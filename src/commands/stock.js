const axios = require('axios');
const cheerio = require('cheerio');


module.exports = {
    name: 'stock',
    aliases: ['t', 'st'],
    permissions: [],
    description: '使用\`st\`來顯示股價新聞',
    async execute(message, args, cmd, bot, Discord, toggleData) {

        const html = await axios.get('https://www.yuanta.com.tw/eYuanta/Securities/Stock');
        const $ = await cheerio.load(html.data);
        let data = [];        
      
        $('ul.news_li').each((i, elem) => {
          if (i <= 3) {
            data.push({
                link: `https://www.yuanta.com.tw${$(elem).find('a').attr('href')}`,
                image: $(elem).find('img').attr('src'),
                title: $(elem).find('p.news_first_title').text(),
                note: $(elem).find('p.news_first_note').text().split(/ +/)[1],
            })
          }
        });

        const stockEmbed = new Discord.MessageEmbed()
                    .setColor('#4f9be8')
                    .setTitle(`${data[0].title}`)
                    .setURL(`${data[0].link}`)
                    .setAuthor('元大證券', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/%E5%85%83%E5%A4%A7%E8%AD%89%E5%88%B8LOGO.jpg/1200px-%E5%85%83%E5%A4%A7%E8%AD%89%E5%88%B8LOGO.jpg', 'https://www.yuanta.com.tw/')
                    .setThumbnail('https://i.imgur.com/2eXfQti.png')
                    .setImage(`https://i.imgur.com/gutP3Je.jpg`)
                    .setTimestamp()
                    .setFooter(`Function created by ${bot.config.author}. 元大證券`, 'https://i.imgur.com/2eXfQti.png');

            message.channel.send(stockEmbed);
    },
};
