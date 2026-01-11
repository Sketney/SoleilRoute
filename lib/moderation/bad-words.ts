const badWords = {
  en: [
    "fuck",
    "shit",
    "bitch",
    "bastard",
    "asshole",
    "dick",
    "pussy",
    "cunt",
    "motherfucker",
    "nigger",
    "faggot",
  ],
  ru: [
    "\u0431\u043b\u044f\u0434\u044c",
    "\u0431\u043b\u044f\u0442\u044c",
    "\u0431\u043b\u044f",
    "\u0431\u043b\u044f\u0434\u0438\u043d\u0430",
    "\u0431\u043b\u044f\u0434\u0438\u043d\u0441\u043a\u0438\u0439",
    "\u0435\u0431\u0430\u0442\u044c",
    "\u0435\u0431\u0430\u043d\u044b\u0439",
    "\u0435\u0431\u043b\u0430\u043d",
    "\u0435\u0431\u0443\u0442\u044c",
    "\u0435\u0431\u0443\u0447\u0438\u0439",
    "\u0445\u0443\u0439",
    "\u0445\u0443\u044f",
    "\u0445\u0443\u0435\u0432\u044b\u0439",
    "\u043f\u0438\u0437\u0434\u0430",
    "\u043f\u0438\u0437\u0434\u0435\u0446",
    "\u043f\u0438\u0437\u0434\u0435\u0442\u044c",
    "\u0433\u043e\u0432\u043d\u043e",
    "\u0441\u0443\u043a\u0430",
    "\u043c\u0443\u0434\u0430\u043a",
  ],
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0430-\u044f\u0451\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsProhibitedLanguage(text: string) {
  const normalized = normalize(text);
  if (!normalized) {
    return false;
  }
  const all = [...badWords.en, ...badWords.ru];
  return all.some((word) => normalized.includes(word));
}

export function getBadWordsPreview(limit = 6) {
  return [...badWords.en, ...badWords.ru].slice(0, limit);
}

