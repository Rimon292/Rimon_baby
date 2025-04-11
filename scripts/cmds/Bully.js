module.exports.config = {
    name: "bully",
    category: "automation",
    author: "Rimon"
};

const userResponses = {};

module.exports.onStart = async function ({ api, event }) {
    const botAdmins = ['61550123016189']; // এখানে তোর UID দে

    if (!botAdmins.includes(event.senderID)) {
        return api.sendMessage("তুই কে রে? Permission ছাড়া চলবি না ভাই!", event.threadID);
    }

    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("কারে bully করবি? Mention কর আগে!", event.threadID);

    api.getUserInfo(mention, async (err, userInfo) => {
        if (err) {
            return api.sendMessage("User info আনতে পারলাম না ভাই।", event.threadID);
        }

        const gender = userInfo[mention].gender;
        const genderText = gender === 1 ? "মাইয়া" : gender === 2 ? "পোলা" : "অজানা জাতের";

        const msg = [
            // আগের ৫০টা রোস্ট
            "তোর আত্মবিশ্বাস দেখলে আয়নাও নিজের প্রতিবিম্বে থুথু ফেলে।",
            "তোর কথা শুনে মিরর ফাটে না, কারণ ওরও দয়া লাগে।",
            "তুই যদি কোনোদিন বুদ্ধিমান হোস, বিজ্ঞান নতুন অধ্যায় খুলবে – “বেকার মিরাকল”।",
            "তোর হাসিতে এত বিষ আছে, মনে হয় সাপও তোর কাছে কোচিং করে।",
            "তুই তোর বুদ্ধি দিয়ে স্ক্র্যাবল খেললে 'duh' বানানোই কষ্ট।",
            "তুই যদি কোনওদিন স্টাইলিশ হোস, ফ্যাশন ইন্ডাস্ট্রি দেউলিয়া হয়ে যাবে।",
            "তুই এত ফেক, তোর জন্ম সার্কাসে হইছে মনে হয়।",
            "তুই জিনিয়াস হইলে, অ্যাইনস্টাইন মুচকি হাসে।",
            "তোর কমব্যাক এত দুর্বল, ‘404 রোস্ট নট ফাউন্ড’।",
            "তোর অস্তিত্বই এমন, কেউ তোর নাম শুনে Google-এ ব্লক করে।",
            "তুই এত নিরুত্তর যে, তোর মুখ দেখলেই 'skip ad' আসে।",
            "তোর কান্না শুনে পেঁয়াজও কাঁদা বন্ধ করে।",
            "তুই এত ন্যাচারালি বিরক্তিকর, উইফাই-ও কানেকশন ছিড়ে নেয়।",
            "তোর মত মানুষ দেখে আল্লাহও হয়তো বলে 'আমার ভুল ছিল'।",
            "তুই এমন সস্তা, বাজারে ছেঁড়া প্যাকেটেও মানুষ তোকে নেয় না।",
            "তুই আইডিয়া দিলে মানুষের IQ কমে যায়।",
            "তোর আওয়াজ শুনে পাখিরাও গান গাওয়া ছেড়ে দেয়।",
            "তুই এত নিষ্প্রয়োজনীয় যে Ctrl+Z-ও তোকে ফিরিয়ে নিতে চায় না।",
            "তুই সৎ হলে সৎ শব্দটাই লজ্জা পায়।",
            "তোর স্মার্টনেস এত কম, ক্যালকুলেটরেও ERR দেখায়।",
            "তোর আইকিউ দেখে স্কুল নিজেই ডিগ্রি ফেরত চায়।",
            "তুই ডিকশনারিতে থাকলে 'বেকুব' শব্দ বাদ যেত।",
            "তোর এত কম জ্ঞান, গুগলও তোকে ব্লক করে দিয়েছে।",
            "তুই এমন ফেইক, চায়না তোকে 'made in us' বলে ছাড়ে।",
            "তুই এমন বোকার হদ্দ, তোরে দেখে কমেডিয়ানও সিরিয়াস হয়ে যায়।",
            "তুই এত বোরিং, তোর সাথে চ্যাট করলে ফোন সাইলেন্ট হয়ে যায়।",
            "তোর কথা শুনে অ্যাপল Siri-ও চুপ হয়ে যায়।",
            "তোর যুক্তি এমন হাস্যকর, ক্লাউন রিটায়ার করে দিছে।",
            "তুই তোর থটস শেয়ার করলে মানুষ 'report as spam' দেয়।",
            "তুই এত আনফিল্টার্ড, ইনস্টাগ্রাম তোকে স্কিপ করে।",
            "তোর সাজগোজ দেখে আয়নারাও চোখ বন্ধ করে।",
            "তুই যদি হ্যান্ডসাম হোস, তবে ভুতেরা হয় সুপারমডেল।",
            "তোর সাজ এমন পুরনো, জাদুঘরেও তোকে ঢুকতে দেয় না।",
            "তোর ফ্যাশন সেন্স দেখে ব্লাইন্ড মানুষ চোখ খুলতে চায় না।",
            "তোর ছবি দিলে ক্যামেরা নিজেই ডিলিট মারে।",
            "তুই এত আগলি, স্ক্যারি ফিল্টার তোকে মুছে দেয়।",
            "তোর মুখে এমন এক্সপ্রেশন, যেন লাইফেই এক্সাইটমেন্ট নাই।",
            "তুই রোজ সেলফি দিলে ফেসবুক 'sorry for your loss' বলে।",
            "তুই যদি লুকস নিয়ে কম্পিট করিস, ছায়াও তোকে ছেড়ে দেয়।",
            "তোরে roast করা insult না, তা তো charity।",
            "তুই এমন embarrassing, তোর ছায়াও অন্য কারো পিছে চলে যায়।",
            "তোর স্কিল দেখে বাঁদরও evolve হইতে লজ্জা পায়।",
            "তুই এমন loser, Google Maps-এ তোর goal খুঁজে পায় না।",
            "তোর অবস্থা এমন, mirror বলছে 'not again...'।",
            "তুই এত useless, recycle bin-ও তোকে না নেয়।",
            "তোর নাম শুনে WiFi ডিসকানেক্ট হয়।",
            "তুই এমন ছোট মানসিকতায় বড় হইছোস কেমনে?",
            "তুই রাগ করলে meme পেইজে চাকরি হয় তোর।",
            "তুই শেষমেষ এমন একটা joke, যেটা punchline-ই ভুলে গেছে।",

            // নতুন ২০টা এক্সট্রা রোস্ট
            "তুই কথা বললেই কান্না পায়—তবে সেটা দয়া না, অপমান।",
            "তোর রুচি দেখে dustbin-ও offended।",
            "তুই এত বোকা, তোরে drive দিলে GPS suicide করে।",
            "তোরে ব্লক না করলে মানুষ insomnia তে ভোগে।",
            "তুই এমন cringe, TikTok তোকে shadowban করে।",
            "তুই যেখানেই যাস, awkwardness আগেই হাজির হয়।",
            "তোর reference কেউ দেয় না, কারণ তোরে কেউ চেনে না।",
            "তুই এমন dry, তোকে দেইখা মরুভূমি jealous হয়।",
            "তুই joke করলে silence clap দেয়।",
            "তুই এমন tone মারিস, tuning fork ফেটে যায়।",
            "তোর রাগ এমন soft, marshmallow-ও dominance দেখায়।",
            "তুই বললি তো বুঝি—life pause হইছে।",
            "তোর প্রতি min আকর্ষণ কমে ৭০%।",
            "তুই reply দিলেই ফোন vibrate না, বমি করে।",
            "তোর ভাব এত বেশি, attitude ও তোরে unfollow করে।",
            "তুই এমন emotionless, robot তোকে ‘boring’ বলছে।",
            "তুই roast খাইলেও taste নাই।",
            "তুই এমন low-key, তোকে underground রেখেই শান্তি।",
            "তুই এত flat, pancake ও তোরে দেখে আফসোস করে।",
            "তোর talent negative scale এ পড়ে।"
        ];

        api.sendMessage(`কিরে ${event.mentions[mention]}? বাপের সাথে বেয়াদবি কেন?¿.`, event.threadID);

        if (!userResponses[mention]) {
            userResponses[mention] = { index: 0 };
        }

        const listener = (err, message) => {
            if (message && message.senderID === mention && message.body) {
                const currentIndex = userResponses[mention].index;
                api.sendMessage(msg[currentIndex % msg.length], message.threadID, message.messageID);
                userResponses[mention].index++;
            }
        };

        if (!userResponses[mention].listenerAttached) {
            api.listenMqtt(listener);
            userResponses[mention].listenerAttached = true;
        }
    });
};
