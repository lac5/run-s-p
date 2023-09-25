import { spawn, exec } from 'node:child_process';
import $ from './variables.js';

let scripts = await $.scripts;

export default function(command, stdio) {
    return new Promise((resolve, reject) => {
        let options = {
            cwd: $.binFolder,
        };
        let child = scripts.includes(command) ?
            spawn($.npm, ['run', command].concat($.args), options) :
            exec(command + $.argString, options);
        if (stdio) {
            child.stdout.pipe(stdio.stdout);
            child.stderr.pipe(stdio.stderr);
        }
        child.on('close', (code) => resolve(code));
        child.on('error', (error) => error && reject(error));
    });
}
