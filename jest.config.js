module.exports = {
    testTimeout: 1000000,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1',
        '^vue$': 'vue/dist/vue.common.js'
    },

    moduleFileExtensions: [
        'js',
        'json'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.js'
    ],
    coverageThreshold: {
        global: {
            lines: 80,
        },
    },
};
