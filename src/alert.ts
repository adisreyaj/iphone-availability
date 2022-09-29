import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
export const sentTelegramAlert = async (text: string) => {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: `${text} at ${new Date().toLocaleString()}`,
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("Failed to notify");
  }
};
