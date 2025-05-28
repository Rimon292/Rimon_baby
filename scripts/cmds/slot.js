const cooldown = new Map();

module.exports = {
  config: {
    name: "slot",
    version: "2.5",
    author: "flame x",
    description: {
      role: 2,
      en: "Playing slot game",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "💰 Please enter a valid amount of money to play.",
      not_enough_money: "💸 Check your balance if you have that amount.",
      cooldown_message: "⏳ Please wait 5 seconds before playing again.",
      win_message: "𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1",
      lose_message: "𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭 $%1",
      jackpot_message: "𝐉𝐀𝐂𝐊𝐏𝐎𝐓!! 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1 𝐟𝐨𝐫 𝐟𝐢𝐯𝐞 %2 𝐬𝐲𝐦𝐛𝐨𝐥𝐬!",
    },
  },
  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;

    if (cooldown.has(senderID)) {
      return message.reply(getLang("cooldown_message"));
    }
    cooldown.set(senderID, true);
    setTimeout(() => cooldown.delete(senderID), 5000);

    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["💚", "🧡", "❤️", "💜", "💙", "💛"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = win(slot1, slot2, slot3, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = result(slot1, slot2, slot3, winnings, getLang);
    return message.reply(messageText);
  },
};

function win(slot1, slot2, slot3, betAmount) {
  const isJackpot = slot1 === slot2 && slot2 === slot3;
  const isWin = isJackpot || Math.random() < 0.4;

  if (isJackpot) return betAmount * 10;
  if (isWin) return betAmount * 2;
  return -betAmount;
}

function result(slot1, slot2, slot3, winnings, getLang) {
  const bold = (text) =>
    text
      .replace(/[A-Z]/gi, (c) =>
        String.fromCodePoint(
          c.charCodeAt(0) + (c >= 'a' ? 119737 - 97 : 119743 - 65)
        )
      )
      .replace(/\d/g, (d) =>
        String.fromCodePoint(0x1d7ce + parseInt(d))
      );

  const slotLine = `\n\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [  ${slot1}  |  ${slot2}  |  ${slot3}  ]`;

  if (winnings > 0) {
    if (slot1 === slot2 && slot2 === slot3) {
      return `${bold(">🪽")}\n• ${bold(getLang("jackpot_message", winnings, slot1))}${bold(slotLine)}`;
    } else {
      return `${bold(">🪽")}\n• ${bold(getLang("win_message", winnings))}${bold(slotLine)}`;
    }
  } else {
    return `${bold(">🪽")}\n• ${bold(getLang("lose_message", -winnings))}${bold(slotLine)}`;
  }
}

                                   
