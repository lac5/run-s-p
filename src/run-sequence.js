import { runAll } from './run-all.js';

export function runSequence(...commands) {
    return runAll({ sequence: commands });
}
