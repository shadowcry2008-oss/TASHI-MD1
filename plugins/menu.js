const { cmd, commands } = require('../command'); 
const os = require('os');
const moment = require('moment-timezone');

const fs = require('fs');
const path = require('path');
const botLogo = path.join(__dirname, '../media/tashi-logo.png');

const logoTypes = ["neon","neon2","fire2","glitch","hacker","futuristic","thunder","devil","fire","ice","snow","lava","metal","gold","silver","glossy","blackpink","transformer","horror","blood","joker","galaxy","space","cloud","sand","stone","magma","gradient","light","paper","watercolor","candy","christmas","luxury","leaf","summer","circuit","block3d","cartoon","chrome","frozen"];


cmd({
    pattern: "menu",
    alias: ["panel", "list", "commands"],
    desc: "Show main menu.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, pushname, prefix, reply }) => {
    try {
        let hostname = os.hostname();
        if (hostname.length === 12) hostname = 'Replit';
        else if (hostname.length === 36) hostname = 'Heroku';
        else if (hostname.length === 8) hostname = 'Koyeb';
        else hostname = 'VPS / Local';

        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
        const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;

        const uptimeSeconds = process.uptime();
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
        const rtime = `${uptimeHours}h ${uptimeMinutes}m`;

        const time = moment.tz('Asia/Colombo').format('HH');
        let greeting = "Good Night";
        if (time >= 4 && time < 12) greeting = "Good Morning";
        else if (time >= 12 && time < 17) greeting = "Good Afternoon";
        else if (time >= 17 && time < 20) greeting = "Good Evening";

        const menuText = `╭─── « TASHI-MD » ───⟡
│
│ ⊳ *𝗛𝗶 ${pushname}, ${greeting}!*
│
│ ◈ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0.0
│ ◈ 𝗢𝘄𝗻𝗲𝗿  : GAYAN
│ ◈ 𝗥𝗮𝗺    : ${ramUsage}
│ ◈ 𝗨𝗽𝘁𝗶𝗺𝗲 : ${rtime}
│ ◈ 𝗛𝗼𝘀𝘁   : ${hostname}
│
╰───────────────⟡

╭─── « 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗣𝗔𝗡𝗘𝗟 » ───⟡
│
│ [ 𝟭 ] 𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨
│ [ 𝟮 ] 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨
│ [ 𝟯 ] 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨
│ [ 𝟰 ] 𝗟𝗢𝗚𝗢 𝗠𝗘𝗡𝗨
│ [ 𝟱 ] 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦
│ [ 𝟲 ] 𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨
│ [ 𝟳 ] 𝗔𝗜 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦
│ [ 𝟴 ] 𝗢𝗧𝗛𝗘𝗥 𝗧𝗢𝗢𝗟𝗦
│
╰───────────────⟡

> _Reply with a number to navigate._`;

        const imgBuffer = fs.readFileSync(botLogo);

        const sentMsg = await conn.sendMessage(from, {
            image: imgBuffer,
            caption: menuText
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": "mainmenu",
            "2": "ownermenu",
            "3": "groupmenu",
            "4": "logomenu",
            "5": "downloadmenu",
            "6": "searchmenu",
            "7": "aimenu",
            "8": "othermenu"
        };

    } catch (e) {
        console.log(e);
        reply(`*❌ System Error!*\n\n${e}`);
    }
});


const generateSubMenu = async (conn, mek, from, category, title, pushname, reply) => {
    try {
        let cmdList = '';
        for (let i = 0; i < commands.length; i++) { 
            if (commands[i].category === category && !commands[i].dontAddCommandList) {
                cmdList += `│ ⊳ *${commands[i].pattern}*\n│   ${commands[i].desc || 'No Description'}\n│\n`;
            }
        }

        if (cmdList === '') cmdList = `│ ⊳ No commands found.\n│\n`;

        let menuContent = `╭─── « TASHI-MD» ───⟡
│
│ ⊳ *${title}*
│
${cmdList}╰───────────────⟡

> © TASHI-MD`;

        const imgBuffer = fs.readFileSync(botLogo);
        await conn.sendMessage(from, { image: imgBuffer, caption: menuContent }, { quoted: mek });
    } catch (e) { 
        reply('*❌ Submenu Error !!*'); 
        console.log(e); 
    }
};

cmd({ pattern: "logomenu", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    try {
        let logoList = `╭─── « TASHI-MD » ───⟡
│
│ ⊳ *𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥 𝗠𝗘𝗡𝗨*
│
`;
        
        logoTypes.forEach((type, index) => {
            
            let num = (index + 1).toString().padStart(2, '0');
            logoList += `│ [ ${num} ] ${type.toUpperCase()}\n`;
        });

        logoList += `│
╰───────────────⟡

> _Reply with a number to generate._
> _To set custom name: .logo <name>_

> © TASHI-MD`;

        const imgBuffer = fs.readFileSync(botLogo);
        const sentMsg = await conn.sendMessage(from, { image: imgBuffer, caption: logoList }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {};

        logoTypes.forEach((type, index) => {
            global.numberStore[msgId][(index + 1).toString()] = `genlogo ${type}&${pushname}`;
        });

    } catch (e) {
        reply('*❌ Logo Menu Error!*');
        console.log(e);
    }
});


cmd({ pattern: "mainmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'main', '𝗠𝗔𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦', pushname, reply);
});

cmd({ pattern: "ownermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'owner', '𝗢𝗪𝗡𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦', pushname, reply);
});

cmd({ pattern: "groupmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'group', '𝗚𝗥𝗢𝗨𝗣 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦', pushname, reply);
});

cmd({ pattern: "downloadmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'download', '𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥𝗦', pushname, reply);
});

cmd({ pattern: "searchmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'search', '𝗦𝗘𝗔𝗥𝗖𝗛 𝗧𝗢𝗢𝗟𝗦', pushname, reply);
});

cmd({ pattern: "aimenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'ai', '𝗔𝗜 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦', pushname, reply);
});

cmd({ pattern: "othermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'other', '𝗢𝗧𝗛𝗘𝗥 𝗨𝗧𝗜𝗟𝗜𝗧𝗜𝗘𝗦', pushname, reply);
});
