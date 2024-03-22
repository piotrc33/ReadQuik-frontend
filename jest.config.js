module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleNameMapper: {
    "^src/app/(.*)$": "<rootDir>/src/app/$1",
  },
};