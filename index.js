const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: "IP_SERVER_CỦA_BẠN",
    port: 25565,
    username: "Bot_Treo"
  })

  bot.on('spawn', () => {
    console.log("Bot đã vào server!")
  })

  bot.on('end', () => {
    console.log("Bot bị out → reconnect sau 5s")
    setTimeout(createBot, 5000)
  })

  bot.on('error', err => console.log("Lỗi:", err))
}

createBot()
