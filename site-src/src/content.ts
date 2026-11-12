/*
 * Every word on the page, in Hindi and English.
 *
 * ⚠ EVERY CLAIM HERE WAS CHECKED AGAINST THE SELLER APP (office-online worktree,
 * dc3d63cc, 12 Nov 2026). Where the app has its own wording, it is used verbatim
 * so the site and the app say the same thing. Before adding a line, find it in
 * the app. Known limits that shaped the copy:
 *   - Freight is an estimate from road distance (the app says "भाड़ा अंदाज़े से").
 *   - "आपको मिलना है" is what is overdue or due today; later money is in the week strip.
 *   - Login codes over WhatsApp are NOT live — only "WhatsApp से लॉगिन" (the seller
 *     sends a message) is. Ordering inside the WhatsApp chat is switched off.
 *   - Accounts are not held for approval; ORDERS are approved by the office.
 *   - The level perk "live tracking (once FASTag comes)" is a promise, so it is left out.
 *   - Example figures are the app's own demo data (Gandak Bio-Energy, Bettiah…) and
 *     are always labelled as examples.
 */

export type Lang = 'hi' | 'en';

export const LINKS = {
  play: 'https://play.google.com/store/apps/details?id=com.shreehari.vendors',
  ios: 'https://apps.apple.com/in/app/osht-agro-trading/id6802507783',
  tel: 'tel:+919935435500',
  telDisplay: '+91 99354 35500',
  whatsapp: 'https://wa.me/919794865500?text=OSHT',
  whatsappDisplay: '97948 65500'
} as const;

const hi = {
  meta: { langName: 'हिंदी', other: 'English', switchTo: 'Switch to English' },
  seo: {
    title: 'OSHT - Agro Trading | ओम श्री हरि ट्रेडिंग प्रा. लि. का ऐप',
    description:
      'OSHT, ओम श्री हरि ट्रेडिंग प्रा. लि. का ऐप: हर मिल का भाव भाड़ा काटकर, हर गाड़ी का पैसा और कागज़, और बोलकर पूछने पर मैडम हिंदी में बताती हैं। Android और iPhone पर मुफ़्त।'
  },
  // The brand's own line — the App Store subtitle and the Play banner say the same.
  headline: { words: ['भाव', 'गाड़ी', 'कागज़', 'पैसा'], and: 'और', tail: 'एक ऐप में।' },
  dawn: {
    title: 'हर सुबह, सबसे अच्छा भाव।',
    sub: 'ऐप खोलते ही सबसे ऊपर — भाड़ा काटकर, हाथ में कितना।',
    scroll: 'नीचे खिसकाइए'
  },
  privacy: 'प्राइवेसी पॉलिसी',
  intro: 'ऐप की शुरुआत',
  skip: 'सीधे मुख्य हिस्से पर जाइए',
  nav: {
    label: 'पन्ने के हिस्से',
    rate: 'भाव',
    money: 'पैसा',
    lorry: 'गाड़ी',
    madam: 'मैडम',
    levels: 'लेवल',
    whatsapp: 'WhatsApp',
    join: 'जुड़िए',
    getApp: 'ऐप लें',
    home: 'OSHT — ऊपर जाइए'
  },
  store: {
    playSmall: 'यहाँ से पाइए',
    playBig: 'Google Play',
    iosSmall: 'यहाँ से पाइए',
    iosBig: 'App Store'
  },
  hero: {
    eyebrow: 'OSHT · ओम श्री हरि ट्रेडिंग प्रा. लि. का ऐप',
    titleA: 'हर सुबह, सबसे अच्छा भाव।',
    titleB: 'भाड़ा काटकर, हाथ में कितना।',
    rotatePrefix: 'और हर',
    rotate: ['गाड़ी का पैसा', 'गाड़ी का कागज़', 'सवाल का जवाब'],
    rotateSuffix: '— एक ही ऐप में।',
    sub: 'OSHT ओम श्री हरि ट्रेडिंग का अपना ऐप है। हर मिल का भाव आपकी जगह से भाड़ा घटाकर दिखाता है, हर गाड़ी का पैसा और कागज़ सँभालता है — और मैडम बोलकर हिंदी में बताती हैं।',
    call: 'ऑफिस को फ़ोन',
    points: ['ब्रोकर और सप्लायर के लिए मुफ़्त', 'हिंदी और English', 'Android और iPhone'],
    phoneAlt: 'OSHT ऐप का होम — आज का सबसे अच्छा भाव, ₹2,474 प्रति क्विंटल हाथ में',
    chipInHand: '/ क्विंटल हाथ में',
    chipBest: 'आपके लिए आज का सबसे अच्छा भाव',
    chipGold: 'गोल्ड सप्लायर',
    example: 'उदाहरण'
  },
  ticker: {
    label: 'हर गाड़ी के कागज़',
    items: ['पार्टी विवरण', 'कांटा पर्ची', 'टैगिंग', 'प्री-अराइवल स्लिप', 'GRN', 'बिल (चालान)', 'फ़ैक्ट्री रसीद', 'खरीद रसीद', 'पर्ची (ऑथराइज़्ड)', 'चेक की फ़ोटो']
  },
  rate: {
    kicker: 'आज का भाव',
    title: 'भाड़ा काटकर, हाथ में कितना',
    body: 'ऐप हर मिल के भाव में से आपकी जगह से मिल तक का भाड़ा घटाता है, और जिस मिल से सबसे ज़्यादा पैसा हाथ में आए, उसे सबसे ऊपर रखता है। साथ में यह भी कि एक गाड़ी (30 टन) पर कितना बनेगा।',
    points: [
      { t: 'अपनी जगह से हिसाब', b: 'गाँव, शहर या पिन कोड डालिए — जगह कभी भी बदल सकते हैं।' },
      { t: 'हाथ का भाव, या मिल का भाव', b: 'एक टैप में दोनों तरह देखिए — भाड़ा काटकर, या मिल का अपना भाव।' },
      { t: 'भाव अलार्म', b: 'एक अंक तय कीजिए — किसी मिल का भाव उससे ऊपर जाए या नीचे आए, तो ऐप बताएगा।' }
    ],
    card: {
      title: 'आज का भाव',
      from: 'Bettiah से',
      tabInHand: 'हाथ में (भाड़ा काटकर)',
      tabMill: 'मिल का भाव',
      rank1: 'आपके लिए #1',
      rankHigh: 'सबसे ऊँचा भाव',
      inHand: 'हाथ में',
      perQtl: '/ क्विंटल',
      millRate: 'मिल का भाव',
      freight: 'भाड़ा',
      perLorry: 'एक गाड़ी (30 टन) पर',
      lakh: 'लाख',
      km: 'किमी',
      payDays: '{n} दिन में पेमेंट',
      behind: 'पहले नंबर से ₹{d} कम · एक गाड़ी पर ₹{l} कम',
      send: 'यहाँ भेजें',
      note: 'उदाहरण — ऐप के डेमो से। भाड़ा दूरी से अंदाज़ा होता है।'
    }
  },
  money: {
    kicker: 'पैसा',
    title: 'हर गाड़ी का पैसा, कब और कितना',
    body: 'पैसा टैब खोलते ही सबसे ऊपर वह रकम, जो आज तक आपको मिल जानी चाहिए। उसके नीचे अगले 7 दिन — किस दिन कितना आना है। और हर गाड़ी अपनी लाइन में: रकम, तय तारीख़, और लेट हो तो कितने दिन।',
    points: [
      { t: 'इस महीने कितना मिला', b: 'महीने भर में आया पैसा, एक नज़र में।' },
      { t: 'बाकी · लेट · मिल गया', b: 'एक टैप में छाँटिए — किस गाड़ी का पैसा कहाँ अटका है।' },
      { t: 'लेट है? सीधे ऑफिस को फ़ोन', b: 'लेट गाड़ी पर “ऑफिस से पूछें” दबाइए, फ़ोन लग जाएगा। पैसा आ गया, तो बैंक की पर्ची भी वहीं।' }
    ],
    card: {
      title: 'पैसा',
      sub: 'हर गाड़ी का पैसा — कब और कितना',
      due: 'आपको मिलना है',
      dueSub: '3 गाड़ियाँ · इनमें 2 लेट',
      month: 'इस महीने मिला',
      next7: 'अगले 7 दिन',
      days: ['गुरु', 'शुक्र', 'शनि', 'रवि', 'सोम', 'मंगल', 'बुध'],
      filters: ['बाकी (9)', 'लेट (2)', 'मिल गया (2)', 'सब'],
      late: '8 दिन लेट',
      dueOn: 'तय था 4 नवंबर',
      ask: 'ऑफिस से पूछें'
    },
    note: 'उदाहरण — ऐप के डेमो से। रकम वज़न × भाव से अंदाज़ा होती है, या बही से — ऐप ऊपर लिखकर बताता है।'
  },
  lorry: {
    kicker: 'गाड़ी और कागज़',
    title: 'गाड़ी कहाँ है, कागज़ पूरे हुए?',
    body: 'हर गाड़ी का सफ़र एक लाइन में — लोड से पेमेंट तक। हर क़दम उसी के कागज़ से पता चलता है।',
    where: 'लॉरी कहाँ है?',
    stages: [
      { t: 'माल लोड हुआ', p: 'पार्टी विवरण' },
      { t: 'मिल के लिए रवाना', p: 'प्री-अराइवल स्लिप' },
      { t: 'मिल पहुँची', p: 'GRN · कांटा पर्ची' },
      { t: 'तौल हुई, माल उतरा', p: 'फ़ैक्ट्री रसीद' },
      { t: 'हिसाब बना', p: 'खरीद रसीद' },
      { t: 'पेमेंट हो गया', p: 'पर्ची (ऑथराइज़्ड)' }
    ],
    statement: 'ड्राइवर को कुछ नहीं करना — यह सब कागज़ों से पता चलता है।',
    papersTitle: 'कागज़',
    you: 'आपसे',
    office: 'ऑफिस से',
    optional: 'ज़रूरी नहीं',
    done: 'आ गया',
    waiting: 'आना बाकी',
    points: [
      { t: 'बस फ़ोटो खींचिए', b: 'कागज़ की फ़ोटो भेजिए — कौन-सा कागज़ है, फ़ोटो के बाद ऐप ख़ुद पूछ लेगा।' },
      { t: 'नेटवर्क नहीं? कोई बात नहीं', b: 'कागज़ फ़ोन में रुका रहता है और सिग्नल आते ही अपने-आप चला जाता है।' },
      { t: 'तीन कागज़, एक PDF', b: 'ऑफिस के तीनों कागज़ एक PDF में, सीधे WhatsApp पर भेजिए।' }
    ]
  },
  madam: {
    kicker: 'मैडम',
    title: 'बोलकर पूछिए, मैडम बताएँगी',
    ask: 'पूछिए —',
    questions: ['मेरी गाड़ी कहाँ है?', 'कौन से कागज़ बाकी हैं?', 'कितने पैसे बाकी हैं?', 'आज क्या हुआ?'],
    body: 'मैडम ऐप की आवाज़ वाली सहायक हैं। माइक दबाकर बोलिए या लिखकर पूछिए — वे आपकी गाड़ी, कागज़ और पैसे का हाल बताती हैं, कागज़ भेज देती हैं, और कहें तो नया सौदा भी दर्ज करती हैं।',
    points: [
      { t: 'सौदा आपकी “हाँ” से', b: 'नया सौदा दर्ज करने से पहले मैडम आपसे “हाँ” बुलवाती हैं।' },
      { t: 'भाव रेट कार्ड से', b: 'सौदे का भाव हमेशा आज के रेट कार्ड से आता है — सुनी हुई बात से नहीं।' },
      { t: 'आपकी भाषा में', b: 'ऐप जिस भाषा में है, मैडम उसी में जवाब देती हैं।' }
    ],
    chips: ['मेरी गाड़ी कहाँ है?', 'कौन से कागज़ बाकी हैं?', 'नया सौदा दर्ज कीजिए', 'कितने पैसे बाकी हैं?', 'आज क्या हुआ?', 'गाड़ी का कागज़ भेजिए'],
    hello: 'नमस्ते, मैं मैडम हूँ!',
    help: 'आज मैं आपकी क्या मदद करूँ?',
    press: 'दबाकर बोलिए',
    screenAlt: 'मैडम की स्क्रीन — “आज मैं आपकी क्या मदद करूँ?” और सवालों के बटन'
  },
  levels: {
    kicker: 'लेवल',
    title: 'गोल्ड सप्लायर बनिए, फ़ायदे पाइए',
    body: 'लेवल पिछले 90 दिनों में पहुँची गाड़ियों से बनता है — और हर फ़ैक्टरी रसीद 2 दिन में भेजने से।',
    tiers: [
      { key: 'silver', name: 'सिल्वर', need: '90 दिन में 10 गाड़ियाँ', plus: '', perks: ['मिल पर माल जल्दी उतरवाने में प्राथमिकता'] },
      { key: 'gold', name: 'गोल्ड', need: '25 गाड़ियाँ · 80% कागज़ समय पर', plus: 'सिल्वर के फ़ायदे, और', perks: ['ऑफिस में आपके कागज़ सबसे पहले'] },
      { key: 'platinum', name: 'प्लैटिनम', need: '60 गाड़ियाँ · 90% कागज़ समय पर', plus: 'गोल्ड के फ़ायदे, और', perks: ['सीधी हेल्पलाइन', 'OSHT प्लैटिनम सप्लायर सर्टिफ़िकेट'] }
    ],
    card: {
      brand: 'OSHT · SUPPLIER',
      tier: 'गोल्ड',
      of: '/ 60 गाड़ियाँ',
      next: 'प्लैटिनम के लिए 32 गाड़ियाँ और',
      next2: 'और 90% कागज़ समय पर',
      stats: [
        { v: '847.9', l: 'टन माल' },
        { v: '89%', l: 'कागज़ समय पर' },
        { v: '8', l: 'हफ़्ते लगातार' }
      ],
      window: 'पिछले 90 दिन'
    },
    perksTitle: 'फ़ायदे',
    example: 'उदाहरण — ऐप के डेमो से'
  },
  whatsapp: {
    kicker: 'WhatsApp',
    title: 'WhatsApp से लॉगिन, WhatsApp पर भाव',
    body: 'नंबर डालिए और “WhatsApp से लॉगिन” दबाइए। WhatsApp खुलेगा, संदेश पहले से लिखा मिलेगा — बस भेजिए, और ऐप में लॉगिन हो जाएगा।',
    items: [
      { t: 'रोज़ आज के भाव', b: 'मिलों के भाव WhatsApp पर। न चाहिए, तो “बंद” लिखकर भेज दीजिए।' },
      { t: 'ऑफिस के कागज़ और सूचनाएँ', b: 'जो कागज़ और ख़बर ऑफिस से आपके लिए है, वह अपने-आप WhatsApp पर।' },
      { t: 'भाव अलार्म भी', b: 'आप चालू करें, तो भाव अलार्म WhatsApp पर भी बजेगा — ऐप बंद हो तब भी।' }
    ],
    chatName: 'OSHT',
    chatStatus: 'ओम श्री हरि ट्रेडिंग',
    me: 'OSHT लॉगिन 482913',
    them: '✅ लॉगिन हो गया — ऐप पर लौटिए',
    chatNote: 'उदाहरण · कोड हर बार नया, 5 मिनट के लिए',
    save: 'OSHT का नंबर सेव कीजिए',
    saveHint: 'WhatsApp पर “OSHT” लिखकर भेजिए — हमारा संपर्क कार्ड आ जाएगा।'
  },
  more: {
    kicker: 'और भी',
    title: 'छोटी-छोटी बातें, जो रोज़ काम आती हैं',
    cards: [
      { label: 'ऑर्डर', t: 'पिछले जैसा ऑर्डर', b: 'एक टैप में। मिल, माल, सप्लायर, पेमेंट — सब पहले से भरा, आज के भाव से।' },
      { label: 'ऑर्डर', t: 'एक बार में एक सवाल', b: 'नया ऑर्डर? ऐप एक-एक सवाल पूछता है और पढ़कर सुनाता है। वज़न और भाव बोलकर भी बता सकते हैं।' },
      { label: 'भरोसा', t: 'शर्तें पढ़कर ही', b: 'मिल की शर्तों पर टिक लगाए बिना ऑर्डर नहीं जाता।' },
      { label: 'ख़बर', t: 'मंज़ूरी की ख़बर', b: 'ऑफिस ऑर्डर मंज़ूर करे, तो उसी वक़्त आपको बताया जाता है।' },
      { label: 'रंग-रूप', t: 'रात में आँखों को आराम', b: 'फ़ोन जैसा, भगवा (उजला) या केसर (गहरा) — जो रंग-रूप भाए।' },
      { label: 'घंटी', t: 'अपडेट की घंटी', b: 'पैसा, कागज़, ऑर्डर, भाव — हर ख़बर छाँटकर।' }
    ]
  },
  gallery: {
    kicker: 'नया रूप',
    title: 'ऐप अंदर से ऐसा दिखता है',
    body: 'भगवा रंग, बड़े अक्षर, साफ़ हिसाब। खींचकर एक-एक स्क्रीन देखिए।',
    hint: 'खींचिए या स्क्रॉल कीजिए',
    items: {
      home: 'होम',
      rates: 'आज का भाव',
      money: 'पैसा',
      lorry: 'गाड़ी का सफ़र',
      papers: 'कागज़',
      repeat: 'पिछले जैसा ऑर्डर',
      ask: 'एक-एक सवाल',
      review: 'भेजने से पहले',
      madam: 'मैडम',
      level: 'लेवल',
      updates: 'अपडेट',
      login: 'WhatsApp से लॉगिन',
      'home-night': 'रात में होम'
    }
  },
  join: {
    kicker: 'जुड़िए',
    title: 'चार क़दम में शुरू',
    steps: [
      { t: 'ऐप डाउनलोड कीजिए', b: 'Google Play या App Store पर “OSHT - Agro Trading”।' },
      { t: 'नंबर पक्का कीजिए', b: 'फ़ोन पर आया कोड डालिए — या WhatsApp से लॉगिन कीजिए।' },
      { t: 'अपनी पहचान दीजिए', b: 'ब्रोकर: अपना नाम — फ़र्म और GST नंबर चाहें तो। सप्लायर: GST नंबर, नाम और पता अपने-आप भर जाते हैं।' },
      { t: 'पहला ऑर्डर भेजिए', b: 'ऑफिस के मंज़ूर करते ही आपको बताया जाएगा।' }
    ],
    help: 'कहीं अटकें, तो ऑफिस को फ़ोन कीजिए'
  },
  faq: {
    kicker: 'सवाल-जवाब',
    title: 'आम सवाल',
    items: [
      { q: 'भाड़ा कैसे निकलता है?', a: 'आपकी जगह से मिल तक की सड़क की दूरी से — यह अंदाज़ा होता है, पक्की रकम नहीं। अपनी जगह कभी भी बदल सकते हैं।' },
      { q: 'पैसा कब आएगा, कैसे पता चलेगा?', a: 'पैसा टैब में हर गाड़ी की रकम और तय तारीख़ है, और अगले 7 दिन का हिसाब। पैसा लेट हो, तो वहीं से ऑफिस को फ़ोन कीजिए।' },
      { q: 'ड्राइवर को कुछ करना होगा?', a: 'नहीं। गाड़ी कहाँ तक पहुँची, यह उसके कागज़ों से पता चलता है। ड्राइवर को कोई ऐप नहीं चाहिए।' },
      { q: 'मैडम कौन हैं?', a: 'ऐप की आवाज़ वाली सहायक। दबाकर बोलिए या लिखिए — ऐप जिस भाषा में है, उसी में जवाब। पहली बार आपसे अनुमति लेती हैं।' },
      { q: 'लेवल कैसे बढ़ता है?', a: 'पिछले 90 दिनों में मिल पहुँची गाड़ियों से, और हर फ़ैक्टरी रसीद 2 दिन में भेजने से। सिल्वर 10 गाड़ियों पर, गोल्ड 25 पर, प्लैटिनम 60 पर।' },
      { q: 'ऐप के पैसे लगते हैं?', a: 'नहीं। OSHT के साथ व्यापार करने वाले ब्रोकर और सप्लायर के लिए ऐप मुफ़्त है।' },
      { q: 'नेटवर्क न हो, तो?', a: 'कागज़ की फ़ोटो फ़ोन में रुकी रहती है, और सिग्नल आते ही अपने-आप चली जाती है।' },
      { q: 'iPhone पर भी है?', a: 'हाँ। Google Play और App Store, दोनों पर “OSHT - Agro Trading” नाम से।' }
    ]
  },
  contact: {
    kicker: 'संपर्क',
    title: 'कोई बात? सीधे ऑफिस से पूछिए',
    body: 'ऑफिस सुबह 9 से शाम 7 बजे तक फ़ोन उठाता है। हिंदी में बात होगी।',
    call: 'फ़ोन कीजिए',
    whatsapp: 'WhatsApp',
    play: 'Google Play',
    ios: 'App Store'
  },
  cta: {
    title: 'आज का भाव, आज ही देखिए',
    body: 'ऐप डाउनलोड कीजिए — भाव, पैसा, गाड़ी और कागज़, सब एक जगह।'
  },
  footer: {
    blurb: 'कृषि जिंस का व्यापार — सप्लायर से मिल तक। OSHT वह ऐप है, जिससे यह व्यापार चलता है।',
    app: 'ऐप',
    contact: 'संपर्क',
    rights: '© 2026 Om Shri Hari Trading Pvt Ltd'
  },
  common: { example: 'उदाहरण' }
};

export type Copy = typeof hi;

const en: Copy = {
  meta: { langName: 'English', other: 'हिंदी', switchTo: 'हिंदी में देखिए' },
  seo: {
    title: 'OSHT - Agro Trading | The app of Om Shri Hari Trading Pvt Ltd',
    description:
      "OSHT is the app of Om Shri Hari Trading Pvt Ltd: every mill's grain rate after freight, each lorry's money and papers, and Madam to answer by voice in Hindi. Free on Android and iPhone."
  },
  headline: { words: ['Rates', 'lorries', 'papers', 'payments'], and: 'and', tail: 'in one app.' },
  dawn: {
    title: 'Every morning, the best rate.',
    sub: 'At the top the moment you open the app — after freight, what lands in hand.',
    scroll: 'Scroll down'
  },
  privacy: 'Privacy policy',
  intro: "The app's opening",
  skip: 'Skip to the main content',
  nav: {
    label: 'Page sections',
    rate: 'Rates',
    money: 'Money',
    lorry: 'Lorries',
    madam: 'Madam',
    levels: 'Levels',
    whatsapp: 'WhatsApp',
    join: 'Join',
    getApp: 'Get the app',
    home: 'OSHT — back to top'
  },
  store: {
    playSmall: 'Get it on',
    playBig: 'Google Play',
    iosSmall: 'Download on the',
    iosBig: 'App Store'
  },
  hero: {
    eyebrow: 'OSHT · the app of Om Shri Hari Trading Pvt Ltd',
    titleA: 'Every morning, the best rate.',
    titleB: 'After freight — what lands in hand.',
    rotatePrefix: 'And',
    rotate: ["every lorry's payment", "every lorry's paper", 'an answer, by voice'],
    rotateSuffix: '— in one app.',
    sub: "OSHT is Om Shri Hari Trading's own app. It shows every mill's rate after freight from your place, keeps each lorry's money and papers in order — and Madam answers out loud, in your language.",
    call: 'Call the office',
    points: ['Free for brokers and suppliers', 'Hindi and English', 'Android and iPhone'],
    phoneAlt: "The OSHT app's Home — today's best rate, ₹2,474 a quintal in hand",
    chipInHand: '/ qtl in hand',
    chipBest: "Today's best rate for you",
    chipGold: 'Gold supplier',
    example: 'Example'
  },
  ticker: {
    label: "Every lorry's papers",
    items: ['Party detail', 'Kata parchi', 'Tagging', 'Pre-arrival slip', 'GRN', 'Invoice (challan)', 'Factory receipt', 'Purchase receipt', 'Pay slip (authorised)', 'Cheque photo']
  },
  rate: {
    kicker: "Today's rate",
    title: 'See what lands in hand, after freight',
    body: "The app takes each mill's rate, subtracts the freight from your place to the mill, and puts the mill that leaves the most money in your hand at the top — with what one 30-tonne lorry comes to.",
    points: [
      { t: 'Worked out from your place', b: 'Enter your village, town or PIN code — and change it any time.' },
      { t: 'In-hand rate, or the mill’s rate', b: 'One tap shows it either way — after freight, or the mill’s own rate.' },
      { t: 'Rate alarm', b: 'Set a figure. When a mill’s rate goes above or below it, the app tells you.' }
    ],
    card: {
      title: "Today's rate",
      from: 'from Bettiah',
      tabInHand: 'In hand (after freight)',
      tabMill: "Mill's rate",
      rank1: '#1 for you',
      rankHigh: 'Highest rate',
      inHand: 'In hand',
      perQtl: '/ qtl',
      millRate: "Mill's rate",
      freight: 'Freight',
      perLorry: 'One lorry (30 t)',
      lakh: 'lakh',
      km: 'km',
      payDays: 'paid in {n} days',
      behind: '₹{d} below #1 · ₹{l} less a lorry',
      send: 'Send here',
      note: "Example from the app's demo. Freight is an estimate from distance."
    }
  },
  money: {
    kicker: 'Money',
    title: "Every lorry's payment: when, and how much",
    body: 'The पैसा (Money) tab opens on what is due to you as of today. Below it, the next 7 days — how much falls due on each day. And every lorry on its own line: the amount, the date it was due, and how many days late.',
    points: [
      { t: 'Received this month', b: 'A month of money in, at a glance.' },
      { t: 'Due · Late · Received', b: 'One tap sorts out which lorry’s money is stuck where.' },
      { t: 'Late? Call the office', b: 'Tap “Ask the office” on a late lorry and the call goes through. Once paid, the bank slip is right there.' }
    ],
    card: {
      title: 'Money',
      sub: "Every lorry's payment — when, and how much",
      due: 'Due to you',
      dueSub: '3 lorries · 2 of them late',
      month: 'Received this month',
      next7: 'Next 7 days',
      days: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      filters: ['Due (9)', 'Late (2)', 'Received (2)', 'All'],
      late: '8 days late',
      dueOn: 'Was due 4 Nov',
      ask: 'Ask the office'
    },
    note: "Example from the app's demo. Amounts are estimated from weight × rate, or taken from the books — the app says which."
  },
  lorry: {
    kicker: 'Lorries and papers',
    title: 'Where is the lorry? Are the papers done?',
    body: "Each lorry's trip on one line — from loading to payment. Every step is read from that step's paper.",
    where: 'Where is the lorry?',
    stages: [
      { t: 'Loaded', p: 'Party detail' },
      { t: 'Left for the mill', p: 'Pre-arrival slip' },
      { t: "At the mill's gate", p: 'GRN · Kata parchi' },
      { t: 'Weighed and unloaded', p: 'Factory receipt' },
      { t: 'Reckoning made', p: 'Purchase receipt' },
      { t: 'Paid', p: 'Pay slip (authorised)' }
    ],
    statement: 'The driver does nothing — all of this is known from the papers.',
    papersTitle: 'Papers',
    you: 'From you',
    office: 'From the office',
    optional: 'Optional',
    done: 'Arrived',
    waiting: 'Still to come',
    points: [
      { t: 'Just take a photo', b: 'Send a photo of the paper — the app asks which paper it is after the photo.' },
      { t: 'No signal? No problem', b: 'The paper waits on the phone and goes by itself the moment signal returns.' },
      { t: 'Three papers, one PDF', b: "Send the office's three papers as one PDF, straight to WhatsApp." }
    ]
  },
  madam: {
    kicker: 'Madam',
    title: 'Just ask Madam. By voice.',
    ask: 'Ask —',
    questions: ['Where is my lorry?', 'Which papers are missing?', 'How much money is due?', 'What happened today?'],
    body: "Madam is the app's voice assistant. Press the mic and speak, or type — she tells you where your lorry is, which papers are pending and what money is due, sends a paper for you, and can even record a new deal.",
    points: [
      { t: 'A deal needs your “yes”', b: 'Before she records a new deal, Madam asks you to say “yes”.' },
      { t: 'The rate comes from the rate card', b: "A deal's rate always comes from today's rate card — never from what was heard." },
      { t: 'In your language', b: 'Madam answers in whatever language the app is set to.' }
    ],
    chips: ['Where is my lorry?', 'Which papers are missing?', 'Raise a new order', 'How much money is due?', 'What happened today?', 'Send a lorry’s paper'],
    hello: "Hello, I'm Madam!",
    help: 'How can I help you today?',
    press: 'Press and speak',
    screenAlt: "Madam's screen — “How can I help you today?” with question buttons"
  },
  levels: {
    kicker: 'Levels',
    title: 'Grow your level, unlock real benefits',
    body: 'Your level comes from lorries delivered in the last 90 days — and sending each factory receipt within 2 days.',
    tiers: [
      { key: 'silver', name: 'Silver', need: '10 lorries in 90 days', plus: '', perks: ['Priority unloading at the mill'] },
      { key: 'gold', name: 'Gold', need: '25 lorries · 80% papers on time', plus: 'Silver’s benefits, plus', perks: ['Your papers handled first at the office'] },
      { key: 'platinum', name: 'Platinum', need: '60 lorries · 90% papers on time', plus: 'Gold’s benefits, plus', perks: ['A direct helpline', 'OSHT Platinum Supplier certificate'] }
    ],
    card: {
      brand: 'OSHT · SUPPLIER',
      tier: 'Gold',
      of: '/ 60 lorries',
      next: '32 more lorries for Platinum',
      next2: 'and 90% papers on time',
      stats: [
        { v: '847.9', l: 't of goods' },
        { v: '89%', l: 'papers on time' },
        { v: '8', l: 'weeks in a row' }
      ],
      window: 'Last 90 days'
    },
    perksTitle: 'Benefits',
    example: "Example from the app's demo"
  },
  whatsapp: {
    kicker: 'WhatsApp',
    title: 'Sign in with WhatsApp. Rates on WhatsApp.',
    body: 'Type your number and tap “Login with WhatsApp”. WhatsApp opens with the message already written — press send, and you are signed in to the app.',
    items: [
      { t: "Today's rates, every day", b: "Mills' rates on WhatsApp. Don't want them? Reply “बंद”." },
      { t: 'Office papers and notices', b: 'Papers and news the office has for you arrive on WhatsApp by themselves.' },
      { t: 'Rate alarms too', b: 'Switch it on and your rate alarm rings on WhatsApp as well — even with the app shut.' }
    ],
    chatName: 'OSHT',
    chatStatus: 'Om Shri Hari Trading',
    me: 'OSHT लॉगिन 482913',
    them: '✅ लॉगिन हो गया — ऐप पर लौटिए',
    chatNote: 'Example · a new code each time, good for 5 minutes',
    save: 'Save the OSHT number',
    saveHint: 'Send “OSHT” on WhatsApp and our contact card comes back.'
  },
  more: {
    kicker: 'And more',
    title: 'Small things that help every day',
    cards: [
      { label: 'Orders', t: 'Repeat last order', b: 'One tap. Mill, quantity, supplier, payment — all filled in from last time, at today’s rate.' },
      { label: 'Orders', t: 'One question at a time', b: 'A new order? The app asks one question at a time and reads it out. Say the weight and the rate, or tap.' },
      { label: 'Trust', t: 'Terms first', b: "An order can't go until you tick the mill's terms." },
      { label: 'News', t: 'Approval, the moment it happens', b: 'When the office approves your order, you hear straight away.' },
      { label: 'Look', t: 'Easy on the eyes at night', b: 'Same as phone, Bhagwa (light) or Kesar (dark) — whichever you like.' },
      { label: 'Bell', t: 'The update bell', b: 'Money, papers, orders, rates — every update, sorted.' }
    ]
  },
  gallery: {
    kicker: 'The new look',
    title: 'See the app, screen by screen',
    body: 'Saffron, big letters, clear sums. Drag to look through each screen.',
    hint: 'Drag or scroll',
    items: {
      home: 'Home',
      rates: "Today's rate",
      money: 'Money',
      lorry: "A lorry's trip",
      papers: 'Papers',
      repeat: 'Repeat last order',
      ask: 'One question at a time',
      review: 'Before you send',
      madam: 'Madam',
      level: 'Level',
      updates: 'Updates',
      login: 'Login with WhatsApp',
      'home-night': 'Home at night'
    }
  },
  join: {
    kicker: 'Join',
    title: 'Start in four steps',
    steps: [
      { t: 'Download the app', b: '“OSHT - Agro Trading” on Google Play or the App Store.' },
      { t: 'Confirm your number', b: 'Enter the code sent to your phone — or log in with WhatsApp.' },
      { t: 'Tell us who you are', b: 'Broker: your name — firm and GST number if you like. Supplier: your GSTIN; name and address fill in by themselves.' },
      { t: 'Send your first order', b: 'You will hear the moment the office approves it.' }
    ],
    help: 'Stuck anywhere? Call the office'
  },
  faq: {
    kicker: 'Questions',
    title: 'Common questions',
    items: [
      { q: 'How is freight worked out?', a: 'From the road distance between your place and the mill — it is an estimate, not a fixed amount. You can change your place any time.' },
      { q: 'How do I know when I will be paid?', a: 'The पैसा (Money) tab shows every lorry’s amount and due date, and the next 7 days. If a payment is late, call the office from right there.' },
      { q: 'Does the driver have to do anything?', a: 'No. How far a lorry has got is read from its papers. The driver needs no app.' },
      { q: 'Who is Madam?', a: "The app's voice assistant. Press and speak, or type — she answers in the app's language. She asks your permission the first time." },
      { q: 'How does my level go up?', a: 'From the lorries that reached the mill in the last 90 days, and sending each factory receipt within 2 days. Silver at 10 lorries, Gold at 25, Platinum at 60.' },
      { q: 'Does the app cost anything?', a: 'No. The app is free for brokers and suppliers trading with OSHT.' },
      { q: 'What if there is no signal?', a: 'The photo of the paper waits on the phone, and goes by itself the moment signal returns.' },
      { q: 'Is it on iPhone too?', a: 'Yes — on both Google Play and the App Store, as “OSHT - Agro Trading”.' }
    ]
  },
  contact: {
    kicker: 'Contact',
    title: 'Questions? Ask the office directly',
    body: 'The office answers the phone from 9 in the morning to 7 in the evening. We speak Hindi.',
    call: 'Call us',
    whatsapp: 'WhatsApp',
    play: 'Google Play',
    ios: 'App Store'
  },
  cta: {
    title: "See today's rate, today",
    body: 'Download the app — rates, money, lorries and papers, all in one place.'
  },
  footer: {
    blurb: 'Agricultural commodity trade — from the supplier to the mill. OSHT is the app this trade runs on.',
    app: 'App',
    contact: 'Contact',
    rights: '© 2026 Om Shri Hari Trading Pvt Ltd'
  },
  common: { example: 'Example' }
};

export const COPY: Record<Lang, Copy> = { hi, en };
