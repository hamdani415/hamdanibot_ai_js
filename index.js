import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"
dotenv.config()

const token = process.env.TOKEN_TELEGRAM
const api = process.env.API_OPENROUTER

const bot = new TelegramBot(token, { polling: true })

let chats = {}

bot.on("message", async (msg) => {
    const chatId = msg.chat.id
    const chat = msg.text

    if(chat === "/reset"){
        chats[chatId] = []
        bot.sendMessage(chatId , "memory telah di hapus")
        return
    }

    if (!chats[chatId]) {
        delete chats[chatId]
    }

    chats[chatId].push({
        role: "user",
        content: chat
    })

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + api,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openrouter/free",
            messages: chats[chatId]
        })
    }
    )
    const data = await response.json()
    if (!data.choices) {
        bot.sendMessage(chatId, "Error dari AI 😢")
        return
    }
    const hasilAI = data.choices[0].message.content

    chats[chatId].push({
        role: "assistant",
        content: hasilAI
    })

    bot.sendMessage(chatId, hasilAI)

}

)

// bot.onText(/\reset/, (msg) => {
//     const chatId = msg.chat.id
//     bot.sendMessage(chatId , "halo juga")

// })
