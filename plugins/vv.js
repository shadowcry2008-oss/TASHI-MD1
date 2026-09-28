const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const dbPath = path.join(__dirname, 'vv_trigger.json');

cmd({
    pattern: "setvv",
    react: "⚙️",
    desc: "Set a custom prefix-less trigger for VV",
    category: "owner",
    use: '.setvv <emoji or word>',
    filename: __filename
},
async (conn, mek, m, { from, q, isOwner, reply }) => {
    if (!isOwner) return await reply("❌ 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿!");

    const query = q ? q.trim() : "";

    if (query.toLowerCase() === 'reset') {
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
        return await reply("✅ *Custom VV Trigger Reset!*\nNow using default emoji: 🔓");
    }

    if (!query) {
        return await reply(`🛠️ *CUSTOM VV TRIGGER SETUP* 🛠️\n\n*🔹 Set a custom emoji or word (No Prefix needed):*\n.setvv 🔓\n.setvv get\n\n*🔹 Reset to default:*\n.setvv reset`);
    }

    fs.writeFileSync(dbPath, JSON.stringify({ trigger: query }));
    await reply(`✅ *CUSTOM VV TRIGGER SAVED!*\n\nNow you can simply reply to a View Once message using:\n*${query}*\n_(No dot/prefix required!)_`);
});

// Prefix-less Trigger Logic
cmd({
    on: "body" 
},
async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        if (!isOwner || !m.quoted) return;

        const msgText = mek.message?.conversation || mek.message?.extendedTextMessage?.text || "";
        if (!msgText) return;

        let trigger = "🔓"; 
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath));
            trigger = data.trigger;
        }

        if (msgText.trim() !== trigger) return;

        const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) return;

        let type = Object.keys(quotedMessage)[0];
        let mediaMsg = quotedMessage[type];

        if (type === 'viewOnceMessageV2' || type === 'viewOnceMessage' || type === 'viewOnceMessageV2Extension') {
            const innerType = Object.keys(quotedMessage[type].message)[0];
            mediaMsg = quotedMessage[type].message[innerType];
            type = innerType;
        }

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
            return reply("❌ 𝗧𝗵𝗶𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝗩𝗶𝗲𝘄 𝗢𝗻𝗰𝗲 𝗽𝗵𝗼𝘁ο, 𝘃𝗶𝗱𝗲𝗼, 𝗼𝗿 𝘃𝗼𝗶𝗰𝗲 𝗻𝗼𝘁𝗲.");
        }

        const stream = await downloadContentFromMessage(mediaMsg, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let senderId = m.quoted.sender || m.sender || '';
        const secretCaption = `🔓 *𝗩𝗜𝗘𝗪-𝗢𝗡𝗖𝗘 𝗥𝗘𝗧𝗥𝗜𝗘𝗩𝗘𝗗*\n\n◈ *𝚃𝚈𝙿𝙴:* ${type.replace('Message', '').toUpperCase()}\n◈ *𝙵𝚁𝙾𝙼:* ${from.split('@')[0]}\n◈ *𝚂𝙴𝗡𝙳𝙴𝚁:* @${senderId.split('@')[0]}\n\n> © 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 GAYAN`;

        if (type === 'imageMessage') {
            await conn.sendMessage(senderId, { image: buffer, caption: secretCaption, mentions: [senderId] });
        } else if (type === 'videoMessage') {
            await conn.sendMessage(senderId, { video: buffer, caption: secretCaption, mimetype: 'video/mp4', mentions: [senderId] });
        } else if (type === 'audioMessage') {
            await conn.sendMessage(senderId, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true });
            await conn.sendMessage(senderId, { text: secretCaption, mentions: [senderId] });
        }

    } catch (e) {
        console.log("VV_PREFIXLESS_ERROR:", e);
    }
});

// .vv Command Logic
cmd({
    pattern: "vv",
    alias: ["viewonce", "retrieve"],
    desc: "Retrieve View Once media.",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        if (!isOwner) return reply("❌ 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿!");
        if (!m.quoted) return reply("❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗩𝗶𝗲𝘄 𝗢𝗻𝗰𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲.");
        
        const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) return reply("❌ 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗶𝗻𝗱 𝘁𝗵𝗲 𝗾𝘂𝗼𝘁𝗲𝗱 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗱𝗮𝘁𝗮.");

        let type = Object.keys(quotedMessage)[0];
        let mediaMsg = quotedMessage[type];

        if (type === 'viewOnceMessageV2' || type === 'viewOnceMessage' || type === 'viewOnceMessageV2Extension') {
            const innerType = Object.keys(quotedMessage[type].message)[0];
            mediaMsg = quotedMessage[type].message[innerType];
            type = innerType;
        }

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
            return reply("❌ 𝗧𝗵𝗶𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝗩𝗶𝗲𝘄 𝗢𝗻𝗰𝗲 𝗽𝗵𝗼𝘁𝗼, 𝘃𝗶𝗱𝗲𝗼, 𝗼𝗿 𝘃𝗼𝗶𝗰𝗲 𝗻𝗼𝘁𝗲.");
        }

        const stream = await downloadContentFromMessage(mediaMsg, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let senderId = m.quoted.sender || m.sender || '';
        const secretCaption = `🔓 *𝗩𝗜𝗘𝗪-𝗢𝗡𝗖𝗘 𝗥𝗘𝗧𝗥𝗜𝗘𝗩𝗘𝗗*\n\n◈ *𝚃𝚈𝙿𝙴:* ${type.replace('Message', '').toUpperCase()}\n◈ *𝙵𝚁𝙾𝙼:* ${from.split('@')[0]}\n◈ *𝚂𝙴𝗡𝙳𝙴𝚁:* @${senderId.split('@')[0]}\n\n> © 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 qʏᴇᴇɴ ɴᴇꜱʜᴜ ᴍᴅ`;

        if (type === 'imageMessage') {
            await conn.sendMessage(senderId, { image: buffer, caption: secretCaption, mentions: [senderId] });
        } else if (type === 'videoMessage') {
            await conn.sendMessage(senderId, { video: buffer, caption: secretCaption, mimetype: 'video/mp4', mentions: [senderId] });
        } else if (type === 'audioMessage') {
            await conn.sendMessage(senderId, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true });
            await conn.sendMessage(senderId, { text: secretCaption, mentions: [senderId] });
        }
    } catch (e) {
        console.log("VV_ERROR:", e);
        reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: " + e.message);
    }
});
