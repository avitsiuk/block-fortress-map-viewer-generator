module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: '../coverage',
    rootDir: './services',
    roots: [
      '../test'
    ]
};
