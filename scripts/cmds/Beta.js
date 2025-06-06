 const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "beta",
    aliases: [],
    version: "1.0",
    author: "Team  Calyx",
    countDown: 30,
    role: 0,
    shortDescription: "Generate image",
    category: "𝗔𝗜",
    guide: {
      en: "{pn} <prompt> [--ar <ratio>]",
      ar: "{pn} <المطالبة> [--ar <النسبة>]"
    },
  },
  onStart: async function ({ message, event, args, api }) {

    const jsonResponse = await axios.get('https://raw.githubusercontent.com/Savage-Army/extras/refs/heads/main/api.json');
    const apiUrl = jsonResponse.data.api;
    const prompt = args.slice(0, args.indexOf("--ar") > -1 ? args.indexOf("--ar") : args.length).join(" ");
    const ratio = args.includes("--ar") ? args.slice(args.indexOf("--ar") + 1).join("").trim() : "2:3";
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const attachments = [];
      const numImages = 4; 

      const requests = Array.from({ length: numImages }, async (value, index) => {
        const url = `${apiUrl}/beta?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`;
          const imagePath = path.join(__dirname, "cache", `image_${index + 1}_${Date.now()}.png`);
        try {
          const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
          });
          const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
           attachments.push(fs.createReadStream(imagePath));
         
        } catch (error) {
            console.error(`Error downloading image ${index + 1}:`, error);
          }
      });

      await Promise.all(requests);
        message.reply({ attachment: attachments }, event.threadID, () => {
        attachments.forEach((attachment) => {
              if(attachment.path){
                fs.unlinkSync(attachment.path);
              }
        });
          
          message.unsend(message.messageID);
      }, event.messageID);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
