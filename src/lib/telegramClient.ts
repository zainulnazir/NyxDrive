import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { promises as fs } from "fs";
import path from "path";

const apiId = parseInt(process.env.TELEGRAM_API_ID || "YOUR_API_ID");
const apiHash = process.env.TELEGRAM_API_HASH || "YOUR_API_HASH";

export class NyxTelegramClient {
private client: TelegramClient;
private sessionPath = path.join(__dirname, "session.txt");

constructor() {
 this.client = new TelegramClient(
   new StringSession(""),
   apiId,
   apiHash,
   { connectionRetries: 5 }
 );
}

async start(
 phoneNumber: () => Promise<string>,
 phoneCode: () => Promise<string>,
 password?: () => Promise<string>
) {
 await this.client.start({ phoneNumber, phoneCode, password });
 const session = this.client.session.save();
 await fs.writeFile(this.sessionPath, session, "utf8");
 return true;
}

async loadSession() {
 try {
   const session = await fs.readFile(this.sessionPath, "utf8");
   this.client = new TelegramClient(
     new StringSession(session),
     apiId,
     apiHash,
     { connectionRetries: 5 }
   );
   await this.client.connect();
   return await this.client.isUserAuthorized();
 } catch {
   return false;
 }
}

getClient() {
 return this.client;
}
}
