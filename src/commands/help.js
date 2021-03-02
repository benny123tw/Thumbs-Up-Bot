module.exports = {
    name: 'help',
    aliases: ['h'],
    permissions: [],
    description: '查看幫助',
    async execute(message, args, cmd, bot, Discord, toggleData) {

        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('All Commands')
            .setDescription(`機器人在這個伺服器使用的指令前輟是 \`${toggleData.prefix}\`, 使用的表情為 ${toggleData.emoji}`)
            .setThumbnail('https://i.imgur.com/2eXfQti.png')
            .setFooter(
                `All works made with ❤️ by ${bot.config.author}`,
                'https://i.imgur.com/2eXfQti.png',
            );
        bot.commands.forEach(command => {
            helpEmbed.addField(`\`${toggleData.prefix}${command.name}\``, `${command.description}`, false);
        });        
        message.channel.send(helpEmbed);
    },
};
