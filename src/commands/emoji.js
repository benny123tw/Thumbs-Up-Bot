const toggleModel = require('../models/toggleSchema');

module.exports = {
    name: 'emoji',
    aliases: ['emo'],
    permissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
    description: '使用\`emoji\ (emoji)`切換點讚表情',
    async execute(message, args, cmd, bot, Discord, toggleData) {
        if (!args[0])
            return message.channel.send(`目前 **${bot.config.name}** 點讚表情是 ${toggleData.emoji}`);
        if (!/\p{Extended_Pictographic}/u.test(args[0])) return message.reply('請輸入Emoji');

        let emoji = args[0];

        const respone = await toggleModel.findOneAndUpdate(
            {
                serverID: message.guild.id,
            },
            {
                $set: {
                    emoji: emoji,
                },
            },
        );

        return message.channel.send(`<@${message.member.user.id}>將表情切換至 ${emoji}`);
    },
};
