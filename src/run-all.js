import exec from './exec-async.js';

export async function runAll(options) {
    let errors = [];
    if (options.hasOwnProperty('sequence')) {
        try {
            for (let command of mapCommands(options.sequence, options, false)) {
                try {
                    await command();
                } catch (error) {
                    if (options.verbose) {
                        let message = `error running command "${command}": `;
                        console.error(message, error);
                        let e = new Error(message + error);
                        e.error = error;
                        error = e;
                    }
                    errors.push(error);
                }
            }
        } catch (error) {
            if (options.verbose) {
                let message = `error running sequence "${options.sequence}": `;
                console.error(message, error);
                let e = new Error(message + error);
                e.error = error;
                error = e;
            }
            errors.push(error);
        }
    }
    if (options.hasOwnProperty('parallel')) {
        try {
            await Promise.all(
                Array.from(mapCommands(options.parallel, options, true))
                    .map(async command => {
                        try {
                            await command();
                        } catch (error) {
                            if (options.verbose) {
                                let message = `error running command "${command}": `;
                                console.error(message, error);
                                let e = new Error(message + error);
                                e.error = error;
                                error = e;
                            }
                            errors.push(error);
                        }
                    })
            );
        } catch (error) {
            if (options.verbose) {
                let message = `error running parallel sequence "${options.sequence}": `;
                console.error(message, error);
                let e = new Error(message + error);
                e.error = error;
                error = e;
            }
            errors.push(error);
        }
    }
    if (errors.length > 0) {
        throw new AggregateError(errors.map(x => x[1]), 'Error while running commands');
    }
}

runAll.command = Symbol();

function* mapCommands(commands, options, isParallel) {
    if (options.verbose) {
        for (let command of commands) {
            console.log(String(command));
            yield wrapCommand(command, options, isParallel);
        }
    } else {
        for (let command of commands) {
            yield wrapCommand(command, options);
        }
    }
}

function wrapCommand(command, options, isParallel) {
    let func = typeof command === 'function' ?(
        () => command()
    ): typeof command === 'string' ?(
        () => exec(command, process)
    ): Array.isArray(command) ?(
        isParallel ?
            () => run(Object.setPrototypeOf({ sequence: command }, options)) : 
            () => run(Object.setPrototypeOf({ parallel: command }, options)) 
    ):(
        () => run(Object.setPrototypeOf(command, options))
    );
    func[runAll.command] = command;
    func.toString = command.hasOwnProperty('toString') ? command.toString : toString;
    return func;
}

function toString() {
    return String(this[runAll.command]);
}
