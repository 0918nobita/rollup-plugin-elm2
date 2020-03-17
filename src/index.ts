import { createFilter } from '@rollup/pluginutils';
import elmCompiler from 'node-elm-compiler';
import {
    Plugin,
    PluginContext,
    SourceDescription,
    TransformHook,
    TransformResult,
} from 'rollup';

type FilterOptions = {
    [K in 'include' | 'exclude']: Parameters<typeof createFilter>[0];
};

export type Elm2PluginOptions = FilterOptions & {
    compiler: {
        debug: boolean;
        optimize: boolean;
    };
};

const defaultOptions: Elm2PluginOptions = {
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
    return `const env = {}; (function () { ${code} }).call(env); export default env.Elm;`;
}

export default function elm2(opt = defaultOptions): Plugin {
    const plugin: Plugin = { name: 'elm2' };

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
        const result: SourceDescription = {
            code: wrapElmCode(elmCode),
            map: { mappings: '' as const },
        };
        dependencies.forEach(this.addWatchFile);
        return result;
    };

    plugin.transform = transformHook;
    return plugin;
}
