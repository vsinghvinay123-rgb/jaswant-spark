export interface CropInfo {
  nameEn: string;
  nameHi: string;
  waterNeeded: string;
  waterNeededHi: string;
  irrigations: string;
  irrigationsHi: string;
  schedule: string;
  scheduleHi: string;
  bestFor: string;
  bestForHi: string;
  waterPerAcre: number; // cubic meters per acre
  seedRatePerAcre: number; // kg per acre
  rainfallNeeded: string;
}

export const CROPS: CropInfo[] = [
  {
    nameEn: "Wheat (Gehun)",
    nameHi: "गेहूं",
    waterNeeded: "High",
    waterNeededHi: "अधिक",
    irrigations: "4-6 irrigations",
    irrigationsHi: "4-6 सिंचाई",
    schedule: "First irrigation after 21 days of sowing, then every 20-25 days",
    scheduleHi: "बुवाई के 21 दिन बाद पहली सिंचाई, फिर हर 20-25 दिन",
    bestFor: "North India - Punjab, Haryana, UP, MP",
    bestForHi: "उत्तर भारत - पंजाब, हरियाणा, यूपी, मध्य प्रदेश",
    waterPerAcre: 4000,
    seedRatePerAcre: 40,
    rainfallNeeded: "450-650 mm",
  },
  {
    nameEn: "Rice (Chawal)",
    nameHi: "चावल",
    waterNeeded: "Very High - 120-150 cm throughout season",
    waterNeededHi: "बहुत अधिक - पूरे मौसम में 120-150 सेमी",
    irrigations: "Continuous standing water required",
    irrigationsHi: "लगातार खड़े पानी की आवश्यकता",
    schedule: "Maintain 5-7 cm water level from transplanting to 2 weeks before harvest",
    scheduleHi: "रोपाई से कटाई के 2 सप्ताह पहले तक 5-7 सेमी पानी का स्तर बनाए रखें",
    bestFor: "West Bengal, Tamil Nadu, Andhra Pradesh, Punjab",
    bestForHi: "पश्चिम बंगाल, तमिलनाडु, आंध्र प्रदेश, पंजाब",
    waterPerAcre: 5000,
    seedRatePerAcre: 30,
    rainfallNeeded: "1000-2000 mm",
  },
  {
    nameEn: "Bajra (Pearl Millet)",
    nameHi: "बाजरा",
    waterNeeded: "Very Low",
    waterNeededHi: "बहुत कम",
    irrigations: "2-3 irrigations only",
    irrigationsHi: "केवल 2-3 सिंचाई",
    schedule: "Drought-resistant crop, perfect for arid regions. Water at flowering stage only if needed",
    scheduleHi: "सूखा-प्रतिरोधी फसल, शुष्क क्षेत्रों के लिए उत्तम। फूल आने पर ही पानी दें",
    bestFor: "Rajasthan, Gujarat, Maharashtra, Haryana",
    bestForHi: "राजस्थान, गुजरात, महाराष्ट्र, हरियाणा",
    waterPerAcre: 1000,
    seedRatePerAcre: 2,
    rainfallNeeded: "250-300 mm",
  },
  {
    nameEn: "Cotton (Kapaas)",
    nameHi: "कपास",
    waterNeeded: "Moderate",
    waterNeededHi: "मध्यम",
    irrigations: "6-8 irrigations, every 15-20 days",
    irrigationsHi: "6-8 सिंचाई, हर 15-20 दिन",
    schedule: "First irrigation at square formation, then every 15-20 days. Avoid waterlogging",
    scheduleHi: "स्क्वायर बनने पर पहली सिंचाई, फिर हर 15-20 दिन। जलभराव से बचें",
    bestFor: "Gujarat, Maharashtra, Telangana, Madhya Pradesh",
    bestForHi: "गुजरात, महाराष्ट्र, तेलंगाना, मध्य प्रदेश",
    waterPerAcre: 3000,
    seedRatePerAcre: 5,
    rainfallNeeded: "600-1000 mm",
  },
  {
    nameEn: "Sugarcane (Ganna)",
    nameHi: "गन्ना",
    waterNeeded: "High - 200-250 cm",
    waterNeededHi: "अधिक - 200-250 सेमी",
    irrigations: "25-30 irrigations",
    irrigationsHi: "25-30 सिंचाई",
    schedule: "Every 7-10 days in summer, 15-20 days in winter",
    scheduleHi: "गर्मियों में हर 7-10 दिन, सर्दियों में 15-20 दिन",
    bestFor: "UP, Maharashtra, Karnataka, Tamil Nadu",
    bestForHi: "यूपी, महाराष्ट्र, कर्नाटक, तमिलनाडु",
    waterPerAcre: 8000,
    seedRatePerAcre: 2500,
    rainfallNeeded: "1500-2500 mm",
  },
  {
    nameEn: "Guar (Cluster Bean)",
    nameHi: "ग्वार",
    waterNeeded: "Very Low",
    waterNeededHi: "बहुत कम",
    irrigations: "3-4 irrigations",
    irrigationsHi: "3-4 सिंचाई",
    schedule: "Drought resistant. Water only at flowering and pod filling stages",
    scheduleHi: "सूखा प्रतिरोधी। केवल फूल और फली भरने पर पानी दें",
    bestFor: "Rajasthan, Haryana, Gujarat",
    bestForHi: "राजस्थान, हरियाणा, गुजरात",
    waterPerAcre: 800,
    seedRatePerAcre: 6,
    rainfallNeeded: "300-500 mm",
  },
  {
    nameEn: "Sarson (Mustard)",
    nameHi: "सरसों",
    waterNeeded: "Low",
    waterNeededHi: "कम",
    irrigations: "2-3 irrigations",
    irrigationsHi: "2-3 सिंचाई",
    schedule: "First at pre-flowering (30-35 days), second at pod formation",
    scheduleHi: "पहली फूल आने से पहले (30-35 दिन), दूसरी फली बनने पर",
    bestFor: "Rajasthan, UP, Haryana, MP",
    bestForHi: "राजस्थान, यूपी, हरियाणा, मध्य प्रदेश",
    waterPerAcre: 1600,
    seedRatePerAcre: 2.5,
    rainfallNeeded: "250-400 mm",
  },
  {
    nameEn: "Maize (Makka)",
    nameHi: "मक्का",
    waterNeeded: "Moderate",
    waterNeededHi: "मध्यम",
    irrigations: "5-6 irrigations",
    irrigationsHi: "5-6 सिंचाई",
    schedule: "Critical at tasseling and silking stage. Every 10-15 days",
    scheduleHi: "टैसलिंग और सिल्किंग स्टेज पर ज़रूरी। हर 10-15 दिन",
    bestFor: "Karnataka, Bihar, UP, Rajasthan",
    bestForHi: "कर्नाटक, बिहार, यूपी, राजस्थान",
    waterPerAcre: 2500,
    seedRatePerAcre: 8,
    rainfallNeeded: "500-800 mm",
  },
];

// Agri-math engine: parse acres/bigha and crop from user input
const LAND_REGEX = /(\d+(?:\.\d+)?)\s*(acre|acres|bigha|hectare|hectares|hektar)/i;
const CROP_ALIASES: Record<string, string> = {
  bajra: "Bajra", pearl: "Bajra", millet: "Bajra",
  guar: "Guar", cluster: "Guar",
  sarson: "Sarson", mustard: "Sarson",
  gehun: "Wheat", wheat: "Wheat", gehu: "Wheat",
  chawal: "Rice", rice: "Rice", dhan: "Rice",
  cotton: "Cotton", kapaas: "Cotton", kapas: "Cotton",
  ganna: "Sugarcane", sugarcane: "Sugarcane",
  makka: "Maize", maize: "Maize", corn: "Maize",
  gwar: "Guar",
};

function findCropFromQuery(query: string): CropInfo | null {
  const lower = query.toLowerCase();
  for (const [alias, name] of Object.entries(CROP_ALIASES)) {
    if (lower.includes(alias)) {
      return CROPS.find(c => c.nameEn.startsWith(name)) || null;
    }
  }
  return null;
}

function parseLandArea(query: string): { acres: number; unit: string } | null {
  const match = query.match(LAND_REGEX);
  if (!match) return null;
  let acres = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "bigha") acres *= 0.625; // approx conversion
  if (unit === "hectare" || unit === "hectares" || unit === "hektar") acres *= 2.47;
  return { acres, unit: match[2] };
}

function getLangKey(lang: string): "en" | "hi" {
  return (lang === "hi" || lang === "marwadi") ? "hi" : "en";
}

function generateAgriCalc(query: string, lang: string): string | null {
  const lk = getLangKey(lang);
  const land = parseLandArea(query);
  const crop = findCropFromQuery(query);

  if (land && !crop) {
    const a = land.acres;
    const dryLand = a <= 10;
    const recCrops = dryLand
      ? CROPS.filter(c => ["Bajra", "Guar", "Sarson"].some(n => c.nameEn.startsWith(n)))
      : CROPS.filter(c => ["Wheat", "Rice", "Maize"].some(n => c.nameEn.startsWith(n)));

    const lines = recCrops.map((c, i) => {
      const water = Math.round(a * c.waterPerAcre);
      const seed = Math.round(a * c.seedRatePerAcre * 10) / 10;
      return lk === "en"
        ? `${i + 1}. **${c.nameEn}**: Water = ${water} m³ | Seed = ${seed} kg | ${c.irrigations}`
        : `${i + 1}. **${c.nameHi}**: पानी = ${water} m³ | बीज = ${seed} kg | ${c.irrigationsHi}`;
    });

    return lk === "en"
      ? `## 📊 ${land.acres.toFixed(1)} Acre Land Analysis\n\n${dryLand ? "**Region Type**: Dry/Semi-arid → Low water crops recommended\n\n" : ""}${lines.join("\n")}\n\n✅ **Calculation complete.**`
      : `## 📊 ${land.acres.toFixed(1)} एकड़ ज़मीन विश्लेषण\n\n${dryLand ? "**क्षेत्र प्रकार**: शुष्क → कम पानी वाली फसलें अनुशंसित\n\n" : ""}${lines.join("\n")}\n\n✅ **गणना पूर्ण।**`;
  }

  if (land && crop) {
    const a = land.acres;
    const water = Math.round(a * crop.waterPerAcre);
    const seed = Math.round(a * crop.seedRatePerAcre * 10) / 10;
    return lk === "en"
      ? `## 📊 ${crop.nameEn} — ${a.toFixed(1)} Acre Calculation\n\n- **Total Water**: ${water} cubic meters\n- **Irrigations**: ${crop.irrigations}\n- **Seed Required**: ${seed} kg\n- **Rainfall Needed**: ${crop.rainfallNeeded}\n- **Schedule**: ${crop.schedule}\n- **Best Regions**: ${crop.bestFor}\n\n✅ **Calculation complete.**`
      : `## 📊 ${crop.nameHi} — ${a.toFixed(1)} एकड़ गणना\n\n- **कुल पानी**: ${water} क्यूबिक मीटर\n- **सिंचाई**: ${crop.irrigationsHi}\n- **बीज आवश्यक**: ${seed} kg\n- **वर्षा आवश्यक**: ${crop.rainfallNeeded}\n- **अनुसूची**: ${crop.scheduleHi}\n- **उत्तम क्षेत्र**: ${crop.bestForHi}\n\n✅ **गणना पूर्ण।**`;
  }

  if (crop && !land) {
    return lk === "en"
      ? `## 🌾 ${crop.nameEn}\n\n| Detail | Info |\n|---|---|\n| **Water/Acre** | ${crop.waterPerAcre} m³ |\n| **Irrigations** | ${crop.irrigations} |\n| **Seed Rate/Acre** | ${crop.seedRatePerAcre} kg |\n| **Rainfall** | ${crop.rainfallNeeded} |\n| **Schedule** | ${crop.schedule} |\n| **Best Regions** | ${crop.bestFor} |\n\n💡 *Specify acres for exact calculation, e.g. "5 acre bajra"*`
      : `## 🌾 ${crop.nameHi}\n\n| विवरण | जानकारी |\n|---|---|\n| **पानी/एकड़** | ${crop.waterPerAcre} m³ |\n| **सिंचाई** | ${crop.irrigationsHi} |\n| **बीज दर/एकड़** | ${crop.seedRatePerAcre} kg |\n| **वर्षा** | ${crop.rainfallNeeded} |\n| **अनुसूची** | ${crop.scheduleHi} |\n| **उत्तम क्षेत्र** | ${crop.bestForHi} |\n\n💡 *सटीक गणना के लिए एकड़ बताएं, जैसे "5 acre बाजरा"*`;
  }

  return null;
}

// ============= GK DATABASE =============

interface GKEntry {
  keywords: string[];
  answerEn: string;
  answerHi: string;
}

const GK_DATABASE: GKEntry[] = [
  { keywords: ["isro full form"], answerEn: "ISRO = Indian Space Research Organisation, founded 1969 by Dr. Vikram Sarabhai.", answerHi: "ISRO = भारतीय अंतरिक्ष अनुसंधान संगठन, 1969 में डॉ. विक्रम साराभाई द्वारा स्थापित।" },
  { keywords: ["first pm", "first prime minister", "pehle pradhanmantri"], answerEn: "Jawaharlal Nehru — India's first Prime Minister (1947-1964).", answerHi: "जवाहरलाल नेहरू — भारत के पहले प्रधानमंत्री (1947-1964)।" },
  { keywords: ["first president", "pehle rashtrapati"], answerEn: "Dr. Rajendra Prasad — India's first President (1950-1962).", answerHi: "डॉ. राजेंद्र प्रसाद — भारत के पहले राष्ट्रपति (1950-1962)।" },
  { keywords: ["capital of india", "bharat ki rajdhani"], answerEn: "New Delhi is the capital of India.", answerHi: "नई दिल्ली भारत की राजधानी है।" },
  { keywords: ["national animal", "rashtriya pashu"], answerEn: "Bengal Tiger (Panthera tigris tigris) is India's national animal.", answerHi: "बंगाल टाइगर भारत का राष्ट्रीय पशु है।" },
  { keywords: ["national bird", "rashtriya pakshi"], answerEn: "Indian Peacock (Pavo cristatus) is India's national bird.", answerHi: "भारतीय मोर भारत का राष्ट्रीय पक्षी है।" },
  { keywords: ["national flower", "rashtriya phool"], answerEn: "Lotus (Nelumbo nucifera) is India's national flower.", answerHi: "कमल भारत का राष्ट्रीय फूल है।" },
  { keywords: ["national anthem", "rashtriya gaan"], answerEn: "Jana Gana Mana — written by Rabindranath Tagore, adopted 24 Jan 1950.", answerHi: "जन गण मन — रवीन्द्रनाथ टैगोर द्वारा लिखित, 24 जनवरी 1950 को अपनाया गया।" },
  { keywords: ["national song", "rashtriya geet"], answerEn: "Vande Mataram — written by Bankim Chandra Chattopadhyay.", answerHi: "वन्दे मातरम् — बंकिम चन्द्र चट्टोपाध्याय द्वारा लिखित।" },
  { keywords: ["chandrayaan", "moon mission"], answerEn: "Chandrayaan-3 (2023): India became the 4th country to land on the Moon and 1st at the South Pole.", answerHi: "चंद्रयान-3 (2023): भारत चंद्रमा पर उतरने वाला चौथा देश और दक्षिणी ध्रुव पर पहला।" },
  { keywords: ["mangalyaan", "mars mission", "mars orbiter"], answerEn: "Mangalyaan (2014): India's Mars Orbiter Mission — cheapest Mars mission ever at ₹450 crore.", answerHi: "मंगलयान (2014): भारत का मंगल ऑर्बिटर मिशन — सबसे सस्ता मंगल मिशन, ₹450 करोड़।" },
  { keywords: ["aditya", "solar mission", "sun mission"], answerEn: "Aditya-L1: India's first solar observation mission, launched 2023.", answerHi: "आदित्य-L1: भारत का पहला सौर अवलोकन मिशन, 2023 में लॉन्च।" },
  { keywords: ["constitution", "samvidhan", "fundamental rights"], answerEn: "Indian Constitution: Longest written constitution. 448 articles, 12 schedules. Drafted by Dr. B.R. Ambedkar. Adopted 26 Nov 1949, effective 26 Jan 1950.", answerHi: "भारतीय संविधान: सबसे लंबा लिखित संविधान। 448 अनुच्छेद, 12 अनुसूचियां। डॉ. बी.आर. अम्बेडकर द्वारा बनाया। 26 नवंबर 1949 को अपनाया, 26 जनवरी 1950 से लागू।" },
  { keywords: ["republic day", "gantantra diwas"], answerEn: "Republic Day: 26 January — celebrates adoption of the Constitution in 1950.", answerHi: "गणतंत्र दिवस: 26 जनवरी — 1950 में संविधान अपनाने का उत्सव।" },
  { keywords: ["independence day", "swatantrata diwas", "15 august"], answerEn: "Independence Day: 15 August 1947 — India gained freedom from British rule.", answerHi: "स्वतंत्रता दिवस: 15 अगस्त 1947 — भारत को ब्रिटिश शासन से आज़ादी मिली।" },
  { keywords: ["gandhi", "mahatma", "bapu"], answerEn: "Mahatma Gandhi (1869-1948): Father of the Nation. Led freedom movement through non-violence (Ahimsa) and Satyagraha.", answerHi: "महात्मा गांधी (1869-1948): राष्ट्रपिता। अहिंसा और सत्याग्रह से स्वतंत्रता आंदोलन का नेतृत्व किया।" },
  { keywords: ["bhagat singh", "shaheed"], answerEn: "Bhagat Singh (1907-1931): Revolutionary freedom fighter, hanged at 23. 'Inquilab Zindabad!'", answerHi: "भगत सिंह (1907-1931): क्रांतिकारी स्वतंत्रता सेनानी, 23 की उम्र में शहीद। 'इंक़लाब ज़िंदाबाद!'" },
  { keywords: ["bose", "subhash", "netaji", "ina", "azad hind"], answerEn: "Subhas Chandra Bose (1897-1945): Founded INA. Famous slogan: 'Tum mujhe khoon do, main tumhe azaadi dunga!'", answerHi: "सुभाष चंद्र बोस (1897-1945): INA के संस्थापक। प्रसिद्ध नारा: 'तुम मुझे खून दो, मैं तुम्हें आज़ादी दूंगा!'" },
  { keywords: ["ambedkar", "samvidhan nirmaata", "constitution maker"], answerEn: "Dr. B.R. Ambedkar (1891-1956): Architect of Indian Constitution, champion of Dalit rights and social justice.", answerHi: "डॉ. बी.आर. अम्बेडकर (1891-1956): भारतीय संविधान के निर्माता, दलित अधिकारों और सामाजिक न्याय के चैंपियन।" },
  { keywords: ["kalam", "missile man", "apj"], answerEn: "Dr. APJ Abdul Kalam (1931-2015): Missile Man of India, 11th President. Key role in Pokhran-II nuclear tests and DRDO/ISRO projects.", answerHi: "डॉ. एपीजे अब्दुल कलाम (1931-2015): भारत के मिसाइल मैन, 11वें राष्ट्रपति। पोखरण-II और DRDO/ISRO परियोजनाओं में मुख्य भूमिका।" },
  { keywords: ["taj mahal"], answerEn: "Taj Mahal: Built by Shah Jahan (1632-1653) in Agra for Mumtaz Mahal. UNESCO World Heritage Site, one of 7 Wonders of the World.", answerHi: "ताजमहल: शाहजहां द्वारा (1632-1653) आगरा में मुमताज़ महल के लिए बनवाया गया। UNESCO विश्व धरोहर, 7 अजूबों में से एक।" },
  { keywords: ["indus valley", "sindhu ghati", "harappa", "mohenjo"], answerEn: "Indus Valley Civilization (3300-1300 BCE): One of world's oldest civilizations. Harappa & Mohenjo-daro had advanced drainage, grid cities.", answerHi: "सिंधु घाटी सभ्यता (3300-1300 ईसा पूर्व): दुनिया की सबसे पुरानी सभ्यताओं में से एक। हड़प्पा और मोहनजोदड़ो में उन्नत जल निकासी।" },
  { keywords: ["vedas", "ved", "vedic"], answerEn: "Vedas: 4 sacred texts — Rigveda, Samaveda, Yajurveda, Atharvaveda. World's oldest scriptures (~1500 BCE).", answerHi: "वेद: 4 पवित्र ग्रंथ — ऋग्वेद, सामवेद, यजुर्वेद, अथर्ववेद। विश्व के सबसे प्राचीन ग्रंथ (~1500 ईसा पूर्व)।" },
  { keywords: ["ashoka", "maurya"], answerEn: "Emperor Ashoka (304-232 BCE): Maurya dynasty. After Kalinga war, embraced Buddhism and non-violence. Ashoka Chakra on Indian flag.", answerHi: "सम्राट अशोक (304-232 ईसा पूर्व): मौर्य वंश। कलिंग युद्ध के बाद बौद्ध धर्म और अहिंसा अपनाई। भारतीय ध्वज पर अशोक चक्र।" },
  { keywords: ["mughal", "mugal", "babur", "akbar", "aurangzeb"], answerEn: "Mughal Empire (1526-1857): Founded by Babur. Akbar known for religious tolerance. Built Taj Mahal, Red Fort, Fatehpur Sikri.", answerHi: "मुगल साम्राज्य (1526-1857): बाबर द्वारा स्थापित। अकबर धार्मिक सहिष्णुता के लिए प्रसिद्ध। ताजमहल, लाल किला, फतेहपुर सीकरी का निर्माण।" },
  { keywords: ["population", "jansankhya", "abadi"], answerEn: "India's population: ~1.44 billion (2024), world's most populous country.", answerHi: "भारत की जनसंख्या: ~1.44 अरब (2024), दुनिया का सबसे अधिक जनसंख्या वाला देश।" },
  { keywords: ["states", "rajya", "how many states"], answerEn: "India has 28 states and 8 Union Territories.", answerHi: "भारत में 28 राज्य और 8 केंद्र शासित प्रदेश हैं।" },
  { keywords: ["longest river", "sabse lambi nadi", "ganga"], answerEn: "Ganga: India's longest river (~2525 km). Sacred river, originates from Gangotri glacier.", answerHi: "गंगा: भारत की सबसे लंबी नदी (~2525 किमी)। पवित्र नदी, गंगोत्री ग्लेशियर से निकलती है।" },
  { keywords: ["highest peak", "sabse unchi", "kanchenjunga", "k2"], answerEn: "Kangchenjunga (8,586 m): India's highest peak and world's 3rd highest.", answerHi: "कंचनजंगा (8,586 मी): भारत की सबसे ऊंची चोटी और दुनिया की तीसरी सबसे ऊंची।" },
  { keywords: ["currency", "rupee", "rupaya", "mudra"], answerEn: "Indian Rupee (₹/INR): Official currency. 1 Rupee = 100 Paise. Symbol designed by D. Udaya Kumar.", answerHi: "भारतीय रुपया (₹/INR): आधिकारिक मुद्रा। 1 रुपया = 100 पैसे। प्रतीक डी. उदय कुमार द्वारा डिज़ाइन।" },
  { keywords: ["aryabhata", "aryabhatt", "zero", "shunya"], answerEn: "Aryabhata (476 CE): Ancient Indian mathematician. India gave the world the concept of Zero (Shunya).", answerHi: "आर्यभट्ट (476 ई.): प्राचीन भारतीय गणितज्ञ। भारत ने दुनिया को शून्य (Zero) की अवधारणा दी।" },
  { keywords: ["ramanujan", "mathematician"], answerEn: "Srinivasa Ramanujan (1887-1920): Mathematical genius. Made 3,900+ results. Infinite series and number theory.", answerHi: "श्रीनिवास रामानुजन (1887-1920): गणितीय प्रतिभा। 3,900+ परिणाम। अनंत श्रृंखला और संख्या सिद्धांत।" },
  { keywords: ["cv raman", "raman effect"], answerEn: "C.V. Raman: Nobel Prize 1930 for Raman Effect (light scattering). National Science Day: 28 Feb.", answerHi: "सी.वी. रमन: 1930 में रमन प्रभाव (प्रकाश प्रकीर्णन) के लिए नोबेल पुरस्कार। राष्ट्रीय विज्ञान दिवस: 28 फ़रवरी।" },
  { keywords: ["pokhran", "nuclear", "atom bomb", "parmanu"], answerEn: "Pokhran-I (1974): India's first nuclear test ('Smiling Buddha'). Pokhran-II (1998): 5 nuclear tests under PM Vajpayee.", answerHi: "पोखरण-I (1974): भारत का पहला परमाणु परीक्षण ('स्माइलिंग बुद्धा')। पोखरण-II (1998): PM वाजपेयी के तहत 5 परमाणु परीक्षण।" },
  { keywords: ["iit", "indian institute of technology"], answerEn: "IITs: India's premier engineering institutes. First IIT: Kharagpur (1951). Total 23 IITs across India.", answerHi: "IITs: भारत के प्रमुख इंजीनियरिंग संस्थान। पहला IIT: खड़गपुर (1951)। कुल 23 IIT पूरे भारत में।" },
  { keywords: ["olympics", "olympic medal", "neeraj"], answerEn: "Neeraj Chopra: Gold in Javelin at Tokyo 2020 Olympics — India's first Olympic track & field gold!", answerHi: "नीरज चोपड़ा: टोक्यो 2020 ओलंपिक में जैवलिन में स्वर्ण — भारत का पहला ट्रैक एंड फील्ड ओलंपिक गोल्ड!" },
  { keywords: ["cricket", "world cup", "icc"], answerEn: "India won Cricket World Cup in 1983 (Kapil Dev) and 2011 (MS Dhoni). T20 WC: 2007, 2024.", answerHi: "भारत ने 1983 (कपिल देव) और 2011 (एमएस धोनी) में क्रिकेट विश्व कप जीता। T20 WC: 2007, 2024।" },
  { keywords: ["yoga", "yog"], answerEn: "Yoga: 5000-year-old Indian practice. International Yoga Day: 21 June (since 2015, proposed by PM Modi at UN).", answerHi: "योग: 5000 साल पुरानी भारतीय पद्धति। अंतर्राष्ट्रीय योग दिवस: 21 जून (2015 से, PM मोदी ने UN में प्रस्तावित)।" },
  { keywords: ["railway", "rail", "train", "indian railways"], answerEn: "Indian Railways: 4th largest railway network. 68,000+ km track. First train: Mumbai to Thane, 16 April 1853.", answerHi: "भारतीय रेलवे: चौथा सबसे बड़ा रेल नेटवर्क। 68,000+ किमी ट्रैक। पहली ट्रेन: मुंबई से ठाणे, 16 अप्रैल 1853।" },
  { keywords: ["upi", "digital payment", "bhim"], answerEn: "UPI (Unified Payments Interface): India's digital payment revolution. 10+ billion transactions/month. BHIM app by NPCI.", answerHi: "UPI: भारत की डिजिटल भुगतान क्रांति। 10+ अरब लेन-देन/महीना। NPCI द्वारा BHIM ऐप।" },
  { keywords: ["tricolor", "tiranga", "flag", "jhanda"], answerEn: "Indian Flag (Tiranga): Saffron (courage), White (peace, truth), Green (prosperity). Ashoka Chakra has 24 spokes.", answerHi: "भारतीय ध्वज (तिरंगा): केसरी (साहस), सफ़ेद (शांति, सत्य), हरा (समृद्धि)। अशोक चक्र में 24 तीलियां।" },
  { keywords: ["drdo", "defence research"], answerEn: "DRDO: Defence Research and Development Organisation. HQ: Delhi. Develops missiles (Agni, Prithvi, BrahMos), tanks (Arjun), aircraft (Tejas).", answerHi: "DRDO: रक्षा अनुसंधान और विकास संगठन। मुख्यालय: दिल्ली। मिसाइल (अग्नि, पृथ्वी, ब्रह्मोस), टैंक (अर्जुन), विमान (तेजस) विकसित करता है।" },
  { keywords: ["pslv", "gslv", "rocket", "launch vehicle"], answerEn: "PSLV: India's workhorse rocket, 50+ successful launches. GSLV: Heavy-lift for geosynchronous satellites. LVM3 for Chandrayaan-3.", answerHi: "PSLV: भारत का प्रमुख रॉकेट, 50+ सफल लॉन्च। GSLV: भारी उपग्रहों के लिए। LVM3 चंद्रयान-3 के लिए।" },
  { keywords: ["navic", "gps india", "navigation satellite"], answerEn: "NavIC (IRNSS): India's own GPS navigation system. 7 satellites. Accuracy within 20 meters over India.", answerHi: "NavIC (IRNSS): भारत का अपना GPS नेविगेशन सिस्टम। 7 उपग्रह। भारत पर 20 मीटर तक सटीकता।" },
  { keywords: ["gaganyaan", "manned mission", "space man"], answerEn: "Gaganyaan: India's first manned space mission (ISRO). Will send 3 astronauts (Vyomanauts) to Low Earth Orbit.", answerHi: "गगनयान: भारत का पहला मानव अंतरिक्ष मिशन (ISRO)। 3 अंतरिक्ष यात्रियों (व्योमनॉट) को पृथ्वी की निचली कक्षा में भेजेगा।" },
  { keywords: ["tata", "ratan tata"], answerEn: "Ratan Tata (1937-2024): Chairman of Tata Group. Launched Tata Nano, acquired Jaguar Land Rover. Philanthropist and Bharat Ratna nominee.", answerHi: "रतन टाटा (1937-2024): टाटा ग्रुप के अध्यक्ष। टाटा नैनो लॉन्च किया, जगुआर लैंड रोवर का अधिग्रहण। परोपकारी और भारत रत्न नामांकित।" },
  { keywords: ["sachin", "tendulkar", "cricket god"], answerEn: "Sachin Tendulkar: God of Cricket. 100 international centuries. Bharat Ratna (2014). Played 24 years for India.", answerHi: "सचिन तेंदुलकर: क्रिकेट के भगवान। 100 अंतर्राष्ट्रीय शतक। भारत रत्न (2014)। 24 साल भारत के लिए खेले।" },
  { keywords: ["chandra shekhar", "azad"], answerEn: "Chandra Shekhar Azad (1906-1931): Revolutionary who vowed never to be captured alive. Died fighting British in Allahabad.", answerHi: "चंद्रशेखर आज़ाद (1906-1931): क्रांतिकारी जिन्होंने कभी ज़िंदा न पकड़े जाने की कसम खाई। इलाहाबाद में अंग्रेज़ों से लड़ते हुए शहीद।" },
  { keywords: ["sarojini naidu", "nightingale"], answerEn: "Sarojini Naidu (1879-1949): 'Nightingale of India'. First woman Governor of India (UP). Poet and freedom fighter.", answerHi: "सरोजिनी नायडू (1879-1949): 'भारत की कोकिला'। भारत की पहली महिला गवर्नर (यूपी)। कवयित्री और स्वतंत्रता सेनानी।" },
  { keywords: ["vikram sarabhai", "space father"], answerEn: "Dr. Vikram Sarabhai (1919-1971): Father of Indian Space Programme. Founded ISRO and IIM Ahmedabad.", answerHi: "डॉ. विक्रम साराभाई (1919-1971): भारतीय अंतरिक्ष कार्यक्रम के जनक। ISRO और IIM अहमदाबाद की स्थापना।" },
  { keywords: ["green revolution", "hari kranti", "swaminathan", "norman borlaug"], answerEn: "Green Revolution (1960s-70s): M.S. Swaminathan made India food self-sufficient. Wheat & rice yields multiplied in Punjab, Haryana.", answerHi: "हरित क्रांति (1960-70 के दशक): एम.एस. स्वामीनाथन ने भारत को खाद्य आत्मनिर्भर बनाया। पंजाब, हरियाणा में गेहूं और चावल उत्पादन कई गुना बढ़ा।" },
  { keywords: ["white revolution", "shwet kranti", "kurien", "amul"], answerEn: "White Revolution (Operation Flood): Dr. Verghese Kurien made India world's largest milk producer. Founded Amul.", answerHi: "श्वेत क्रांति (ऑपरेशन फ्लड): डॉ. वर्गीस कुरियन ने भारत को दुनिया का सबसे बड़ा दूध उत्पादक बनाया। अमूल की स्थापना।" },
];

// ============= MAIN KNOWLEDGE SEARCH =============

interface KnowledgeEntry {
  keywords: string[];
  responseEn: string;
  responseHi: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ["who made you", "who created you", "who is your owner", "kisne banaya", "creator", "tumhe kisne", "who are you", "kaun ho tum", "tum kaun ho"],
    responseEn: "I am **Bharat AI**, created by the innovator **Jaswant**. 🇮🇳\n\nCapabilities:\n- 🌾 Agri-Math Engine (crop + land calculations)\n- 📡 60+ GK facts (ISRO, History, Constitution)\n- 💻 Coding basics (Hinglish)\n- 📷 Fasal Doctor (crop scanning)\n- 📍 Auto-Location detection",
    responseHi: "मैं **भारत AI** हूँ, नवप्रवर्तक **जसवंत** द्वारा निर्मित। 🇮🇳\n\nक्षमताएं:\n- 🌾 एग्री-मैथ इंजन (फसल + ज़मीन गणना)\n- 📡 60+ GK तथ्य (ISRO, इतिहास, संविधान)\n- 💻 कोडिंग बेसिक्स (हिंग्लिश)\n- 📷 फसल डॉक्टर (फसल स्कैनिंग)\n- 📍 ऑटो-लोकेशन डिटेक्शन",
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "namaskar", "kaise ho"],
    responseEn: "Namaste! 🙏 I'm **Bharat AI** by **Jaswant**. Ask me anything — farming calculations, GK, coding, or use the tools below. Direct answers only.",
    responseHi: "नमस्ते! 🙏 मैं **भारत AI** हूँ, **जसवंत** द्वारा। कुछ भी पूछें — खेती गणना, GK, कोडिंग, या नीचे के टूल्स इस्तेमाल करें। सीधे जवाब।",
  },
  {
    keywords: ["coding", "code", "programming", "html", "css", "javascript", "js", "python", "react"],
    responseEn: `## Coding Basics — Hinglish Style 💻

### HTML (Structure)
\`\`\`html
<h1>Namaste Bharat!</h1>
<p>Yeh paragraph hai.</p>
\`\`\`

### CSS (Styling)
\`\`\`css
h1 { color: #FF9933; font-size: 24px; }
\`\`\`

### JavaScript (Logic)
\`\`\`javascript
let naam = prompt("Aapka naam?");
alert("Namaste, " + naam + "!");
\`\`\`

**Path**: HTML → CSS → JS → React. Step by step.`,
    responseHi: `## कोडिंग बेसिक्स — हिंग्लिश स्टाइल 💻

### HTML (ढांचा)
\`\`\`html
<h1>नमस्ते भारत!</h1>
<p>यह पैराग्राफ है।</p>
\`\`\`

### CSS (स्टाइलिंग)
\`\`\`css
h1 { color: #FF9933; font-size: 24px; }
\`\`\`

### JavaScript (लॉजिक)
\`\`\`javascript
let naam = prompt("आपका नाम?");
alert("नमस्ते, " + naam + "!");
\`\`\`

**पथ**: HTML → CSS → JS → React। कदम-दर-कदम।`,
  },
];

export function searchKnowledge(query: string, lang: string, profileLandSize?: string): string {
  const lk = getLangKey(lang);
  const lower = query.toLowerCase().trim();

  // If profile has land size and user asks general crop question without specifying area
  let q = query;
  if (profileLandSize && !parseLandArea(query) && findCropFromQuery(query)) {
    q = `${profileLandSize} ${query}`;
  }

  // 1. Try agri-math calculations first
  const agriResult = generateAgriCalc(q, lang);
  if (agriResult) return agriResult;

  // 2. Try GK database
  for (const gk of GK_DATABASE) {
    if (gk.keywords.some(k => lower.includes(k))) {
      return lk === "en" ? gk.answerEn : gk.answerHi;
    }
  }

  // 3. Crop-related generic queries
  const cropKeywords = ["crop", "fasal", "kheti", "farming", "kisan", "agriculture", "sinchai", "irrigation", "water", "pani"];
  if (cropKeywords.some(k => lower.includes(k))) {
    const allCrops = CROPS.map(c => lk === "en"
      ? `- **${c.nameEn}**: ${c.irrigations} | ${c.waterPerAcre} m³/acre | Seed: ${c.seedRatePerAcre} kg/acre`
      : `- **${c.nameHi}**: ${c.irrigationsHi} | ${c.waterPerAcre} m³/एकड़ | बीज: ${c.seedRatePerAcre} kg/एकड़`
    ).join("\n");
    return lk === "en"
      ? `## 🌾 All Crops — Quick Reference\n\n${allCrops}\n\n💡 *Type "5 acre bajra" for exact calculation.*`
      : `## 🌾 सभी फसलें — त्वरित संदर्भ\n\n${allCrops}\n\n💡 *"5 acre बाजरा" टाइप करें सटीक गणना के लिए।*`;
  }

  // 4. General knowledge base
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(k => lower.includes(k))) {
      const response = lk === "en" ? entry.responseEn : entry.responseHi;
      if (response) return response;
    }
  }

  // 5. Hinglish / Marwadi fallback personality
  if (lang === "hinglish") {
    return "Abhi yeh mujhe nahi aata, par **Jaswant** jaldi update karega! 🙏\n\nTry karo: 🌾 \"5 acre bajra\" | 📡 \"Chandrayaan\" | 💻 \"coding\" | 🇮🇳 \"Gandhi\"";
  }
  if (lang === "marwadi") {
    return "अभी यो मनै नीं आवै, पण **जसवंत** जल्दी ही बतावैला! 🙏\n\nट्राई करो: 🌾 \"5 acre बाजरा\" | 📡 \"चंद्रयान\" | 💻 \"कोडिंग\" | 🇮🇳 \"गांधी\"";
  }

  return lk === "en"
    ? "Main abhi seekh raha hoon, par **Jaswant** mujhe jaldi hi iski jaankari dega! 🙏\n\nTry: 🌾 \"5 acre bajra\" | 📡 \"Chandrayaan\" | 💻 \"coding\" | 🇮🇳 \"Gandhi\""
    : "मैं अभी सीख रहा हूँ, पर **जसवंत** मुझे जल्दी ही इसकी जानकारी देगा! 🙏\n\nट्राई करें: 🌾 \"5 acre बाजरा\" | 📡 \"चंद्रयान\" | 💻 \"कोडिंग\" | 🇮🇳 \"गांधी\"";
}
