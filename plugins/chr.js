const { cmd } = require('../command');
const delay = ms => new Promise(res => setTimeout(res, ms)); 
cmd({
    pattern: "pky",
    alias: ["creact", "channelreact"],
    desc: "React to a specific WhatsApp Channel message with multiple emojis.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, pushname }) => {
    try {
        if (!q || !q.includes(",")) {
            return reply("⚠️ *𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗙𝗼𝗿𝗺𝗮𝘁!*\n\n*📌 𝗨𝘀𝗮𝗴𝗲:* .chr <channel_link>, <emojis>\n*𝗘𝘅:* .chr https://whatsapp.com/channel/ABCDE12345/123, ❤️🔥👍");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

       
        let parts = q.split(",");
        let link = parts[0].trim();
        
        
        let rawEmojis = parts.slice(1).join("").replace(/\s/g, '');

        
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        const emojiArray = Array.from(segmenter.segment(rawEmojis)).map(s => s.segment);

        const inviteCode = link.split('/')[4];
        const messageId = link.split('/')[5];

        if (!inviteCode || !messageId || emojiArray.length === 0) {
            return reply("❌ *𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗲𝘅𝘁𝗿𝗮𝗰𝘁 𝗱𝗲𝘁𝗮𝗶𝗹𝘀.* Please ensure it's a valid link and emojis.");
        }

        
        const res = await conn.newsletterMetadata("invite", inviteCode);
        
        
        for (let emoji of emojiArray) {
            await conn.newsletterReactMessage(res.id, messageId, emoji);
            await delay(1000);
        }

        
        let caption = `╭─── « 📢 *𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗥𝗘𝗔𝗖𝗧* » ───⟡
│
│ ⊳ *𝗦𝘁𝗮𝘁𝘂𝘀:* Reacted Successfully! ✅
│ ⊳ *𝗘𝗺𝗼𝗷𝗶𝘀:* ${emojiArray.join(" ")}
│ ⊳ *𝗖𝗵𝗮𝗻𝗻𝗲𝗹:* ${res.name || 'Unknown'}
│
╰───────────────⟡

> © 𝗧𝗛𝗨𝗛𝗜 𝗠𝗗 𝗩𝟬𝟭`;

        await reply(caption);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log("CHANNEL_REACT_ERROR:", e);
        reply(`❌ *𝗘𝗿𝗿𝗼𝗿:* Could not react. Make sure the bot has followed the channel or the link is correct.\n\n_${e.message || e.toString()}_`);
    }
});
