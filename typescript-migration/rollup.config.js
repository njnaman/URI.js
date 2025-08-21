export default [
    {
        input: 'dist/IPv6.js',
        output: {
            file: 'dist/IPv6.js',
            format: 'umd',
            name: 'IPv6'
        },
    },
    {
        input: 'dist/punycode.js',
        output: {
            file: 'dist/punycode.js',
            format: 'umd',
            name: 'punycode'
        },
    },
    {
        input: 'dist/SecondLevelDomains.js',
        output: {
            file: 'dist/SecondLevelDomains.js',
            format: 'umd',
            name: 'SecondLevelDomains'
        },
    },
    {
        input: 'dist/URI.js',
        output: {
            file: 'dist/URI.js',
            format: 'umd',
            name: 'URI',
            globals: {
                './punycode': 'punycode',
                './IPv6': 'IPv6',
                './SecondLevelDomains': 'SecondLevelDomains'
            }
        },
        external: ['./punycode', './IPv6', './SecondLevelDomains']
    },
];
