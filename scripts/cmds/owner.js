
const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info,flame"],
    author: "flame x rimon",
    role: 0,
    shortDescription: "Show Owner Information",
    longDescription: "Displays detailed information about the bot owner.",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const ownerInfo = {
        name: '𝙔𝙤𝙪𝙧 𝙍𝙞𝙢𝙤𝙣 🪽🩷',
        class: '𝙞𝙣𝙩𝙚𝙧 2𝙣𝙙 𝙮𝙚𝙖𝙧𝙨',
        group: '𝙎𝙘𝙞𝙚𝙣𝙘𝙚',
        gender: '𝙈𝙖𝙡𝙚',
        Birthday: '𝟐0-𝟎8-𝟐𝟎𝟎𝟖',
        religion: '𝙄𝙨𝙡𝙖𝙢',
        hobby: '𝙞𝙙𝙠',
        Fb: 'https://www.facebook.com/it.z.rimon.216225',
        Relationship: '𝘼𝙡𝙬𝙖𝙮𝙨 𝙗𝙚 𝙨𝙞𝙣𝙜𝙡𝙚',
        Height: '6'
      };

      const videoUrl = 'https://i.imgur.com/CNpkoYi.mp4';
      const tmpFolderPath = path.join(__dirname, 'tmp');
      if (!fs.existsSync(tmpFolderPath)) {
        fs.mkdirSync(tmpFolderPath);
      }

      const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');
      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const messageBody = `
👑 𝙊𝙬𝙣𝙚𝙧 𝙄𝙣𝙛𝙤 🪽

~𝙉𝘼𝙈𝙀: ${ownerInfo.name}
~𝘾𝙇𝘼𝙎𝙎: ${ownerInfo.class}
~𝙂𝙍𝙊𝙐𝙋: ${ownerInfo.group}
~𝙂𝙀𝙉𝘿𝙀𝙍: ${ownerInfo.gender}
~𝘽𝙄𝙍𝙏𝙃𝘿𝘼𝙔: ${ownerInfo.Birthday}
~𝙍𝙀𝙇𝙄𝙂𝙄𝙊𝙉: ${ownerInfo.religion}
~𝙍𝙀𝙇𝘼𝙏𝙄𝙊𝙉𝙎𝙃𝙄𝙋: ${ownerInfo.Relationship}
~𝙃𝙊𝘽𝘽𝙔: ${ownerInfo.hobby}
~𝙃𝙀𝙄𝙂𝙃𝙏: ${ownerInfo.Height}
~𝙁𝘽: ${ownerInfo.Fb}
        `;

        await api.sendMessage({
          body: messageBody,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => {
          fs.unlinkSync(videoPath);
        }, event.messageID);

        api.setMessageReaction('🪽', event.messageID, () => {}, true);
      });

      writer.on("error", () => {
        api.sendMessage("❌ | Failed to download video.", event.threadID, event.messageID);
      });
    } catch (error) {
      console.error('Error in ownerinfo command:', error);
      return api.sendMessage('⚠️ An error occurred while processing the command.', event.threadID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix();
