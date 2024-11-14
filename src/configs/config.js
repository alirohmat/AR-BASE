import { config } from "dotenv";
config();

export default {
  owner: ["6282132789470"],
  pairingNumber: "6287834100533",
  self: false,
  autoRead: {
    story: true,
    storyEmoji: true,
    message: false,
  },
  autoOnline: true,
  storyReadInterval: 1000,
  autoRestart: "350 MB",
  writeStore: false,
  session: process.env.SESSION || "",
  database: process.env.DATABASE || "",
  mongoURi: process.env.MONGO_URi || "",
  commands: "commands",
  scrapers: "scraper", 
  msg: {
    owner: "Fitur ini hanya dapat diakses oleh pemilik!",
    group: "Fitur ini hanya dapat diakses di dalam grup!",
    private: "Fitur ini hanya dapat diakses di chat pribadi!",
    admin: "Fitur ini hanya dapat diakses oleh admin grup!",
    botAdmin: "Bot bukan admin, tidak dapat menggunakan fitur ini!",
    bot: "Fitur ini hanya dapat diakses oleh bot",
    premium: "Fitur ini hanya dapat diakses oleh pengguna premium",
    media: "Balas ke media...",
    query: "Tidak ada query?",
    error: "Terjadi kesalahan, silakan ulangi beberapa saat lagi.",
    quoted: "Balas ke pesan...",
    wait: "Tunggu sebentar...",
    urlInvalid: "URL tidak valid",
    notFound: "Hasil tidak ditemukan!",
    register:
      "Silakan lakukan pendaftaran terlebih dahulu untuk menggunakan fitur ini.",
    limit:
      "Limit kamu sudah habis, silahkan ketik .claim atau membeli premium.",
  },
};
