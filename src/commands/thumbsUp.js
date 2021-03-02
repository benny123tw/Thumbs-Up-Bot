const toggleModel = require('../models/toggleSchema');

module.exports = {
    name: 'thumbsup',
    aliases: ['tup', 'up', 't'],
    permissions: ["MANAGE_MESSAGES"],
    description: '使用\`thumbsup\ (on/off)`切換點讚開關',
    async execute(message, args, cmd, bot, Discord, toggleData) {
        if (!args[0])
            return message.channel.send(`目前 **${this.name}** 開關狀態是 ${toggleData.thumbsUp}`);
        if (args[0] !== '1' && args[0] !== '0' && args[0] !== 'on' && args[0] !== 'off') return message.reply('請輸入on/off或0/1');

        let _switch;
        if (args[0] === '1' || args[0] === 'on') _switch = true;
        if (args[0] === '0' || args[0] === 'off') _switch = false;

        const respone = await toggleModel.findOneAndUpdate(
            {
                serverID: message.guild.id,
            },
            {
                $set: {
                    thumbsUp: _switch,
                },
            },
        );

        return message.channel.send(`**${this.name}** 開關切換至 ${_switch}`);
    },
};
