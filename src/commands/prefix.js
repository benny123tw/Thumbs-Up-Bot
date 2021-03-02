const toggleModel = require('../models/toggleSchema');

module.exports = {
    name: 'prefix',
    aliases: ['p', 'px'],
    permissions: ["ADMINISTRATOR"],
    description: '更換機器人指令前輟',
    async execute(message, args, cmd, bot, Discord, toggleData) {


        if (!args[0]) return message.channel.send(`**${message.guild.name}** 的前輟是 \`${toggleData.prefix}\``);
        if (!isNaN(args[0])) return message.reply('請不要輸入數字!');

        const prefix = args[0];

        const respone = await toggleModel.findOneAndUpdate(
            {
                serverID: message.guild.id,
            },
            {
                $set: {
                    prefix: prefix,
                },
            },
        );

        return message.channel.send(`Prefix is set to \`${prefix}\` on **${message.guild.name}**`);
    },
};
