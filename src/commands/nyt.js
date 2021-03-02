const axios = require('axios');
require('dotenv').config();
const BASE_URL= `https://api.nytimes.com/svc/topstories/v2/`;
const defaultSection = `home`;
const validSections = [
    'arts', 'automobiles', 'books', 'business', 'fashion', 'food', 'health', 'home', 'insider', 
    'magazine', 'movies', 'nyregion', 'obituaries', 'opinion', 'politics', 'realestate', 'science', 
    'sports', 'sundayreview', 'technology', 'theater', 't-magazine', 'travel', 'upshot', 'us', 'world'
]

module.exports = {
    name: 'newyorktimes',
    aliases: ['nyt', 'ny'],
    permissions: [],
    description: '使用\`nyt\`來查看今日頭條',
    async execute(message, args, cmd, bot, Discord, toggleData) {

        let url = '';
        let section = defaultSection;
        let quantity = 1;

        /**check fisrt argument if it is number point to quantity and section to default 
         * and if first argument is NaN point to section and check second argument  
         */
        if (!isNaN(args[0])) quantity = args[0]; 
        else if (args[0]) section = args[0].toLowerCase();

        //check second argument quantity
        if (!isNaN(args[1]) && args[1] <= 10) quantity = args[1]; //if quantity > 10 server will be a mess
        if (!validSections.includes(section)) return message.channel.send(`請輸入有效的主題: ${validSections.join(', ')}`);
        
        url = `${BASE_URL}${section}.json`

        const options = {
            method: 'GET',
            url: `${url}`,
            params: {
                'api-key': process.env.NEWYORKTIMES_APIKEYS,
            }
        };
        
        axios(options)
            .then(function(respone) {
                results = respone.data.results;
                for(let i=0; i<quantity; i++) {
                    // message.channel.send(`> **${results[i].title}**\n${results[i].abstract}\n${results[i].short_url}\n${results[i].multimedia[0].url}`)
                    const newsEmbed = new Discord.MessageEmbed()
                            .setColor('#f096e7')
                            .setTitle(`${results[i].title}`)
                            .setURL(`${results[i].multimedia[0].url}`)
                            .setAuthor('New York Times', 'https://i.imgur.com/gdUzawB.png', 'https://www.nytimes.com/')
                            .setDescription(`${results[i].abstract}`)
                            .setThumbnail('https://i.imgur.com/2eXfQti.png')
                            .setImage(`${results[i].multimedia[0].url}`)
                            .setTimestamp()
                            .setFooter(`Function created by ${bot.config.author}. APi from New York Times`, 'https://i.imgur.com/2eXfQti.png');

                    message.channel.send(newsEmbed);
                }
            })
        
    },
};
