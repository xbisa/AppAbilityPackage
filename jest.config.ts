import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
};

export default config;