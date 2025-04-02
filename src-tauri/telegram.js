const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require("fs").promises;
const path = require("path");

const apiId = YOUR_API_ID; // Replace with your API ID
const apiHash = "YOUR_API_HASH"; // Replace with your API Hash
const sessionPath = path.join(__dirname, "session.txt");

async function startClient(phone, codeCallback, passwordCallback) {
const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
connectionRetries: 5,
});

await client.start({
phoneNumber: async () => phone,
phoneCode: async () => codeCallback(),
password: async () => passwordCallback(),
onError: (err) => { throw err; },
});

const session = client.session.save();
await fs.writeFile(sessionPath, session, "utf8");
await client.disconnect();
return "Login successful";
}

async function loadSession() {
try {
const session = await fs.readFile(sessionPath, "utf8");
const client = new TelegramClient(new StringSession(session), apiId, apiHash, {
connectionRetries: 5,
});
await client.connect();
const authorized = await client.isUserAuthorized();
await client.disconnect();
return authorized;
} catch {
return false;
}
}

process.on("message", async (msg) => {
try {
if (msg.type === "start") {
const result = await startClient(msg.phone, msg.codeCallback, msg.passwordCallback);
process.send({ success: true, result });
} else if (msg.type === "load") {
const result = await loadSession();
process.send({ success: true, result });
}
} catch (err) {
process.send({ success: false, error: err.message });
}
});
