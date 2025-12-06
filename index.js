const mineflayer = require("mineflayer");
const { Vec3 } = require("vec3");

function startBot() {
  const bot = mineflayer.createBot({
    host: "servermc4312.aternos.me",
    port: 61700,
    username: "Bot_Treo_24_7"
  });

  bot.on("spawn", () => {
    console.log("✅ Bot đã vào server!");

    // AUTO JUMP liên tục
    setInterval(() => {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 200);
    }, 3000);

    // CHẠY NGẪU NHIÊN
    setInterval(() => {
      const directions = ["forward", "back", "left", "right"];
      const pick = directions[Math.floor(Math.random() * directions.length)];

      // Tắt toàn bộ trước
      bot.setControlState("forward", false);
      bot.setControlState("back", false);
      bot.setControlState("left", false);
      bot.setControlState("right", false);

      bot.setControlState(pick, true);
      console.log("🏃 Bot chạy hướng:", pick);

      setTimeout(() => {
        bot.setControlState(pick, false);
      }, 3000);

    }, 5000);

    // NÉ QUÁI
    setInterval(() => {
      const mobs = bot.nearestEntity(e => e.type === "mob");
      if (!mobs) return;

      const dist = bot.entity.position.distanceTo(mobs.position);

      if (dist < 4) {
        console.log("⚠ Quái gần! Đang né...");
        bot.setControlState("back", true);
        setTimeout(() => bot.setControlState("back", false), 1000);
      }
    }, 500);

    // ANTI AFK (nhúc nhích nhẹ)
    setInterval(() => {
      bot.look(bot.entity.yaw + 0.3, bot.entity.pitch, true);
    }, 4000);
  });

  bot.on("kicked", reason => {
    console.log("⚠ Bot bị kick:", reason);
  });

  bot.on("error", err => {
    console.log("❌ Lỗi:", err);
  });

  // AUTO RECONNECT
  bot.on("end", () => {
    console.log("🔁 Bot out → reconnect trong 5s...");
    setTimeout(startBot, 5000);
  });
}

startBot();
