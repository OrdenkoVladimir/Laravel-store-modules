module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './tsconfig.json',
            './tsconfig.eslint.json',
        ],
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript',
    ],
    rules: {
        '@typescript-eslint/indent': ['error', 4],
        indent: ['error', 4],
        'class-methods-use-this': ['error', { exceptMethods: ['state', 'getters', 'actions', 'mutations'] }],
        'no-param-reassign': ['error', { props: false }],
    },
    settings: {
        react: {
            version: '999.999.999',
        },
    },
};
