const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "tourl",
    alias: ["img2url", "upload", "imgurl"],
    desc: "Upload image to ImgBB and get a direct URL.",
    category: "other",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const isQuotedImage = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
        const isImage = mek.message?.imageMessage;

        if (!isImage && !isQuotedImage) {
            return reply("⚠️ *𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲!*\n\n*𝗘𝘅:* Reply to an image and type .tourl");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const mediaMessage = isQuotedImage ? mek.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : mek.message.imageMessage;
        
        const stream = await downloadContentFromMessage(mediaMessage, 'image');
        let buffer = Buffer.from([]);
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const form = new FormData();
        form.append('image', buffer.toString('base64'));

        const apiKey = "53acd9031dbc65e69bafff8d293e22a4";
        const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders()
        });

        if (!response.data || !response.data.data || !response.data.data.url) {
            return reply("❌ *𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘂𝗽𝗹𝗼𝗮𝗱 𝗶𝗺𝗮𝗴𝗲. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻!*");
        }

        const imgUrl = response.data.data.url;

        let caption = `╭─── « 🔗 *𝗜𝗠𝗔𝗚𝗘 𝗧𝗢 𝗨𝗥𝗟* » ───⟡
│
│ ⊳ *𝗛𝗶 ${pushname},*
│ ⊳ *𝗦𝘁𝗮𝘁𝘂𝘀:* 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗨𝗽𝗹𝗼𝗮𝗱𝗲𝗱! ✅
│
│ ⊳ *𝗟𝗶𝗻𝗸:* │ ${imgUrl}
│
╰───────────────⟡

> © 𝗤𝗨𝗘𝗘𝗡 𝗡𝗘𝗦𝗛𝗨 𝗠𝗗`;

        await reply(caption);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("IMG2URL_ERROR:", e);
        reply(`❌ *𝗘𝗿𝗿𝗼𝗿:* ${e.message}`);
    }
});
