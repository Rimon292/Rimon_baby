const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/KingsOfToxiciter/API/refs/heads/main/404.json');
  return base.data.api;
};

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bot", "kuttu"],
  version: "6.9.0",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "better then all sim simi",
  category: "talk",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;
  let command, comd, final;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
      const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
      return api.sendMessage(dat, event.threadID, event.messageID);
    }

    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(' - ');
      const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
      return api.sendMessage(da, event.threadID, event.messageID);
    }

    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const data = (await axios.get(`${link}?list=all`)).data;
        const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const name = (await usersData.get(number)).name;
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
        return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const d = (await axios.get(`${link}?list=all`)).data.length;
        return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === 'msg') {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
      return api.sendMessage(`Question ${fuk} answer => ${d}`, event.threadID, event.messageID);
    }

    if (args[0] === 'edit') {
      const command = dipto.split(' - ')[1];
      if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use {pn} edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
      return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach ", "shikh ");
      if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
      const tex = re.data.message;
      const teacher = (await usersData.get(re.data.teacher)).name;
      return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'amar') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach ", "");
      if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'react') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach react ", "react");
      if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
      const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
      return api.sendMessage(data, event.threadID, event.messageID);
    }

    const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
    api.sendMessage(d, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        d, 
        apiUrl: link
      });
    }, event.messageID);

  } catch (e) {
    console.log(e);
    api.sendMessage("Check console for error", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try{
  if (event.type == "message_reply") {
    const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
    await api.sendMessage(a, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        a
      });
    }, event.messageID);
  }  
  }catch(err){
      return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }};

module.exports.onChat = async ({ api, event,message }) => {
  try{
    const body = event.body ? event.body.toLowerCase() : ""
    if(body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("janu") || body.startsWith("kuttu")){
      const arr = body.replace(/^\S+\s*/, "") || "Rimon";
      if (arr === "Rimon"){ 
const funnyReplies = [
          "কি হয়ছে বেবি দাকস কেন 🙂",
    "MB nai bye 😓",
    "Ami ekhane bby 🥹",
    "Amake vhule jaw 🤌😫",
    "Hea janu bolo shuntachi🤤🍼",
    "ki hoiche ki koibi ?🐐",
    "tumi ki jano Rimon ar son hasan ☠️",
    "tmi ki jano tumi onk cute 🥺",
    "I love you ummmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmaaaaaaaaaaaaaaaaaaahhhhhhhhh🫦💋",
    "https://www.facebook.com/it.z.rimon.216225 eiii naw amar owner ar id onk loyal hot caring ekta pola potiye naw 👀🫶",
    "ei new jush khaw, bot bolte bolte hapai gecho 🧃",
    "Amake vhule jao 🥺",
    "Distrub koris na amr boss Rimon ar shate room date a achi 🌚💋",
    "bujhchi tui je Single na hole amare dakti na ekhon ki bolbi bol! 🙂🤌",
    "ei mon tumake dilam 🦆💨",
    "bujhchi tur kew nai amar motoi single 🫶💔",
    "কিরে বলদ তুই এইখানে !?🍆",
    "জানিস তুর আর আমার মিল কিসে ? ওইটা হচ্ছে তুই ও লুইচ্চা আর আমার কথা কি কমু!?🙂🚬",
    "তুই মেয়ে হলে আমার owner রিমনকে ডাক অনেক ভালো ছেলে 🔥🌚💋",
    "কি হইছে আমার কি কাজে লাগবে তুর !?🌚👀",
    "তুই সেই লুইচ্চাটা না !? 🙂🔪",
    "baby baby na kore porte bosleo toh paros 🙂",
    "i love you janu🐣"
        ];
        return api.sendMessage(funnyReplies[Math.floor(Math.random() * funnyReplies.length)], event.threadID, (error, info) => {

global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID
      });
    }, event.messageID);}
    const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
    await api.sendMessage(a, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        a
      });
    }, event.messageID);
    }
  }catch(err){
      return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }};
