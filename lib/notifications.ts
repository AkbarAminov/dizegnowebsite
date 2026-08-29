import type { ContactInput } from "./validation";

// Each channel below is independently optional: if its env vars are
// missing, the function silently no-ops instead of throwing, so the
// contact form never fails just because a notification channel isn't
// configured yet.

export async function notifyTelegram(input: ContactInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    "New contact form submission",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    "",
    input.message,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error("Telegram notification failed:", await res.text());
    }
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

export async function notifyEmail(input: ContactInput) {
  const {
    RESEND_API_KEY,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_TO,
  } = process.env;

  const to = EMAIL_TO || EMAIL_USER;
  if (!to) return;

  const subject = `New contact form message from ${input.name}`;
  const text = `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`;

  try {
    if (RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: "Dizegno <onboarding@resend.dev>",
        to,
        replyTo: input.email,
        subject,
        text,
      });
      return;
    }

    if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
        secure: EMAIL_PORT === "465",
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      });
      await transport.sendMail({
        from: EMAIL_USER,
        to,
        replyTo: input.email,
        subject,
        text,
      });
    }
  } catch (err) {
    console.error("Email notification failed:", err);
  }
}
