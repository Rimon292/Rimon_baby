module.exports = {
  config: {
    name: "top",
    version: "1.1",
    author: "flame x",
    category: "economy",
    shortDescription: {
      vi: "Xem 10 người giàu nhất",
      en: "View the top 10 richest people",
    },
    longDescription: {
      vi: "Xem danh sách 10 người giàu nhất trong nhóm",
      en: "View the list of the top 10 richest people in the group",
    },
    guide: {
      en: "{pn} 1\n{pn} 50\n{pn} 100",
    },
    role: 0,
  },

  onStart: async function ({ message, usersData, args, api }) {
    const allUserData = await usersData.getAll();

    const sortedUsers = allUserData
      .filter((user) => !isNaN(user.money))
      .sort((a, b) => b.money - a.money);

    let msg = "👑 𝙏𝙊𝙋 𝙍𝙄𝘾𝙃𝙀𝙎𝙏 𝙈𝙀𝙈𝘽𝙀𝙍𝙎 👑\n\n";

    if (args[0] === "top") {
      if (sortedUsers.length > 0) {
        const richestUser = sortedUsers[0];
        const formattedBalance = formatNumberWithFullForm(richestUser.money);
        msg += `𝟭. 💸 𝐍𝐚𝐦𝐞: 『${richestUser.name}』\n    💰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${formattedBalance}\n`;
      } else {
        msg += "⚠️ 𝐍𝐨 𝐮𝐬𝐞𝐫𝐬 𝐟𝐨𝐮𝐧𝐝.\n";
      }
    } else {
      const topCount = Math.min(parseInt(args[0]) || 10, sortedUsers.length);
      sortedUsers.slice(0, topCount).forEach((user, index) => {
        const formattedBalance = formatNumberWithFullForm(user.money);
        msg += `𝟯. 💸 𝐍𝐚𝐦𝐞: 『${user.name}』\n    💰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${formattedBalance}\n\n`;
      });
    }

    msg += "🌟 𝐁𝐞𝐬𝐭 𝐎𝐟 𝐋𝐮𝐜𝐤, 𝐘𝐨𝐮 𝐂𝐚𝐧 𝐁𝐞 𝐓𝐨𝐩 𝐍𝐞𝐱𝐭! 🌟";

    message.reply(msg);
  },
};

function formatNumberWithFullForm(number) {
  const fullForms = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Hx",
    "Hp",
    "Oc",
    "No",
    "Dc",
  ];

  let fullFormIndex = 0;
  while (number >= 1000 && fullFormIndex < fullForms.length - 1) {
    number /= 1000;
    fullFormIndex++;
  }

  const formattedNumber = number.toFixed(2);
  return `${formattedNumber} ${fullForms[fullFormIndex]}`;
}

  
