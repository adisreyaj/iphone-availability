import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const sentTelegramAlert = async (text: string) => {
  const chatIds = process.env.CHAT_ID?.split(",") ?? [];

  try {
    await Promise.all(chatIds.map((chatId) => sentAlertToUser(chatId, text)));
  } catch (err) {
    console.log("Failed to notify");
  }
};

export const sentAlertToUser = async (chatId: string, text: string) => {
  return fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: `${(text ?? "").toUpperCase()} at ${new Date().toLocaleString()}`,
      }),
      headers: {
        "content-type": "application/json",
      },
    }
  );
};
