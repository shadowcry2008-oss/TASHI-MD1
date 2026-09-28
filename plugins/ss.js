const { cmd } = require('../command');

cmd({
    pattern: "ssweb",
    alias: ["ss", "screenshot", "webss"],
    desc: "Take a screenshot of any website with size options.",
    category: "other",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, pushname }) => {
    try {
        if (!q) return reply("⚠️ *𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗨𝗥𝗟!*\n\n*𝗘𝘅:* .ss google.com");

        let targetUrl = q.startsWith("http") ? q : "https://" + q;

        let menuTxt = `╭─── « 📸 *𝗪𝗘𝗕 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧* » ───⟡
│
│ ⊳ *𝗛𝗶 ${pushname},*
│ ⊳ *𝗧𝗮𝗿𝗴𝗲𝘁:* ${targetUrl}
│
│ [ 𝟭 ] 💻 𝗣𝗖 (𝗙𝘂𝗹𝗹 𝗣𝗮𝗴𝗲)
│ [ 𝟮 ] 💻 𝗣𝗖 (𝗩𝗶𝗲𝘄𝗽𝗼𝗿𝘁)
│ [ 𝟯 ] 📱 𝗠𝗼𝗯𝗶𝗹𝗲 (𝗙𝘂𝗹𝗹 𝗣𝗮𝗴𝗲)
│ [ 𝟰 ] 📱 𝗠𝗼𝗯𝗶𝗹𝗲 (𝗩𝗶𝗲𝘄𝗽𝗼𝗿𝘁)
│ [ 𝟱 ] 💊 𝗧𝗮𝗯𝗹𝗲𝘁 (𝗙𝘂𝗹𝗹 𝗣𝗮𝗴𝗲)
│
╰───────────────⟡

> _🔢 Reply with a number to capture._`;

        const sentMsg = await conn.sendMessage(from, { text: menuTxt }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": `ssdl 1920&1080&true&PC (Full Page)&${targetUrl}`,
            "2": `ssdl 1920&1080&false&PC (Viewport)&${targetUrl}`,
            "3": `ssdl 375&812&true&Mobile (Full Page)&${targetUrl}`,
            "4": `ssdl 375&812&false&Mobile (Viewport)&${targetUrl}`,
            "5": `ssdl 768&1024&true&Tablet (Full Page)&${targetUrl}`
        };

    } catch (e) {
        console.error("SSWEB_MENU_ERROR:", e);
        reply("❌ *𝗘𝗿𝗿𝗼𝗿:* Failed to generate screenshot menu.");
    }
});

cmd({
    pattern: "ssdl",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;

        const [width, height, fullPage, device, url] = q.split('&');

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const apiUrl = `https://www.movanest.xyz/v2/ssweb?url=${encodeURIComponent(url)}&width=${width}&height=${height}&full_page=${fullPage}`;

        let caption = `╭─── « 📸 *𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗥𝗘𝗔𝗗𝗬* » ───⟡
│
│ ⊳ *𝗗𝗲𝘃𝗶𝗰𝗲:* ${device}
│ ⊳ *𝗟𝗶𝗻𝗸:* ${url}
│
╰───────────────⟡

> © 𝗤𝗨𝗘𝗘𝗡 𝗡𝗘𝗦𝗛𝗨 𝗠𝗗`;

        await conn.sendMessage(from, {
            image: { url: apiUrl },
            caption: caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("SSDL_ERROR:", e);
        reply("❌ *𝗘𝗿𝗿𝗼𝗿:* Failed to capture screenshot. The site might be offline or blocked.");
    }
});
