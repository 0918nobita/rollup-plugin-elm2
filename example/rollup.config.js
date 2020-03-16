import elm from 'rollup-plugin-elm2';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;

const devServerConfig = {
    open: true,
    openPage: '/',
    verbose: true,
    contentBase: 'dist',
    host: 'localhost',
    port: 1234,
    historyApiFallback: '/404.html',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
};

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs',
    },
    plugins: [
        elm({
            exclude: ['elm-stuff/**'],
            compiler: {
                optimize: true,
                debug: false,
            },
        }),
        !production && serve(devServerConfig),
    ],
};
