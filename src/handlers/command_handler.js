// const ping = require('../commands/ping')
// const who = require('../commands/who')
// const thumbsup = require('../commands/thumbsUp')
// const help = require('../commands/help')
// const clear = require('../commands/clear')

// module.exports = {
//     ping,
//     who,
//     thumbsup,
//     help,
//     clear,
// }

const fs = require('fs');

module.exports = (bot, Discord) => {
    const command_files = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

    for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if (command.name) bot.commands.set(command.name, command);
    }
};
