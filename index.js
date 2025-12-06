// -------------------------------
// 1. Chống Render bị Sleep
// -------------------------------
const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Bot đang chạy 24/7!"));
app.listen(3000, () => console.log("Chống sleep Render đã bật."));

// -------------------------------
// 2. Chạy bot Minecraft
// -------------------------------
const mineflayer = require("mineflayer");
const { Vec3 } = require("vec3");

// ★ Server Aternos của bạn
const HOST = "servermc4312.aternos.me";
const PORT = 61700;
const USERNAME = "Bot_Treo_24_7";

// -------------------------------
// 3. Hàm khởi động bot + auto reconnect vô hạn
// -------------------------------
function startBot() {
  console.log("Đang thử kết nối tới server...");

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: false
  });

  // Khi bot đăng nhập thành công
  bot.on("login", () => {
    console.log("✔ Bot đã vào server thành công!");
  });

  // Khi bot bị kick hoặc server ngắt kết nối
  bot.on("kicked", (reason) => {
    console.log("⚠ Bị kick: ", reason);
  });

  bot.on("error", (err) => {
    console.log("⌛ Server đang tắt hoặc lỗi kết nối:", err.code);
  });

  // Khi bot bị disconnect → thử lại
  bot.on("end", () => {
    console.log("🔄 Mất kết nối → thử lại sau 5 giây...");
    setTimeout(startBot, 5000);
  });

  // -------------------------------
  // 4. Anti AFK – nhảy + di chuyển nhẹ
  // -------------------------------
  bot.once("spawn", () => {
    console.log("🟢 Anti-AFK started!");

    setInterval(() => {
      if (!bot.entity) return;
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 200);
    }, 6000);

    setInterval(() => {
      if (!bot.entity) return;
      const dir = Math.random() > 0.5 ? "left" : "right";
      bot.setControlState(dir, true);
      setTimeout(() => bot.setControlState(dir, false), 500);
    }, 8000);
  });

  // -------------------------------
  // 5. Né quái cơ bản
  // -------------------------------
  bot.on("physicTick", () => {
    const mobs = bot.nearestEntity(e => e.type === "mob");
    if (!mobs) return;

    const mob = mobs;
    const dist = bot.entity.position.distanceTo(mob.position);

    if (dist < 4) {
      const dx = bot.entity.position.x - mob.position.x;
      const dz = bot.entity.position.z - mob.position.z;
      bot.entity.position.offset(dx * 0.3, 0, dz * 0.3);
    }
  });
}

startBot();
