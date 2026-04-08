import { UI_TEXT, type Lang } from "./i18n";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// Legacy format: keywords[] + answer (single Hinglish string)
interface LegacyEntry {
  keywords: string[];
  answer: string;
}

// New format: pattern (regex) + answers per language with Hinglish fallback
interface MultiLangEntry {
  pattern: RegExp;
  answers: { [key: string]: string };
}

type KBEntry = LegacyEntry | MultiLangEntry;

function isMultiLang(entry: KBEntry): entry is MultiLangEntry {
  return "pattern" in entry && "answers" in entry;
}

const kisanTechGK: KBEntry[] = [
  // Identity & Creator
  { keywords: ["creator", "made", "owner", "kisne banaya", "malik", "who are you", "who made", "who created"], answer: "Mujhe Rajasthan ke visionary Tech Founder, **Jaswant** ne banaya hai. Main SIH ke liye banaya gaya **Bharat AI** hoon." },

  // Kisan GK - Crops & Water
  { keywords: ["bajra", "millet", "pani bajra", "water for bajra"], answer: "**Bajra (Pearl Millet):** Rajasthan ki best fasal. Ise sirf 250-300 mm barish aur 1-2 sinchai (irrigation) chahiye. Beej: 4-5 kg/hectare." },
  { keywords: ["gehun", "wheat", "pani gehun"], answer: "**Gehun (Wheat):** Ise 4-6 baar pani dena padta hai. Pehla pani bone ke 21 din baad (CRI stage) par dena sabse zaroori hai." },
  { keywords: ["sarson", "mustard", "oil"], answer: "**Sarson (Mustard):** Yeh sardiyon ki fasal hai. Ise 2-3 sinchai chahiye. Rajasthan ki mitti iske liye behtareen hai." },
  { keywords: ["guar", "cluster bean", "dry"], answer: "**Guar:** Sukhe (dry) ilako ke liye best hai. Ise bahut kam pani chahiye aur yeh mitti ki urvarak shamta (fertility) badhata hai." },
  { keywords: ["cotton", "kapas", "narma", "kapaas"], answer: "**Kapas (Cotton):** Kali mitti iske liye best hoti hai. Ise 15-20 din ke antar par pani chahiye." },
  { keywords: ["chawal", "rice", "dhaan"], answer: "**Chawal (Rice):** Sabse zyada pani chahiye — lagbhag 120-150 cm poori season mein. Zyada baarish wale ilaakon ke liye best hai." },
  { keywords: ["urea", "khad", "fertilizer", "nitrogen"], answer: "**Urea** sabse zyada use hone wali khad hai. Isme 46% Nitrogen hota hai jo fasal ki growth ke liye zaroori hai. Ise pani dene ke baad daalna chahiye." },

  // Technical GK
  { keywords: ["html", "full form html"], answer: "**HTML** ka full form 'HyperText Markup Language' hai. Yeh kisi bhi website ka dhancha (skeleton) banati hai." },
  { keywords: ["css", "design"], answer: "**CSS** (Cascading Style Sheets) website ko sundar banane aur design karne ke kaam aati hai." },
  { keywords: ["javascript", "js", "brain", "coding", "code"], answer: "**JavaScript** ek programming language hai jo website mein dimaag aur logic dalti hai, bilkul mere dimaag ki tarah!" },
  { keywords: ["ai", "artificial intelligence"], answer: "**AI** (Artificial Intelligence) ka matlab hai computer ko insaan ki tarah sochne aur samajhne ke kabil banana." },
  { keywords: ["isro", "space"], answer: "**ISRO** (Indian Space Research Organisation) Bharat ki space agency hai, jisne Chandrayaan aur Mangalyaan jaise mahan missions kiye hain." },
  { keywords: ["chandrayaan", "moon"], answer: "**Chandrayaan-3** ISRO ka mission tha jo 23 August 2023 ko Moon ke South Pole par land hua. India yeh karne wala pehla desh bana!" },

  // Greetings
  { keywords: ["hi", "hello", "hey", "namaste", "ram ram", "kaise ho"], answer: "Namaste! Main **Jaswant** dwara banaya gaya **Bharat Krishi & Tech AI** hoon. Boliye, fasal ya tech ke baare mein kya janna hai?" },

  // --- Batch 13: Advanced Crop Protection & Soil Science ---
  { keywords: ["safed llat", "white grub", "root borer"], answer: "🐛 **Safed Llat (White Grub):** Yeh moongfali aur bajre ki jado (roots) ka sabse bada dushman hai. Garmiyon mein khet ki gehri jutai karein taaki keede dhoop se mar jayein. Buvai ke waqt Chlorpyrifos ka use karein." },
  { keywords: ["top dressing", "urea kab", "dusra pani"], answer: "🧪 **Urea Top Dressing:** Urea khad hamesha khet mein pani dene ke baad hi chhidakna chahiye (ise Top Dressing kehte hain). Sookhe mein dalne se Nitrogen hawa mein ud jata hai aur fasal ko nahi milta." },
  { keywords: ["cultivator", "tiller", "harrow"], answer: "🚜 **Tractor Implements:** Cultivator mitti ko kholne aur kharpatwar (weeds) nikalne ke kaam aata hai. Jabki Harrow ka use bhari mitti ke dhele (clods) todne aur khet ko samtal karne ke liye hota hai." },
  { keywords: ["thrips", "churda murda", "patti mudna"], answer: "🍂 **Churda-Murda Rog (Thrips):** Mirchi aur tamatar ki pattiyan agar upar ki taraf mud rahi hain, toh yeh Thrips keede ka attack hai. Ise rokne ke liye Imidacloprid ya Spinosad dawa ka spray karein." },
  { keywords: ["phool aate samay", "flowering stage", "boron"], answer: "🌸 **Boron Ka Jaadoo:** Fasal mein phool aate samay 'Boron' (ek micro-nutrient) ka spray karne se phool jhadte nahi hain aur fal ka aakar (size) bada aur chamakdar banta hai." },

  // --- Batch 14 ---
  { keywords: ["python", "best language", "easy coding"], answer: "🐍 **Python Programming:** Duniya ki sabse aasan aur powerful language! AI aur Machine Learning (jaise ChatGPT aur Gemini) ka maximum code Python mein hi likha jata hai." },
  { keywords: ["sql", "database", "mysql", "data store"], answer: "🗄️ **SQL Database:** SQL (Structured Query Language) ek language hai jo databases (jaise user accounts, passwords) ko table format mein save aur manage karne ke kaam aati hai." },
  { keywords: ["open source", "free code", "linux"], answer: "🌍 **Open Source:** Open Source ka matlab hai aisa software jiska code puri duniya ke liye free mein available ho. Jaise Linux operating system aur Android! Aap apne GitHub project ko bhi open-source bana sakte hain." },
  { keywords: ["debugging", "bug", "error", "code nahi chal raha"], answer: "🐞 **Debugging:** Code mein aane wali galti ko 'Bug' kehte hain, aur use dhoondh kar theek karne ko 'Debugging'. JavaScript mein `console.log()` ek developer ka sabse bada hathiyar hota hai!" },
  { keywords: ["ui ux", "user interface"], answer: "🎨 **UI vs UX:** UI (User Interface) ka matlab hai app kaisa dikhta hai (colors, buttons). UX (User Experience) ka matlab hai app chalane mein kisan ke liye kitni aasan aur smooth hai." },

  // --- Batch 15 ---
  { keywords: ["nda", "army", "defense"], answer: "🎖️ **NDA Exam:** Agar aap desh ki sewa ke liye Army, Navy, ya Airforce mein Officer banna chahte hain, toh 12th ke baad NDA (National Defence Academy) ka exam best rasta hai. Isme Math aur GK strong honi chahiye." },
  { keywords: ["polytechnic", "diploma", "iti"], answer: "🛠️ **Polytechnic Diploma:** Class 10 ke baad seedha engineering field mein aane ke liye Polytechnic sabse best option hai. Iske baad B.Tech degree mein seedha 2nd year (Lateral Entry) mein admission mil jata hai!" },
  { keywords: ["passive income", "sote hue paise"], answer: "💰 **Passive Income:** Iska matlab hai ek baar smart mehnat karna aur baad mein lagatar paise aana. Jaise apne 'Fact Jaswant' channel par Evergreen videos banana ya Affiliate marketing links set karna!" },
  { keywords: ["startup", "funding", "investor"], answer: "🚀 **Startup & Funding:** Startup ek aisi nayi tech company hoti hai jo real-world problem solve kare (jaise aapka AI). Jab bade log (Investors) aisi company ko badhane ke liye paise dete hain, toh use 'Funding' kehte hain." },
  { keywords: ["time management", "time table"], answer: "⏳ **Time Management:** Coding, YouTube channels, aur Class 10 ki padhai ek sath manage karne ke liye 'Time Blocking' use karein. Har kaam ke liye din ka ek ghanta fix kar dein aur us waqt phone ko DND par rakhein." },

  // --- Advanced Agri-Business ---
  { keywords: ["mushroom", "khumbi"], answer: "🍄 **Mushroom Farming:** Yeh ek band kamre mein bina dhoop ke ki jane wali high-profit kheti hai. Button mushroom aur Oyster mushroom ki market mein bahut demand hai, aur isme kam jagah lagti hai." },
  { keywords: ["madhumakkhi", "apiculture", "honey", "shahed"], answer: "🐝 **Madhumakkhi Palan (Apiculture):** Kheti ke sath madhumakkhi palne se fasal ka utpadan 20% badh jata hai kyunki 'pollination' bahut achha hota hai. Sath hi shahed (honey) bechkar extra income hoti hai." },
  { keywords: ["kesar", "saffron"], answer: "🌸 **Kesar (Saffron):** Duniya ka sabse mehnga masala! Waise yeh Kashmir mein hota hai, par aajkal smart kisan 'Aeroponics' technology ka use karke ise band kamre mein AC lagakar bhi uga rahe hain." },
  { keywords: ["resham", "silk", "sericulture"], answer: "🐛 **Resham (Silk):** Resham ke keedo ko Shahtoot (Mulberry) ke patto par pala jata hai taaki unse silk nikala ja sake. Kheti ki is branch ko 'Sericulture' kehte hain." },

  // --- World GK & Geography ---
  { keywords: ["duniya ka sabse bada", "largest ocean", "prashant"], answer: "🌊 **Pacific Ocean:** Prashant Mahasagar (Pacific Ocean) duniya ka sabse bada aur sabse gehra mahasagar hai. Duniya ka sabse gehra point 'Mariana Trench' bhi yahi hai." },
  { keywords: ["everest", "sabse unchi", "tallest mountain"], answer: "⛰️ **Mount Everest:** Duniya ki sabse unchi choti Mount Everest hai, jiski unchai 8,848.86 meters hai. Yeh Nepal mein sthit hai." },
  { keywords: ["nile", "neel nadi", "longest river duniya"], answer: "🗺️ **Nile River:** Duniya ki sabse lambi nadi Neel (Nile) nadi hai, jo Africa mein behti hai aur Mediterranean Sea mein girti hai." },

  // --- Indian Economy ---
  { keywords: ["gst", "tax", "full form gst"], answer: "📊 **GST (Goods and Services Tax):** Yeh Bharat ka ek 'One Nation, One Tax' system hai jo 1 July 2017 ko lagoo hua tha, jisse business aur trade aasan ho sake." },
  { keywords: ["make in india"], answer: "🏭 **Make in India:** Yeh sarkar ki ek flagship scheme hai jiska maqsad Bharat mein hi saaman banana aur naye startups ko badhawa dena hai. Hamara 'Bharat AI' bhi ek proud 'Make in India' project hai!" },
  { keywords: ["rbi", "reserve bank", "banko ka bank"], answer: "🏦 **RBI (Reserve Bank of India):** RBI Bharat ka central bank hai jo currency notes chhapta hai aur baaki sabhi banks ke rules tay karta hai. Ise 'Bankon ka Bank' kaha jata hai." },

  // --- Future Tech ---
  { keywords: ["metaverse", "vr", "virtual reality"], answer: "🥽 **Metaverse & VR:** Metaverse ek aisi 3D digital duniya hai jahan log Virtual Reality (VR) headset pehan kar ek dusre se mil sakte hain, game khel sakte hain, aur digital zameen bhi kharid sakte hain." },
  { keywords: ["smart contract", "crypto rules"], answer: "📜 **Smart Contracts:** Yeh code mein likhe gaye digital contracts hote hain jo Blockchain par chalte hain. Inhe koi badal ya mita nahi sakta aur shartein poori hone par yeh apne aap execute ho jate hain." },

  // --- Batch 16 ---
  { keywords: ["food processing", "sauce", "ketchup", "juice"], answer: "🏭 **Food Processing (Value Addition):** Tamatar khet mein ₹10/kg bikta hai, par uska Ketchup banakar ₹150/kg bikta hai! Kisan ko ab sirf fasal nahi, fasal ka 'Product' banana chahiye. Sarkar 'PMFME Scheme' ke tahat aisi factory lagane par 35% subsidy deti hai." },
  { keywords: ["parali", "stubble", "kachra jalana", "dhuaan"], answer: "🔥 **Parali (Stubble) Jalana:** Khet mein fasal ka kachra jalane se mitti ke faydemand bacteria mar jate hain aur pradushan hota hai. Iski jagah 'Happy Seeder' machine ka use karein jo kachre ko mitti mein milakar natural khad bana deti hai." },
  { keywords: ["mahila kisan", "women farmer", "aurat"], answer: "👩‍🌾 **Mahila Kisan Pariyojana:** Kheti mein 70% kaam mahilayein karti hain. 'Mahila Kisan Sashaktikaran Pariyojana (MKSP)' ke tahat auraton ke Self-Help Groups (SHGs) ko drone chalane aur tractor ki special training aur fund milta hai." },
  { keywords: ["carbon credit", "hawa saaf", "ped lagana"], answer: "🌳 **Carbon Credits:** Agar aap organic kheti karte hain aur khet mein ped lagate hain, toh aap hawa ko saaf kar rahe hain. Duniya ki badi companiyan iske badle kisan ko 'Carbon Credits' deti hain, jo dollars ($) mein bikte hain!" },

  // --- Batch 17 ---
  { keywords: ["oont", "camel", "ship of desert", "oontni"], answer: "🐪 **Oont (Camel) Palan:** Oontni ka doodh (Camel Milk) Diabetes (Sugar) aur height badhane ke liye sabse best mana jata hai. Bikaner mein 'National Research Centre on Camel' hai jahan ispar bahut research hoti hai." },
  { keywords: ["guar gum", "gvar", "export"], answer: "🛢️ **Guar Gum Export:** Rajasthan duniya ka sabse bada Guar producer hai. Guar se nikla 'Gum' America aur Europe mein oil drilling aur cosmetics (makeup) banane mein use hota hai. Yeh ek International cash crop hai!" },
  { keywords: ["johad", "khadeen", "baarish ka pani", "rainwater"], answer: "🌧️ **Johad / Khadeen (Water Harvesting):** Churu aur Jaisalmer jaise ilakon mein barish ka pani rokne ki paramparik takneek. Khet ke dhalan par mitti ki deewar banakar pani roka jata hai, jisse saal bhar zameen mein nami (moisture) rehti hai." },
  { keywords: ["khejri fali", "sangri", "panchkuta"], answer: "🍲 **Sangri (Khejri):** Khejri ke ped par lagne wali fali ko 'Sangri' kehte hain. Marwad ki 'Ker-Sangri' ki sabzi duniya bhar mein 5-star hotels mein mehngi bikti hai. Yeh sukhe ilake ka green gold hai!" },

  // --- Batch 18 ---
  { keywords: ["sih", "smart india hackathon", "judge", "pitch"], answer: "🏆 **SIH Winning Strategy:** Smart India Hackathon mein jeetne ke liye app ka 'Practical' hona zaroori hai. Bharat AI 100% offline chalta hai, regional language support karta hai, aur kisan ki real problem solve karta hai—yahi iski sabse badi USP (Unique Selling Proposition) hai!" },
  { keywords: ["hallucination", "ai jhooth", "galat jawab", "fake answer"], answer: "🤖 **AI Hallucination:** Bade AI (jaise ChatGPT) kabhi-kabhi confidence ke sath jhooth bol dete hain, ise 'Hallucination' kehte hain. Par Jaswant ka Bharat AI ek 'Rule-Based Engine' hai, isliye yeh kheti ke mamle mein hamesha 100% sateek aur verified jawab hi deta hai." },
  { keywords: ["nlp", "natural language processing", "keyword match"], answer: "🧠 **NLP (Natural Language Processing):** Yeh computer ki woh takneek hai jisse machine insaan ki bhasha (text ya voice) samajhti hai. Humara app Regex aur Fuzzy matching use karke kisan ke sawal mein se main 'Keywords' nikalta hai." },
  { keywords: ["internet nahi", "offline ai", "bina net"], answer: "📶 **Offline Capability:** Gaon mein hamesha 5G nahi hota. Isliye is app ka dimaag (Database) seedha mobile ke browser mein load ho jata hai. Bina internet ke chalna is app ki sabse badi power hai." },

  // --- Batch 19 ---
  { keywords: ["ola", "hailstorm", "olavrishti", "barf"], answer: "🧊 **Olavrishti (Hailstorm):** Olo se fasal barbad hone par turant apne khet ki photo khinchein aur 72 ghante ke andar PMFBY (Fasal Bima Yojna) app par claim darj karein ya toll-free number par call karein." },
  { keywords: ["bijli girna", "lightning", "kadak", "aakashiy bijli"], answer: "⚡ **Aakashiy Bijli (Lightning):** Barish aur toofan ke waqt khet mein ped ke neeche ya tractor par na baithein. Sarkar ki 'Damini App' download karein jo bijli girne se 40 minute pehle aapke mobile par alert de deti hai." },
  { keywords: ["khet talab", "farm pond", "paani ikattha", "diggi"], answer: "🌊 **Khet Talab Yojna:** Barish ka pani khet mein hi rokne ke liye farm pond (diggi) banwayein. Rajasthan sarkar iske nirmaan par kisanon ko 60% se 70% tak ki subsidy deti hai." },

  // --- Batch 20 ---
  { keywords: ["jamabandi", "nakal", "khata", "khasra", "apna khata"], answer: "📄 **Jamabandi & Apna Khata:** Ab nakal nikalwane ke liye patwari ke chakkar lagane ki zaroorat nahi. Rajasthan sarkar ke 'Apna Khata' portal par apna Khasra number daalkar online Jamabandi free mein nikal sakte hain." },
  { keywords: ["girdawari", "fasal ki entry"], answer: "📝 **E-Girdawari:** Patwari dwara khet mein kaunsi fasal boi gayi hai, iski online entry ko Girdawari kehte hain. Fasal bima claim aur MSP par fasal bechne ke liye yeh sabse zaroori sarkaari document hai." },
  { keywords: ["agmarknet", "mandi bhav app"], answer: "📱 **Agmarknet Portal:** Yeh Bharat sarkar ka official portal hai jahan aap pure desh ki kisi bhi mandi ka daily live bhav (price) apne mobile par ek click mein dekh sakte hain." },
  { keywords: ["emitra", "e-mitra"], answer: "🖥️ **E-Mitra:** Rajasthan mein kisi bhi krishi yojna (jaise tarbandi, pipeline, solar pump) ka form bharne ke liye sabse nazdiki E-Mitra center par jayein. Wahan se aapka aavedan seedha krishi vibhag ke system mein chala jayega." },

  // --- Batch 21 ---
  { keywords: ["ashwagandha", "asgandh"], answer: "🌿 **Ashwagandha:** Retili mitti aur kam pani wali sabse top aushadhiya (medicinal) fasal. Iski jado (roots) ki market mein bhari demand hai aur yeh aam fasal se 3 guna zyada munafa (profit) deti hai." },
  { keywords: ["sonamukhi", "sena"], answer: "🍃 **Sonamukhi (Senna):** Churu aur Jodhpur ke aaspaas ke ilakon ke liye vardan! Ek baar bone ke baad yeh 3-4 saal tak patte deti hai. Isme awara pashu muh nahi marte aur pani ki zaroorat bilkul kam hoti hai." },
  { keywords: ["safed musli", "musli"], answer: "🌱 **Safed Musli:** Ise kheti ka 'Safed Sona' (White Gold) kaha jata hai. Ise halki retili mitti mein lagaya jata hai aur mandi mein iska bhav ₹1000 se ₹1500 prati kilo tak mil jata hai." },
  { keywords: ["tulsi", "basil"], answer: "🪴 **Tulsi Farming:** Patanjali aur Dabur jaisi Ayurvedic companiyan contract farming ke zariye Tulsi seedha kisan se kharidti hain. Yeh 3 mahine mein taiyar ho jati hai aur isme keede-bimari ka khatra lagbhag zero hota hai." },

  // --- Batch 22 ---
  { keywords: ["bakri", "goat", "chheli", "sirohi", "jamnapari"], answer: "🐐 **Bakri Palan:** Bakri ko 'Gareeb ki Gaay' kaha jata hai. Rajasthan mein Sirohi aur Jamnapari nasal (breed) sabse best hain kyunki yeh sukhe mausam mein asani se reh sakti hain. Inka doodh dengue fever mein bahut faydemand hota hai." },
  { keywords: ["murgi", "poultry", "kadaknath", "anda", "egg"], answer: "🐓 **Murgi Palan:** Kheti ke sath extra income ke liye murgi palan best hai. 'Kadaknath' murgi ka meat aur ande (eggs) sabse mehange bikte hain kyunki inme protein bahut zyada aur fat kam hota hai." },
  { keywords: ["machhli palan", "fish farming", "talaab", "rohu"], answer: "🐟 **Machhli Palan:** Agar khet mein diggi ya talab hai, toh usme Rohu aur Katla machhli paal sakte hain. Sarkar 'PM Matsya Sampada Yojana' ke tahat kisanon ko talab banane ke liye 60% tak ki subsidy deti hai." },
  { keywords: ["pashu aahar", "chara", "silage", "sukha chara"], answer: "🌾 **Silage (Hara Chara):** Sardiyon ya sukhe ke waqt jab hara chara nahi hota, tab 'Silage' kaam aata hai. Yeh hare chare ko gaddhe mein daba kar banaya gaya achaar hai jo pashuon ka doodh badhata hai." },

  // --- Batch 23 ---
  { keywords: ["localstorage", "save data", "memory"], answer: "💾 **LocalStorage:** Yeh browser ki ek hidden memory hoti hai. Iska use karke hum user ka theme (Dark/Light) ya chat history save kar sakte hain taaki app band karne ke baad bhi data delete na ho, bina kisi server ke!" },
  { keywords: ["pwa", "progressive web app", "install app", "play store"], answer: "📱 **PWA (Progressive Web App):** PWA ek aisi advance tech hai jisse ek aam website ko log apne phone mein bilkul ek asli 'App' ki tarah install kar sakte hain. 'Bharat AI' ko PWA banane se yeh bina Play Store ke bhi download ho jayega." },
  { keywords: ["cache", "fast load", "speed badhao"], answer: "⚡ **Browser Cache:** Jab app pehli baar khulti hai, toh images aur database browser ke 'Cache' mein save ho jate hain. Isliye agli baar app bina internet ke aur lagbhag instantly (turant) load ho jati hai." },

  // --- Batch 24 ---
  { keywords: ["business model", "paise kaise", "revenue", "monetize"], answer: "💼 **Business Model:** Bharat AI completely free aur offline hai. Future mein isse paise kamane ke liye hum 'Freemium Model' laa sakte hain jahan kisan advance weather alerts ke liye choti si fees de sakte hain, ya agriculture companiyon ke banners chala sakte hain." },
  { keywords: ["problem statement", "kyun banaya", "idea"], answer: "🎯 **Problem Statement:** Gaon mein internet connection kamzor hota hai aur bade AI kisan ki local bhasha nahi samajhte. Bharat AI is problem ko 100% offline rehkar aur local faslon ki sateek jankari dekar solve karta hai. Yahi iski USP (Unique Selling Proposition) hai." },
  { keywords: ["future plan", "aage kya", "roadmap"], answer: "🚀 **Future Roadmap:** Jaswant ka aage ka plan isme ek lightweight 'Offline Image Recognition' (Computer Vision) jodna hai, jisse kisan sirf fasal ki photo khinchega aur AI bina net ke bimari pehchan kar dawa bata dega!" },
  { keywords: ["team", "kon kon", "solo"], answer: "🤝 **The Team:** Yeh poora offline AI architecture aur database ek single tech visionary, Jaswant ne design kiya hai, jo future ki tech industry mein ek bada badlav lane ke liye taiyar hain." },

  // --- Batch 25 ---
  { keywords: ["pm of india", "pradhan mantri", "prime minister"], answer: "🇮🇳 **Pradhan Mantri (PM):** Bharat ke vartaman Pradhan Mantri Shri Narendra Modi hain." },
  { keywords: ["president", "rashtrapati"], answer: "🇮🇳 **Rashtrapati (President):** Bharat ki vartaman Rashtrapati Smt. Droupadi Murmu hain. Yeh is pad par pahunchne wali pehli adivasi mahila hain." },
  { keywords: ["rashtriya pashu", "rashtriya pakshi", "national animal", "national bird"], answer: "🦚 **Rashtriya Prateek:** Bharat ka Rashtriya Pashu 'Baagh' (Tiger) aur Rashtriya Pakshi 'Mor' (Peacock) hai. Bharat ka Rashtriya Phool 'Kamal' (Lotus) hai." },
  { keywords: ["national anthem", "rashtragaan", "jana gana"], answer: "🎶 **Rashtragaan:** Bharat ka Rashtragaan 'Jana Gana Mana' hai jise Rabindranath Tagore ne likha tha. Wahi hamara Rashtrageet 'Vande Mataram' hai jise Bankim Chandra Chatterjee ne likha tha." },
  { keywords: ["iron man of india", "loh purush", "sardar patel"], answer: "🗽 **Loh Purush (Iron Man):** Sardar Vallabhbhai Patel ko Bharat ka Loh Purush kaha jata hai. Unhone azadi ke baad Bharat ki 500+ riyasaton ko ekjuth kiya tha." },

  // --- Batch 26 ---
  { keywords: ["computer kisne", "father of computer", "computer aavishkar"], answer: "💻 **Computer:** Computer ka aavishkar Charles Babbage ne kiya tha. Inhe 'Father of Computer' kaha jata hai." },
  { keywords: ["bulb kisne", "bijli ka bulb", "thomas edison"], answer: "💡 **Bulb:** Bijli ke bulb ka aavishkar Thomas Alva Edison ne kiya tha. Unhone iske liye hazaron baar try kiya tha, jo kisi bhi tech founder ke liye 'Never Give Up' ka sabse bada example hai!" },
  { keywords: ["telephone", "phone kisne", "graham bell"], answer: "☎️ **Telephone:** Telephone ka aavishkar Alexander Graham Bell ne kiya tha." },
  { keywords: ["shunya kisne", "zero", "aryabhatta"], answer: "0️⃣ **Zero (Shunya):** Zero (0) ka aavishkar Bharat ke mahan ganitagya (mathematician) Aryabhata ne kiya tha. Yeh duniya ko Bharat ki sabse badi den hai!" },
  { keywords: ["aeroplane kisne", "havai jahaz", "plane"], answer: "✈️ **Aeroplane:** Havai jahaz ka aavishkar 'Wright Brothers' (Orville aur Wilbur Wright) ne 1903 mein kiya tha." },

  // --- Batch 27 ---
  { keywords: ["kitni haddiyan", "bones", "haddi"], answer: "🦴 **Manav Sharir (Bones):** Ek adult insaan ke sharir mein total 206 haddiyan (bones) hoti hain. Jabki ek navjat shishu (newborn baby) mein lagbhag 300 haddiyan hoti hain jo baad mein jud jati hain." },
  { keywords: ["khoon laal", "blood red", "hemoglobin"], answer: "🩸 **Khoon (Blood):** Insani khoon ka rang laal 'Hemoglobin' naam ke protein ki wajah se hota hai. Yeh oxygen ko humare fefdo (lungs) se pure sharir mein phailata hai." },
  { keywords: ["vitamin c", "immunity", "nimbu"], answer: "🍊 **Vitamins:** Bimariyon se ladne ki takat (Immunity) badhane ke liye Vitamin C sabse zaroori hai, jo nimbu, santra (orange) aur aawla (amla) jaise khatte falon mein milta hai." },
  { keywords: ["sabse bada grah", "largest planet", "jupiter"], answer: "🪐 **Solar System:** Humare solar system ka sabse bada grah (planet) 'Jupiter' (Brihaspati) hai. Aur Suraj ke sabse nazdeek wala grah 'Mercury' (Budh) hai." },
  { keywords: ["poudhe khana", "photosynthesis", "prakash sanshleshan"], answer: "🌿 **Photosynthesis:** Poudhe suraj ki roshni, carbon dioxide aur pani ka use karke apna khana khud banate hain. Is process ko 'Prakash Sanshleshan' (Photosynthesis) kehte hain." },

  // --- Batch 28 ---
  { keywords: ["hawa mahal", "jaipur mahal", "hava"], answer: "🏰 **Hawa Mahal:** Jaipur ka Hawa Mahal Maharaja Sawai Pratap Singh ne banwaya tha. Isme 953 jharokhe (khidkiyan) hain taaki rajput raniyan bina kisi ko dikhe bahar ka tyohar dekh sakein." },
  { keywords: ["indira gandhi canal", "nehar", "rajasthan canal"], answer: "🌊 **Indira Gandhi Nehar:** Yeh Bharat ki sabse lambi nehar (canal) hai. Yeh Punjab se shuru hoti hai aur Thar registan (Bikaner, Jaisalmer) ko peene aur kheti ka pani deti hai. Yeh Rajasthan ki jeevan rekha (lifeline) hai!" },
  { keywords: ["ghoomar", "dance", "kalbelia", "folk"], answer: "💃 **Rajasthan Folk Dance:** 'Ghoomar' Rajasthan ka sabse famous paramparik nritya (dance) hai. Sath hi 'Kalbelia' dance ko toh UNESCO ne bhi world heritage mein shamil kiya hai." },
  { keywords: ["guru shikhar", "sabse unchi choti", "mount abu"], answer: "⛰️ **Guru Shikhar:** Rajasthan (aur Aravalli parvat) ki sabse unchi choti Mount Abu mein sthit 'Guru Shikhar' hai. Iski unchai 1,722 meters hai." },

  // --- Batch 29 ---
  { keywords: ["kisan diwas", "farmer day", "chaudhary charan singh"], answer: "🌾 **Kisan Diwas:** Bharat mein har saal 23 December ko 'Rashtriya Kisan Diwas' manaya jata hai. Yeh din Bharat ke 5ve Pradhan Mantri, Chaudhary Charan Singh ji ke janamdin par manaya jata hai." },
  { keywords: ["environment day", "paryavaran", "5 june"], answer: "🌍 **Paryavaran Diwas:** Har saal 5 June ko 'World Environment Day' manaya jata hai taaki logon ko ped lagane aur nature bachane ke liye jagruk kiya ja sake." },
  { keywords: ["yoga day", "yog diwas", "21 june"], answer: "🧘 **International Yoga Day:** Duniya bhar mein 21 June ko 'Antarrashtriya Yog Diwas' manaya jata hai. Bharat ne hi duniya ko Yog sikhaya hai!" },
  { keywords: ["earth day", "prithvi diwas", "22 april"], answer: "🌎 **Earth Day:** 22 April ko 'Prithvi Diwas' manaya jata hai. Global warming aur pollution se prithvi ko bachana iska mukhya maqsad hai." },
  { keywords: ["science day", "vigyan diwas", "cv raman"], answer: "🔬 **National Science Day:** 28 February ko 'Rashtriya Vigyan Diwas' manaya jata hai. Isi din mahan bhartiya scientist Sir C.V. Raman ne 'Raman Effect' ki khoj ki thi." },

  // --- Batch 30 ---
  { keywords: ["dengue", "malaria", "machhar", "bukhar"], answer: "🦟 **Dengue & Malaria:** Yeh dono khatarnak bukhar machhar ke katne se hote hain (Dengue Aedes machhar se aur Malaria Anopheles se). Bachav ke liye aaspaas pani ikattha na hone dein aur machhardani (net) ka use karein." },
  { keywords: ["pani saaf", "filter", "fitkari", "alum", "boil"], answer: "🚰 **Pani Saaf Karna:** Peene ke pani ko bacteria-free banane ka sabse asan tarika usko ubalna (boil) hai. Khet mein gadle pani ko saaf karne ke liye usme Fitkari (Alum) ghumayein, saara kachra niche baith jayega." },
  { keywords: ["vitamin a", "aankh", "gajar", "papita"], answer: "👁️ **Vitamin A (Aankhon ke liye):** Aankhon ki roshni tez karne ke liye Vitamin A zaroori hai. Yeh gajar (carrot), papita aur hare patte wali sabziyon mein sabse zyada paya jata hai." },
  { keywords: ["gravity", "gurutvakarshan", "seb girna", "newton"], answer: "🍎 **Gravity (Gurutvakarshan):** Duniya ki har chiz zameen ki taraf kyun girti hai? Is 'Gravity' ki khoj mahan scientist Isaac Newton ne ki thi jab unke sir par ek seb (apple) gira tha." },

  // --- Batch 31 ---
  { keywords: ["otp", "bank fraud", "paise kat gaye", "thagi"], answer: "🚨 **Cyber Fraud Alert:** Bank ya sarkar kabhi bhi aapse phone par OTP (One Time Password) ya PIN nahi mangti. Agar galti se paise kat jayein, toh turant Cyber Crime Helpline '1930' par call karein." },
  { keywords: ["virus", "malware", "phone hang"], answer: "🦠 **Phone Virus/Malware:** Agar aapka phone anjaan links par click karne se hang ho raha hai, toh turant anjaan apps ko delete karein aur phone ko 'Factory Reset' kar lein. Hamesha Play Store se hi app download karein." },
  { keywords: ["motherboard", "processor", "cpu"], answer: "🖥️ **Computer Hardware:** CPU (Central Processing Unit) computer ka dimaag hai, aur Motherboard uski haddi (backbone) hai jisse saare purze (parts) jude hote hain." },
  { keywords: ["wi-fi", "router", "internet speed"], answer: "📶 **Wi-Fi & Router:** Router ek aisi machine hai jo internet line ko wireless signal (Wi-Fi) mein badalti hai taaki aapka phone bina wire ke internet se jud sake." },

  // --- Batch 32 ---
  { keywords: ["pashu bima", "gay bima", "bhains insurance"], answer: "🐄 **Pashu Bima Yojana:** Sarkar pashuon ke marne ya chori hone par nuksan se bachane ke liye Pashu Bima deti hai. Isme kisan ko sirf thoda sa premium bharna hota hai aur gaay/bhains ka kaan (ear) tag kiya jata hai." },
  { keywords: ["tractor loan", "krishi yantra loan"], answer: "🚜 **Tractor Loan:** Naya tractor lene ke liye bank 80% tak loan deti hai. Agar aap apne KCC (Kisan Credit Card) ka record achha rakhte hain, toh loan jaldi aur saste byaj (interest) par mil jata hai." },
  { keywords: ["agri clinic", "soil lab business"], answer: "🔬 **Agri-Clinics & Business:** Kheti ki padhai karne ke baad aap gaon mein mitti jaanch (Soil testing) ki lab ya beej/khad ki dukan khol sakte hain. NABARD iske liye 36% se 44% tak ki subsidy deta hai." },
  { keywords: ["fasal kharab", "muavza", "patwari"], answer: "📋 **Muavza (Compensation):** Barish ya sukhe se fasal kharab hone par sabse pehle apne Patwari se mil kar 'Girdawari' mein nuksan darj karwayein, tabhi sarkar se muavza milta hai." },

  // --- Batch 33 ---
  { keywords: ["pythagoras", "karn", "adhar"], answer: "📐 **Pythagoras Theorem:** Ek right-angled triangle mein: (Hypotenuse)² = (Base)² + (Perpendicular)². Matlab sabse lambi line ka square baki dono lines ke squares ke jod ke barabar hota hai." },
  { keywords: ["circle area", "vrit ka kshetrafal", "pi"], answer: "⭕ **Area of Circle:** Vrit (Circle) ka kshetrafal nikalne ka formula πr² hota hai. Yahan 'π' (Pi) ki value lagbhag 22/7 ya 3.14 hoti hai aur 'r' circle ki radius (trijiya) hai." },
  { keywords: ["ohm law", "ohm ka niyam", "bijli ka niyam"], answer: "⚡ **Ohm's Law (Physics):** V = IR. Iska matlab hai ki voltage (V) hamesha current (I) aur resistance (R) ke guna (multiply) ke barabar hota hai. Yeh bijli (electricity) ka sabse zaruri niyam hai." },
  { keywords: ["light reflection", "prakash ka paraavartan", "sheesha"], answer: "🪞 **Reflection of Light:** Jab prakash (light) kisi chikni satah (jaise sheesha) se takrakar wapas laut jata hai, toh use Prakash ka Paraavartan (Reflection) kehte hain. Isme Angle of Incidence hamesha Angle of Reflection ke barabar hota hai." },

  // --- Batch 34 ---
  { keywords: ["noun", "sangya", "naming word"], answer: "📝 **Noun (Sangya):** Kisi bhi vyakti, jagah, jaanwar ya chiz ke naam ko Noun kehte hain. (Example: Jaswant, Sardarshahar, Dog, Computer). 'Noun is a naming word!'" },
  { keywords: ["vowel", "swar", "a e i o u"], answer: "🔤 **Vowels & Consonants:** English alphabet mein 26 letters hote hain. Inme se 5 Vowels (A, E, I, O, U) hote hain, aur baaki 21 letters ko Consonants (Vyanjan) kehte hain." },
  { keywords: ["tense", "kaal", "past present future"], answer: "⏳ **Tense (Kaal):** Tense humein samay (time) batata hai. Yeh 3 type ke hote hain: Present (Jo chal raha hai), Past (Jo beet gaya), aur Future (Jo aayega)." },
  { keywords: ["english kaise seekhein", "spoken english"], answer: "🗣️ **Spoken English Tips:** English bolna seekhne ka sabse best tareeqa hai use roz sunna! English movies ya YouTube videos subtitles ke sath dekhein, aur chote-chote sentences rozana bolne ki practice karein." },

  // --- Batch 35 ---
  { keywords: ["google kisne", "founder of google"], answer: "🔍 **Google History:** Google ki shuruat 1998 mein 'Larry Page' aur 'Sergey Brin' ne ek chote se garage se ki thi. Aaj yeh duniya ka sabse bada search engine hai. Iska pehla naam 'BackRub' tha!" },
  { keywords: ["apple kisne", "steve jobs", "iphone founder"], answer: "🍏 **Apple & Steve Jobs:** Apple company ko Steve Jobs aur Steve Wozniak ne banaya tha. Steve Jobs ne sikhaya ki technology sirf kaam ki nahi, balki sundar aur aasan (user-friendly) bhi honi chahiye." },
  { keywords: ["elon musk", "spacex", "tesla"], answer: "🚀 **Elon Musk:** Yeh aaj ki sadi ke sabse bade tech visionary hain. Inki company 'SpaceX' rocket banati hai aur 'Tesla' electric cars. Inka sapna insaan ko Mars (Mangal grah) par basana hai." },
  { keywords: ["bill gates", "microsoft kisne"], answer: "🪟 **Microsoft:** Duniya ke zyadatar computers mein chalne wala 'Windows' operating system Microsoft ne banaya hai, jiski shuruat mahan coder Bill Gates ne ki thi." },

  // --- Batch 36 ---
  { keywords: ["mool adhikar", "fundamental rights", "mauleek adhikar"], answer: "📜 **Fundamental Rights:** Bharat ke Samvidhan ne har nagrik ko 6 Mool Adhikar (Fundamental Rights) diye hain. Jisme Samanta ka adhikar (Right to Equality) aur Azadi ka adhikar (Right to Freedom) sabse mukhya hain." },
  { keywords: ["loktantra", "democracy", "prajatantra"], answer: "🗳️ **Loktantra (Democracy):** Loktantra ka sabse aasan matlab hai—'Janta ka, Janta ke dwara, aur Janta ke liye shasan' (Of the people, by the people, for the people). Yahan neta chunav (election) se bante hain." },
  { keywords: ["supreme court", "sabse badi adalat", "uchchatam nyayalaya"], answer: "⚖️ **Supreme Court:** New Delhi mein sthit Supreme Court Bharat ki sabse badi adalat hai. Iska faisla pure desh mein aakhiri aur sabko manne wala hota hai." },
  { keywords: ["panchayat", "sarpanch", "gram sabha"], answer: "🏘️ **Gram Panchayat:** Gaon ke vikas aur chote jhagdo ko suljhane ke liye Gram Panchayat hoti hai, jiska mukhiya 'Sarpanch' hota hai. Yeh Bharat ke loktantra ki sabse pehli aur zaroori seedhi hai." },

  // =====================================================
  // NEW MULTI-LANGUAGE ENTRIES (pattern + answers)
  // =====================================================

  // --- Batch 37: Solar Energy & Water Tech ---
  { pattern: /solar pump|kusum|bijli bill|solar panel/i, answers: { Hinglish: "☀️ **PM KUSUM Yojana:** Khet mein solar pump lagwane par sarkar 60% tak subsidy deti hai. Isse bijli ka bill zero ho jata hai aur din mein asani se sinchai hoti hai.", English: "☀️ **PM KUSUM Yojana:** The government provides up to 60% subsidy for installing solar pumps in fields. It reduces electricity bills to zero and allows easy daytime irrigation.", Hindi: "☀️ **पीएम कुसुम योजना:** खेत में सोलर पंप लगवाने पर सरकार 60% तक सब्सिडी देती है। इससे बिजली का बिल जीरो हो जाता है और दिन में आसानी से सिंचाई होती है।", Marwadi: "☀️ **पीएम कुसुम योजना:** खेत में सोलर पंप लगावण पर सरकार 60% सब्सिडी देवै है। इणसूं बिजली रो बिल कोनी आवै और दिन में सोरा ही पाणी लाग जावै सा।" } },
  { pattern: /drip|boond boond|pani bachat|micro irrigation/i, answers: { Hinglish: "💧 **Boond-Boond Sinchai (Drip):** Rajasthan jaise sukhe ilako ke liye sabse best! Isme pani seedha poudhe ki jado mein jata hai, jisse 70% pani ki bachat hoti hai aur fasal dugni hoti hai.", English: "💧 **Drip Irrigation:** Best for dry areas like Rajasthan! Water goes directly to the roots, saving 70% water and doubling the crop yield.", Hindi: "💧 **ड्रिप सिंचाई:** राजस्थान जैसे सूखे इलाकों के लिए सबसे बढ़िया तकनीक! इसमें पानी सीधा पौधे की जड़ों में जाता है, जिससे 70% पानी बचता है।", Marwadi: "💧 **बूंद-बूंद सिंचाई:** राजस्थान खातिर आ सबसूं चोखी तकनीक है! ईं में पाणी सीधो जड़ां में जावै, जिणसूं 70% पाणी बचै और फसल भी चोखी होवै।" } },

  // --- Batch 38: Major Government Schemes ---
  { pattern: /ayushman|bimar|free ilaj|health card|hospital/i, answers: { Hinglish: "🏥 **Ayushman Bharat Card:** Is card se kisi bhi bade private ya sarkari hospital mein 5 lakh rupaye tak ka free ilaj milta hai. Yeh gareeb parivaron ke liye sabse badi health scheme hai.", English: "🏥 **Ayushman Bharat Card:** This card provides free medical treatment up to ₹5 lakh in major private or government hospitals. It's the biggest health scheme for poor families.", Hindi: "🏥 **आयुष्मान भारत कार्ड:** इस कार्ड से किसी भी बड़े प्राइवेट या सरकारी अस्पताल में 5 लाख रुपये तक का मुफ्त इलाज मिलता है।", Marwadi: "🏥 **आयुष्मान भारत कार्ड:** ईं कार्ड सूं कोई भी मोटा प्राइवेट या सरकारी अस्पताल में 5 लाख रिप्या ताईं रो मुफ्त इलाज मिलै सा।" } },
  { pattern: /ration card|free gehu|anaj|garib kalyan/i, answers: { Hinglish: "🌾 **PM Garib Kalyan Yojana:** Ration card dharakon ko sarkar ki taraf se har mahine free gehu/chawal milta hai. Apna ration card hamesha Aadhar se link rakhein (E-KYC zaroori hai).", English: "🌾 **PM Garib Kalyan Yojana:** Ration card holders get free wheat/rice every month from the government. Always keep your ration card linked to Aadhaar (E-KYC is mandatory).", Hindi: "🌾 **पीएम गरीब कल्याण योजना:** राशन कार्ड धारकों को सरकार की तरफ से हर महीने मुफ्त गेहूं/चावल मिलता है। अपना राशन कार्ड हमेशा आधार से ई-केवाईसी करवा कर रखें।", Marwadi: "🌾 **पीएम गरीब कल्याण योजना:** राशन कार्ड आळां नै सरकार हर महिने फिरी में गहूं देवै है। आपणो राशन कार्ड आधार कार्ड सूं लिंक (E-KYC) राखणो जरूरी है।" } },

  // --- Batch 39: AI Awareness & Student Focus ---
  { pattern: /chatgpt|ai tool|homework|project/i, answers: { Hinglish: "🤖 **AI for Students:** ChatGPT ya Gemini jaise AI tools ka use homework copy karne ke liye nahi, balki mushkil concepts (jaise Math ya Science) ko asani se samajhne ke liye karein.", English: "🤖 **AI for Students:** Do not use AI tools like ChatGPT or Gemini to copy homework. Instead, use them to easily understand difficult Math or Science concepts.", Hindi: "🤖 **छात्रों के लिए AI:** ChatGPT या Gemini जैसे AI टूल्स का उपयोग होमवर्क कॉपी करने के लिए नहीं, बल्कि मुश्किल विषयों (जैसे गणित या विज्ञान) को समझने के लिए करें।", Marwadi: "🤖 **टाबरां खातिर AI:** ChatGPT या Gemini रो इस्तेमाल होमवर्क चीटिंग खातिर ना करो, बल्कि कोई दोरो विषय (जियां गणित या विज्ञान) समझण खातिर करो सा।" } },
  { pattern: /cyber crime|thagi helpline|online fraud/i, answers: { Hinglish: "🚨 **Cyber Helpline (1930):** Agar internet par aapke sath paiso ki thagi ho jaye, toh turant National Cyber Crime Helpline number '1930' par call karein ya cybercrime.gov.in par report karein.", English: "🚨 **Cyber Helpline (1930):** If you face any online financial fraud, immediately call the National Cyber Crime Helpline number '1930' or report it on cybercrime.gov.in.", Hindi: "🚨 **साइबर हेल्पलाइन (1930):** अगर इंटरनेट पर आपके साथ पैसों की ठगी हो जाए, तो तुरंत नेशनल साइबर क्राइम हेल्पलाइन नंबर '1930' पर कॉल करें।", Marwadi: "🚨 **साइबर हेल्पलाइन (1930):** जदि इंटरनेट माथै थारै सागे पईसां री ठगी हो जावै, तो झटपट साइबर क्राइम हेल्पलाइन नंबर '1930' माथै फोन करो सा।" } },

  // --- Batch 40: Livestock & Vet Care ---
  { pattern: /thanela|than mein sujan|doodh kam|mastitis/i, answers: { Hinglish: "🐄 **Thanela Rog (Mastitis):** Doodh wale pashuon ke than mein sujan aana sabse aam bimari hai. Isse bachne ke liye doodh nikalne ke baad than ko lal dawa (KMnO4) ke pani se dhoye.", English: "🐄 **Mastitis:** Swelling in the udder of milking animals. To prevent this, wash the udder with potassium permanganate (KMnO4) water after milking.", Hindi: "🐄 **थनैला रोग:** दूध वाले पशुओं के थन में सूजन आना। इससे बचने के लिए दूध निकालने के बाद थन को लाल दवा (KMnO4) के पानी से धोएं।", Marwadi: "🐄 **थनैला रोग:** दूध आळा पशुवां रै थण में सोजस आवणो। ईं सूं बचाव खातिर दूध काढ़ण रै बाद थण नै लाल दवा (KMnO4) आळै पाणी सूं धोवणो चाईजै सा।" } },
  { pattern: /lumpy|lampi|gaay ke gathan|ganth/i, answers: { Hinglish: "🐄 **Lumpy Virus:** Gaay ke sharir par moti ganthein ban jana iske lakshan hain. Bimar pashu ko turant dusre pashuon se alag karein, neem ke patte ka dhuaan karein aur pashu doctor se vaccine lagwayein.", English: "🐄 **Lumpy Virus:** Thick nodules forming on the cow's body are symptoms. Isolate the sick animal immediately, use neem smoke, and get them vaccinated by a vet.", Hindi: "🐄 **लंपी वायरस:** गाय के शरीर पर मोटी गांठें बन जाना इसके लक्षण हैं। बीमार पशु को तुरंत अलग करें, नीम के पत्ते का धुआं करें और डॉक्टर से वैक्सीन लगवाएं।", Marwadi: "🐄 **लंपी वायरस:** गायां रै शरीर माथै मोटी गांठां बण जावै। बीमार पशु नै झटपट बाकिया सूं नूवो (अलग) कर दियो, नीम रै पत्तां रो धूंओ करो और डॉक्टर सूं टीको लगवाओ सा।" } },

  // --- Batch 41: Core Tech & Developer Tools ---
  { pattern: /git push|git pull|github par code/i, answers: { Hinglish: "🐙 **Git Commands:** 'git push' ka use code ko aapke computer se GitHub par bhejne ke liye hota hai, aur 'git pull' se GitHub ka naya code wapas aapke computer mein aata hai.", English: "🐙 **Git Commands:** 'git push' is used to send code from your local computer to GitHub, and 'git pull' fetches new code from GitHub to your computer.", Hindi: "🐙 **गिट कमांड्स:** 'git push' का इस्तेमाल कोड को आपके कंप्यूटर से गिटहब पर भेजने के लिए होता है, और 'git pull' से गिटहब का नया कोड आपके कंप्यूटर में आता है।", Marwadi: "🐙 **गिट कमांड्स:** 'git push' रो काम कोड नै थारै कंप्यूटर सूं गिटहब माथै भेजणो है, और 'git pull' सूं गिटहब रो नूवो कोड थारै कंप्यूटर में आवै सा।" } },
  { pattern: /frontend vs backend|ui database/i, answers: { Hinglish: "🌐 **Web Dev:** Frontend woh hai jo user ko screen par dikhta hai (jaise HTML, CSS). Backend woh hai jahan data save hota hai aur logic chalta hai (jaise Database, Node.js).", English: "🌐 **Web Dev:** Frontend is what the user sees on the screen (like HTML, CSS). Backend is where data is saved and logic runs (like Database, Node.js).", Hindi: "🌐 **वेब डेवलपमेंट:** फ्रंटएंड वह है जो यूजर को स्क्रीन पर दिखता है (जैसे HTML, CSS)। बैकएंड वह है जहाँ डेटा सेव होता है और लॉजिक चलता है।", Marwadi: "🌐 **वेब डेवलपमेंट:** फ्रंटएंड बो है जिको यूजर नै स्क्रीन माथै दीखै है। और बैकएंड बो है जठै डेटा सेव होवै और असली काम (लॉजिक) चालै सा।" } },

  // --- Batch 42: Desert Farming & Pride ---
  { pattern: /bajra|pearl millet|retili kheti/i, answers: { Hinglish: "🌾 **Bajra (Pearl Millet):** Rajasthan ki mukhya fasal. Ise pani ki bahut kam zaroorat hoti hai aur yeh bhari garmi jhel sakta hai. Bajre mein iron aur calcium bharpoor matra mein hota hai.", English: "🌾 **Bajra (Pearl Millet):** The main crop of Rajasthan. It requires very little water and can tolerate extreme heat. Pearl millet is rich in iron and calcium.", Hindi: "🌾 **बाजरा:** यह राजस्थान की मुख्य फसल है। इसे पानी की बहुत कम जरूरत होती है और यह भारी गर्मी झेल सकता है। बाजरे में आयरन और कैल्शियम भरपूर होता है।", Marwadi: "🌾 **बाजरी:** आ राजस्थान री मुख्य फसल है सा। ईं नै पाणी री घणी कम जरूरत होवै और आ मोटो तावड़ो (गर्मी) सह सकै है। बाजरी में आयरन और ताकत घणी होवै।" } },
  { pattern: /khejri|shami|kalpavriksha|state tree/i, answers: { Hinglish: "🌳 **Khejri (State Tree):** Khejri Rajasthan ka Kalpavriksha hai. Yeh bhayankar sukhe mein bhi hara rehta hai aur iski jado (roots) mein nitrogen banane wale bacteria hote hain jo mitti ko upjau banate hain.", English: "🌳 **Khejri (State Tree):** Khejri is the Kalpavriksha of Rajasthan. It stays green even in severe droughts, and its roots have nitrogen-fixing bacteria that make the soil fertile.", Hindi: "🌳 **खेजड़ी (राज्य वृक्ष):** खेजड़ी राजस्थान का कल्पवृक्ष है। यह भयंकर सूखे में भी हरा रहता है और इसकी जड़ों में नाइट्रोजन बनाने वाले बैक्टीरिया होते हैं।", Marwadi: "🌳 **जांटी (खेजड़ी):** जांटी आपणै राजस्थान रो कल्पवृक्ष है। आ भयंकर काळ (सूखे) में भी हरी रैवै और ईंरी जड़ां खेत री माटी नै उपजाऊ बणावै सा।" } },

  // --- Batch 43: Digital Creator & AI Tools ---
  { pattern: /thumbnail|ctr|youtube click/i, answers: { Hinglish: "🖼️ **YouTube Thumbnails:** Video ka Thumbnail ekdum clear aur 'clicky' hona chahiye. High CTR (Click-Through Rate) ke liye text kam aur face expressions zyada use karein, jaise gaming ya fact videos mein hota hai.", English: "🖼️ **YouTube Thumbnails:** Video thumbnails should be clear and click-worthy. For a high CTR (Click-Through Rate), use less text and more facial expressions, especially for gaming or fact channels.", Hindi: "🖼️ **यूट्यूब थंबनेल:** वीडियो का थंबनेल एकदम साफ़ और आकर्षक होना चाहिए। ज्यादा क्लिक (CTR) पाने के लिए थंबनेल पर टेक्स्ट कम और चेहरे के हाव-भाव ज्यादा इस्तेमाल करें।", Marwadi: "🖼️ **यूट्यूब थंबनेल:** वीडियो रो थंबनेल एकदम साफ़ और चोखो होवणो चाईजै। ज्यादा क्लिक लेवण खातिर थंबनेल माथै लिख्योड़ो कम राखो और फोटो बढ़िया लगाओ सा।" } },
  { pattern: /script|fact video|ai script/i, answers: { Hinglish: "📝 **Video Scripting:** Ek achhi fact video ki script mein pehle 3 second ka 'Hook' bahut zaroori hai jo viewer ko rok le. AI ka use karke aap trending topics par zabardast script likhwa sakte hain.", English: "📝 **Video Scripting:** A good fact video script must have a strong 3-second 'Hook' to grab the viewer's attention. You can use AI to write engaging scripts on trending topics.", Hindi: "📝 **वीडियो स्क्रिप्टिंग:** एक अच्छी फैक्ट वीडियो की स्क्रिप्ट में पहले 3 सेकंड का 'हुक' बहुत जरूरी है जो दर्शक को रोक ले। एआई का इस्तेमाल करके आप शानदार स्क्रिप्ट लिखवा सकते हैं।", Marwadi: "📝 **वीडियो स्क्रिप्ट:** एक चोखी फैक्ट वीडियो रै सुरू आला 3 सेकंड घणा जरूरी होवै जिणसूं देखण आळो रुक जावै। एआई रै मद्दत सूं थे चोखी स्क्रिप्ट बणा सको हो।" } },

  // --- Batch 44: High-Value Local Farming ---
  { pattern: /isabgol|ghoda jeera/i, answers: { Hinglish: "🌾 **Isabgol (Ghoda Jeera):** Retili mitti aur thandi sardiyon (jaise Churu/Sardarshahar mein) ke liye yeh ek Cash Crop hai. Iske beej ka chilka (husk) pet ki bimariyon mein kaam aata hai aur yeh kisan ko bhari munafa deta hai.", English: "🌾 **Isabgol (Psyllium Husk):** It is a cash crop suitable for sandy soils and cold winters. Its husk is used for stomach ailments and provides huge profits to farmers.", Hindi: "🌾 **ईसबगोल (घोड़ा जीरा):** रेतीली मिट्टी और ठंडी सर्दियों के लिए यह एक शानदार नकदी फसल है। इसका छिलका पेट की बीमारियों में काम आता है और यह भारी मुनाफा देता है।", Marwadi: "🌾 **ईसबगोल (घोड़ा जीरो):** रेतीली माटी और ठंडे इलाकां खातिर आ एक चोखी नकदी फसल है। ईंरो छिलको पेट रै सांतरी रै काम आवै और पईसा भी चोखा बणै सा।" } },
  { pattern: /tarbandi|taarbandi|awara pashu/i, answers: { Hinglish: "🚧 **Tarbandi Yojana:** Awara pashuon se fasal bachane ke liye khet ke charo taraf taarbandi (wire fencing) lagwane par Rajasthan sarkar lagbhag 50% subsidy (ya ₹40,000 tak) deti hai.", English: "🚧 **Tarbandi Yojana:** To protect crops from stray animals, the Rajasthan government provides a 50% subsidy (up to ₹40,000) for installing wire fencing around the field.", Hindi: "🚧 **तारबंदी योजना:** आवारा पशुओं से फसल बचाने के लिए खेत के चारों तरफ तारबंदी (फेंसिंग) करवाने पर राजस्थान सरकार लगभग 50% सब्सिडी (या ₹40,000 तक) देती है।", Marwadi: "🚧 **तारबंदी योजना:** आवारा पशुवां सूं फसल बचावण खातिर खेत रै चारूं कानी तारबंदी करण पर राजस्थान सरकार 50% ताईं (या ₹40,000) सब्सिडी देवै सा।" } },

  // --- Batch 45: Future Visions & Smart Infrastructure ---
  { pattern: /mechanical engineer|automobile|rto officer/i, answers: { Hinglish: "⚙️ **Mechanical Engineering:** Agar aapko machines, gadiyo aur engines mein interest hai, toh yeh field best hai. Isi degree ke base par aap RTO Officer (Motor Vehicle Inspector) ka exam bhi de sakte hain!", English: "⚙️ **Mechanical Engineering:** If you are interested in machines, cars, and engines, this field is best. Based on this degree, you can also take the exam for RTO Officer (Motor Vehicle Inspector)!", Hindi: "⚙️ **मैकेनिकल इंजीनियरिंग:** अगर आपको मशीनों, गाड़ियों और इंजन में दिलचस्पी है, तो यह फील्ड सबसे अच्छी है। इसी डिग्री के आधार पर आप RTO ऑफिसर की परीक्षा भी दे सकते हैं!", Marwadi: "⚙️ **मैकेनिकल इंजीनियरिंग:** जदि थानै मशीन, गाड़ियां और इंजन में शौक है, तो आ फील्ड सबसूं चोखी है। ईं पढाई रै बाद थे RTO ऑफिसर रो एग्जाम भी दे सको हो सा।" } },
  { pattern: /surakshit marg|accident rokna|road safety/i, answers: { Hinglish: "🛣️ **Surakshit Marg AI:** Yeh ek next-level innovation hai jahan AI cameras aur sensors ka use karke sadko par hone wale accidents ko roka jata hai aur emergency aane par turant ambulance ko alert bheja jata hai.", English: "🛣️ **Surakshit Marg AI:** This is a next-level innovation where AI cameras and sensors are used to prevent road accidents and send instant alerts to ambulances during emergencies.", Hindi: "🛣️ **सुरक्षित मार्ग AI:** यह एक आधुनिक तकनीक है जहां एआई कैमरे और सेंसर का उपयोग करके सड़क हादसों को रोका जाता है और आपातकाल में एंबुलेंस को तुरंत अलर्ट भेजा जाता है।", Marwadi: "🛣️ **सुरक्षित मार्ग AI:** आ एक घणी जोरदार तकनीक है जठै एआई कैमरा और सेंसर सूं सड़क हादसां नै रोक्यो जावै और कोई एक्सीडेंट होवण पर एंबुलेंस नै झटपट मैसेज भेज्यो जावै।" } },
];

function smartSearch(input: string, lang: Lang): string {
  const q = input.toLowerCase();
  const t = UI_TEXT[lang];

  // Land-based crop calculation (priority check)
  const landMatch = q.match(/(\d+)\s*(acre|bigha|hectare)/);
  if (landMatch && /crop|fasal|kaunsi|konsi|pani|water|acchi/.test(q)) {
    const size = parseInt(landMatch[1]);
    const unit = landMatch[2];
    return t.botPrefix + `**${size} ${unit} Land Details:**\n\n1. **Best Crop:** Bajra ya Guar (kam pani)\n2. **Bajra Water:** ${size * 1000} cubic meters (1-2 sinchai)\n3. **Guar Water:** ${size * 800} cubic meters (3-4 sinchai)\n4. **Beej Bajra:** ${size * 5} kg | **Beej Guar:** ${size * 6} kg\n\n✅ Calculation complete.`;
  }

  // --- Check multi-lang (pattern) entries first (higher priority) ---
  let bestPatternMatch: { answers: { [key: string]: string } } | null = null;
  for (const entry of kisanTechGK) {
    if (isMultiLang(entry) && entry.pattern.test(input)) {
      bestPatternMatch = entry;
      break;
    }
  }

  if (bestPatternMatch) {
    const answer = bestPatternMatch.answers[lang] || bestPatternMatch.answers["Hinglish"] || Object.values(bestPatternMatch.answers)[0];
    return t.botPrefix + answer;
  }

  // --- Legacy keyword matching (best score wins) ---
  let bestMatch: { answer: string; score: number } = { answer: "", score: 0 };

  for (const entry of kisanTechGK) {
    if (isMultiLang(entry)) continue; // skip pattern entries
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) {
        score++;
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { answer: entry.answer, score };
    }
  }

  if (bestMatch.score > 0) {
    return t.botPrefix + bestMatch.answer;
  }

  // Fallback
  return t.fallback;
}

export async function sendMessage(
  messages: Message[],
  lang: Lang,
  _profileLandSize?: string
): Promise<string> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) return UI_TEXT[lang].fallback;

  // Simulate slight delay for natural feel
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

  return smartSearch(lastUserMsg.content, lang);
}

export function generateId(): string {
  return crypto.randomUUID();
}
