import OpenAI from "openai";

export default async function handler(req, res) {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
  });

  const user = req.body.user;
  const prompt = `
Du bist ein empathischer Song-Assistent. Erstelle aus folgenden Angaben ein strukturiertes Song-Briefing:

Name: ${user.name}
E-Mail: ${user.email}
Thema: ${user.beschreibung}
Zahlung: ${user.zahlung}
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Du bist ein freundlicher Song-Assistent" },
      { role: "user", content: prompt }
    ]
  });

  res.status(200).json({ reply: completion.choices[0].message.content });
}
