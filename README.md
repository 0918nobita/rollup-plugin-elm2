# rollup-plugin-elm2

Bundle Elm programs with Rollup

Supported Elm version: 0.19

## Usage

```javascript
import Elm from './Main.Elm';

const node = document.getElementById('app');
const app = Elm.Main.init({ node });
```

```javascript
import elm from 'rollup-plugin-elm2';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.js',
    plugins: [
      elm({
        exclude: 'elm-stuff/**',
        compiler: {
          optimize: production,
          debug: !production,
        },
      }),
    ],
};
```

Check the `/example` for a complete example.

## Options

```javascript
{
  include: [],
  exclude: [],
  compiler: {
    // Enable / Disable compiler optimizations (default: false)
    optimize: true,
    // Enable / Disable debug mode (default: false)
    debug: false,
    // Path to Elm executable (default: elm)
    pathToElm: path.resolve(__dirname, 'node_modules/elm/bin/elm')
  }
}
```
