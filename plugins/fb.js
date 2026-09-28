const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "Download videos from Facebook.",
    category: "download",
    react: "🏮",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        
        if (!q || (!q.includes('facebook.com') && !q.includes('fb.watch'))) {
            return reply("🚫 *𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝘃𝗶𝗱𝗲𝗼 𝗨𝗥𝗟.*");
        }

       
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

       
        const apiUrl = `https://www.ominisave.com/api/fb?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.status || !data.result) {
            return reply("❌ *𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝘃𝗶𝗱𝗲𝗼. 𝗠𝗮𝗸𝗲 𝘀𝘂𝗿𝗲 𝘁𝗵𝗲 𝗹𝗶𝗻𝗸 𝗶𝘀 𝗽𝘂𝗯𝗹𝗶𝗰.*");
        }

        const res = data.result;
        const dlUrl = res.downloadLink;
        const title = res.title || "Facebook Video";
        const quality = res.quality || "HD";

       
        await conn.sendMessage(from, { react: { text: "⬆️", key: mek.key } });
        
        const caption = `╭─── « 🏮 *𝗙𝗕 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥* » ───
│
│ 🎬 *𝗧𝗶𝘁𝗹𝗲:* ${title}
│ quality: *${quality}*
│
╰───────────────⟡

> ©   𝘘𝘜𝘌𝘌𝘕 𝘕𝘌𝘚𝘏𝘜 𝘔𝘋`;

        
        await conn.sendMessage(from, { 
            video: { url: dlUrl }, 
            mimetype: 'video/mp4', 
            caption: caption 
        }, { quoted: mek });

       
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log("FB_ERROR:", e);
        reply("❌ *𝗘𝗿𝗿𝗼𝗿:* Failed to download the video.");
    }
});
