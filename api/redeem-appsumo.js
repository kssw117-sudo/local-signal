export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, email } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Код обязателен' });
  }
  const normalizedCode = code.trim().toUpperCase();

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_FILEPATH } = process.env;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}`;

  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const getRes = await fetch(apiUrl, { headers: ghHeaders });
    if (!getRes.ok) {
      return res.status(500).json({ error: 'Не удалось прочитать список кодов' });
    }
    const fileData = await getRes.json();
    const content = JSON.parse(
      Buffer.from(fileData.content, 'base64').toString('utf-8')
    );

    const entry = content.find((c) => c.code === normalizedCode);
    if (!entry) {
      return res.status(404).json({ error: 'Код не найден' });
    }

    // Если код уже был активирован раньше — просто пускаем повторно.
    // Это защищает настоящего владельца, если он потеряет доступ
    // (очистит историю браузера, сменит устройство и т.д.) — код по сути
    // работает как пароль, а не одноразовый ключ после первой активации.
    if (entry.redeemed) {
      return res.status(200).json({ success: true });
    }

    entry.redeemed = true;
    entry.redeemed_at = new Date().toISOString();
    entry.redeemed_email = email || null;

    const updatedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Redeem code ${normalizedCode}`,
        content: updatedContent,
        sha: fileData.sha,
      }),
    });

    if (!putRes.ok) {
      return res.status(409).json({
        error: 'Не удалось активировать код, попробуйте ещё раз через несколько секунд',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера, попробуйте снова' });
  }
}
