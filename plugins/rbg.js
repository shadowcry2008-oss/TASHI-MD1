const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: "removebg",
    alias: ["rbg", "bgremove"],
    desc: "Remove the background of an image.",
    category: "image",
    react: "✂️",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    try {
        
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        
        if (!mime.startsWith('image/')) return reply("🚫 *𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲.*");

       
        const { key } = await conn.sendMessage(from, { text: "🖌️ *𝗔𝗻𝗮𝗹𝘆𝘇𝗶𝗻𝗴 𝗜𝗺𝗮𝗴𝗲...*" }, { quoted: mek });

      
        let media = await q.download();

       
        await conn.sendMessage(from, { text: "⬆️ *𝗨𝗽𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝘁𝗼 𝗖𝗹𝗼𝘂𝗱...*", edit: key });
        
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", media, "image.jpg");

        const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
        });
        
        const imageUrl = uploadRes.data.trim();

        
        await conn.sendMessage(from, { text: "✂️ *𝗥𝗲𝗺𝗼𝘃𝗶𝗻𝗴 𝗕𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱...*", edit: key });

        const apiUrl = `https://www.movanest.xyz/v2/removebg?image_url=${encodeURIComponent(imageUrl)}`;
        const rbgResponse = await axios.get(apiUrl, { responseType: 'arraybuffer' });

       
        await conn.sendMessage(from, { 
            image: rbgResponse.data, 
            caption: "✅ *𝗥𝗘𝗠𝗢𝗩𝗘𝗕𝗚 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬!*\n\n> © 𝚀𝚞𝚎𝚎𝚗 𝙽𝚎𝚜𝚑𝚞 𝙼𝙳" 
        }, { quoted: mek });

        await conn.sendMessage(from, { text: "✨ *𝗣𝗿𝗼𝗰𝗲𝘀𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!*", edit: key });

    } catch (e) {
        console.log(e);
        reply("❌ *𝗘𝗿𝗿𝗼𝗿:* " + e.message);
    }
});
