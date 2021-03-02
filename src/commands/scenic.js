const axios = require('axios');

module.exports = {
    name: 'scenicspot',
    aliases: ['sp'],
    permissions: [],
    description: '使用\`sp (region)\`來搜尋景點',
    async execute(message, args, cmd, bot, Discord, toggleData) {


        const options = {
            method: 'GET',
            url: `https://gis.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json`,
        };
        let regionArray = ['default'];
        axios(options)
            .then(function(respone) {
                // console.log(respone.data.XML_Head.Infos)
                results = respone.data.XML_Head.Infos.Info;
                let region = '';
                if(args[0]) {
                    regionArray = [];
                    region = args[0];
                    for(let result of results) {
                        if(result.Region == region )
                            regionArray.push(result);
                    }
                    results = regionArray;
                }

                if(!regionArray.length) return message.reply(`請輸入正確的地區`);              
                
                const randomNumber = Math.floor(Math.random() * results.length);
                const scenicEmbed = new Discord.MessageEmbed()
                            .setColor('#eb992f')
                            .setTitle(`${results[randomNumber].Name}`)
                            .setURL(`${results[randomNumber].Website}`)
                            .setAuthor('交通部觀光局', 'https://resources.3people.com.tw/res/Images/6c533ea0-f24d-418a-8541-50c5ee74140b.png', 'https://www.taiwan.net.tw/')
                            .setDescription(`${results[randomNumber].Toldescribe}`)
                            .setThumbnail('https://i.imgur.com/2eXfQti.png')
                            .addFields(
                                { name: '地址', value: results[randomNumber].Add || '無', inline: true },
                                // this can make a blank{ name: '\u200B', value: '\u200B' },
                                { name: '電話', value: results[randomNumber].Tel || '無', inline: true },
                                {
                                    name: '關鍵字',
                                    value: results[randomNumber].Keyword || '無',
                                },
                            )
                            .setImage(`${results[randomNumber].Picture1}`)
                            .setTimestamp()
                            .setFooter(`Function created by ${bot.config.author}. Data from 交通部觀光局`, 'https://i.imgur.com/2eXfQti.png');

                    message.channel.send(scenicEmbed);
            })
    },
};
