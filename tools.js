const express = require('express');
const os = require('os');
const path = require('path');
const kleur = require('kleur');
const opn = require('opn');
const fs = require('fs');
const app = express();

require('dotenv').config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT; // get port from .env


module.exports = {
    openServer(file) {
        app.use(express.static(path.join(process.cwd())));
        app.get('/', (req, res) => {
            res.sendFile(path.join(process.cwd(), file));
        });
    
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`${kleur.blue('Your server has launching on:')}\n - localhost: ${kleur.underline(`http://localhost:${PORT}`)}\n - IP: ${kleur.underline(`http://${this.getIp()}:${PORT}`)}`);
        });

        if(process.env.AUTOOPENSITE == 'true') opn('http://localhost:' + PORT); // if env variable autoopensite has turned on, redirect the user to the website
    },
    getIp(){
        const networkInterfaces = os.networkInterfaces();

        let ipAddress;
        for (const interfaceName in networkInterfaces) {
            const interfaceDetails = networkInterfaces[interfaceName];
            for (const detail of interfaceDetails) {
                if (detail.family === 'IPv4' && !detail.internal) {
                    ipAddress = detail.address;
                    break;
                }
            }
        if (ipAddress) break;
        }
        return ipAddress
    },
    getFilename(files){
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        function recursion(files){
            readline.question(`${kleur.yellow('Several HTML files found:')}\n - ${files.map((file) => kleur.underline(file)).join('\n - ')}\n${kleur.dim('Enter the name of one of them:')} `, (answer) => {
                if (files.includes(answer)) {
                    readline.close();
                    module.exports.openServer(answer);
                } else {
                    console.log(kleur.red('❌ There is no HTML file with that name\n'));
                    recursion(files);
                }
            });
        }
        recursion(files);
    },
    changeEnv(key, value){
        const envPath = path.join(__dirname, '.env');
        let content = fs.readFileSync(envPath, 'utf-8');

        const lines = content.split('\n');
        found = false;
    
        const newLines = lines.map(line => {
            if (line.startsWith(`${key} = `)) {
                found = true;
                return `${key} = ${value}`;
            }
            return line;
        });
    
        if (!found) {
            newLines.push(`${key} = ${value}`);
        }
        fs.writeFileSync(envPath, newLines.join('\n'), 'utf-8');
    },
    getDate(){
        const date = new Date();
        return `${(String(date.getDate()).length == 1 ? '0' : '') + (date.getDate())}.${(String(date.getMonth() + 1).length == 1 ? '0' : '') + (date.getMonth() + 1)}.${date.getFullYear()} | ${(String(date.getHours()).length == 1 ? '0' : '') + (date.getHours())}:${(String(date.getMinutes() + 1).length == 1 ? '0' : '') + (date.getMinutes())}`
    }
}