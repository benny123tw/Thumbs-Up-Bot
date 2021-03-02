module.exports = {
    name: 'ping',
    aliases: [],
    permissions: [],
    description: 'Ping! Pong?',
    execute(message, args, cmd, bot, Discord, toggleData) {
        const delay = Date.now() - message.createdAt;
        message.reply(`**pong** *(delay: ${delay}ms)*`);
    },
};
