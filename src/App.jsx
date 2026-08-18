import React, { useState, useEffect, useRef } from 'react';

export default function LocalSEOKit() {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('post');

  const [postTopic, setPostTopic] = useState('');
  const [postResult, setPostResult] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  const [question, setQuestion] = useState('');
  const [facts, setFacts] = useState('');
  const [answerResult, setAnswerResult] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(false);

  const [reviewExcerpt, setReviewExcerpt] = useState('');
  const [seoResult, setSeoResult] = useState(null);
  const [seoLoading, setSeoLoading] = useState(false);

  const [calendarResult, setCalendarResult] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const [competitorText, setCompetitorText] = useState('');
  const [competitorResult, setCompetitorResult] = useState(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);

  const [weeklyActions, setWeeklyActions] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);
  const [storefrontPhoto, setStorefrontPhoto] = useState(null);

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityDebounceRef = useRef(null);

  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const [brandVoiceSuggestions, setBrandVoiceSuggestions] = useState([]);
  const [showBrandVoiceSuggestions, setShowBrandVoiceSuggestions] = useState(false);

  const CATEGORY_OPTIONS = [
    'Coffee shop', 'Restaurant', 'Cafe', 'Bakery', 'Bar', 'Pizza restaurant',
    'Hair salon', 'Barbershop', 'Nail salon', 'Spa', 'Massage therapist',
    'Gym', 'Yoga studio', 'Dentist', 'Doctor', 'Pharmacy', 'Veterinarian',
    'Auto repair shop', 'Car wash', 'Florist', 'Pet store', 'Bookstore',
    'Clothing store', 'Jewelry store', 'Furniture store', 'Hardware store',
    'Law firm', 'Accounting firm', 'Real estate agency', 'Insurance agency',
    'Photography studio', 'Tattoo shop', 'Dry cleaner', 'Locksmith',
  ];

  const BRAND_VOICE_OPTIONS = [
    'Friendly, playful', 'Professional, polished', 'Warm, welcoming',
    'Bold, energetic', 'Elegant, sophisticated', 'Down-to-earth, casual',
    'Witty, fun', 'Calm, reassuring', 'Luxurious, exclusive', 'Minimalist, direct',
  ];

  function handleCityChange(value) {
    setCity(value);
    if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
    if (!value.trim() || value.trim().length < 3) {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      return;
    }
    cityDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setCitySuggestions(data || []);
        setShowCitySuggestions(true);
      } catch (err) {
        setCitySuggestions([]);
      }
    }, 400);
  }

  function pickCitySuggestion(item) {
    const addr = item.address || {};
    const street = [addr.house_number, addr.road].filter(Boolean).join(' ');
    const cityName = addr.city || addr.town || addr.village || addr.municipality || '';
    const region = addr.state || addr.country || '';
    const parts = [street, cityName, region].filter(Boolean);
    setCity(parts.length ? parts.join(', ') : item.display_name);
    setShowCitySuggestions(false);
    setCitySuggestions([]);
  }

  function handleCategoryChange(value) {
    setCategory(value);
    if (!value.trim()) {
      setCategorySuggestions([]);
      setShowCategorySuggestions(false);
      return;
    }
    const filtered = CATEGORY_OPTIONS.filter(c => c.toLowerCase().includes(value.toLowerCase()));
    setCategorySuggestions(filtered.slice(0, 6));
    setShowCategorySuggestions(filtered.length > 0);
  }

  function handleBrandVoiceChange(value) {
    setBrandVoice(value);
    if (!value.trim()) {
      setBrandVoiceSuggestions([]);
      setShowBrandVoiceSuggestions(false);
      return;
    }
    const filtered = BRAND_VOICE_OPTIONS.filter(v => v.toLowerCase().includes(value.toLowerCase()));
    setBrandVoiceSuggestions(filtered.slice(0, 6));
    setShowBrandVoiceSuggestions(filtered.length > 0);
  }
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletReadyRef = useRef(false);
  const [weeklyActionsLoading, setWeeklyActionsLoading] = useState(false);
  const [checkedActions, setCheckedActions] = useState({});

  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const [licenseCode, setLicenseCode] = useState(() => localStorage.getItem('seo_licenseCode') || '');
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('seo_unlocked') === 'true');
  const [licenseError, setLicenseError] = useState('');

  const languages = [
    { code: 'en', label: 'English', englishName: 'English', rtl: false },
    { code: 'ru', label: 'Русский', englishName: 'Russian', rtl: false },
    { code: 'ar', label: 'العربية', englishName: 'Arabic', rtl: true },
    { code: 'fa', label: 'فارسی', englishName: 'Persian', rtl: true },
    { code: 'es', label: 'Español', englishName: 'Spanish', rtl: false },
    { code: 'fr', label: 'Français', englishName: 'French', rtl: false },
    { code: 'de', label: 'Deutsch', englishName: 'German', rtl: false },
    { code: 'it', label: 'Italiano', englishName: 'Italian', rtl: false },
    { code: 'pt', label: 'Português', englishName: 'Portuguese', rtl: false },
    { code: 'tr', label: 'Türkçe', englishName: 'Turkish', rtl: false },
    { code: 'zh', label: '中文', englishName: 'Chinese', rtl: false },
    { code: 'hi', label: 'हिन्दी', englishName: 'Hindi', rtl: false },
    { code: 'ja', label: '日本語', englishName: 'Japanese', rtl: false },
    { code: 'sv', label: 'Svenska', englishName: 'Swedish', rtl: false },
    { code: 'no', label: 'Norsk', englishName: 'Norwegian', rtl: false },
    { code: 'da', label: 'Dansk', englishName: 'Danish', rtl: false },
    { code: 'fi', label: 'Suomi', englishName: 'Finnish', rtl: false },
    { code: 'uk', label: 'Українська', englishName: 'Ukrainian', rtl: false },
    { code: 'be', label: 'Беларуская', englishName: 'Belarusian', rtl: false },
    { code: 'el', label: 'Ελληνικά', englishName: 'Greek', rtl: false },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const ui = {
    en: {
      title: 'Local Signal',
      subtitle: 'Get found. GBP posts, Q&A answers, and SEO descriptions — generated on the spot.',
      businessLabel: 'Business name', businessPh: 'e.g. Morning Coffee Shop',
      categoryLabel: 'Category', categoryPh: 'e.g. Coffee shop',
      cityLabel: 'City / area', cityPh: 'e.g. Austin, TX or 123 Main St, Austin',
      brandVoiceLabel: 'Brand voice — optional', brandVoicePh: 'e.g. friendly, playful',
      languageLabel: 'Language',
      tabPost: 'GBP POST', tabQA: 'Q&A REPLY', tabSeo: 'SEO COPY', tabCalendar: 'CALENDAR', tabCompetitor: 'STAND OUT',
      competitorIntro: 'Paste a competitor\'s post or profile description and get concrete ways to differentiate — not generic advice, specific gaps to fill.',
      competitorLabel: 'Competitor\'s post or description', competitorPh: 'e.g. paste their Google Business Profile "About" text or a recent post',
      generateCompetitor: 'Find the gaps', generatingCompetitor: 'Scanning for gaps...',
      competitorGapsHeading: 'WHAT THEY\'RE MISSING',
      competitorAngleHeading: 'YOUR ANGLE',
      weeklyActionsTitle: "THIS WEEK'S 3 ACTIONS",
      locateOnMap: 'Show on map', locatingMap: 'Finding location...', locateMapError: 'Could not find that location. Try a more specific city.', resetMap: 'Reset',
      uploadStorefrontPhoto: 'Add a storefront photo', changeStorefrontPhoto: 'Change storefront photo',
      weeklyActionsSubtitle: 'A quick-glance plan — not just data, an actual next step.',
      generateWeeklyActions: 'Get my 3 actions', generatingWeeklyActions: 'Prioritizing...',
      calendarIntro: 'Generate 12 post ideas mapped across the month — a ready content plan instead of one post at a time.',
      generateCalendar: 'Generate month plan', generatingCalendar: 'Mapping the month...',
      calendarWeekLabel: 'WEEK',
      howToTitle: 'How to use Local Signal',
      howToClose: 'Close',
      howToSteps: [
        { title: 'Fill in your business details', body: 'Business name and category are required. City and brand voice are optional but make the output sharper.' },
        { title: 'Pick a tab', body: 'GBP POST for a single update, Q&A REPLY for a customer question, SEO COPY for your profile description, or CALENDAR for a month of post ideas at once.' },
        { title: 'Generate and check the signal', body: 'GBP posts include an automatic compliance check — green means it\'s safe to publish, amber means review the flagged issue first.' },
        { title: 'Copy and publish', body: 'Copy the text and paste it directly into Google Business Profile. Nothing is posted automatically — you stay in control of what goes live.' },
      ],
      postTopicLabel: "What's the update?", postTopicPh: 'e.g. new seasonal pumpkin latte, weekend 20% off',
      generatePost: 'Generate post', generatingPost: 'Broadcasting...',
      questionLabel: "Customer's question", questionPh: 'e.g. Do you have gluten-free options?',
      factsLabel: 'Key facts to include', factsPh: 'e.g. yes, gluten-free muffins and oat milk available',
      generateAnswer: 'Generate answer', generatingAnswer: 'Drafting...',
      generateSeo: 'Generate descriptions', generatingSeo: 'Mapping copy...',
      seoIntro: 'A short line for your Google Business Profile, and a longer one for your website — both built for local search.',
      reviewExcerptLabel: 'Paste a happy review — optional', reviewExcerptPh: 'e.g. "Best latte in town, Maria always remembers my order..."',
      reviewExcerptHint: 'Pulls real phrases customers use into your description.',
      fillError: 'Fill in business name and category first.',
      genError: 'Could not generate. Try again.',
      copyBtn: 'Copy', copiedBtn: 'Copied',
      shortDescHeading: 'SHORT · ~150 CHARS',
      longDescHeading: 'LONG · ~750 CHARS',
      complianceClean: 'Looks compliant with Google\'s post policy',
      complianceIssues: 'Policy check found:',
      licenseGateTitle: 'Access code', licensePh: 'Enter your code',
      unlockBtn: 'Unlock', licenseInvalid: 'Invalid or inactive code',
      noCodeText: 'No code? Get access',
      statusLive: 'ON THE MAP',
      badgeLanguages: '20 LANGUAGES', badgeTools: '5 TOOLS', badgeUnlimited: 'UNLIMITED GENERATIONS',
      businessDetailsLabel: 'BUSINESS DETAILS',
      aboutTitle: 'About Local Signal',
      aboutClose: 'Close',
      aboutBody: [
        'Local Signal helps small businesses show up — and look active — in Google Search and Maps.',
        'GBP POST writes Google Business Profile updates. Google\'s algorithm favors profiles that post regularly, and most owners simply never get around to it.',
        'Q&A REPLY drafts answers to the questions customers leave on your profile — usually left unanswered for weeks.',
        'SEO COPY writes short and long business descriptions optimized for local search, and can pull real phrases from a happy review to keep the language authentic.',
        'Every GBP post is checked against Google\'s content policy automatically — flagging phone numbers, links, or spammy claims before you post.',
      ],
    },
    ru: {
      title: 'Local Signal',
      subtitle: 'Станьте заметны. Посты для Google Business, ответы клиентам и SEO-описания — на месте.',
      businessLabel: 'Название бизнеса', businessPh: 'Например: кофейня «Утро»',
      categoryLabel: 'Категория', categoryPh: 'Например: кофейня',
      cityLabel: 'Город / район', cityPh: 'Например: Москва или ул. Тверская 15, Москва',
      brandVoiceLabel: 'Голос бренда — необязательно', brandVoicePh: 'Например: дружелюбный, с юмором',
      languageLabel: 'Язык',
      tabPost: 'ПОСТ GBP', tabQA: 'ОТВЕТ КЛИЕНТУ', tabSeo: 'SEO-ТЕКСТ', tabCalendar: 'КАЛЕНДАРЬ', tabCompetitor: 'ОТЛИЧИЕ',
      competitorIntro: 'Вставьте пост или описание конкурента — получите конкретные способы отличиться, не общие советы, а точные пробелы, которые можно закрыть.',
      competitorLabel: 'Пост или описание конкурента', competitorPh: 'Например: вставьте текст «О нас» из его Google Business Profile или недавний пост',
      generateCompetitor: 'Найти пробелы', generatingCompetitor: 'Ищу пробелы...',
      competitorGapsHeading: 'ЧТО ОНИ УПУСКАЮТ',
      competitorAngleHeading: 'ВАШ УГОЛ ПОДАЧИ',
      weeklyActionsTitle: 'ТРИ ДЕЙСТВИЯ НА ЭТУ НЕДЕЛЮ',
      locateOnMap: 'Показать на карте', locatingMap: 'Ищу местоположение...', locateMapError: 'Не удалось найти это место. Уточните город.', resetMap: 'Сбросить',
      uploadStorefrontPhoto: 'Добавить фото витрины', changeStorefrontPhoto: 'Сменить фото витрины',
      weeklyActionsSubtitle: 'План на один взгляд — не просто данные, а конкретный следующий шаг.',
      generateWeeklyActions: 'Получить мои 3 действия', generatingWeeklyActions: 'Расставляю приоритеты...',
      calendarIntro: 'Генерирует 12 идей постов на месяц вперёд — готовый план контента вместо одного поста за раз.',
      generateCalendar: 'Сгенерировать план на месяц', generatingCalendar: 'Составляю план...',
      calendarWeekLabel: 'НЕДЕЛЯ',
      howToTitle: 'Как пользоваться Local Signal',
      howToClose: 'Закрыть',
      howToSteps: [
        { title: 'Заполните данные бизнеса', body: 'Название и категория обязательны. Город и голос бренда необязательны, но делают результат точнее.' },
        { title: 'Выберите вкладку', body: 'ПОСТ GBP — для одного обновления, ОТВЕТ КЛИЕНТУ — на вопрос в профиле, SEO-ТЕКСТ — описание бизнеса, КАЛЕНДАРЬ — сразу план постов на месяц.' },
        { title: 'Сгенерируйте и проверьте сигнал', body: 'Посты GBP автоматически проверяются на соответствие правилам — зелёный значит можно публиковать, жёлтый — сначала посмотрите, что помечено.' },
        { title: 'Скопируйте и опубликуйте', body: 'Скопируйте текст и вставьте прямо в Google Business Profile. Ничего не публикуется автоматически — вы сами решаете, что выходит в эфир.' },
      ],
      postTopicLabel: 'Что нового?', postTopicPh: 'Например: новый сезонный латте, скидка 20%',
      generatePost: 'Сгенерировать пост', generatingPost: 'Транслирую...',
      questionLabel: 'Вопрос клиента', questionPh: 'Например: у вас есть безглютеновые опции?',
      factsLabel: 'Ключевые факты для ответа', factsPh: 'Например: да, есть безглютеновые маффины',
      generateAnswer: 'Сгенерировать ответ', generatingAnswer: 'Пишу...',
      generateSeo: 'Сгенерировать описания', generatingSeo: 'Наношу на карту...',
      seoIntro: 'Короткая строка для Google Business Profile и более длинная для сайта — обе заточены под локальный поиск.',
      reviewExcerptLabel: 'Вставьте позитивный отзыв — необязательно', reviewExcerptPh: 'Например: «Лучший латте в городе, Мария всегда помнит мой заказ...»',
      reviewExcerptHint: 'Использует реальные фразы клиентов в описании.',
      fillError: 'Сначала заполните название и категорию бизнеса.',
      genError: 'Не удалось сгенерировать. Попробуйте ещё раз.',
      copyBtn: 'Копировать', copiedBtn: 'Скопировано',
      shortDescHeading: 'КОРОТКОЕ · ~150 СИМВ',
      longDescHeading: 'ДЛИННОЕ · ~750 СИМВ',
      complianceClean: 'Соответствует правилам постов Google',
      complianceIssues: 'Проверка правил нашла:',
      licenseGateTitle: 'Код доступа', licensePh: 'Введите код',
      unlockBtn: 'Разблокировать', licenseInvalid: 'Неверный или неактивный код',
      noCodeText: 'Нет кода? Получить доступ',
      statusLive: 'НА КАРТЕ',
      badgeLanguages: '20 ЯЗЫКОВ', badgeTools: '5 ИНСТРУМЕНТОВ', badgeUnlimited: 'БЕЗ ЛИМИТА ГЕНЕРАЦИЙ',
      businessDetailsLabel: 'ДАННЫЕ БИЗНЕСА',
      aboutTitle: 'О Local Signal',
      aboutClose: 'Закрыть',
      aboutBody: [
        'Local Signal помогает малому бизнесу быть заметным и выглядеть активным в Google Поиске и Картах.',
        'ПОСТ GBP пишет обновления для Google Business Profile. Алгоритм Google выше ставит профили, которые регулярно публикуют посты — а руки до этого обычно не доходят.',
        'ОТВЕТ КЛИЕНТУ готовит ответы на вопросы, которые клиенты оставляют в профиле — обычно они висят без ответа неделями.',
        'SEO-ТЕКСТ пишет короткое и длинное описание бизнеса под локальный поиск, и может вплести реальные фразы из позитивного отзыва, чтобы текст звучал живо.',
        'Каждый пост GBP автоматически проверяется на соответствие правилам Google — телефоны, ссылки или спорные заявления помечаются до публикации.',
      ],
    },
  };

  const t = ui[language] || ui.en;
  const bodyFont = currentLang.rtl ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const displayFont = currentLang.rtl ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
  const monoFont = "'IBM Plex Mono', monospace";

  const INK = '#111827';
  const INK_SOFT = '#55606E';
  const BG = '#EEF2F6';
  const CARD = '#F3F6F9';
  const LINE = '#D7DEE6';
  const AMBER = '#F2A93B';
  const AMBER_DEEP = '#D98E1E';
  const TEAL = '#2FA89A';
  const TEXT_LIGHT = '#111827';

  async function callGenerate(prompt) {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseCode, prompt }),
    });
    if (response.status === 403) {
      throw new Error('license');
    }
    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');
    return text.replace(/```json|```/g, '').trim();
  }

  async function handleGeneratePost() {
    if (!businessName.trim() || !category.trim() || !postTopic.trim()) {
      setError(t.fillError);
      return;
    }
    setError('');
    setPostLoading(true);
    setPostResult(null);

    const voiceInstruction = brandVoice.trim()
      ? `Match this brand voice: "${brandVoice.trim()}".`
      : 'Use a friendly, professional small-business tone.';

    const prompt = `You are a local SEO copywriter. Write a Google Business Profile post (update) for this business:
Business name: "${businessName}"
Category: "${category}"
Location: "${city || 'not specified'}"
Update topic: "${postTopic}"
Write in ${currentLang.englishName}. ${voiceInstruction}
Keep it under 1500 characters, include a natural call-to-action, and make it sound like a genuine update, not an ad. Include one relevant emoji if appropriate.

Respond ONLY with valid JSON, no markdown, no code fences: {"post": "the post text", "cta_suggestion": "short suggested CTA button label (e.g. 'Learn more', 'Call now', 'Book now')", "compliance": {"clean": true or false, "flags": ["short flag label if any issue found, e.g. 'Contains a phone number', 'Contains a URL', 'Unverifiable superlative claim (best, #1, etc.)', 'Excessive capitalization'"]}}
Google Business Profile posts should not contain phone numbers, URLs (other than what the platform itself allows), ALL-CAPS spam-like text, or unverifiable superlative claims — flag any of these if present in the post you wrote, otherwise return an empty flags array and clean: true.`;

    try {
      const clean = await callGenerate(prompt);
      setPostResult(JSON.parse(clean));
    } catch (err) {
      if (err.message === 'license') {
        setUnlocked(false);
        localStorage.removeItem('seo_unlocked');
        setLicenseError(t.licenseInvalid);
      } else {
        setError(t.genError);
      }
    } finally {
      setPostLoading(false);
    }
  }

  async function handleGenerateAnswer() {
    if (!businessName.trim() || !question.trim()) {
      setError(t.fillError);
      return;
    }
    setError('');
    setAnswerLoading(true);
    setAnswerResult(null);

    const prompt = `You are answering a customer question on a Google Business Profile Q&A section for "${businessName}" (${category || 'a local business'}${city ? ', ' + city : ''}).
Customer's question: "${question}"
Key facts to base the answer on: "${facts || 'no specific facts provided, answer generically but helpfully'}"
Write in ${currentLang.englishName}. Keep the answer short (2-4 sentences), accurate to the facts given, friendly, and helpful for future customers reading it too.

Respond ONLY with valid JSON, no markdown, no code fences: {"answer": "the answer text"}`;

    try {
      const clean = await callGenerate(prompt);
      setAnswerResult(JSON.parse(clean));
    } catch (err) {
      if (err.message === 'license') {
        setUnlocked(false);
        localStorage.removeItem('seo_unlocked');
        setLicenseError(t.licenseInvalid);
      } else {
        setError(t.genError);
      }
    } finally {
      setAnswerLoading(false);
    }
  }

  async function handleGenerateSeo() {
    if (!businessName.trim() || !category.trim()) {
      setError(t.fillError);
      return;
    }
    setError('');
    setSeoLoading(true);
    setSeoResult(null);

    const voiceInstruction = brandVoice.trim()
      ? `Match this brand voice: "${brandVoice.trim()}".`
      : 'Use a warm, professional small-business tone.';

    const prompt = `You are a local SEO copywriter. Write two business descriptions for local search optimization:
Business name: "${businessName}"
Category: "${category}"
Location: "${city || 'not specified'}"
Write in ${currentLang.englishName}. ${voiceInstruction}
Naturally include the business category and location for local SEO, without keyword-stuffing.
${reviewExcerpt.trim() ? `A real customer review to draw authentic language from (weave in a genuine phrase or sentiment from it naturally, don't quote it verbatim as a testimonial): "${reviewExcerpt.trim()}"` : ''}

Respond ONLY with valid JSON, no markdown, no code fences: {"short": "~150 character description for Google Business Profile", "long": "~750 character description for a website About page"}`;

    try {
      const clean = await callGenerate(prompt);
      setSeoResult(JSON.parse(clean));
    } catch (err) {
      if (err.message === 'license') {
        setUnlocked(false);
        localStorage.removeItem('seo_unlocked');
        setLicenseError(t.licenseInvalid);
      } else {
        setError(t.genError);
      }
    } finally {
      setSeoLoading(false);
    }
  }

  async function handleGenerateCalendar() {
    if (!businessName.trim() || !category.trim()) {
      setError(t.fillError);
      return;
    }
    setError('');
    setCalendarLoading(true);
    setCalendarResult(null);

    const voiceInstruction = brandVoice.trim()
      ? `Match this brand voice: "${brandVoice.trim()}".`
      : 'Use a friendly, professional small-business tone.';

    const prompt = `You are a local SEO content planner. Generate a month's worth of Google Business Profile post ideas for this business:
Business name: "${businessName}"
Category: "${category}"
Location: "${city || 'not specified'}"
Write in ${currentLang.englishName}. ${voiceInstruction}
Generate exactly 12 distinct post ideas spread across a month (roughly 3 per week), varied in type (promotions, behind-the-scenes, seasonal or local relevance, customer-focused, educational/tips). Each idea should be a short, concrete topic line (not the full post itself) that a busy owner could glance at and know what to post that week.

Respond ONLY with valid JSON, no markdown, no code fences: {"weeks": [{"label": "Week 1", "ideas": ["short topic 1", "short topic 2", "short topic 3"]}, {"label": "Week 2", "ideas": [...]}, {"label": "Week 3", "ideas": [...]}, {"label": "Week 4", "ideas": [...]}]}`;

    try {
      const clean = await callGenerate(prompt);
      setCalendarResult(JSON.parse(clean));
    } catch (err) {
      if (err.message === 'license') {
        setUnlocked(false);
        localStorage.removeItem('seo_unlocked');
        setLicenseError(t.licenseInvalid);
      } else {
        setError(t.genError);
      }
    } finally {
      setCalendarLoading(false);
    }
  }

  async function handleGenerateCompetitor() {
    if (!businessName.trim() || !competitorText.trim()) {
      setError(t.fillError);
      return;
    }
    setError('');
    setCompetitorLoading(true);
    setCompetitorResult(null);

    const prompt = `You are a local marketing strategist. A business is trying to differentiate itself from a competitor.
Our business: "${businessName}", category: "${category || 'not specified'}", location: "${city || 'not specified'}".
Competitor's post or profile text: "${competitorText.trim()}"
Write in ${currentLang.englishName}.
Analyze what the competitor emphasizes and what they leave out or underplay. Then suggest a specific angle our business could take that the competitor isn't using — concrete and actionable, not generic advice like "be authentic" or "focus on quality".

Respond ONLY with valid JSON, no markdown, no code fences: {"gaps": ["short specific gap 1", "short specific gap 2", "short specific gap 3"], "angle": "one paragraph suggesting a concrete differentiation angle for our business"}`;

    try {
      const clean = await callGenerate(prompt);
      setCompetitorResult(JSON.parse(clean));
    } catch (err) {
      if (err.message === 'license') {
        setUnlocked(false);
        localStorage.removeItem('seo_unlocked');
        setLicenseError(t.licenseInvalid);
      } else {
        setError(t.genError);
      }
    } finally {
      setCompetitorLoading(false);
    }
  }

  async function handleGenerateWeeklyActions() {
    if (!businessName.trim() || !category.trim()) {
      setError(t.fillError);
      return;
    }
    setError('');
    setWeeklyActionsLoading(true);
    setWeeklyActions(null);
    setCheckedActions({});

    const prompt = `You are a pragmatic local marketing advisor. Give this business exactly 3 prioritized, concrete actions to take this week to improve their Google Business Profile visibility.
Business: "${businessName}", category: "${category}", location: "${city || 'not specified'}".
Write in ${currentLang.englishName}.
Each action must be short (one sentence), specific, and doable within the week — not generic advice like "post more" or "engage with customers". Order them by priority, most impactful first.

Respond ONLY with valid JSON, no markdown, no code fences: {"actions": ["specific action 1", "specific action 2", "specific action 3"]}`;

    try {
      const clean = await callGenerate(prompt);
      setWeeklyActions(JSON.parse(clean));
    } catch (err) {
      if (err.message === 'license') {
        setUnlocked(false);
        localStorage.removeItem('seo_unlocked');
        setLicenseError(t.licenseInvalid);
      } else {
        setError(t.genError);
      }
    } finally {
      setWeeklyActionsLoading(false);
    }
  }

  function toggleAction(i) {
    setCheckedActions(prev => ({ ...prev, [i]: !prev[i] }));
  }

  function handleStorefrontUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setStorefrontPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  // Динамически подгружаем Leaflet (карта на OpenStreetMap) с CDN —
  // без npm-пакетов, без API-ключа. Тёмные плитки CartoDB тоже бесплатны.
  function loadLeaflet() {
    return new Promise((resolve) => {
      if (window.L) {
        leafletReadyRef.current = true;
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        leafletReadyRef.current = true;
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  async function handleLocateBusiness() {
    if (!city.trim()) return;
    setMapError(false);
    setMapLoading(true);
    try {
      await loadLeaflet();
      const query = businessName.trim() ? `${businessName}, ${city}` : city;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
        { headers: { 'Accept-Language': language } }
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        // Пробуем ещё раз только по городу, без названия бизнеса
        const res2 = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`
        );
        const data2 = await res2.json();
        if (!data2 || data2.length === 0) {
          setMapError(true);
          setMapLoading(false);
          return;
        }
        setMapCoords({ lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) });
      } else {
        setMapCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } catch (err) {
      setMapError(true);
    } finally {
      setMapLoading(false);
    }
  }

  // Инициализация/обновление карты при появлении координат
  useEffect(() => {
    if (!mapCoords || !mapContainerRef.current || !window.L) return;
    const L = window.L;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([mapCoords.lat, mapCoords.lng], 16);

    // Убираем стандартный префикс Leaflet (включая флаг Украины) —
    // оставляем только нужную атрибуцию OpenStreetMap/CARTO
    map.attributionControl.setPrefix('');

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 20,
    }).addTo(map);

    // Кастомная метка в фирменных цветах (янтарь + розовое кольцо), как точки-сигналы радара
    const icon = L.divIcon({
      className: '',
      html: `<div style="position:relative;width:22px;height:22px;">
        <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #E94F82;opacity:0.6;"></div>
        <div style="position:absolute;top:5px;left:5px;width:12px;height:12px;border-radius:50%;background:#F2A93B;box-shadow:0 0 8px rgba(242,169,59,0.8);"></div>
      </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    L.marker([mapCoords.lat, mapCoords.lng], { icon }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapCoords]);

  function handleCopy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    });
  }

  // Проверка кода: коды AppSumo начинаются с "SEO-" и проверяются через
  // /api/redeem-appsumo. Обычные коды (Getly, SEO92) работают как раньше.
  async function handleUnlock() {
    if (!licenseCode.trim()) return;
    setLicenseError('');

    if (licenseCode.trim().toUpperCase().startsWith('SEO-')) {
      try {
        const res = await fetch('/api/redeem-appsumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: licenseCode.trim() }),
        });
        const data = await res.json();
        if (data.success) {
          setUnlocked(true);
          localStorage.setItem('seo_unlocked', 'true');
          localStorage.setItem('seo_licenseCode', licenseCode.trim());
        } else {
          setLicenseError(data.error || t.licenseInvalid);
        }
      } catch (err) {
        setLicenseError(t.licenseInvalid);
      }
      return;
    }

    setUnlocked(true);
    localStorage.setItem('seo_unlocked', 'true');
    localStorage.setItem('seo_licenseCode', licenseCode.trim());
  }

  // Пульсирующая геометка — компактная версия для узких мест (селект языка и т.п.)
  const PinSignal = ({ size = 34, ring = AMBER, pin = AMBER, outline = INK }) => (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <style>{`
        @keyframes pingRing {
          0% { transform: scale(0.6); opacity: 0.55; }
          100% { transform: scale(2.1); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: `1.5px solid ${ring}`, animation: 'pingRing 2.2s ease-out infinite',
      }} />
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: 'relative' }}>
        <circle cx="12" cy="10" r="3.4" fill={pin} />
        <path d="M12 21c4.2-4.6 7-8.3 7-11.6A7 7 0 0 0 5 9.4C5 12.7 7.8 16.4 12 21z" stroke={outline} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      </svg>
    </div>
  );

  // Радар-визуализация: концентрические кольца, вращающийся луч сканирования,
  // точки-сигналы ("найдены" клиентами в разных точках) — главный визуальный
  // момент хиро-панели, буквально изображающий "быть на карте"
  const RadarHero = () => {
    // Точки-сигналы разбросаны по всей ширине панели (не только у радара) —
    // изображают несколько "найденных" мест на карте одновременно
    const blips = [
      { top: '20%', left: '12%', delay: '0.2s', size: 6 },
      { top: '68%', left: '22%', delay: '1.6s', size: 5 },
      { top: '78%', left: '58%', delay: '0.9s', size: 6 },
      { top: '18%', left: '48%', delay: '2.3s', size: 5 },
      { top: '30%', left: '84%', delay: '0.5s', size: 6 },
      { top: '75%', left: '92%', delay: '1.9s', size: 5 },
    ];
    return (
      <div style={{ position: 'relative', width: '100%', height: 270, overflow: 'hidden' }}>
        <style>{`
          @keyframes radarSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes blipPulse {
            0% { transform: scale(0.4); opacity: 0; }
            15% { opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
          }
          @keyframes blipCore { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
        `}</style>

        {/* фоновая точечная сетка "карты" на всю панель */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(rgba(17,24,39,0.05) 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }} />

        {/* рассеянные точки-сигналы по всей ширине */}
        {blips.map((b, i) => (
          <div key={i} style={{ position: 'absolute', top: b.top, left: b.left, width: b.size, height: b.size }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `1px solid ${AMBER}`, animation: `blipPulse 2.8s ease-out infinite`, animationDelay: b.delay,
            }} />
            <div style={{
              position: 'absolute', top: b.size * 0.25, left: b.size * 0.25, width: b.size * 0.5, height: b.size * 0.5, borderRadius: '50%',
              background: AMBER, animation: `blipCore 2.8s ease-in-out infinite`, animationDelay: b.delay,
            }} />
          </div>
        ))}

        {/* центральный радар — крупный, заполняет панель по высоте */}
        <div style={{ position: 'absolute', top: '50%', left: '54%', transform: 'translate(-50%,-50%)', width: 260, height: 260 }}>
          {[46, 84, 122].map((r, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%', width: r * 2, height: r * 2,
              transform: 'translate(-50%,-50%)', borderRadius: '50%',
              border: `1px solid rgba(242,169,59,${0.34 - i * 0.09})`,
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `conic-gradient(from 0deg, rgba(242,169,59,0.55), rgba(242,169,59,0) 28%)`,
            animation: 'radarSpin 4s linear infinite',
            maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
          }} />
          {/* центральная метка */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', width: 9, height: 9,
            transform: 'translate(-50%,-50%)', borderRadius: '50%', background: AMBER,
            boxShadow: `0 0 0 5px rgba(242,169,59,0.18)`,
          }} />
        </div>
      </div>
    );
  };

  const AboutModal = () => {
    if (!showAbout) return null;
    return (
      <div
        onClick={() => setShowAbout(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl p-6"
          style={{ background: INK, border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 19, color: '#FFFFFF' }}>{t.aboutTitle}</h2>
            <button
              onClick={() => setShowAbout(false)}
              style={{ fontFamily: monoFont, fontSize: 11, color: '#8B96A5', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t.aboutClose} ✕
            </button>
          </div>
          <div className="space-y-3">
            {t.aboutBody.map((line, i) => (
              <p key={i} className="text-sm" style={{ color: '#C7D0DA', lineHeight: 1.55 }}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const HowToModal = () => {
    if (!showHowTo) return null;
    return (
      <div
        onClick={() => setShowHowTo(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl p-6"
          style={{ background: CARD, border: `1px solid ${LINE}`, maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 19, color: TEXT_LIGHT }}>{t.howToTitle}</h2>
            <button
              onClick={() => setShowHowTo(false)}
              style={{ fontFamily: monoFont, fontSize: 11, color: INK_SOFT, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t.howToClose} ✕
            </button>
          </div>
          <div className="space-y-4">
            {t.howToSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: AMBER, color: TEXT_LIGHT,
                  fontFamily: monoFont, fontSize: 11, fontWeight: 700, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: TEXT_LIGHT }}>{step.title}</p>
                  <p className="text-sm" style={{ color: INK_SOFT, lineHeight: 1.5 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10" dir={currentLang.rtl ? 'rtl' : 'ltr'} style={{
        fontFamily: bodyFont,
        background: `linear-gradient(120deg, #F7F3EC, #FBEAF0, #F5F4EE, #F7F3EC)`,
        backgroundSize: '300% 300%',
        
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Cairo:wght@400;700&display=swap');
          @keyframes gradientDrift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes cardRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes shimmerSweep { 0% { left: -150%; } 55%, 100% { left: 150%; } }
          .ls-shimmer { position: relative; overflow: hidden; }
          .ls-shimmer::after {
            content: ''; position: absolute; top: 0; left: -150%; width: 55%; height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
            transform: skewX(-20deg); animation: shimmerSweep 3.2s ease-in-out infinite;
          }
          .ls-card { animation: cardRise 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
          .ls-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
          .ls-btn:hover { transform: translateY(-2px) scale(1.01); }
        `}</style>
        <AboutModal />
        <div className="w-full max-w-sm ls-card">
          <div className="rounded-t-2xl px-6 pt-6 relative" style={{ background: INK, overflow: 'hidden' }}>
            <div className="flex items-center justify-between relative" style={{ zIndex: 1 }}>
              <button
                onClick={() => setShowAbout(true)}
                style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.1em', color: AMBER, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                LOCAL SIGNAL
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs rounded px-2 py-1 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#C7D0DA', fontFamily: monoFont }}
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} style={{ color: TEXT_LIGHT }}>{l.label}</option>
                ))}
              </select>
            </div>
            <RadarHero />
          </div>
          <div className="rounded-b-2xl px-6 pb-7 pt-5 relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.5)', borderTop: 'none', overflow: 'hidden', boxShadow: '0 24px 48px -12px rgba(242,169,59,0.25)' }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 160, height: 160, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(242,169,59,0.14), transparent 70%)`, pointerEvents: 'none',
            }} />
            <h1 className="text-2xl mb-5 relative" style={{ fontFamily: displayFont, fontWeight: 700, color: TEXT_LIGHT }}>
              {t.licenseGateTitle}
            </h1>
            <input
              type="text"
              value={licenseCode}
              onChange={(e) => setLicenseCode(e.target.value)}
              placeholder={t.licensePh}
              className="w-full rounded px-3 py-2.5 text-sm mb-3 focus:outline-none relative"
              style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid ${LINE}`, color: TEXT_LIGHT, fontFamily: monoFont }}
            />
            {licenseError && <p className="text-sm mb-3 relative" style={{ color: '#C0472F' }}>{licenseError}</p>}
            <button
              onClick={handleUnlock}
              className="w-full font-semibold py-2.5 rounded text-sm relative ls-shimmer"
              style={{ background: `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`, color: TEXT_LIGHT, boxShadow: `0 0 28px rgba(242,169,59,0.55)` }}
            >
              {t.unlockBtn}
            </button>
            <a href="/buy.html" className="block text-center text-xs mt-4 relative" style={{ color: TEAL }}>
              {t.noCodeText}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'post', label: t.tabPost },
    { id: 'qa', label: t.tabQA },
    { id: 'seo', label: t.tabSeo },
    { id: 'calendar', label: t.tabCalendar },
    { id: 'competitor', label: t.tabCompetitor },
  ];

  return (
    <div className="min-h-screen" dir={currentLang.rtl ? 'rtl' : 'ltr'} style={{
      fontFamily: bodyFont,
      background: `linear-gradient(120deg, #F7F3EC, #FBEAF0, #F5F4EE, #F7F3EC)`,
      backgroundSize: '300% 300%',
      
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Cairo:wght@400;700&display=swap');
        @keyframes gradientDrift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes cardRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatBlob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-16px) scale(1.06); } }
        @keyframes globeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmerSweep { 0% { left: -150%; } 55%, 100% { left: 150%; } }
        .ls-shimmer { position: relative; overflow: hidden; }
        .ls-shimmer::after {
          content: ''; position: absolute; top: 0; left: -150%; width: 55%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
          transform: skewX(-20deg); animation: shimmerSweep 3.2s ease-in-out infinite;
        }
        .ls-globe-ring { transform-origin: 36px 36px; animation: globeSpin 14s linear infinite; }
        .ls-globe-ring-slow { transform-origin: 36px 36px; animation: globeSpin 22s linear infinite reverse; }
        .ls-globe-spin { transform-box: view-box; transform-origin: 50% 50%; animation: globeSpin 12s linear infinite; }
        .ls-card { animation: cardRise 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
        .ls-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .ls-btn:hover { transform: translateY(-2px) scale(1.01); }
        .ls-btn:active { transform: translateY(0) scale(0.98); }
      `}</style>

      <AboutModal />
      <HowToModal />
      <div className="w-full ls-card">
        <div style={{ padding: '40px 24px 0', background: `linear-gradient(160deg, #1D1424 0%, #14131F 55%, #1A1220 100%)`, position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, rgba(233,79,130,0.28), transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -70, left: -50, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, rgba(242,169,59,0.3), transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '35%', left: -30, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, rgba(233,79,130,0.20), transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, right: -20, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, rgba(242,169,59,0.22), transparent 70%)`, pointerEvents: 'none' }} />
          <div className="flex items-center justify-between relative">
            <button
                onClick={() => setShowAbout(true)}
                style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.1em', color: AMBER, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                LOCAL SIGNAL
              </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHowTo(true)}
                className="text-xs rounded px-2 py-1.5 flex items-center gap-1"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#C7D0DA', fontFamily: monoFont, cursor: 'pointer' }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: '50%', border: '1px solid #C7D0DA',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
                }}>?</span>
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs rounded px-2 py-1 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#C7D0DA', fontFamily: monoFont }}
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} style={{ color: TEXT_LIGHT }}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="text-3xl mt-1" style={{
            fontFamily: displayFont, fontWeight: 700, letterSpacing: '-0.01em',
            background: `linear-gradient(90deg, ${AMBER}, #E94F82)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            {t.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#D9A6C2' }}>{t.subtitle}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {[t.badgeLanguages, t.badgeTools, t.badgeUnlimited].map((b, i) => {
              const isPink = i === 1;
              return (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{
                  fontFamily: monoFont, fontSize: 10, letterSpacing: '0.03em',
                  background: isPink ? 'rgba(233,79,130,0.12)' : 'rgba(242,169,59,0.12)',
                  border: isPink ? '1px solid rgba(233,79,130,0.3)' : '1px solid rgba(242,169,59,0.3)',
                  color: isPink ? '#E94F82' : AMBER,
                }}>
                  {b}
                </span>
              );
            })}
          </div>
          <RadarHero />
        </div>

        <div style={{ padding: '32px 24px 64px', minHeight: '60vh', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', overflow: 'hidden', position: 'relative', boxSizing: 'border-box' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(120deg, rgba(242,169,59,0.05), rgba(233,79,130,0.11), rgba(233,79,130,0.06), rgba(242,169,59,0.05))`,
            backgroundSize: '250% 250%',
            animation: 'gradientDrift 22s ease infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${AMBER}, ${TEAL}, transparent)`,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(rgba(17,24,39,0.05) 1px, transparent 1px)`,
            backgroundSize: '16px 16px', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: -110, right: -90, width: 340, height: 340, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(242,169,59,0.22), transparent 68%)`, pointerEvents: 'none', filter: 'blur(4px)',
          }} />
          <div style={{
            position: 'absolute', top: '30%', left: '55%', width: 220, height: 220, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(217,142,30,0.10), transparent 70%)`, pointerEvents: 'none', filter: 'blur(6px)',
          }} />
          <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ width: 16, height: 1, background: AMBER_DEEP, display: 'inline-block' }} />
            <h2 style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: '0.08em', color: INK_SOFT }}>{t.businessDetailsLabel}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12, width: '100%' }}>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 5, background: "rgba(242,169,59,0.15)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER_DEEP} strokeWidth="2"><path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" strokeLinejoin="round"/></svg></span>
                {t.businessLabel}
              </label>
              <input
                type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                placeholder={t.businessPh}
                className="w-full rounded px-3 py-2 text-sm focus:outline-none"
                style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 5, background: "rgba(242,169,59,0.15)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER_DEEP} strokeWidth="2"><path d="M20.5 12.5L12 21l-9-9 8.5-8.5H20a1 1 0 0 1 1 1v8z" strokeLinejoin="round"/><circle cx="15" cy="8" r="1.4" fill={AMBER_DEEP} stroke="none"/></svg></span>
                {t.categoryLabel}
              </label>
              <input
                type="text" value={category} onChange={(e) => handleCategoryChange(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; if (categorySuggestions.length) setShowCategorySuggestions(true); }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; setTimeout(() => setShowCategorySuggestions(false), 150); }}
                placeholder={t.categoryPh}
                className="w-full rounded px-3 py-2 text-sm focus:outline-none"
                style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
              />
              {showCategorySuggestions && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
                  background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>
                  {categorySuggestions.map((c, i) => (
                    <div
                      key={i}
                      onMouseDown={() => { setCategory(c); setShowCategorySuggestions(false); }}
                      className="text-sm cursor-pointer"
                      style={{ padding: '8px 12px', color: TEXT_LIGHT, borderBottom: i < categorySuggestions.length - 1 ? `1px solid ${LINE}` : 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(242,169,59,0.12)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, width: '100%' }}>
            <div style={{ position: 'relative' }}>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 5, background: "rgba(242,169,59,0.15)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER_DEEP} strokeWidth="2"><circle cx="12" cy="10" r="2.6"/><path d="M12 21c3.6-3.9 6-7.3 6-10.6A6 6 0 0 0 6 10.4C6 13.7 8.4 17.1 12 21z" strokeLinejoin="round"/></svg></span>
                {t.cityLabel}
              </label>
              <input
                type="text" value={city} onChange={(e) => handleCityChange(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; if (citySuggestions.length) setShowCitySuggestions(true); }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; setTimeout(() => setShowCitySuggestions(false), 150); }}
                placeholder={t.cityPh}
                className="w-full rounded px-3 py-2 text-sm focus:outline-none"
                style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
                  background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>
                  {citySuggestions.map((item, i) => (
                    <div
                      key={i}
                      onMouseDown={() => pickCitySuggestion(item)}
                      className="text-sm cursor-pointer"
                      style={{ padding: '8px 12px', color: TEXT_LIGHT, borderBottom: i < citySuggestions.length - 1 ? `1px solid ${LINE}` : 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(242,169,59,0.12)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 5, background: "rgba(242,169,59,0.15)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER_DEEP} strokeWidth="2"><path d="M4 14V10M8 17V7M12 19V5M16 15V9M20 13V11" strokeLinecap="round"/></svg></span>
                {t.brandVoiceLabel}
              </label>
              <input
                type="text" value={brandVoice} onChange={(e) => handleBrandVoiceChange(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; if (brandVoiceSuggestions.length) setShowBrandVoiceSuggestions(true); }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; setTimeout(() => setShowBrandVoiceSuggestions(false), 150); }}
                placeholder={t.brandVoicePh}
                className="w-full rounded px-3 py-2 text-sm focus:outline-none"
                style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
              />
              {showBrandVoiceSuggestions && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
                  background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>
                  {brandVoiceSuggestions.map((v, i) => (
                    <div
                      key={i}
                      onMouseDown={() => { setBrandVoice(v); setShowBrandVoiceSuggestions(false); }}
                      className="text-sm cursor-pointer"
                      style={{ padding: '8px 12px', color: TEXT_LIGHT, borderBottom: i < brandVoiceSuggestions.length - 1 ? `1px solid ${LINE}` : 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(242,169,59,0.12)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded mb-5" style={{ position: 'relative', overflow: 'hidden' }}>
            {!mapCoords && !mapLoading && (
              <button
                onClick={handleLocateBusiness}
                disabled={!city.trim()}
                className="ls-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px',
                  borderRadius: 8, background: 'rgba(242,169,59,0.10)', border: `1px dashed rgba(242,169,59,0.4)`,
                  color: AMBER_DEEP, fontFamily: monoFont, fontSize: 11, letterSpacing: '0.03em',
                  cursor: city.trim() ? 'pointer' : 'not-allowed', opacity: city.trim() ? 1 : 0.5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AMBER_DEEP} strokeWidth="2"><circle cx="12" cy="10" r="2.6"/><path d="M12 21c3.6-3.9 6-7.3 6-10.6A6 6 0 0 0 6 10.4C6 13.7 8.4 17.1 12 21z" strokeLinejoin="round"/></svg>
                {t.locateOnMap}
              </button>
            )}
            {mapLoading && (
              <p style={{ fontFamily: monoFont, fontSize: 11, color: INK_SOFT }}>{t.locatingMap}</p>
            )}
            {mapError && (
              <p style={{ fontFamily: monoFont, fontSize: 11, color: '#C0472F' }}>{t.locateMapError}</p>
            )}
            {mapCoords && (
              <div style={{ position: 'relative' }}>
                <div ref={mapContainerRef} style={{ width: '100%', height: 220, borderRadius: 10, border: `1px solid rgba(242,169,59,0.3)` }} />
                <button
                  onClick={() => { setMapCoords(null); setMapError(false); }}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 500,
                    background: 'rgba(20,19,31,0.85)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
                    color: '#FFFFFF', fontFamily: monoFont, fontSize: 10, padding: '4px 8px', cursor: 'pointer',
                  }}
                >
                  {t.resetMap}
                </button>

                <label
                  className="flex items-center gap-3 mt-2 rounded-lg px-3 py-2 text-sm cursor-pointer"
                  style={{ background: BG, border: `1px dashed ${LINE}`, color: INK_SOFT }}
                >
                  {storefrontPhoto ? (
                    <img src={storefrontPhoto} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(242,169,59,0.15)', flexShrink: 0 }} />
                  )}
                  <span>{storefrontPhoto ? t.changeStorefrontPhoto : t.uploadStorefrontPhoto}</span>
                  <input type="file" accept="image/*" onChange={handleStorefrontUpload} className="hidden" />
                </label>
                {storefrontPhoto && (
                  <img src={storefrontPhoto} alt="Storefront" style={{ width: '100%', maxWidth: 560, maxHeight: 240, objectFit: 'cover', borderRadius: 10, marginTop: 8, border: `1px solid rgba(233,79,130,0.3)`, display: 'block', marginLeft: 'auto', marginRight: 'auto', imageRendering: 'auto' }} />
                )}
              </div>
            )}
          </div>

          <div className="rounded mb-5 p-3.5" style={{ background: `linear-gradient(160deg, #1D1424 0%, #14131F 55%, #1A1220 100%)`, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 100, height: 100, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(242,169,59,0.25), transparent 70%)`, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: -30, width: 110, height: 110, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(233,79,130,0.22), transparent 70%)`, pointerEvents: 'none',
            }} />
            {[
              { top: '22%', left: '78%', delay: '0.3s', color: AMBER, size: 5 },
              { top: '68%', left: '88%', delay: '1.7s', color: '#E94F82', size: 5 },
              { top: '75%', left: '15%', delay: '1.0s', color: AMBER, size: 4 },
            ].map((b, i) => (
              <div key={i} style={{ position: 'absolute', top: b.top, left: b.left, width: b.size, height: b.size, pointerEvents: 'none' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: `1px solid ${b.color}`, animation: `blipPulse 2.8s ease-out infinite`, animationDelay: b.delay,
                }} />
                <div style={{
                  position: 'absolute', top: b.size * 0.25, left: b.size * 0.25, width: b.size * 0.5, height: b.size * 0.5, borderRadius: '50%',
                  background: b.color, animation: `blipCore 2.8s ease-in-out infinite`, animationDelay: b.delay,
                }} />
              </div>
            ))}
            <div className="flex items-center justify-between mb-1 relative">
              <h3 style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.06em', color: AMBER }}>{t.weeklyActionsTitle}</h3>
            </div>
            <p className="text-xs mb-3 relative" style={{ color: '#8B96A5' }}>{t.weeklyActionsSubtitle}</p>

            {!weeklyActions && (
              <button
                onClick={handleGenerateWeeklyActions} disabled={weeklyActionsLoading}
                className="text-xs font-semibold px-3 py-2 rounded relative"
                style={{
                  background: weeklyActionsLoading ? 'rgba(255,255,255,0.12)' : `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`,
                  color: weeklyActionsLoading ? '#8B96A5' : INK,
                  boxShadow: weeklyActionsLoading ? 'none' : `0 0 24px rgba(242,169,59,0.55)`,
                }}
              >
                {weeklyActionsLoading ? t.generatingWeeklyActions : t.generateWeeklyActions}
              </button>
            )}

            {weeklyActions && weeklyActions.actions && (
              <div className="space-y-2 relative">
                {weeklyActions.actions.map((action, i) => (
                  <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                    <span
                      onClick={() => toggleAction(i)}
                      style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                        border: `1.5px solid ${checkedActions[i] ? AMBER : 'rgba(255,255,255,0.3)'}`,
                        background: checkedActions[i] ? AMBER : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {checkedActions[i] && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </span>
                    <span
                      onClick={() => toggleAction(i)}
                      className="text-sm"
                      style={{
                        color: checkedActions[i] ? '#8B96A5' : '#E9EDF2',
                        textDecoration: checkedActions[i] ? 'line-through' : 'none',
                      }}
                    >
                      {action}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex mb-4 overflow-x-auto" style={{ borderBottom: `1px solid ${LINE}` }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 text-center py-2.5 whitespace-nowrap px-1"
                style={{
                  fontFamily: monoFont, fontSize: 9.5, letterSpacing: '0.03em',
                  color: activeTab === tab.id ? INK : INK_SOFT,
                  borderBottom: activeTab === tab.id ? `2px solid ${AMBER}` : '2px solid transparent',
                  boxShadow: activeTab === tab.id ? `0 2px 8px -2px rgba(242,169,59,0.6)` : 'none',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'post' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>{t.postTopicLabel}</label>
                <textarea
                  value={postTopic} onChange={(e) => setPostTopic(e.target.value)}
                  placeholder={t.postTopicPh} rows={3}
                  className="w-full rounded px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {error && <p className="text-sm" style={{ color: '#C0472F' }}>{error}</p>}
              <button
                onClick={handleGeneratePost} disabled={postLoading}
                className={`w-full font-semibold py-2.5 rounded text-sm ls-btn ${postLoading ? '' : 'ls-shimmer'}`}
                style={{ width: "100%", boxSizing: "border-box", background: postLoading ? LINE : `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`, color: postLoading ? INK_SOFT : TEXT_LIGHT, boxShadow: postLoading ? 'none' : `0 0 28px rgba(242,169,59,0.55)` }}
              >
                {postLoading ? t.generatingPost : t.generatePost}
              </button>

              {postResult && (
                <div className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${AMBER}` }}>
                  <p className="text-sm mb-2" style={{ color: TEXT_LIGHT }}>{postResult.post}</p>
                  {postResult.cta_suggestion && (
                    <p style={{ fontFamily: monoFont, fontSize: 10.5, color: TEAL, marginBottom: 8 }}>CTA → {postResult.cta_suggestion}</p>
                  )}
                  {postResult.compliance && (
                    <div className="flex items-start gap-1.5 mb-2">
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                        background: postResult.compliance.clean ? TEAL : '#D98E1E',
                      }} />
                      {postResult.compliance.clean ? (
                        <p style={{ fontFamily: monoFont, fontSize: 10.5, color: TEAL }}>{t.complianceClean}</p>
                      ) : (
                        <div>
                          <p style={{ fontFamily: monoFont, fontSize: 10.5, color: '#D98E1E' }}>{t.complianceIssues}</p>
                          <ul style={{ fontFamily: monoFont, fontSize: 10.5, color: INK_SOFT, marginTop: 2 }}>
                            {postResult.compliance.flags.map((f, i) => (
                              <li key={i}>— {f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={() => handleCopy(postResult.post, 'post')} className="text-xs font-semibold"
                    style={{ fontFamily: monoFont, color: copied === 'post' ? TEAL : AMBER_DEEP }}>
                    {copied === 'post' ? t.copiedBtn : t.copyBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>{t.questionLabel}</label>
                <textarea
                  value={question} onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.questionPh} rows={2}
                  className="w-full rounded px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>{t.factsLabel}</label>
                <textarea
                  value={facts} onChange={(e) => setFacts(e.target.value)}
                  placeholder={t.factsPh} rows={2}
                  className="w-full rounded px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {error && <p className="text-sm" style={{ color: '#C0472F' }}>{error}</p>}
              <button
                onClick={handleGenerateAnswer} disabled={answerLoading}
                className={`w-full font-semibold py-2.5 rounded text-sm ls-btn ${answerLoading ? '' : 'ls-shimmer'}`}
                style={{ width: "100%", boxSizing: "border-box", background: answerLoading ? LINE : `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`, color: answerLoading ? INK_SOFT : TEXT_LIGHT, boxShadow: answerLoading ? 'none' : `0 0 28px rgba(242,169,59,0.55)` }}
              >
                {answerLoading ? t.generatingAnswer : t.generateAnswer}
              </button>

              {answerResult && (
                <div className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${AMBER}` }}>
                  <p className="text-sm mb-2" style={{ color: TEXT_LIGHT }}>{answerResult.answer}</p>
                  <button onClick={() => handleCopy(answerResult.answer, 'answer')} className="text-xs font-semibold"
                    style={{ fontFamily: monoFont, color: copied === 'answer' ? TEAL : AMBER_DEEP }}>
                    {copied === 'answer' ? t.copiedBtn : t.copyBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: INK_SOFT }}>{t.seoIntro}</p>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>{t.reviewExcerptLabel}</label>
                <textarea
                  value={reviewExcerpt} onChange={(e) => setReviewExcerpt(e.target.value)}
                  placeholder={t.reviewExcerptPh} rows={2}
                  className="w-full rounded px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; }}
                />
                <p className="text-xs mt-1" style={{ color: TEAL }}>{t.reviewExcerptHint}</p>
              </div>
              {error && <p className="text-sm" style={{ color: '#C0472F' }}>{error}</p>}
              <button
                onClick={handleGenerateSeo} disabled={seoLoading}
                className={`w-full font-semibold py-2.5 rounded text-sm ls-btn ${seoLoading ? '' : 'ls-shimmer'}`}
                style={{ width: "100%", boxSizing: "border-box", background: seoLoading ? LINE : `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`, color: seoLoading ? INK_SOFT : TEXT_LIGHT, boxShadow: seoLoading ? 'none' : `0 0 28px rgba(242,169,59,0.55)` }}
              >
                {seoLoading ? t.generatingSeo : t.generateSeo}
              </button>

              {seoResult && (
                <div className="space-y-3">
                  <div className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${TEAL}` }}>
                    <h3 style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.05em', color: TEAL, marginBottom: 8 }}>{t.shortDescHeading}</h3>
                    <p className="text-sm mb-2" style={{ color: TEXT_LIGHT }}>{seoResult.short}</p>
                    <button onClick={() => handleCopy(seoResult.short, 'short')} className="text-xs font-semibold"
                      style={{ fontFamily: monoFont, color: copied === 'short' ? TEAL : AMBER_DEEP }}>
                      {copied === 'short' ? t.copiedBtn : t.copyBtn}
                    </button>
                  </div>
                  <div className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${TEAL}` }}>
                    <h3 style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.05em', color: TEAL, marginBottom: 8 }}>{t.longDescHeading}</h3>
                    <p className="text-sm mb-2" style={{ color: TEXT_LIGHT }}>{seoResult.long}</p>
                    <button onClick={() => handleCopy(seoResult.long, 'long')} className="text-xs font-semibold"
                      style={{ fontFamily: monoFont, color: copied === 'long' ? TEAL : AMBER_DEEP }}>
                      {copied === 'long' ? t.copiedBtn : t.copyBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: INK_SOFT }}>{t.calendarIntro}</p>
              {error && <p className="text-sm" style={{ color: '#C0472F' }}>{error}</p>}
              <button
                onClick={handleGenerateCalendar} disabled={calendarLoading}
                className={`w-full font-semibold py-2.5 rounded text-sm ls-btn ${calendarLoading ? '' : 'ls-shimmer'}`}
                style={{ width: "100%", boxSizing: "border-box", background: calendarLoading ? LINE : `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`, color: calendarLoading ? INK_SOFT : TEXT_LIGHT, boxShadow: calendarLoading ? 'none' : `0 0 28px rgba(242,169,59,0.55)` }}
              >
                {calendarLoading ? t.generatingCalendar : t.generateCalendar}
              </button>

              {calendarResult && calendarResult.weeks && (
                <div className="space-y-3">
                  {calendarResult.weeks.map((week, wi) => (
                    <div key={wi} className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${AMBER}` }}>
                      <h3 style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.05em', color: AMBER_DEEP, marginBottom: 8 }}>
                        {t.calendarWeekLabel} {wi + 1}
                      </h3>
                      <ul className="space-y-1.5">
                        {week.ideas.map((idea, ii) => (
                          <li key={ii} className="flex items-start gap-2 text-sm" style={{ color: TEXT_LIGHT }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: TEAL, marginTop: 7, flexShrink: 0 }} />
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button
                    onClick={() => handleCopy(calendarResult.weeks.map((w, i) => `${t.calendarWeekLabel} ${i+1}:\n${w.ideas.map(x => '- ' + x).join('\n')}`).join('\n\n'), 'calendar')}
                    className="text-xs font-semibold"
                    style={{ fontFamily: monoFont, color: copied === 'calendar' ? TEAL : AMBER_DEEP }}
                  >
                    {copied === 'calendar' ? t.copiedBtn : t.copyBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'competitor' && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: INK_SOFT }}>{t.competitorIntro}</p>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: INK_SOFT, fontFamily: bodyFont, letterSpacing: '0.02em', fontWeight: 600 }}>{t.competitorLabel}</label>
                <textarea
                  value={competitorText} onChange={(e) => setCompetitorText(e.target.value)}
                  placeholder={t.competitorPh} rows={3}
                  className="w-full rounded px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ width: "100%", boxSizing: "border-box", background: BG, border: `1px solid rgba(242,169,59,0.35)`, color: TEXT_LIGHT, transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onFocus={(e) => { e.target.style.borderColor = AMBER; e.target.style.boxShadow = '0 0 0 3px rgba(242,169,59,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {error && <p className="text-sm" style={{ color: '#C0472F' }}>{error}</p>}
              <button
                onClick={handleGenerateCompetitor} disabled={competitorLoading}
                className={`w-full font-semibold py-2.5 rounded text-sm ls-btn ${competitorLoading ? '' : 'ls-shimmer'}`}
                style={{ width: "100%", boxSizing: "border-box", background: competitorLoading ? LINE : `linear-gradient(135deg, ${AMBER}, ${AMBER_DEEP})`, color: competitorLoading ? INK_SOFT : TEXT_LIGHT, boxShadow: competitorLoading ? 'none' : `0 0 28px rgba(242,169,59,0.55)` }}
              >
                {competitorLoading ? t.generatingCompetitor : t.generateCompetitor}
              </button>

              {competitorResult && (
                <div className="space-y-3">
                  <div className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${TEAL}` }}>
                    <h3 style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.05em', color: TEAL, marginBottom: 8 }}>{t.competitorGapsHeading}</h3>
                    <ul className="space-y-1.5">
                      {competitorResult.gaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT_LIGHT }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: AMBER, marginTop: 7, flexShrink: 0 }} />
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded p-3" style={{ background: BG, borderLeft: `3px solid ${AMBER}` }}>
                    <h3 style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: '0.05em', color: AMBER_DEEP, marginBottom: 8 }}>{t.competitorAngleHeading}</h3>
                    <p className="text-sm mb-2" style={{ color: TEXT_LIGHT }}>{competitorResult.angle}</p>
                    <button onClick={() => handleCopy(competitorResult.angle, 'angle')} className="text-xs font-semibold"
                      style={{ fontFamily: monoFont, color: copied === 'angle' ? TEAL : AMBER_DEEP }}>
                      {copied === 'angle' ? t.copiedBtn : t.copyBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="30" stroke={AMBER} strokeWidth="1.2" opacity="0.45" />
            <g className="ls-globe-spin">
              <ellipse cx="36" cy="36" rx="30" ry="12" stroke={AMBER} strokeWidth="0.9" opacity="0.55" />
              <ellipse cx="36" cy="36" rx="14" ry="30" stroke={AMBER} strokeWidth="0.9" opacity="0.55" />
              <line x1="6" y1="36" x2="66" y2="36" stroke={AMBER} strokeWidth="0.9" opacity="0.55" />
              <line x1="36" y1="6" x2="36" y2="66" stroke={AMBER} strokeWidth="0.9" opacity="0.55" />
            </g>
            <circle cx="36" cy="36" r="2" fill={AMBER} opacity="0.7" />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontFamily: monoFont, fontSize: 10, color: INK_SOFT, letterSpacing: '0.04em' }}>
            POWERED BY CLAUDE &middot; PLAINWORK BY KSENIA
          </span>
        </div>
      </div>
    </div>
  );
}
