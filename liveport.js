#!/usr/bin/env node

// import the modules
const fs = require('fs');
const kleur = require('kleur');
const tools = require('./tools.js');
const path = require('path');

// list of command
const commands = {
    'help': () => {
        console.log(fs.readFileSync(path.join(__dirname, 'tableHelp.txt'), 'utf-8'));
    },
    'setport': () => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        let newPort = process.argv.slice(2)[1];

        if(!newPort || !/^\d+$/.test(newPort) || newPort < 0 || newPort > 65535 || newPort == 0){
            newPort = '';
            process.stdout.write(`${kleur.red('The above port is not suitable,')} please write a new one (${kleur.underline('only numbers')}): `);
            process.stdin.on('data', (key) => {
                // if typed backspace
                if ((key === '\u0008' || key === '\x7f') && newPort.length > 0) {
                    newPort = newPort.slice(0, -1);    // erase last letter from variable
                    process.stdout.write('\b \b');     // erase last letter from console
                }
                
                // if typed enter
                if ((key.includes('\n') || key.includes('\r')) && newPort.length > 0 ) {
                    console.log();
                    changePort();
                    process.exit();

                }
                if (key === '\u0003') return process.exit(); // if typed Ctrl + C

                // if typed number
                if (/^\d$/.test(key) && newPort + key <= 65535 && newPort + key != 0) {
                    process.stdout.write(kleur.yellow(key));
                    newPort += key;
                } else {
                    process.stdout.write(' ');
                    process.stdout.write('\b \b');
                }
            });
            process.on('exit', () => {
                if (process.stdin.isRaw) process.stdin.setRawMode(false);
            });
        } else {
            changePort();
            process.exit();
        }
        function changePort(){
            console.log(kleur.green('✅ The port has been successfully changed'));  // inform the user
            tools.changeEnv('PORT', newPort);                                       // change the port
            tools.changeEnv('LASTUPDATEDATE', tools.getDate());                     // write the date when this operation was performed
        }
    },
    'openserver': () => {
        fs.readdir(process.cwd(), (err, data) => {
            if (err) return console.error(kleur.bgRed(err));

            // get list of html files
            const htmlFiles = data.filter(file =>
                file.toLowerCase().endsWith('htm') || file.toLowerCase().endsWith('html')
            );

            // look at the number of HTML files
            if (htmlFiles.length === 0) {           // don't open the server due to the absence of an html file
                console.log(kleur.red('❌ No HTML file found in directory'));
            } else if (htmlFiles.length === 1) {    // open a server with a single html file
                console.log(kleur.green('✅ One HTML file found: ') + kleur.underline(htmlFiles[0]));
                tools.openServer(htmlFiles[0]);
            } else tools.getFilename(htmlFiles);    // if there is more than one html file, please ask the user to select a file
        });
    },
    'autoopensite': () => {
        let newVar = process.argv.slice(2)[1];
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        function recursion(){
            readline.question(`${kleur.red('Your arguments must be Boolean,')} type again: `, (answers) => {
                if(answers == 'true' || answers == 'false'){
                    confirm(answers);
                } else recursion();
            });
        }
        if(newVar == 'true' || newVar == 'false'){
            confirm(newVar)
        } else recursion();

        function confirm(bool){
            readline.close();
            tools.changeEnv('AUTOOPENSITE', bool);                          // change env variable
            tools.changeEnv('LASTUPDATEDATE', tools.getDate());             // write the date when this operation was performed
            return console.log(kleur.green('✅ Succesfully chanched!'));    // inform the user that everything is done
        }
    },
    'config': () => {
        require('dotenv').config();
        const portStr = String(process.env.PORT);
        const siteStr = String(process.env.AUTOOPENSITE);

        const entries = [
            ['Port', portStr],
            ['Auto open site', siteStr],
        ];

        const maxLabelLen = Math.max(...entries.map(([label]) => label.length));
        const maxValueLen = Math.max(...entries.map(([, value]) => value.length));
        const tableWidth = maxLabelLen + 1 + maxValueLen;

        const buildLine = (label, value) => {
        const dotsCount = maxLabelLen - label.length;
        const spacesAfterValue = maxValueLen - value.length;
        return `| ${kleur.underline(label)}${' .'.repeat(dotsCount / 2)} : ${kleur.yellow(value)}${' '.repeat(spacesAfterValue)} |`;
        };

        console.log(`${kleur.blue('Configuring LivePort variables:')}
+${'-'.repeat(tableWidth + 4)}+
${entries.map(([label, value]) => buildLine(label, value)).join('\n')}
+${'-'.repeat(tableWidth + 4)}+
${kleur.gray('last updated: ' + process.env.LASTUPDATEDATE)}`);
    }
}

if (Object.keys(commands).includes(process.argv.slice(2)[0])){ // check if the written command exists
    commands[process.argv.slice(2)[0]]()                       // starting the command
} else {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdout.write(`${kleur.red('No such command')}: "${kleur.yellow(process.argv.slice(2)[0])}"!\nYou can view the entire list of commands by entering the following:\n - ${kleur.bgBlack(kleur.bold(kleur.yellow(' liveport')) + ' help ')}\nWould you like to open it? (${kleur.green('y')} / ${kleur.red('n')}): `);
    const answers = {
        'y': () => commands['help'](),
        'n': () => console.log(kleur.gray('Okay, bye. Closing the program'))
    }
    process.stdin.on('data', (key) => {
        if(Object.keys(answers).includes(key)){
            process.stdout.write(key == 'y' ? kleur.green(key) : kleur.red(key)); // print the letter that is currently being typed
            console.log();    // carry over to a new line
            answers[key]();   // call the function
            return process.exit();   // turn off the func for write in console
        } else {
            process.stdout.write(' ');
            process.stdout.write('\b \b'); // delete the letter if it does not fit
        }
    });
    process.on('exit', () => {
        if (process.stdin.isRaw) process.stdin.setRawMode(false);
    });
}
