module.exports = {
  config: {
    name: "topexp",
    version: "1.0",
    author: "OTINXSANDIP",
    role: 0,
    shortDescription: {
      en: "Top 10 Exp users"
    },
    longDescription: {
      en: ""
    },
    category: "economy",
    guide: {
      en: "{pn}"
    }
  },
  onStart: async function ({ api, args, message, event, usersData }) {
    const allUsers = await usersData.getAll();

    // Filter out users with no experience points
    const usersWithExp = allUsers.filter(user => user.exp > 0);

    if (usersWithExp.length < 10) {
      message.reply("There are not enough users with experience points to display a top 10.");
      return;
    }

    const topExp = usersWithExp.sort((a, b) => b.exp - a.exp).slice(0, 10);

    const topUsersList = topExp.map((user, index) => `${index + 1}. 🍂${user.name}🍂\n     ➥${user.exp}`);

    const messageText = `𓀬 𝙏𝙊𝙋 𝙍𝘼𝙉𝙆 𝙐𝙎𝙀𝙍 𓀬\n \n${topUsersList.join('\n')}`;

    message.reply(messageText);
  }
};
