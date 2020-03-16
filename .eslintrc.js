module.exports = {
    env: { es6: true },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
    ],
    plugins: ['@typescript-eslint', 'simple-import-sort'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: './workspaces/*/tsconfig.json',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts', '.tsx'],
            },
        },
    },
    rules: {
        'no-undef': 'off',
        'simple-import-sort/sort': 'error',
    },
};
