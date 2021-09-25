const TelegrammApi = require('node-telegram-bot-api')
const {gameOptions, againOptions}= require('./options');
const winston =require('winston');

const token =`2045650391:AAEUHnOwi55Wf8DZ0GTJvZf-wJANr1oRZ9s`;

const bot = new TelegrammApi(token, {polling :true});

const chats = {};

const startagain = async (chatId)=>{
    await bot.sendMessage(chatId, 'now you have to select a number from 1 to 9');
    const randomNumber = Math.floor(Math.random()* 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Guess', gameOptions);
}
const start = ()=>{
    bot.setMyCommands([
        {command: '/start', description : 'bot to start'},
        {command : '/info', description : "take info about the bot"},
        {command : '/game', description : "play the game"}

    ])
    
    bot.on('message', async (msg)=>{
        const text = msg.text;
        const chatId = msg.chat.id;
          
        if(text === "/start"){
            console.log(msg);
            await bot.sendSticker(chatId, `https://tgram.ru/wiki/stickers/img/PolarBear/gif/15.gif`)
            return bot.sendMessage(chatId, `Hello ${msg.chat.first_name}! Wellcome to telegram bot`)
        }
        if(text === "/info"){
            return bot.sendMessage(chatId, `There is very interesting game here! Would you like playing the game? Press the fast game button!`)
        };
        if(text ==="/game"){
          return startagain(chatId)
        }        
        return bot.sendSticker(chatId,'https://tgram.ru/wiki/stickers/img/PolarBear/gif/12.gif' )
    })   
}

bot.on('callback_query', async (msg)=>{
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data ==="/again"){
        return startagain(chatId);       
    }
    if(data==chats[chatId]){        
       await bot.sendMessage(chatId, `you found the number ${chats[chatId]}`, againOptions) ;
       await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/PolarBear/gif/3.gif') 
    }else {
       await bot.sendMessage(chatId, `you do not found the number ${chats[chatId]}`,againOptions );
       await bot.sendSticker(chatId, "https://tgram.ru/wiki/stickers/img/PolarBear/gif/4.gif") ; 
    }

})
start()