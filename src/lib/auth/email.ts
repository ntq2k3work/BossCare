type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(payload: EmailPayload) {
  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.AUTH_EMAIL_FROM ?? "BossCare <onboarding@resend.dev>",
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email provider rejected message: ${response.status}`);
    }

    return { delivered: true, devOnly: false };
  }

  console.info(`[dev-email] to=${payload.to} subject=${payload.subject}\n${payload.text}`);
  return { delivered: false, devOnly: true };
}
