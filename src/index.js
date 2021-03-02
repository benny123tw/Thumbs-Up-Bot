const os = require('os');
const path = require('path');
const fs = require('fs');
const discord = require('discord.js');
const winston = require('winston');
const chalk = require('chalk');
const opn = require('opn');
const mkdirp = require('mkdirp');
const jsonfile = require('jsonfile');

const handlers = ['command_handler', 'event_handler'];
const mongoose = require('mongoose');
require('dotenv').config();

const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const sanitise = str => str.replace(/[^a-z0-9_-]/gi, '');

// Logger
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    modules: 3,
    modwarn: 4,
    modinfo: 5,
    debug: 6,
};
const logger = tag =>
    winston.createLogger({
        levels: logLevels,
        transports: [new winston.transports.Console({ colorize: true, timestamp: true })],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.padLevels({ levels: logLevels }),
            winston.format.timestamp(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${tag}${info.message}`),
        ),
        level: 'debug',
    });

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    modules: 'cyan',
    modwarn: 'yellow',
    modinfo: 'green',
    debug: 'blue',
});

// Config
const configSchema = {
    discordToken: { type: 'string', default: 'Paste your bot token here.' },
    author: { type: 'string', default: 'Benny Yen' },
    name: { type: 'string', default: 'Bot' },
    defaultGame: { type: 'string', default: '$help for help' },
    prefix: { type: 'string', default: '$' },
    version: { type: 'string', default: '1.0.0' },
    commandAliases: { type: 'object', default: {} },
    defaultColors: {
        type: 'object',
        default: {
            neutral: { type: 'string', default: '#287db4' },
            error: { type: 'string', default: '#c63737' },
            warning: { type: 'string', default: '#ff7100' },
            success: { type: 'string', default: '#41b95f' },
        },
    },
    settings: { type: 'object', default: {} },
};

const createBot = initialConfig => {
    // Define the bot
    const bot = {
        thumbsup: false,
        client: new discord.Client(),
        log: logger(initialConfig.tag || `[Bot ${initialConfig.index}]`),
        commands: new discord.Collection(),
        events: new discord.Collection(),
    };

    // Connect to the database
    if(initialConfig.name !== 'TestBot')
    mongoose
        .connect(process.env.MONGODB_SRV, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => {
            bot.log.info(chalk.greenBright(`Connected to the database!`));
        })
        .catch(err => {
            bot.log.error(chalk.red(`${err}`));
        });
    else 
    mongoose
        .connect(process.env.TEST_MONGODB_SRV, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => {
            bot.log.info(chalk.greenBright(`Connected to the database!`));
        })
        .catch(err => {
            bot.log.error(chalk.red(`${err}`));
        });

    /*
     * Define all the core functions for the bot lifecycle
     */

    // Set the config directory to use
    bot.setConfigDirectory = function setConfigDirectory(configDir) {
        this.configDir = configDir;
        this.configFile = path.join(configDir, 'config.json');
    };

    // Open the config file in a text editor
    bot.openConfigFile = function openConfigFile() {
        bot.log.info('Opening config file in a text editor...');
        opn(this.configFile)
            .then(() => {
                bot.log.info('Exiting.');
                process.exit(0);
            })
            .catch(err => {
                this.log.error('Error opening config file.');
                throw err;
            });
    };

    // Set default config directory
    bot.setConfigDirectory(path.join(os.homedir(), `.discord-${sanitise(initialConfig.name)}-bot`));

    // Recursively iterate over the config to check types and reset properties to default if they are the wrong type
    bot.configIterator = function configIterator(startPoint, startPointInSchema) {
        Object.keys(startPointInSchema).forEach(property => {
            if (!has(startPoint, property)) {
                if (startPointInSchema[property].type !== 'object') {
                    startPoint[property] = startPointInSchema[property].default;
                } else {
                    startPoint[property] = {};
                }
            }
            if (startPointInSchema[property].type === 'object') {
                configIterator(startPoint[property], startPointInSchema[property].default);
            }
            if (
                !Array.isArray(startPoint[property]) &&
                typeof startPoint[property] !== startPointInSchema[property].type
            ) {
                startPoint[property] = startPointInSchema[property].default;
            }
        });
    };

    bot.loadConfig = function loadConfig(config, callback) {
        bot.log.info(`Checking for config file...`);
        const configExists = fs.existsSync(this.configFile);

        /*
         *  If the file does not exist, create it
         */
        if (!configExists) {
            bot.log.info(`No config file found, generating...`);
            try {
                mkdirp.sync(path.dirname(this.configFile));
                const { token, name, author, prefix, version } = initialConfig;
                const baseConfig = {
                    discordToken: token,
                    prefix,
                    name,
                    author,
                    version,
                };
                fs.writeFileSync(this.configFile, JSON.stringify(baseConfig, null, 4));
            } catch (err) {
                this.log.error(chalk.red.bold(`Unable to create config.json: ${err.message}`));
                throw err;
            }
        }

        /*
         * Load the config file from the directory
         */
        this.log.info(`Loading config...`);
        try {
            this.config = JSON.parse(fs.readFileSync(this.configFile));
        } catch (err) {
            this.log.error(`Error reading config: ${err.message}`);
            this.log.error(
                'Please fix the config error or delete config.json so it can be regenerated.',
            );
            throw err;
        }

        /*
         * iterate over the given config, check all values and sanitise
         */
        this.configIterator(this.config, configSchema);

        /*
         * write the changed/created config file to the directory
         */
        fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 4));

        /*
         * read the new file from the directory again
         * - assign it to the bot's config
         * - execute callback() or abort on error
         */
        jsonfile.readFile(this.configFile, (err, obj) => {
            if (err) {
                bot.log.error(chalk.red.bold(`Unable to load config.json: ${err.message}`));
                throw err;
            } else {
                bot.config = obj;
                callback();
            }
        });
    };

    // Load the bot
    bot.load = function load(config) {
        // Set up some properties
        this.config = {};

        // Load config, load modules, and login
        this.loadConfig(config, () => {
            this.log.info(`Loading commands...`);

            handlers.forEach(handler => {
                require(`./handlers/${handler}`)(bot, discord, this.log);
            });
            this.log.info(`Connecting...`);
            this.client.login(this.config.discordToken);
        });
    };

    return {
        start: () => bot.load(initialConfig),
    };
};

module.exports = {
    createBot,
};
