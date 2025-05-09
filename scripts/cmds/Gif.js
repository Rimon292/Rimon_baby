const axios = require("axios");

// Temporary in-memory cache to track last GIF index per keyword
const lastGifIndexMap = new Map();

module.exports = {
  config: {
    name: "gif",
    version: "1.2",
    author: "Kaiz",
    countDown: 3,
    role: 0,
    shortDescription: "Send a random gif",
    longDescription: "Search and send a non-repeating GIF using Kaiz Tenor API",
    category: "fun",
    guide: "{pn} <keyword>",
    aliases: ["g"]
  },

  onStart: async function ({ message, args }) {
    const query = args.join(" ").toLowerCase();
    if (!query) {
      return message.reply("Please provide a keyword.\nExample: gif ayanokoji");
    }

    try {
      const res = await axios.get(`https://kaiz-apis.gleeze.com/api/gif-tenor?search=${encodeURIComponent(query)}&limit=5`);
      const gifs = res.data.imageurls;

      if (!gifs || gifs.length === 0) {
        return message.reply("No GIFs found for your search.");
      }

      // Get last used index for this keyword
      let lastIndex = lastGifIndexMap.get(query) ?? -1;
      let nextIndex = (lastIndex + 1) % gifs.length;

      // Save next index for next call
      lastGifIndexMap.set(query, nextIndex);

      const selectedGif = gifs[nextIndex];

      message.reply({
        body: `🀄🌸🀄 "${query}" GIF:`,
        attachment: await global.utils.getStreamFromURL(selectedGif)
      });

    } catch (err) {
      console.error(err);
      message.reply("Failed to fetch GIF. Please try again later.");
    }
  }
};
