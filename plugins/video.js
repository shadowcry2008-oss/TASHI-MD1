const { cmd } = require('../command');
const { ytmp4 } = require('sadaslk-dlcore');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["ytvideo", "watch"],
    use: '.video <query or url>',
    react: "📽️",
    desc: "Download videos from YouTube using dlcore",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {            
        if (!q) return await reply('🔎 *𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗶𝗱𝗲𝗼 𝗻𝗮𝗺𝗲 𝗼𝗿 𝗨𝗥𝗟!*');
        
        const url = q.replace(/\?si=[^&]*/, '');
        const results = await yts(url);
        const result = results.videos[0];

        if (!result) return reply("❌ *𝗩𝗶𝗱𝗲𝗼 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱!*");

        let caption = `╭━━━〔 *TASHI-MD* 〕━━━┈⊷
┃ 📹 *𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*
╰━━━━━━━━━━━━━━━┈⊷

*┌────────────────────┐*
*├ \`🎬 𝐓𝐢𝐭𝐥𝐞\` :* ${result.title} 
*├ \`🐼 𝐕𝐢𝐞𝐰𝐬\` :* ${result.views}
*├ \`⌛ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨н\` :* ${result.duration}
*├ \`📎 𝐔block\` :* ${result.url}
*└────────────────────┘*

╭━━━〔 *培育 𝗡𝗨𝗠𝗕𝗘𝗥* 〕━━━┈⊷
┃ *🎬 替代 𝗩𝗜𝗗𝗘𝗢*
┃ 1️⃣ | 144p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 2️⃣ | 240p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 3️⃣ | 360p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 4️⃣ | 480p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 5️⃣ | 720p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 6️⃣ | 1080p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃
┃ *📂 𝗗𝗢𝗖𝗨𝗠𝗘𝗡𝗧 𝗩𝗜𝗗𝗘𝗢*
┃ 7️⃣ | 144p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 8️⃣ | 240p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 9️⃣ | 360p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 🔟 | 480p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 1️⃣1️⃣ | 720p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
┃ 1️⃣2️⃣ | 1080p 𝗤𝘂𝗮𝗹𝗶𝘁𝘆
╰━━━━━━━━━━━━━━━┈⊷

_🔢 Please reply with the corresponding number._`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": `videodl 144&${result.url}`,
            "2": `videodl 240&${result.url}`,
            "3": `videodl 360&${result.url}`,
            "4": `videodl 480&${result.url}`,
            "5": `videodl 720&${result.url}`,
            "6": `videodl 1080&${result.url}`,
            
            "7": `docdl 144&${result.url}&${result.title}`,
            "8": `docdl 240&${result.url}&${result.title}`,
            "9": `docdl 360&${result.url}&${result.title}`,
            "10": `docdl 480&${result.url}&${result.title}`,
            "11": `docdl 720&${result.url}&${result.title}`,
            "12": `docdl 1080&${result.url}&${result.title}`
        };

    } catch (e) {
        reply('❌ *𝗘𝗿𝗿𝗼𝗿 𝗢𝗰𝗰𝘂𝗿𝗿𝗲𝗱 !!*');
        console.log(e);
    }
});

cmd({
    pattern: "videodl",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;
        const [quality, url] = q.split('&');
        
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        const data = await ytmp4(url, {
            format: "mp4",
            videoQuality: quality
        });

        const dlUrl = data.downloadLink || data.dl_url || data.url;
        if (!dlUrl) return reply(`❌ *𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗴𝗲𝘁 ${quality}𝗽 𝗹𝗶𝗻𝗸.*`);

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: dlUrl },
            caption: `🎬 *𝗤𝘂𝗮𝗹𝗶𝘁𝘆:* ${quality}p\n\n> © 𝚀𝚞𝚎𝚎𝚗 𝚗𝚎𝚜𝚑𝚞 𝚖𝚍`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        reply('❌ *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱!*');
        console.log(e);
    }
});

cmd({
    pattern: "docdl",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;
        const [quality, url, title] = q.split('&');

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        const data = await ytmp4(url, {
            format: "mp4",
            videoQuality: quality
        });

        const dlUrl = data.downloadLink || data.dl_url || data.url;
        if (!dlUrl) return reply(`❌ *𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗴𝗲𝘁 ${quality}𝗽 𝗱𝗼𝗰𝘂𝗺𝗲𝗻𝘁 𝗹𝗶𝗻𝗸.*`);

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            document: { url: dlUrl },
            mimetype: 'video/mp4',
            fileName: `${title || 'video'}.mp4`,
            caption: `📂 *𝗙𝗶𝗹𝗲:* ${title}\n🎬 *𝗤𝘂𝗮𝗹𝗶𝘁𝘆:* ${quality}p\n\n> © 𝚀𝚞𝚎𝚎𝙽 𝙽𝙴𝚂𝙷𝚄 𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        reply('❌ *𝗗𝗼𝗰𝘂𝗺𝗲𝗻𝘁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱!*');
        console.log(e);
    }
});
