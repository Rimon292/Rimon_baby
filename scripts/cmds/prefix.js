const fs = require("fs-extra");
const axios = require("axios");

const videoUrls = ["http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1746422722870.mp4" 
  ];

let lastVideoIndex = -1;

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    description: "Change or view the bot prefix and play a welcome video",
    category: "config",
    guide: {
      en: "Use '{pn}' to view prefix and video\nUse '{pn} <new prefix>' to change"
    }
  },

  langs: {
    en: {
      reset: "✅ Prefix reset to default: %1",
      onlyAdmin: "⚠️ Only bot admins can change the global prefix.",
      confirmGlobal: "❗ React to confirm global prefix change.",
      confirmThisThread: "❗ React to confirm group prefix change.",
      successGlobal: "✅ Global prefix set to: %1",
      successThisThread: "✅ Group prefix set to: %1",
      thanksInvite:
        "⚠️ 𝙍𝙞𝙢𝙤𝙣 𝙘𝙝𝙖𝙩 𝙗𝙤𝙩 🗯\n\n"
        + "🔊𝙂𝙡𝙤𝙗𝙖𝙡 𝙋𝙧𝙚𝙛𝙞𝙭: %1\n"
        + "巛 𝙜𝙧𝙤𝙪𝙥 𝙥𝙧𝙚𝙛𝙞𝙭: %2\n"
        + "ッ 𝙍𝙚𝙦𝙪𝙚𝙨𝙚𝙙 𝙗𝙮: %3\n\n"
        + "💡 Type %1𝙝𝙚𝙡𝙥 𝙩𝙤 𝙫𝙞𝙚𝙬 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨!\n\n"
        + "📹 𝙒𝙖𝙩𝙘𝙝 𝙩𝙝𝙞𝙨 𝙫𝙞𝙙𝙚𝙤:",
      errorVideoOnly: "🔴 Failed to load video, but here's your prefix info."
    }
  },

  getSenderName: async function (api, userID) {
    try {
      const user = await api.getUserInfo(userID);
      return user[userID]?.name || "User";
    } catch {
      return "User";
    }
  },

  sendWelcomeVideo: async function ({ message, getLang, threadsData, event, api }) {
    const globalPrefix = global.GoatBot.config.prefix || ".";
    const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;
    const senderName = await this.getSenderName(api, event.senderID);

    const prefixText = getLang("thanksInvite", globalPrefix, threadPrefix, senderName);

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * videoUrls.length);
    } while (randomIndex === lastVideoIndex && videoUrls.length > 1);
    lastVideoIndex = randomIndex;

    const videoUrl = videoUrls[randomIndex];

    try {
      const res = await axios.get(videoUrl, { responseType: "stream" });
      return message.reply({
        body: prefixText,
        attachment: res.data
      });
    } catch (err) {
      console.error("Video load failed:", err.message);
      return message.reply(prefixText + "\n\n" + getLang("errorVideoOnly"));
    }
  },

  onStart: async function ({ args, message, event, threadsData, getLang, role, api, commandName }) {
    if (!args[0]) {
      return this.sendWelcomeVideo({ message, getLang, threadsData, event, api });
    }

    if (args[0].toLowerCase() === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix || "."));
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal && role < 2) return message.reply(getLang("onlyAdmin"));

    const confirmText = setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");

    return message.reply(confirmText, (err, info) => {
      if (!err) {
        global.GoatBot.onReaction.set(info.messageID, {
          commandName,
          author: event.senderID,
          newPrefix,
          setGlobal,
          messageID: info.messageID
        });
      }
    });
  },

  onReaction: async function ({ event, Reaction, message, threadsData, getLang }) {
    if (event.userID !== Reaction.author) return;

    try {
      if (Reaction.setGlobal) {
        global.GoatBot.config.prefix = Reaction.newPrefix;
        fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
        return message.reply(getLang("successGlobal", Reaction.newPrefix));
      } else {
        await threadsData.set(event.threadID, Reaction.newPrefix, "data.prefix");
        return message.reply(getLang("successThisThread", Reaction.newPrefix));
      }
    } finally {
      global.GoatBot.onReaction.delete(Reaction.messageID);
    }
  },

  onChat: async function ({ event, message, getLang, threadsData, api }) {
    if (event.body && event.body.toLowerCase().trim() === "prefix") {
      return this.sendWelcomeVideo({ message, getLang, threadsData, event, api });
    }
  }
};
