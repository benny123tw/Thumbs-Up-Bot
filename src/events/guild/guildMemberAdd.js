const chalk = require('chalk');
const profileSchema = require('../../models/profileSchema');

module.exports = async (bot, Discord, logger, member) => {
    console.log(`welcome ${member}`);
    const profile = await profileSchema.create({
        userID: member.Id,
        serverID: member.guild.ID,
        coins: 0,
        bank: 0,
    });
    profile.save();
};
