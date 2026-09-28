const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: "colorize",
    alias: ["color", "🎨"],
    desc: "Add color to black and white images.",
    category: "other",
    react: "🖌️",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    try {
       
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (!mime.includes('image')) return reply("📸 *𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗯𝗹𝗮𝗰𝗸 & 𝘄𝗵𝗶𝘁𝗲 𝗶𝗺𝗮𝗴𝗲!*");

        const { key } = await conn.sendMessage(from, { text: "🖌️ *𝗜𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘇𝗶𝗻𝗴 𝗖𝗼𝗹𝗼𝗿𝗶𝘇𝗲...*" }, { quoted: mek });

        
        const mediaBuffer = await q.download();

      
        await conn.sendMessage(from, { text: "📤 *𝗨𝗽𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝘁𝗼 𝗦𝗲𝗿𝘃𝗲𝗿...*", edit: key });
        
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', mediaBuffer, { filename: 'colorize.jpg' });

        const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders() }
        });

        const catboxUrl = catboxRes.data.trim();

       
        await conn.sendMessage(from, { text: "🎨 *𝗖𝗼𝗹𝗼𝗿𝗶𝘇𝗶𝗻𝗴 𝗜𝗺𝗮𝗴𝗲...*", edit: key });

        const apiRes = await axios.get(`https://www.movanest.xyz/v2/colorize?image_url=${encodeURIComponent(catboxUrl)}`);
        const resData = apiRes.data;

        if (resData && resData.status === true && resData.results?.output_url) {
            const finalImage = resData.results.output_url;

           
            await conn.sendMessage(from, {
                image: { url: finalImage },
                caption: "🎨 *𝗖𝗢𝗟𝗢𝗥𝗜𝗭𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬!*\n\n> © 𝙳𝚃𝙴𝙲 𝙼𝙸𝙽𝙸 𝚅𝟹"
            }, { quoted: mek });

            await conn.sendMessage(from, { text: "✅ *𝗙𝗶𝗻𝗶𝘀𝗵𝗲𝗱!*", edit: key });
        } else {
            throw new Error("API did not return a valid image.");
        }

    } catch (e) {
        console.log(e);
        reply("❌ *𝗘𝗿𝗿𝗼𝗿:* " + e.message);
    }
});
