const { cmd } = require('../command');
const { ytmp3 } = require('dxz-ytdl'); 
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

cmd({
    pattern: "song",
    alias: ["ytsong", "play"],
    use: '.song <query or url>',
    react: "🎧",
    desc: "Download songs with quality selection",
    category: "Download",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('🔎 *𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘀𝗼𝗻𝗴 𝗻𝗮𝗺𝗲 𝗼𝗿 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗹𝗶𝗻𝗸!*');

        const url = q.replace(/\?si=[^&]*/, '');
        const results = await yts(url);
        const result = results.videos[0];
        
        if (!result) return reply("❌ *𝗦𝗼𝗻𝗴 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱!*");

        let caption = `╭━━━〔 *TASHI-MD ᴠ01* 〕━━━┈⊷
┃ 🎧 *𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘Ｒ*
╰━━━━━━━━━━━━━━━┈⊷

*┌────────────────────┐*
*├ \`🎶 𝐓𝐢𝐭λ𝐞\` :* ${result.title}
*├ \`⌛ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧\` :* ${result.duration}
*├ \`📎 𝐔𝐑𝐋\` :* ${result.url}
*└────────────────────┘*

╭━━━〔 *痕𝗘𝗣𝗟𝗬 𝗡𝗨𝗠𝗕𝗘𝗥* 〕━━━┈⊷
┃ *🎶 ᴀᴜᴅɪᴏ ғᴏʀᴍᴀᴛ*
┃ 1️⃣ | 128𝗄𝖻𝗉𝗌 (𝖲𝗍𝖺𝗇𝖽𝖺𝗋𝖽)
┃ 2️⃣ | 320𝗄𝖻𝗉𝗌 (𝖧𝗂𝗀𝗁 𝖰𝗎𝖺𝗅𝗂𝗍𝗒)
┃
┃ *📂 ᴅᴏᴄᴜᴍᴇɴᴛ ғᴏʀᴍᴀᴛ*
┃ 3️⃣ | 128𝗄𝖻𝗉𝗌 (𝖲𝗍𝖺𝗇𝖽𝖺𝗋𝖽)
┃ 4️⃣ | 320𝗄𝖻𝗉𝗌 (𝖧𝗂𝗀𝗁 𝖰𝗎𝖺𝗅𝗂𝗍𝗒)
┃
┃ *🎤 ᴠᴏɪᴄᴇ ғᴏʀᴍᴀᴛ*
┃ 5️⃣ | 𝖵𝗈𝗂𝖼𝖾 𝖭𝗈𝗍𝖾
╰━━━━━━━━━━━━━━━┈⊷

_🔢 Please reply with the corresponding number._`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": `ytaa 128k&${result.url}`,
            "2": `ytaa 320k&${result.url}`,
            "3": `ytad 128k&${result.url}&${result.thumbnail}&${result.title}`,
            "4": `ytad 320k&${result.url}&${result.thumbnail}&${result.title}`,
            "5": `ytaap ${result.url}`
        };

    } catch (e) {
        console.error(e);
        reply('❌ *Error finding song.*');
    }
});

cmd({
    pattern: "ytaa",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return;
    try {
        const [quality, url] = q.split('&');
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        const result = await ytmp3(url, quality);
        const dlUrl = result.downloadUrl;

        if (!dlUrl) return await reply('❌ *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗹𝗶𝗻𝗸 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.*');

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, { 
            audio: { url: dlUrl }, 
            mimetype: 'audio/mpeg',
            caption: `🎶 *𝗤𝘂𝗮𝗹𝗶𝘁𝘆:* ${quality}\n> © 𝚀𝚞𝚎𝚎𝚗 𝙽𝚎𝚜𝚑𝚞 𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        reply('❌ *Audio Download Failed!*');
    }
});

cmd({
    pattern: "ytad",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;
        const [quality, url, thumb, title] = q.split("&");

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        const result = await ytmp3(url, quality);
        const dlUrl = result.downloadUrl;

        if (!dlUrl) return await reply('❌ *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗹𝗶𝗻𝗸 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.*');

        let botimgBuffer;
        try {
            const response = await fetch(thumb);
            botimgBuffer = Buffer.from(await response.arrayBuffer());
        } catch (e) { console.log(e); }

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            document: { url: dlUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title} (${quality}).mp3`,
            jpegThumbnail: botimgBuffer,
            caption: `📂 *𝖰𝗎𝖺𝗅𝗂𝗍𝗒:* ${quality}\n> © 𝙳𝚃𝙴𝙲 𝙼𝙸𝙽𝙸 𝚅𝟹`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        reply('❌ *Document Download Failed!*');
    }
});

cmd({
    pattern: "ytaap",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        const result = await ytmp3(q, '128k');
        const dlUrl = result.downloadUrl;

        const response = await fetch(dlUrl);
        const buffer = Buffer.from(await response.arrayBuffer());

        const ran = (Math.random() + 1).toString(36).substring(7);
        const mp3File = path.join(__dirname, `${ran}.mp3`);
        const oggFile = path.join(__dirname, `${ran}.ogg`);

        fs.writeFileSync(mp3File, buffer);

        ffmpeg(mp3File)
            .toFormat('ogg')
            .audioCodec('libopus')
            .on('end', async () => {
                await conn.sendMessage(from, {
                    audio: fs.readFileSync(oggFile),
                    mimetype: 'audio/ogg; codecs=opus',
                    ptt: true
                }, { quoted: mek });
                fs.unlinkSync(mp3File);
                fs.unlinkSync(oggFile);
            })
            .save(oggFile);

    } catch (e) {
        reply('❌ *Voice Conversion Failed!*');
    }
});
