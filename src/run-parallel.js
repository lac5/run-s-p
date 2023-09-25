import { runAll } from './runAll.js';

export function runParallel(...commands) {
    return runAll({ parallel: commands });
}
