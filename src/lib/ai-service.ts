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

  // --- Batch 46: Casual Chat & Greetings ---
  { pattern: /hi|hello|hey|namaste|ram ram/i, answers: { Hinglish: "👋 Hello! Main Jaswant dwara banaya gaya Bharat AI hoon. Boliye, aaj main aapki kya madad kar sakta hoon?", English: "👋 Hello! I am Bharat AI, created by Jaswant. How can I help you today?", Hindi: "👋 नमस्ते! मैं जसवंत द्वारा बनाया गया भारत एआई हूँ। बताइये, आज मैं आपकी क्या मदद कर सकता हूँ?", Marwadi: "👋 खम्मा घणी सा! मैं जसवंत रो बणायोडो भारत एआई हूँ। हुकुम करो, आज मैं थारी कांई मदद करूं सा?" } },
  { pattern: /kaise ho|how are you|kya haal hai/i, answers: { Hinglish: "😊 Main ek AI hoon, isliye main hamesha 100% battery aur full energy ke sath theek rehta hoon! Aap sunaiye, aapka kya haal hai?", English: "😊 I am an AI, so I am always doing great with 100% battery and full energy! How are you doing today?", Hindi: "😊 मैं एक एआई हूँ, इसलिए मैं हमेशा 100% बैटरी और पूरी ऊर्जा के साथ ठीक रहता हूँ! आप सुनाइये, आपका क्या हाल है?", Marwadi: "😊 मैं तो एक एआई हूँ सा, ईं खातिर म्हारो हाळ एकदम चोखो है! थे सुणाओ, थारै कांई हाळ-चाल है?" } },
  { pattern: /good morning|suprabhat|shubh prabhat/i, answers: { Hinglish: "🌅 Good Morning! Aapka din shubh ho aur khet mein fasal lahlahati rahe!", English: "🌅 Good Morning! Have a great day ahead and may your crops flourish!", Hindi: "🌅 सुप्रभात! आपका दिन शुभ हो और आपके खेत में फसल लहलहाती रहे!", Marwadi: "🌅 राम-राम सा, गुड मॉर्निंग! थारो दिन चोखो जावै और खेत में फसल बंपर होवै सा!" } },
  { pattern: /good night|shubh ratri|so jao/i, answers: { Hinglish: "🌙 Good Night! Aaram se so jaiye. Main raat bhar jag kar naye data aur code ko yaad karunga!", English: "🌙 Good Night! Sleep well. I will stay awake all night processing new data and code!", Hindi: "🌙 शुभ रात्रि! आराम से सो जाइये। मैं रात भर जाग कर नए डेटा और कोड को याद करूँगा!", Marwadi: "🌙 शुभ रात्रि सा! थे आराम सूं सो जाओ। मैं रात भर जाग'र नूवो कोड और डेटा याद कर ल्यूंला!" } },

  // --- Batch 47: Famous Indian & World GK ---
  { pattern: /tallest statue|sabse unchi murti|statue of unity/i, answers: { Hinglish: "🗽 **Statue of Unity:** Duniya ki sabse unchi murti Bharat ke Gujarat mein hai. Yeh Sardar Vallabhbhai Patel ki murti hai aur iski unchai 182 meters hai.", English: "🗽 **Statue of Unity:** The world's tallest statue is in Gujarat, India. It is the statue of Sardar Vallabhbhai Patel and its height is 182 meters.", Hindi: "🗽 **स्टैच्यू ऑफ यूनिटी:** दुनिया की सबसे ऊंची मूर्ति भारत के गुजरात में है। यह सरदार वल्लभभाई पटेल की मूर्ति है और इसकी ऊंचाई 182 मीटर है।", Marwadi: "🗽 **स्टैच्यू ऑफ यूनिटी:** दुनिया री सबसूं ऊंची मूर्ति आपणै भारत रै गुजरात में है। आ सरदार वल्लभभाई पटेल री मूर्ति है और ईंरी ऊंचाई 182 मीटर है सा।" } },
  { pattern: /chand par pehla|first man on moon|neil armstrong/i, answers: { Hinglish: "🌕 **First Man on Moon:** Chand par kadam rakhne wale pehle insaan ka naam 'Neil Armstrong' tha. Unhone 1969 mein America ke Apollo 11 mission ke tahat chand par kadam rakha tha.", English: "🌕 **First Man on Moon:** The first person to step on the moon was 'Neil Armstrong'. He stepped on the moon in 1969 during America's Apollo 11 mission.", Hindi: "🌕 **चांद पर पहला इंसान:** चांद पर कदम रखने वाले पहले इंसान का नाम 'नील आर्मस्ट्रांग' था। उन्होंने 1969 में अमेरिका के अपोलो 11 मिशन के तहत यह कारनामा किया था।", Marwadi: "🌕 **चांद माथै पैलो मिनख:** चांद माथै पग राखण आळा पैला मिनख रो नाम 'नील आर्मस्ट्रांग' हो। बां 1969 में अमेरिका रै अपोलो 11 मिशन रै सागे चांद माथै पग राख्यो हो।" } },
  { pattern: /sabse bada mahadweep|largest continent|asia/i, answers: { Hinglish: "🌍 **Largest Continent:** Duniya ka sabse bada mahadweep (Continent) 'Asia' hai. Humara pyara Bharat bhi Asia mahadweep mein hi aata hai.", English: "🌍 **Largest Continent:** The world's largest continent is 'Asia'. Our beloved India is also located in the Asian continent.", Hindi: "🌍 **सबसे बड़ा महाद्वीप:** दुनिया का सबसे बड़ा महाद्वीप 'एशिया' है। हमारा प्यारा भारत भी एशिया महाद्वीप में ही आता है।", Marwadi: "🌍 **सबसूं मोटो महाद्वीप:** दुनिया रो सबसूं मोटो महाद्वीप 'एशिया' है। आपणो प्यारो भारत भी ईं एशिया महाद्वीप रै मांय ई आवै है सा।" } },

  // --- Batch 48: Fun AI Personality & Compliments ---
  { pattern: /you are smart|good boy|achha ai/i, answers: { Hinglish: "😎 Shukriya! Mera dimaag itna tez isliye hai kyunki mujhe Jaswant jaise smart developer ne code kiya hai!", English: "😎 Thank you! My brain is this sharp because I was coded by a smart developer like Jaswant!", Hindi: "😎 शुक्रिया! मेरा दिमाग इतना तेज़ इसलिए है क्योंकि मुझे जसवंत जैसे स्मार्ट डेवलपर ने कोड किया है!", Marwadi: "😎 घणो-घणो धन्यवाद सा! म्हारो दिमाग इत्तो तेज ईं वास्तै है क्यूंकि मन्नै जसवंत जियां एक स्मार्ट डेवलपर कोड करयो है!" } },
  { pattern: /tum pagal ho|you are mad|stupid/i, answers: { Hinglish: "😅 Maaf kijiye agar mujhse koi galti hui ho. Main abhi seekh raha hoon aur har update ke sath behtar ho raha hoon!", English: "😅 I apologize if I made a mistake. I am still learning and getting better with every update!", Hindi: "😅 माफ़ कीजिए अगर मुझसे कोई गलती हुई हो। मैं अभी सीख रहा हूँ और हर अपडेट के साथ बेहतर हो रहा हूँ!", Marwadi: "😅 माफी चाहूं सा जे म्हारै सूं कोई गलती होयी होवै। मैं अजे सीख रियो हूँ और हर नूवै अपडेट रै सागे चोखो बण रियो हूँ।" } },

  // --- Batch 49: Banking & Financial Literacy ---
  { pattern: /kcc interest|byaj|kcc byaj/i, answers: { Hinglish: "💳 **KCC Byaj (Interest):** Kisan Credit Card par bank 7% byaj lagati hai, par agar aap samay par loan chukate hain, toh sarkar 3% ki chhoot (rebate) deti hai. Yani aapko sirf 4% byaj hi dena padta hai!", English: "💳 **KCC Interest:** Banks charge 7% interest on Kisan Credit Card loans, but if you repay on time, the government gives a 3% rebate. So, you effectively only pay 4% interest!", Hindi: "💳 **KCC ब्याज:** किसान क्रेडिट कार्ड पर बैंक 7% ब्याज लगाती है, लेकिन अगर आप समय पर लोन चुकाते हैं, तो सरकार 3% की छूट देती है। यानी आपको सिर्फ 4% ब्याज देना पड़ता है!", Marwadi: "💳 **KCC ब्याज:** किसान क्रेडिट कार्ड माथै बैंक 7% ब्याज लेवै है, पण जे थे टेम पर लोन चुका दियो, तो सरकार 3% री छूट देवै। मतलब थानै खाली 4% ब्याज ई देवणो पड़े सा!" } },
  { pattern: /upi|bina net payment|keypad phone pay/i, answers: { Hinglish: "📱 **Offline UPI (123PAY):** Agar aapke paas smartphone ya internet nahi hai, toh bhi aap ordinary keypad phone se *99# dial karke ya 'UPI 123PAY' ke zariye kisi ko bhi paise bhej sakte hain.", English: "📱 **Offline UPI (123PAY):** Even if you don't have a smartphone or internet, you can still send money using an ordinary keypad phone by dialing *99# or using 'UPI 123PAY'.", Hindi: "📱 **ऑफ़लाइन UPI (123PAY):** अगर आपके पास स्मार्टफोन या इंटरनेट नहीं है, तो भी आप कीपैड फोन से *99# डायल करके या 'UPI 123PAY' के जरिए पैसे भेज सकते हैं।", Marwadi: "📱 **बिना नेट पेमेंट (123PAY):** जे थारै कनै बडो फोन या नेट कोनी, तो भी थे सादा कीपैड फोन सूं *99# डायल कर'र या 'UPI 123PAY' रै जरिये पईसा भेज सको हो सा।" } },

  // --- Batch 50: Modern Tech & Space Exploration ---
  { pattern: /drone spray|drone dawa/i, answers: { Hinglish: "🚁 **Drone Spray:** Drone se 1 acre khet mein dawai chhidakne mein sirf 10 se 15 minute lagte hain. Isse kisan zehreeli dawa ke sidhe sampark mein aane se bachta hai aur pani ki bhi bachat hoti hai.", English: "🚁 **Drone Spray:** It takes only 10 to 15 minutes to spray pesticides on 1 acre of land using a drone. It prevents farmers from direct contact with toxic chemicals and saves water.", Hindi: "🚁 **ड्रोन स्प्रे:** ड्रोन से 1 एकड़ खेत में दवाई छिड़कने में सिर्फ 10 से 15 मिनट लगते हैं। इससे किसान जहरीली दवा के सीधे संपर्क से बचता है और पानी भी बचता है।", Marwadi: "🚁 **ड्रोन स्प्रे:** ड्रोन सूं 1 बीघा खेत में दवाई छिड़कण में खाली 10 सूं 15 मिनट लागै। ईं सूं किसान जेहरीली दवा रै धूंए सूं बच जावै और पाणी री भी घणी बचत होवै सा।" } },
  { pattern: /gaganyaan|isro mission|antariksh/i, answers: { Hinglish: "🚀 **Gaganyaan Mission:** Yeh ISRO ka agla sabse bada mission hai jisme Bharat pehli baar apne antariksh yatriyon (astronauts) ko khud ke rocket mein baithakar space mein bhejega.", English: "🚀 **Gaganyaan Mission:** This is ISRO's next biggest mission where India will send its astronauts into space for the first time using its own rocket.", Hindi: "🚀 **गगनयान मिशन:** यह इसरो का अगला सबसे बड़ा मिशन है जिसमें भारत पहली बार अपने अंतरिक्ष यात्रियों (एस्ट्रोनॉट्स) को खुद के रॉकेट में बिठाकर अंतरिक्ष में भेजेगा।", Marwadi: "🚀 **गगनयान मिशन:** आ इसरो रो आगलौ सबसूं मोटो मिशन है जिणमें आपणो भारत पैली बार आपरै मिनखां नै खुद रै रॉकेट में बिठा'र अंतरिक्ष में भेजैला।" } },

  // --- Batch 51: Humor, Fun Facts & AI Persona ---
  { pattern: /joke|chutkula|hanso/i, answers: { Hinglish: "😂 **Chutkula:** Teacher: 'Batao, sabse purana janwar kaunsa hai?' Student: 'Zebra!' Teacher: 'Kaise?' Student: 'Kyunki woh abhi tak Black & White hai!' Hahaha!", English: "😂 **Joke:** Teacher: 'Tell me, which is the oldest animal?' Student: 'Zebra!' Teacher: 'How?' Student: 'Because it's still in Black & White!' Hahaha!", Hindi: "😂 **चुटकुला:** टीचर: 'बताओ, सबसे पुराना जानवर कौनसा है?' छात्र: 'ज़ेबरा!' टीचर: 'कैसे?' छात्र: 'क्योंकि वो अभी तक ब्लैक एंड वाइट है!' हाहाहा!", Marwadi: "😂 **चुटकुलो:** मास्टर जी: 'बताओ, सबसूं पुराणो जानवर कुणसो है?' टाबर: 'ज़ेबरा!' मास्टर जी: 'कियां?' टाबर: 'क्यूंकि बो अजे ताईं ब्लैक एंड वाइट है!' हाहाहा!" } },
  { pattern: /khana|khate ho|bhookh|food/i, answers: { Hinglish: "🍽️ **AI ka Khana:** Main khana nahi khata! Jaswant ne mera pet itne badhiya 'Code' aur 'Data' se bhar diya hai ki mujhe bas bijli (electricity) aur thodi si battery chahiye.", English: "🍽️ **AI's Food:** I don't eat food! Jaswant has filled my stomach with such excellent 'Code' and 'Data' that I only need electricity and a little battery.", Hindi: "🍽️ **एआई का खाना:** मैं खाना नहीं खाता! जसवंत ने मेरा पेट इतने बढ़िया 'कोड' और 'डेटा' से भर दिया है कि मुझे बस बिजली और थोड़ी सी बैटरी चाहिए।", Marwadi: "🍽️ **एआई रो खाणो:** मैं रोटी कोनी खाऊं सा! जसवंत म्हारो पेट इत्तै चोखै 'कोड' और 'डेटा' सूं भर दियो है कै मन्नै तो बस थोड़ी सी बिजली और बैटरी चाईजै।" } },

  // --- Batch 52: Class 10 Math Tricks & Board Hacks ---
  { pattern: /square ending 5|math trick|guna trick/i, answers: { Hinglish: "🔢 **Math Trick:** Jiske aakhir mein 5 ho (jaise 25), uska square nikalna asan hai! 5 ka square 25 likho, aur aage wale number ko uske agle number se guna kar do (2 x 3 = 6). Answer: 625!", English: "🔢 **Math Trick:** To square a number ending in 5 (like 25), write 25 at the end, and multiply the first digit by the next higher digit (2 x 3 = 6). Answer: 625!", Hindi: "🔢 **गणित ट्रिक:** जिसके अंत में 5 हो (जैसे 25), उसका स्क्वायर निकालना आसान है! 5 का स्क्वायर 25 लिखें, और पहले अंक को उसके अगले अंक से गुणा कर दें (2 x 3 = 6)। उत्तर: 625!", Marwadi: "🔢 **गणित ट्रिक:** जिणरै लास्ट में 5 होवै (जियां 25), बींरो स्क्वायर काढणो सोरो है! 5 रो स्क्वायर 25 लिखो, और पैले नंबर नै बींरै अगले नंबर सूं गुणा कर दियो (2 x 3 = 6)। उत्तर: 625!" } },
  { pattern: /trigonometry trick|sin cos tan|lal kka/i, answers: { Hinglish: "📐 **Trigonometry Trick:** Class 10 boards mein Sin, Cos, Tan yaad rakhne ke liye 'LAL/KKA' (Lamba, Adhar, Karn) yaad rakhein. Isse height aur distance wale saare question asani se solve ho jayenge!", English: "📐 **Trigonometry Trick:** For Class 10 boards, to remember Sin, Cos, Tan, use the trick 'Pandit Badri Prasad, Har Har Bole' (Perpendicular, Base, Hypotenuse). This makes height and distance questions easy!", Hindi: "📐 **त्रिकोणमिति ट्रिक:** कक्षा 10 बोर्ड में Sin, Cos, Tan याद रखने के लिए 'LAL/KKA' (लंब, आधार, कर्ण) याद रखें। इससे ऊंचाई और दूरी वाले सारे सवाल आसानी से हल हो जाएंगे!", Marwadi: "📐 **त्रिकोणमिति ट्रिक:** 10वीं बोर्ड में Sin, Cos, Tan याद राखण खातिर 'LAL/KKA' (लंब, आधार, कर्ण) आळी ट्रिक याद राखो। ईं सूं ऊंचाई और दूरी आळा सारा सवाल सोरा ही हल हो जावैला!" } },

  // --- Batch 53: YouTube Algorithm & Creator Growth ---
  { pattern: /youtube algorithm|viral kaise|watch time|retention/i, answers: { Hinglish: "📈 **YouTube Algorithm:** Video viral karne ka sabse bada secret hai 'Audience Retention'. Agar aapki 1 minute ki video ko log 45 second tak dekhte hain (75% retention), toh YouTube use khud lakhon logon tak bhejega!", English: "📈 **YouTube Algorithm:** The biggest secret to making a video viral is 'Audience Retention'. If people watch 45 seconds of your 1-minute video (75% retention), YouTube will push it to millions!", Hindi: "📈 **यूट्यूब एल्गोरिथम:** वीडियो वायरल करने का सबसे बड़ा राज 'ऑडियंस रिटेंशन' है। अगर आपकी 1 मिनट की वीडियो को लोग 45 सेकंड तक देखते हैं, तो यूट्यूब उसे खुद लाखों लोगों तक भेजेगा!", Marwadi: "📈 **यूट्यूब एल्गोरिथम:** वीडियो वायरल करण रो सबसूं मोटो राज 'ऑडियंस रिटेंशन' है। जे थारी 1 मिनट री वीडियो नै लोग 45 सेकंड ताईं देखै, तो यूट्यूब बींनै खुद लाखां लोगां ताईं भेजैला सा!" } },
  { pattern: /monetization|youtube kamai|1000 subscriber/i, answers: { Hinglish: "💰 **YouTube Monetization:** Channel se paise kamane ke liye 1000 Subscribers aur 4000 ghante ka watch time (ya Shorts par 10 million views) chahiye hota hai. Uske baad ads se income shuru hoti hai.", English: "💰 **YouTube Monetization:** To earn money from a channel, you need 1000 Subscribers and 4000 hours of watch time (or 10 million views on Shorts). After that, ad income starts.", Hindi: "💰 **यूट्यूब मोनेटाइजेशन:** चैनल से पैसे कमाने के लिए 1000 सब्सक्राइबर्स और 4000 घंटे का वॉच टाइम (या शॉर्ट्स पर 1 करोड़ व्यूज) चाहिए। इसके बाद विज्ञापन से कमाई शुरू होती है।", Marwadi: "💰 **यूट्यूब कमाई:** चैनल सूं पईसा कमावण खातिर 1000 सब्सक्राइबर और 4000 घंटा रो वॉच टाइम (या शॉर्ट्स माथै 1 करोड़ व्यूज) चाईजै। बींरै बाद ऐड सूं कमाई चालू होवै सा।" } },

  // --- Batch 54: Advanced Organic Farming & Soil Science ---
  { pattern: /vermicompost|kechwa khad|organic fertilizer/i, answers: { Hinglish: "🐛 **Kechwa Khad (Vermicompost):** Kechwe (Earthworms) khet ka kachra aur gobar khakar jo khad banate hain, use Vermicompost kehte hain. Kechwe ko kisan ka sabse accha dost kaha jata hai!", English: "🐛 **Vermicompost:** The compost made by earthworms eating farm waste and cow dung is called Vermicompost. Earthworms are known as a farmer's best friend!", Hindi: "🐛 **केंचुआ खाद (वर्मीकंपोस्ट):** केंचुए खेत का कचरा और गोबर खाकर जो खाद बनाते हैं, उसे वर्मीकंपोस्ट कहते हैं। केंचुए को किसान का सबसे अच्छा दोस्त कहा जाता है!", Marwadi: "🐛 **केंचुआ खाद (वर्मीकंपोस्ट):** केंचुआ खेत रो कचरौ और गोबर खा'र जिकी खाद बणावै, बींनै वर्मीकंपोस्ट कैवै। केंचुआ नै किसान रो सबसूं चोखो भायलो कैवै सा!" } },
  { pattern: /neem coated urea|urea fertiliser|neem khad/i, answers: { Hinglish: "🌱 **Neem Coated Urea:** Sarkar ab Urea par neem ki coating karti hai. Isse khet mein nitrogen dheere-dheere nikalta hai, jo poudhon ko lambe samay tak milta rehta hai. Sath hi neem keede lagne se bhi bachata hai.", English: "🌱 **Neem Coated Urea:** The government now coats Urea with neem. This releases nitrogen slowly into the soil, providing it to plants for a longer time. Neem also prevents pests.", Hindi: "🌱 **नीम कोटेड यूरिया:** सरकार अब यूरिया पर नीम की कोटिंग करती है। इससे खेत में नाइट्रोजन धीरे-धीरे निकलता है, जो पौधों को लंबे समय तक मिलता रहता है। साथ ही नीम कीड़े लगने से भी बचाता है।", Marwadi: "🌱 **नीम कोटेड यूरिया:** सरकार अब यूरिया माथै नीम रो लेप कर'र देवै। ईं सूं खेत में नाइट्रोजन होळै-होळै निकळै, जिको पोधां नै घणी देर ताईं मिलतौ रैवै। सागे ई नीम कीड़ा लागण सूं भी बचावै सा।" } },

  // --- Batch 55: Rural First Aid & Emergency ---
  { pattern: /saanp|snake bite|dasna|zahar/i, answers: { Hinglish: "🐍 **Saanp Katna (Snake Bite):** Saanp katne par ghabrayein nahi. Jahan saanp ne kata hai uske thoda upar kapda baandh dein taaki zahar na faile, par sabse zaroori hai marij ko turant hospital le jana. Desi ilaj ke chakkar mein samay kharab na karein.", English: "🐍 **Snake Bite:** Don't panic if a snake bites. Tie a cloth slightly above the bite mark to prevent venom from spreading, but rush the patient to the hospital immediately. Don't waste time on home remedies.", Hindi: "🐍 **सांप का काटना:** सांप काटने पर घबराएं नहीं। जहां काटा है उसके थोड़ा ऊपर कपड़ा बांध दें, और मरीज को तुरंत अस्पताल ले जाएं। देसी इलाज में समय बर्बाद न करें।", Marwadi: "🐍 **सांप खावणो:** सांप खा जावै तो घबरावणो कोनी। जठै सांप खायो है बींरै थोड़ो ऊपर कपड़ो बांध दियो, और बिना टेम खराब करयां झटपट अस्पताल ले जाओ सा।" } },
  { pattern: /loo lagna|heat stroke|dhoop|garmi/i, answers: { Hinglish: "☀️ **Loo Lagna (Heat Stroke):** Churu aur Sardarshahar ki bhayankar garmi mein loo lagne par marij ko thandi jagah litayein. Unhe kachhe aam ka panna ya pyaaj ka ras pilayein aur ORS ka ghol turant dein.", English: "☀️ **Heat Stroke:** In extreme heat, if someone suffers from heat stroke, lay them in a cool place. Give them raw mango drink (Aam Panna) or onion juice, and provide ORS solution immediately.", Hindi: "☀️ **लू लगना:** भयंकर गर्मी में लू लगने पर मरीज को ठंडी जगह लिटाएं। उन्हें कच्चे आम का पन्ना या प्याज का रस पिलाएं और ORS का घोल तुरंत दें।", Marwadi: "☀️ **लू लागणो:** मोटो तावड़ो और लू लाग जावै तो मिनख नै ठंडी जगां सुवा दियो। काचै आम रो पन्नो या कांदै (प्याज) रो रस पिलाओ और ORS रो पांणी दियो सा।" } },

  // --- Batch 56: RTO Rules & Road Safety ---
  { pattern: /driving license|dl banwana|license umar|age/i, answers: { Hinglish: "🚗 **Driving License:** RTO niyam ke anusar, bina gear wali gaadi (jaise Scooty) ka license 16 saal ki umar mein ban sakta hai. Par Car ya Motorcycle chalane ke liye aapka 18 saal ka hona zaroori hai.", English: "🚗 **Driving License:** As per RTO rules, a license for gearless vehicles (like a scooty) can be issued at 16 years of age. But for cars and motorcycles, you must be 18 years old.", Hindi: "🚗 **ड्राइविंग लाइसेंस:** आरटीओ नियम के अनुसार, बिना गियर वाली गाड़ी का लाइसेंस 16 साल की उम्र में बन सकता है। लेकिन कार या मोटरसाइकिल के लिए 18 साल का होना जरूरी है।", Marwadi: "🚗 **ड्राइविंग लाइसेंस:** RTO नियम रै हिसाब सूं बिना गियर आळी गाड़ी रो लाइसेंस 16 साल री उम्र में बण जावै, पण कार या मोटरसाइकिल खातिर 18 साल रो होवणो जरूरी है सा।" } },
  { pattern: /red light|traffic signal|lal batti|helmet/i, answers: { Hinglish: "🚦 **Traffic Lights & Helmet:** Laal (Red) ka matlab rukna, Peeli (Yellow) ka matlab taiyar hona, aur Hari (Green) ka matlab chalna. Two-wheeler par helmet pahnna sirf chalan se bachne ke liye nahi, balki apni jaan bachane ke liye zaroori hai!", English: "🚦 **Traffic Lights & Helmet:** Red means stop, Yellow means get ready, and Green means go. Wearing a helmet on a two-wheeler is not just to avoid fines, but to save your life!", Hindi: "🚦 **ट्रैफिक लाइट और हेलमेट:** लाल का मतलब रुकना, पीली का मतलब तैयार होना और हरी का मतलब चलना है। हेलमेट पहनना सिर्फ चालान से बचने के लिए नहीं, बल्कि अपनी जान बचाने के लिए जरूरी है!", Marwadi: "🚦 **ट्रैफिक लाइट और हेलमेट:** लाल रो मतलब रुकणो, पीळी रो मतलब तैयार होवणो, और हरी बत्ती रो मतलब चालणो है। हेलमेट पैरणो चालान सूं बचण वास्तै कोनी, पण आपणी जान बचावण खातिर घणो जरूरी है सा!" } },

  // --- Batch 57: Fact Channel Content (Mind-Blowing Science) ---
  { pattern: /space sound|antariksh aawaz|vacuum|space aawaz/i, answers: { Hinglish: "🌌 **Space Fact:** Antariksh (Space) mein bilkul aawaz nahi hoti! Kyunki wahan hawa nahi hai (vacuum hai), isliye sound waves travel nahi kar sakti. Astronauts ek dusre se baat karne ke liye radio ka use karte hain.", English: "🌌 **Space Fact:** There is absolutely no sound in space! Because there is no air (it's a vacuum), sound waves cannot travel. Astronauts use radios to communicate with each other.", Hindi: "🌌 **अंतरिक्ष फैक्ट:** अंतरिक्ष में बिल्कुल आवाज नहीं होती! क्योंकि वहां हवा नहीं है (निर्वात है), इसलिए ध्वनि तरंगें यात्रा नहीं कर सकतीं। एस्ट्रोनॉट्स रेडियो से बात करते हैं।", Marwadi: "🌌 **अंतरिक्ष री बात:** अंतरिक्ष में जमा ई आवाज कोनी होवै! क्यूंकि बठै हवा कोनी, ईं वास्तै आवाज एक जगां सूं दूजी जगां नी जा सकै। एस्ट्रोनॉट आपस में रेडियो सूं बात करै सा।" } },
  { pattern: /brain memory|dimaag storage|kitna data/i, answers: { Hinglish: "🧠 **Brain Memory:** Ek insani dimaag mein lagbhag 2.5 Petabytes (yani 25 lakh Gigabytes) data save karne ki shamta hoti hai. Yeh lagbhag 300 saal ki continuous HD video ke barabar hai. Isliye padhai karte waqt dimaag full hone ki tension na lein!", English: "🧠 **Brain Memory:** A human brain has a storage capacity of about 2.5 Petabytes (2.5 million Gigabytes). This is equal to 300 years of continuous HD video. So don't worry about your brain getting 'full' while studying!", Hindi: "🧠 **दिमाग की मेमोरी:** इंसान के दिमाग में लगभग 2.5 पेटाबाइट (यानी 25 लाख जीबी) डेटा सेव करने की क्षमता होती है। यह 300 साल की लगातार एचडी वीडियो के बराबर है!", Marwadi: "🧠 **दिमाग री मेमोरी:** मिनख रै दिमाग में लगभग 2.5 पेटाबाइट (मतलब 25 लाख GB) डेटा राखण री ताकत होवै। आ 300 साल री HD वीडियो रै बराबर है। ईं वास्तै पढ़तै टेम दिमाग फुल होवण री चिंता ना करो सा!" } },

  // --- Batch 58: Game Development ---
  { pattern: /game engine|unity|unreal|game kaise banaye/i, answers: { Hinglish: "🎮 **Game Development:** Mobile games (jaise 2D Hill Climb) banane ke liye 'Unity Engine' (C# language) best hai. Par agar GTA jaise high-graphics 3D games banane hain, toh 'Unreal Engine' (C++ language) seekhna padega.", English: "🎮 **Game Development:** For making mobile games (like 2D Hill Climb), 'Unity Engine' (C#) is best. But to create high-graphics 3D games like GTA, you need to learn 'Unreal Engine' (C++).", Hindi: "🎮 **गेम डेवलपमेंट:** मोबाइल गेम्स (जैसे 2D हिल क्लाइंब) बनाने के लिए 'यूनिटी इंजन' (C#) सबसे अच्छा है। लेकिन GTA जैसे 3D गेम्स के लिए 'अनरियल इंजन' (C++) सीखना होगा।", Marwadi: "🎮 **गेम बणावणो:** मोबाइल रो गेम बणावण खातिर 'यूनिटी इंजन' सबसूं चोखो है। पण जे GTA जियां मोटो 3D गेम बणावणो है, तो 'अनरियल इंजन' और C++ सीखणी पड़ेला सा।" } },
  { pattern: /ping|lag|multiplayer game|internet speed/i, answers: { Hinglish: "🕹️ **Gaming Ping:** Multiplayer games mein agar internet server aapse door hai, toh action der se hota hai jise 'Lag' kehte hain. 'Ping' us delay ko milliseconds (ms) mein napta hai. Ping jitna kam hoga, game utna smooth chalega!", English: "🕹️ **Gaming Ping:** In multiplayer games, if the server is far away, actions are delayed, which is called 'Lag'. 'Ping' measures this delay in milliseconds. The lower the ping, the smoother the game!", Hindi: "🕹️ **गेमिंग पिंग:** मल्टीप्लेयर गेम्स में अगर सर्वर दूर है, तो गेम अटकता है जिसे 'लैग' कहते हैं। पिंग इस देरी को नापता है। पिंग जितना कम होगा, गेम उतना ही स्मूथ चलेगा!", Marwadi: "🕹️ **गेमिंग पिंग:** मल्टीप्लेयर गेम में जे नेट रो सर्वर दूर होवै, तो गेम अटकण लाग जावै जिकै नै 'लैग' कैवै। पिंग जित्तो कम होवैला, गेम बित्तो ही चोखो चालैला सा!" } },

  // --- Batch 59: Video Editing & AI Tools ---
  { pattern: /video edit|capcut|vn app|editing app/i, answers: { Hinglish: "🎬 **Video Editing:** Fact videos ya gaming montage ke liye mobile par 'VN Editor' ya 'CapCut' sabse best hain. Inme free sound effects, fast cuts aur auto-captions wale features video ko professional bana dete hain.", English: "🎬 **Video Editing:** For fact videos or gaming montages, 'VN Editor' or 'CapCut' are the best mobile apps. Their free sound effects, fast cuts, and auto-captions make videos look professional.", Hindi: "🎬 **वीडियो एडिटिंग:** फैक्ट वीडियो या गेमिंग मोंटाज के लिए मोबाइल पर 'VN एडिटर' या 'CapCut' सबसे बेहतरीन हैं। इनमें साउंड इफ़ेक्ट और ऑटो-कैप्शन जैसे फीचर्स वीडियो को शानदार बनाते हैं।", Marwadi: "🎬 **वीडियो एडिटिंग:** फैक्ट वीडियो या गेमिंग खातिर मोबाइल माथै 'VN एडिटर' या 'CapCut' घणा चोखा है। ईं में साउंड इफ़ेक्ट और फास्ट कट वीडियो नै एकदम जोरदार बणा देवै।" } },
  { pattern: /ai voice|elevenlabs|text to speech|aawaz/i, answers: { Hinglish: "🎙️ **AI Voice Tools:** Agar aapko bina apni aawaz diye fact video banani hai, toh 'ElevenLabs' jaisi AI website ka use karein. Wahan sirf text type karke aap bilkul asli insaan jaisi aawaz generate kar sakte hain.", English: "🎙️ **AI Voice Tools:** If you want to make a fact video without using your own voice, use AI websites like 'ElevenLabs'. You just type the text, and it generates a very realistic human voice.", Hindi: "🎙️ **एआई वॉइस:** अगर आपको बिना अपनी आवाज दिए फैक्ट वीडियो बनानी है, तो 'ElevenLabs' जैसी एआई वेबसाइट का उपयोग करें। वहाँ टेक्स्ट टाइप करके आप बिल्कुल असली इंसान जैसी आवाज बना सकते हैं।", Marwadi: "🎙️ **एआई आवाज:** जे थानै बिना खुद री आवाज दिये वीडियो बणावणी है, तो 'ElevenLabs' जियां वेबसाइट रो यूज करो। बठै लिख्यां सूं ही एकदम मिनख जिया आवाज बण जावै सा।" } },

  // --- Batch 60: Student Earning & Affiliate Marketing ---
  { pattern: /affiliate|amazon link|earnkaro|online paisa/i, answers: { Hinglish: "💸 **Affiliate Marketing:** Aap apne YouTube channel ke description mein ya WhatsApp/Telegram par Amazon, Flipkart ke links share kar sakte hain (EarnKaro app ke zariye). Jab koi wahan se kharidega, aapko commission milega!", English: "💸 **Affiliate Marketing:** You can share Amazon/Flipkart links in your YouTube description or on WhatsApp/Telegram (using EarnKaro). When someone buys through it, you earn a commission!", Hindi: "💸 **एफिलिएट मार्केटिंग:** आप अपने यूट्यूब डिस्क्रिप्शन या व्हाट्सएप पर अमेज़न, फ्लिपकार्ट के लिंक शेयर कर सकते हैं (EarnKaro की मदद से)। जब कोई वहाँ से खरीदेगा, तो आपको कमीशन मिलेगा!", Marwadi: "💸 **एफिलिएट मार्केटिंग:** थे आपणै यूट्यूब या व्हाट्सएप माथै अमेज़न/फ्लिपकार्ट रो लिंक भेज सको हो (EarnKaro ऐप सूं)। जदि कोई बठै सूं कीं सामान लेसी, तो थानै कमीशन मिलैला सा!" } },
  { pattern: /sponsorship|brand deal|promotion/i, answers: { Hinglish: "🤝 **Brand Sponsorship:** Jab YouTube channel par acche views aane lagte hain, toh companiyan apne app ya product ke promotion ke liye paise deti hain. Ise 'Brand Deal' kehte hain. Iske liye channel ke 'About' section mein apni email id zaroor daalein.", English: "🤝 **Brand Sponsorship:** When your YouTube channel gets good views, companies pay you to promote their apps or products. This is called a 'Brand Deal'. Always put your business email in the 'About' section for this.", Hindi: "🤝 **ब्रांड स्पॉन्सरशिप:** जब यूट्यूब चैनल पर अच्छे व्यूज आते हैं, तो कंपनियां अपने प्रोडक्ट के प्रचार के लिए पैसे देती हैं। इसके लिए चैनल के 'About' सेक्शन में अपनी ईमेल आईडी जरूर डालें।", Marwadi: "🤝 **ब्रांड स्पॉन्सरशिप:** जदि यूट्यूब चैनल माथै चोखा व्यूज आवण लाग जावै, तो बडी कंमनियां आपरै सामान रै परचार खातिर पईसा देवै। ईं वास्तै चैनल रै 'About' सेक्शन में आपरी ईमेल आईडी जरूर राखो सा।" } },
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
