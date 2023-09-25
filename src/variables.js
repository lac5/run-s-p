import { join, dirname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { platform, argv } from 'node:process';
import make from 'makevars';

const $ = make(function get(name, $) {
    switch (name) {
        case 'nodeFolder': {
            return dirname(argv[0]);
        } case 'npm': {
            return join($.nodeFolder, platform === 'win32' ? 'npm.cmd' : 'npm');
        } case 'args': {
            return argv.slice((argv.indexOf('--') + 1) || argv.length);
        } case 'argString': {
            return ($.args
                .map(command => ` "${command.replace(/"/g, platform === 'win32' ? '""' : '\\"')}"`)
                .join(''));
        } case 'parentModule': {
            let thisModule = join(dirname(argv[1]), '..');
            let folders = thisModule.split(sep);
            let index = folders.indexOf('node_modules');
            let packageJson = (index > -1 ?
                folders.slice(0, index).join(sep) :
                thisModule);
            return packageJson;
        } case 'binFolder': {
            return join($.parentModule, 'node_modules/.bin');
        } case 'scripts': {
            let packageJson = import(pathToFileURL(join($.parentModule, 'package.json')), {
                assert: { type: 'json' }
            });
            return packageJson.then(({ default: packageJson }) => (
                Object.keys(packageJson?.scripts ?? {})
            ));
        }
    }
});
export default $;
