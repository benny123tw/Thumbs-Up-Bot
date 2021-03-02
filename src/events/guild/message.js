const chalk = require('chalk');
const toggleModel = require('../../models/toggleSchema');

const lonleyArray = ['好寂寞', '寂寞', '沒人', '沒有人', '出來', '嗨爆', '起來嗨',
                    'lonely'];

module.exports = async (bot, Discord, logger, message) => {

    let lonleySplitArray = message.content.split(/ +/).join('').split('');
    

    let lonleyStatus = false;
    for (let i=0; i<lonleyArray.length; i++) {
        const splitArray = lonleyArray[i].split('');
        let stack = [];

        for (let j=0; j<splitArray.length; j++) {
            if (!lonleySplitArray.includes(splitArray[j])) {
                break;
            }

            let index = lonleySplitArray.indexOf(splitArray[j]);
            stack.push(lonleySplitArray[index]);
            lonleySplitArray.splice(index, 1);

            // if (stack.length > 1 && stack[stack.length-2]+1 !== stack[stack.length-1]) {
            //     console.log(stack[stack.length-2], stack[stack.length-1])
            //     console.log(`continue break`);
            //     break;
            // }

            // console.log(stack)
        }
        if (stack.length === splitArray.length) lonleyStatus = true;
    }

    let toggleData;
    try {
        toggleData = await toggleModel.findOne({ serverID: message.guild.id });
        if (!toggleData) {
            const toggle = await toggleModel.create({
                serverID: message.guild.id,
                serverName: message.guild.name,
                prefix: bot.config.prefix,
                emoji: '👍',
                thumbsUp: false,
                lonely: false,
            });
            toggle.save();
            logger.info(chalk.redBright(`Not found data on db. Generating...`));
            return message.reply(
                `DB建置完畢，請再輸入一次`,
            );
        }
    } catch (error) {
        logger.error(chalk.red(error));
    }

    // lonley mention
    if (toggleData.lonely && !message.author.bot && lonleyStatus) return message.channel.send(`@everyone 有人寂寞啦起來嗨`);

    // thumbs up bot main function 
    if (toggleData.thumbsUp) message.react(toggleData.emoji);

    // ignore all other messages without our prefixg and bots command
    if (!message.content.startsWith(toggleData.prefix) || message.author.bot) return;
    const args = message.content.slice(toggleData.prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    try {
        const command =
            bot.commands.get(cmd) || bot.commands.find(a => a.aliases && a.aliases.includes(cmd));
        /**
         * check permissions is valid and member's permission
         */
        if(command.permissions.length){
            let invalidPerms = []
            for(const perm of command.permissions){
                if(!validPermissions.includes(perm)){
                    return console.log(`Invalid Permissions ${perm}`);
                }
                if(!message.member.hasPermission(perm)){
                    invalidPerms.push(perm);
                }
            }
            if (invalidPerms.length){
            return message.channel.send(`Missing Permissions: \`${invalidPerms}\``);
            }
        }  
        command.execute(message, args, cmd, bot, Discord, toggleData);
    } catch (error) {
        logger.error(chalk.red(error));
        message.reply('there was an error trying to execute that command!');
    }
};

const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ]