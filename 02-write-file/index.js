const { stdin, stdout, exit } = process;
const path = require("path");
const fs = require("fs");

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Hello! Please, enter a text\n');

stdin.on('data', data => {
    let inputData = data.toString();
    if (inputData.trim() === 'exit') {
        byeFn();
    }
    output.write(data);
})

const byeFn = () => {
    stdout.write('Thank you! Have a good day!!!');
    exit();
}

process.on('SIGINT', byeFn);