const { cmd } = require('../command');

cmd({
    pattern: "poll",
    alias: ["vote", "pool"],
    desc: "Create a poll/vote in the group.",
    category: "other",
    use: '.poll Question | Option1 | Option2 | Option3',
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ මේක Group එකක විතරයි පාවිච්චි කරන්න පුළුවන්.");
        if (!q) return reply("⚠️ කරුණාකර ප්‍රශ්නය සහ උත්තර ඇතුළත් කරන්න.\n\n*EX:* .poll ඔයාලට මොන bot එකද හොඳ? | THUHI MD V1 | THUHI MD V2 | THUHI MD V3");

        const parts = q.split('|');
        
        if (parts.length < 3) {
            return reply("⚠️ කරුණාකර අවම වශයෙන් ප්‍රශ්නයක් සහ උත්තර 2ක්වත් ඇතුළත් කරන්න. (වෙන් කරන්න | ලකුණ පාවිච්චි කරන්න)");
        }

        const question = parts[0].trim();
        const options = parts.slice(1).map(opt => opt.trim());

        await conn.sendMessage(from, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1
            }
        });

    } catch (e) {
        console.log("Poll Command Error:", e);
        reply("❌ Poll එක හදද්දී පොඩි අවුලක් ආවා.");
    }
});
