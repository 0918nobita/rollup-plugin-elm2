import { createFilter } from '@rollup/pluginutils';
import elmCompiler from 'node-elm-compiler';
import {
    Plugin,
    PluginContext,
    SourceDescription,
    TransformHook,
    TransformResult,
} from 'rollup';

interface Options {
    include: string[];
    exclude: string[];
    compiler: {
        debug: boolean;
        optimize: boolean;
    };
}

const defaultOptions: Options = {
    include: [],
    exclude: [],
    compiler: {
        debug: true,
        optimize: false,
    },
};

async function compile(filename, options): Promise<string> {
    return await elmCompiler.compileToString(
        [filename],
        Object.assign({}, options, {
            output: '.js',
        })
    );
}

function wrapElmCode(code: string): string {
    return `let output = {}; (function () { ${code} }).call(output); export default output.Elm;`;
}

export default function elm2(opt: Options = defaultOptions): Plugin {
    const result: Plugin = { name: 'elm2' };

    const transformHook: TransformHook = async function(
        this: PluginContext,
        _,
        id
    ): Promise<TransformResult> {
        const filter = createFilter(opt.include, opt.exclude);
        if (!/.elm$/i.test(id) || !filter(id)) return null;
        const elmCode = await compile(id, opt.compiler);
        const dependencies: string[] = await elmCompiler.findAllDependencies(
            id
        );
        const compiled: SourceDescription = {
            code: wrapElmCode(elmCode),
            map: { mappings: '' as const },
        };
        dependencies.forEach(this.addWatchFile);
        return compiled;
    };

    result.transform = transformHook;
    return result;
}
