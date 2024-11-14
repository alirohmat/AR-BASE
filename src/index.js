import config from "./configs/config.js";
import baileys from "@whiskeysockets/baileys";
import { createClient, getWAVersion } from "./lib/client.js";
import fs from "fs";
import http from "http";

import {
  plugins,
  loadPluginFiles,
  pluginFolder,
  pluginFilter,
} from "./configs/plugins.js";
import { loadScraperFiles, scraperFolder, scraperFilter } from "./configs/scrapers.js";
import groupEvents from "./events/groups.js";
import messageHandler from "./events/messages.js";
import connectionUpdate from "./events/connection.js";
import Database from "./configs/database.js";

const { delay, jidNormalizedUser } = baileys;
const pairingCode = config.pairingNumber;
const pathContacts = `./${config.session}/contacts.json`;
const pathMetadata = `./${config.session}/groupMetadata.json`;

async function WAStart() {
  process.on("uncaughtException", console.error);
  process.on("unhandledRejection", console.error);

  const { version, isLatest } = await getWAVersion();
  console.log(`Menggunakan WA v${version.join(".")}, isLatest: ${isLatest}`);

  const { client, saveCreds, store } = await createClient({
    session: config.session,
  });

  const database = new Database();
  const content = await database.read();
  
  if (!content || Object.keys(content).length === 0) {
    global.db = {
      users: {},
      groups: {},
      settings: {},
      ...(content || {}),
    };

    await database.write(global.db);
    client.logger.info("Database has been initialized successfully.");
  } else {
    global.db = content;
    client.logger.info("Database loaded successfully.");
  }

  if (pairingCode && !client.authState.creds.registered) {
    let phoneNumber = pairingCode.replace(/[^0-9]/g, "");
    await delay(3000);
    let code = await client.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`⚠︎ Kode WhatsApp kamu: ${code}`);
  }

  try {
    await loadPluginFiles(pluginFolder, pluginFilter, {
      logger: client.logger,
      recursiveRead: true,
    })
      .then((plugins) => client.logger.info("Plugins Loader Success!"))
      .catch(console.error);

    await loadScraperFiles(scraperFolder, scraperFilter, {
    	logger: client.logger,
    	recursiveRead: true,
    })
      .then((plugins) => client.logger.info("Scraper Loader Success!"))
      .catch(client.logger.error);
  } catch (error) {
    client.logger.error("Error:", error.message);
  }

  connectionUpdate(client, WAStart);
  groupEvents(client, store);
  messageHandler(client, store);

  client.ev.on("creds.update", saveCreds);

  setInterval(async () => {
    if (store.groupMetadata) {
      fs.writeFileSync(pathMetadata, JSON.stringify(store.groupMetadata));
    }
    if (store.contacts) {
      fs.writeFileSync(pathContacts, JSON.stringify(store.contacts));
    }
    if (config.writeStore) {
      store.writeToFile(`./${config.session}/store.json`);
    }
    if (global.db) {
      await database.write(global.db);
    }
  }, 30 * 1000);
  
  // Tambahkan server HTTP di sini
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Aplikasi WhatsApp Bot berjalan dengan sukses di port 8000");
  });

  server.listen(8000, () => {
    console.log("Server berjalan di http://localhost:8000");
  });
}

WAStart();
