module.exports = {
    name: 'clear',
    aliases: ['c'],
    permissions: ["ADMINISTRATOR", "MANAGE_MESSAGES"],
    description: '使用\`clear (1~100)\`來清除訊息',
    async execute(message, args, cmd, bot, Discord, toggleData) {
        if (!args[0]) return message.reply('輸入1~100的數字來刪除訊息!');
        if (isNaN(args[0])) return message.reply('請輸入數字!');

        
        if (args[0] > 100) return message.reply('你不能刪除超過100條訊息!');
        if (args[0] < 1) return message.reply('你至少要刪除一則訊息!');
        const quantity = parseInt(args[0])+1;

        await message.channel.messages.fetch({ limit: quantity }).then(messages => {
            message.channel.bulkDelete(messages);
        });

        message.channel.send(`已經刪除 \`${quantity-1}條\` 訊息👍`).then(msg =>
            setTimeout(() => {
                msg.delete();
            }, 1500),
        );
    },
};
