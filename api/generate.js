// api/generate.js
// Принимает два типа кодов:
// 1. Общий код с Getly, хранится в переменной окружения ACCESS_CODE
// 2. Уникальные AppSumo-коды вида SEO-XXXX-XXXX (сами коды проверяются
//    и гасятся отдельной функцией /api/redeem-appsumo при разблокировке;
//    здесь просто пропускаем любой код с этим префиксом)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { licenseCode, prompt } = req.body;

  const isSharedCode = licenseCode && licenseCode === process.env.ACCESS_CODE;
  const isAppSumoCode = licenseCode && licenseCode.trim().toUpperCase().startsWith('SEO-');

  if (!licenseCode || (!isSharedCode && !isAppSumoCode)) {
    return res.status(403).json({ error: 'Неверный код доступа' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Нет prompt' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка обращения к ИИ' });
  }
}
