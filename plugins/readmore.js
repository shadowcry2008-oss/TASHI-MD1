const { cmd } = require('../command');


const readMore = String.fromCharCode(8206).repeat(4001);

cmd({
    pattern: "seemore",
    alias: ["readmore", "hidetext"],
    desc: "Create a 'Read More' message.",
    category: "other",
    react: "📖",
    use: ".seemore උඩ පේන කෑල්ල | යට හැංගෙන කෑල්ල",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`*භාවිතා කරන ආකාරය:* .seemore පේන කෑල්ල | හැංගෙන කෑල්ල\n\n*Ex:* .seemore Hello Friend | This is a hidden message!`);

        
        const parts = q.split('|');
        if (parts.length < 2) return reply("❌ කරුණාකර කොටස් දෙක වෙන් කිරීමට `|` ලකුණ පාවිච්චි කරන්න.");

        const textBefore = parts[0].trim();
        const textAfter = parts[1].trim();

        
        const finalMsg = `${textBefore}${readMore}\n${textAfter}`;

        await conn.sendMessage(from, { text: finalMsg }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});
