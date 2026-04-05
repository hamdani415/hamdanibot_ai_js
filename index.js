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

    if (chat === "/reset") {
        chats[chatId] = []
        bot.sendMessage(chatId, "memory telah di hapus")
        return
    }

    if(chat === "/start") {
        bot.sendMessage(chatId , 
            "halo selamat datang di hamdani_bot_ai \n berikut adalah daftar menu yang bisa dilakukan bot ini \n1. /start untuk memulai bot \n2. ketik apa saja untuk menanyakan sesuatu dan ai akan menjawab \n3. personalisasi ai, jdi kamu bisa nyuruh ai untuk agar bersikap seperti apa.\n  contoh : kamu adalah asisten ku panggil aku (nama kamu).... \n3. /reset untuk meriset personalisai ai \n\n note: untuk menghemat limit dri api tolong sebelumnya ketik ke ai jangan jawab terlalu panjang jika tidak perlu, jawab maximal 10 kata jika memang itu tidak diperlukan, jika memang perlu boleh jawab lebih. \nTerimakasih...😊 ")
            return
        }

    if (!chats[chatId]) {
        chats[chatId] = []
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
    // console.log(data)
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

