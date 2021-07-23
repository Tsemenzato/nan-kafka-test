import type {Config} from "@jest/types";

const config: Config.InitialOptions = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
};

export default config;
