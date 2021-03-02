const chalk = require('chalk');
const toggleModel = require('../../models/toggleSchema');

module.exports = async (bot, Discord, logger, oldGuild, newGuild) => {

    const respone = await toggleModel.findOneAndUpdate(
        {
            serverID: oldGuild.id,
        },
        {
            $set: {
                serverID: newGuild.id,
                serverName: newGuild.name,
            },
        },
    );
    
};
