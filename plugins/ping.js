const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now();
        
        // පින්තූරය සමඟ යැවීමට අවශ්‍ය පණිවිඩය
        const pingText = `╭━━━〔 TASHI-MD 〕━━━┈⊷
┃ 🏓 𝐏 𝐎 𝐍 𝐆 !
╰━━━━━━━━━━━━━━━┈⊷

⭔ 𝙎𝙥𝙚𝙚𝙙 : Pinging...
⭔ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙁𝙖𝙨𝙩 & 𝘼𝙘𝙩𝙞𝙫𝙚 🟢

*© TASHI-MD*`;

        // පින්තූරය සමඟ පණිවිඩය යැවීම
        const message = await conn.sendMessage(from, { 
            image: require('fs').readFileSync(require('path').join(__dirname, '../media/tashi-logo.png')), 
            caption: pingText 
        }, { quoted: mek });
        
        const endTime = Date.now();
        const ping = endTime - startTime;
        
        const updatedPingText = `╭━━━〔 TASHI-MD 〕━━━┈⊷
┃ 🏓 𝐏 𝐎 𝐍 𝐆 !
╰━━━━━━━━━━━━━━━┈⊷

⭔ 𝙎𝙥𝙚𝙚𝙙 : ${ping}ms
⭔ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙁𝙖𝙨𝙩 & 𝘼𝙘𝙩𝙞𝙫ᴇ 🟢

*© TASHI-MD*`;

        await conn.sendMessage(from, { text: updatedPingText, edit: message.key });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
})
