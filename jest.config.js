module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js'],
    testMatch: ['**/?(*.)+(spec|test).js'],
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
