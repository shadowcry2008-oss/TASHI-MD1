const { cmd } = require('../command');

cmd({
    pattern: "dp",
    alias: ["pp", "profile"],
    react: "🖼️",
    desc: "Save WhatsApp/business whatsapp Profile Picture with Number",
    category: "owner",
    use: '.dp [tag/reply/947xxxxxxx]',
    filename: __filename
},
async (conn, mek, m, { from, args, q, isOwner, reply, sender }) => {
    try {
        let targetJid = null;
        const isGroup = from.endsWith('@g.us'); // Group ද Private Chat ද Check කරනවා

        // 1. Tag කරලා නම්:.dp @user - Group + Private දෙකේම වැඩ
        if (m.mentionedJid && m.mentionedJid[0]) {
            targetJid = m.mentionedJid[0];
        }
        // 2. Reply කරලා නම්:.dp - Group + Private දෙකේම වැඩ
        else if (m.quoted) {
            targetJid = m.quoted.sender;
        }
        // 3. Number දාලා නම්:.dp 94772398806 - Private එකේ වැඩ
        else if (q && /[0-9]/.test(q)) {
            let num = q.replace(/[^0-9]/g, '');
            if (!num.startsWith('94')) num = '94' + num;
            targetJid = num + '@s.whatsapp.net';
        }
        // 4. මොකුත් නැත්තම්:
        else {
            if (isGroup) {
                // Group එකේ නම්: Tag/Reply/Number අනිවාර්යයි
                return reply(`❌ *Group එකේ DP ගන්න:* \n\`.dp @tag\` හෝ \`.dp\` Reply කරලා.`);
            } else {
                // Private Chat එකේ නම්: Chat Partner ගේ DP එක
                targetJid = from;
            }
        }

        let ppUrl = await conn.profilePictureUrl(targetJid, 'image');
        let number = targetJid.split('@')[0];

        let caption = `*Type:* Image\n*Dp number info:* +${number}\n\ɴ𝗤𝗨𝗘𝗘𝗡 𝗡𝗘𝗦𝗛𝗨 𝗠𝗗\n©> ᴩᴏᴡᴇʀᴅ ʙʏ qᴜᴇᴇɴ ʟᴏᴋᴜ ɴᴇꜱʜᴜ`;

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: caption
        }, { quoted: mek });

    } catch (err) {
        return reply(`❌ DP එක ගන්න බැරි වුණා.\nහේතුව: ඒ කෙනා Privacy Lock කරලා.`);
    }
});
