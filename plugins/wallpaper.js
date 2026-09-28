const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "wallpaper",
    alias: ["wp", "wall"],
    use: '.wp <query>',
    react: "🖼️",
    desc: "Search for high-quality wallpapers.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, pushname }) => {
    try {
        if (!q) return await reply('🔎 *𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘁𝗲𝗿𝗺 𝘁𝗼 𝘀𝗲𝗮𝗿𝗰𝗵!* \n\n*𝗘𝘅:* .wp cyber car');

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        const apikey = "chama_4c00cc4d79447b4994bc2e5fc6b6f9c3";
        const apiUrl = `https://chama-api-hub.vercel.app/api/search/wallpaper?apikey=${apikey}&q=${encodeURIComponent(q)}`;
        const data = await fetchJson(apiUrl);

        if (!data.status || !data.result || data.result.length === 0) {
            return reply("❌ *𝗡𝗼 𝘄𝗮𝗹𝗹𝗽𝗮𝗽𝗲𝗿𝘀 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿:* " + q);
        }

        let caption = `╭─── « 🖼️ *𝗪𝗔𝗟𝗟𝗣𝗔𝗣𝗘𝗥 𝗦𝗘𝗔𝗥𝗖𝗛* » ───
│ 💡 *𝗛𝗶 ${pushname},*
│ 🔎 *𝗤𝘂𝗲𝗿𝘆:* ${q}
╰───────────────⟡

╭─── « 𝗦𝗘𝗟𝗘𝗖𝗧 𝗔 𝗣𝗜𝗖𝗧𝗨𝗥𝗘 » ───
`;

        let storeData = {};
        for (let i = 0; i < Math.min(data.result.length, 10); i++) {
            const res = data.result[i];
            caption += `│ ${i + 1} | ${res.title}\n`;
            storeData[(i + 1).toString()] = `wpdown ${res.image}`;
        }

        caption += `╰───────────────⟡

_🔢 Reply with a number to download HD._
*© TASHI-MD*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: data.result[0].image }, 
            caption: caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = storeData;

    } catch (e) {
        console.error("WP_SEARCH_ERROR:", e);
        reply("❌ *𝗦𝗲𝗮𝗿𝗰𝗵 𝗙𝗮𝗶𝗹𝗲𝗱!*");
    }
});

cmd({
    pattern: "wpdown",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        await conn.sendMessage(from, { 
            image: { url: q }, 
            caption: `✅ *𝗛𝗗 𝗪𝗮𝗹𝗹𝗽𝗮𝗽𝗲𝗿 𝗗𝗲𝗹𝗶𝘃𝗲𝗿𝗲𝗱!* \n\n> © TASHI-MD` 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "🖼️", key: mek.key } });

    } catch (e) {
        console.error("WP_DL_ERROR:", e);
        reply("❌ *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱!*");
    }
});
