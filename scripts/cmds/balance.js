module.exports = {
    config: {
        name: "balance",
        aliases: ["bal"],
        version: "1.5",
        author: "Flame x Rimon",
        countDown: 5,
        role: 0,
        description: {
            en: "😽 𝐂𝐡𝐞𝐜𝐤 𝐛𝐚𝐥𝐚𝐧𝐜𝐞, 𝐬𝐞𝐧𝐝 𝐨𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐦𝐨𝐧𝐞𝐲 𝐰𝐢𝐭𝐡 𝐜𝐚𝐭 𝐜𝐮𝐭𝐞𝐧𝐞𝐬𝐬~"
        },
        category: "economy",
        guide: {
            en: "   {pn} ➤ 𝐂𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 😽"
                + "\n   {pn} <@tag> ➤ 𝐂𝐡𝐞𝐜𝐤 𝐭𝐡𝐞𝐢𝐫 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 🐾"
                + "\n   {pn} send [amount] @mention ➤ 𝐒𝐞𝐧𝐝 𝐦𝐨𝐧𝐞𝐲 😼"
                + "\n   {pn} request [amount] @mention ➤ 𝐀𝐬𝐤 𝐟𝐨𝐫 𝐦𝐨𝐧𝐞𝐲 🐱"
        }
    },

    formatMoney: function (amount) {
        if (!amount) return "0";
        if (amount >= 1e33) return (amount / 1e33).toFixed(1) + 'Dc';
        if (amount >= 1e30) return (amount / 1e30).toFixed(1) + 'No';
        if (amount >= 1e27) return (amount / 1e27).toFixed(1) + 'Oc';
        if (amount >= 1e24) return (amount / 1e24).toFixed(1) + 'Sp';
        if (amount >= 1e21) return (amount / 1e21).toFixed(1) + 'Sx';
        if (amount >= 1e18) return (amount / 1e18).toFixed(1) + 'Qn';
        if (amount >= 1e15) return (amount / 1e15).toFixed(1) + 'Q';
        if (amount >= 1e12) return (amount / 1e12).toFixed(1) + 'T';
        if (amount >= 1e9) return (amount / 1e9).toFixed(1) + 'B';
        if (amount >= 1e6) return (amount / 1e6).toFixed(1) + 'M';
        if (amount >= 1e5) return (amount / 1e5).toFixed(1) + 'Lakh';
        if (amount >= 1e3) return (amount / 1e3).toFixed(1) + 'K';
        return amount.toString();
    },

    onStart: async function ({ message, usersData, event, args, api }) {
        let targetUserID = event.senderID;
        let isSelfCheck = true;

        if (event.messageReply) {
            targetUserID = event.messageReply.senderID;
            isSelfCheck = false;
        } 
        else if (event.mentions && Object.keys(event.mentions).length > 0) {
            targetUserID = Object.keys(event.mentions)[0];
            isSelfCheck = false;
        }

        if (args.length > 0 && (args[0] === "send" || args[0] === "request")) {
            return await this.handleTransaction({ message, usersData, event, args, api });
        }

        const userData = await usersData.get(targetUserID);
        const money = userData?.money || 0;
        const formattedMoney = this.formatMoney(money);

        if (isSelfCheck) {
            return message.reply(`🐾 𝐌𝐞𝐨𝐰~ 𝐘𝐨𝐮𝐫 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 𝐢𝐬 💵 ${formattedMoney} 😽`);
        } 
        else {
            return message.reply(`🐱 𝐂𝐚𝐭 𝐁𝐚𝐧𝐤 𝐑𝐞𝐩𝐨𝐫𝐭 🐱\n😼 ${userData?.name || "𝐔𝐬𝐞𝐫"} 𝐡𝐚𝐬 ${formattedMoney} 💰\n😻 𝐊𝐞𝐞𝐩 𝐛𝐞𝐢𝐧𝐠 𝐚 𝐫𝐢𝐜𝐡 𝐜𝐚𝐭!`);
        }
    },

    handleTransaction: async function ({ message, usersData, event, args, api }) {
        const command = args[0].toLowerCase();
        const amount = parseInt(args[1]);
        const { senderID, threadID, mentions, messageReply } = event;
        let targetID;

        if (isNaN(amount) || amount <= 0) {
            return api.sendMessage(`😿 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭, 𝐤𝐢𝐭𝐭𝐲! ➤\n{pn} send [amount] @mention\n{pn} request [amount] @mention`, threadID);
        }

        if (messageReply) {
            targetID = messageReply.senderID;
        } else {
            const mentionKeys = Object.keys(mentions);
            if (mentionKeys.length === 0) {
                return api.sendMessage("😾 𝐘𝐨𝐮 𝐧𝐞𝐞𝐝 𝐭𝐨 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐚 𝐜𝐚𝐭!", threadID);
            }
            targetID = mentionKeys[0];
        }

        if (!targetID || targetID === senderID) {
            return api.sendMessage("🙀 𝐂𝐚𝐧'𝐭 𝐬𝐞𝐧𝐝 𝐨𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐭𝐨 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!", threadID);
        }

        if (command === "send") {
            const senderData = await usersData.get(senderID);
            const receiverData = await usersData.get(targetID);

            if (!senderData || !receiverData) {
                return api.sendMessage("😿 𝐔𝐬𝐞𝐫 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝!", threadID);
            }

            if (senderData.money < amount) {
                return api.sendMessage("😿 𝐍𝐨𝐭 𝐞𝐧𝐨𝐮𝐠𝐡 𝐜𝐚𝐬𝐡, 𝐦𝐲 𝐟𝐞𝐥𝐥𝐢𝐧𝐞!", threadID);
            }

            await usersData.set(senderID, { ...senderData, money: senderData.money - amount });
            await usersData.set(targetID, { ...receiverData, money: receiverData.money + amount });

            const senderName = await usersData.getName(senderID);
            const receiverName = await usersData.getName(targetID);

            api.sendMessage(`😽 𝐇𝐞𝐲! ${senderName} 𝐬𝐞𝐧𝐭 𝐲𝐨𝐮 ${this.formatMoney(amount)} 💰!`, targetID);
            return api.sendMessage(`😺 𝐘𝐨𝐮 𝐬𝐞𝐧𝐭 ${this.formatMoney(amount)} 𝐭𝐨 ${receiverName} 😽`, threadID);
        }

        if (command === "request") {
            const requesterName = await usersData.getName(senderID);
            const targetName = await usersData.getName(targetID);

            api.sendMessage(`😿 ${requesterName} তোমার কাছে ${this.formatMoney(amount)} টাকা চেয়েছে!\nপাঠাতে লেখো: "{pn} send ${amount} @${requesterName}"`, targetID);
            return api.sendMessage(`😼 তুমি ${targetName}-এর কাছে ${this.formatMoney(amount)} টাকা চেয়েছো!`, threadID);
        }
    }
};
