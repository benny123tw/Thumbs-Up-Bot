const chalk = require('chalk');

module.exports = async (bot, Discord, logger, oldMember, newMember) => {
    console.log(`${oldMember.nickname} chaned to ${newMember.nickname}`);
};
