#!/usr/bin/env node
import { argv } from 'node:process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { runAll } from "./src/run-all.js";

function main(argv) {
    if (argv.verbose) {
        if (argv.sequence) console.log('sequence: ', argv.sequence.join(' & '));
        if (argv.parallel) console.log('parallel: ', argv.parallel.join(' & '));
    }
    return runAll(argv).catch(error => {
        if (argv.verbose) console.error(error);
        throw error;
    });
}

main(
    yargs(hideBin(argv))
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Run with verbose logging',
            default: false,
        })
        .option('sequence', {
            alias: 's',
            type: 'array',
            description: 'Run in sequential order',
        })
        .option('parallel', {
            alias: 'p',
            type: 'array',
            description: 'Run in parallel order',
        })
        .parse()
).catch(console.error);
