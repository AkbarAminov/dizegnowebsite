import nodemailer from "nodemailer";
import type { ContactInput } from "./validation";

// Each channel is optional: without its env vars it is skipped, and a
// delivery failure is logged rather than failing the contact-form request.

export async function notifyContact(input: ContactInput) {
  await Promise.all([sendTelegram(input), sendEmail(input)]);
}

async function sendTelegram(input: ContactInput) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const text = `New contact form submission\nName: ${input.name}\nEmail: ${input.email}\n\n${input.message}`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    if (!res.ok) console.error("Telegram notification failed:", await res.text());
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }
}

async function sendEmail(input: ContactInput) {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return;

  const port = Number(EMAIL_PORT) || 587;
  try {
    const transport = nodemailer.createTransport({
      host: EMAIL_HOST,
      port,
      secure: port === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
    await transport.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO || EMAIL_USER,
      replyTo: input.email,
      subject: `New contact form message from ${input.name}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
    });
  } catch (error) {
    console.error("Email notification failed:", error);
  }
}
