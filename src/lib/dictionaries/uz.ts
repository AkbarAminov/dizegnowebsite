import type { Dictionary } from "../i18n";

const dictionary: Dictionary = {
  nav: {
    work: "Ishlar",
    services: "Xizmatlar",
    answers: "Savollar",
    contact: "Aloqa",
    homeAria: "Dizegno — bosh sahifa",
    menuOpenAria: "Menyuni ochish",
    menuCloseAria: "Menyuni yopish",
  },
  seo: {
    home: {
      title: "Dizegno — Toshkentdagi brending agentligi",
      description:
        "Banklar, chakana savdo va startaplar uchun aydentika, firma uslubi, brendbuk, neyming va qadoqlash — O'zbekiston va MDH bo'ylab. Qat'iy narx, loyihani asoschi boshqaradi.",
    },
    work: {
      title: "Ishlar",
      description:
        "Dizegno keyslari: O'zbekiston va MDHdagi banklar, chakana savdo, yetkazib berish, tibbiyot va sport tadbirlari uchun aydentika, qadoqlash, strategiya va kampaniyalar.",
    },
    services: {
      title: "Xizmatlar: aydentika, brendbuk, neyming, qadoqlash",
      description:
        "Toshkentda logotip va firma uslubi, brendbuk, neyming, qadoqlash dizayni, rebrending va brend strategiyasi. Boshlashdan oldin qat'iy narx va muddat.",
    },
    answers: {
      title: "Savollar va javoblar",
      description:
        "Dizegno qanday ishlaydi: nimadan boshlash, brending qancha turadi, muddatlar, NDA, natijaga huquqlar va jamoangiz bilan ishlash.",
    },
    contact: {
      title: "Aloqa",
      description:
        "Telegram, email yoki telefon orqali bog'laning. Toshkent, O'zbekiston. Ish kuni davomida javob beramiz va qat'iy narxli taklif yuboramiz.",
    },
    projectFallback: "{title} — Toshkentdagi Dizegno brending agentligi keysi.",
  },
  home: {
    selectedWork: { all: "Barcha ishlar" },
  },
  services: {
    title: "Xizmatlar",
    includesLabel: "Nimalar kiradi",
    resultLabel: "Natija",
    items: [
      {
        title: "Aydentika va firma uslubi",
        summary:
          "Ishimizning asosiy formati. Brendning vizual tizimini loyihalaymiz — belgi, logotip, rang, tipografika, grafika va ulardan foydalanish qoidalari — brend har qanday tashuvchida yaxlit ko'rinishi va boshqalar u bilan ishlay boshlaganda buzilmasligi uchun.",
        includes: [
          "Logotip va belgi, variantlar va himoya maydoni",
          "Rang tizimi va tipografika",
          "Grafik til: patternlar, illyustratsiya, fotouslub",
          "Asosiy tashuvchilar: hujjatlar, taqdimot, ijtimoiy tarmoqlar, peshlavha",
          "Foydalanish qoidalari bilan brendbuk",
        ],
        result: "Istalgan pudratchiga topshirish mumkin bo'lgan brendbuk va manba fayllar.",
      },
      {
        title: "Brend strategiyasi va pozitsiyalash",
        summary:
          "Brend nimasi bilan farq qilishi va auditoriyaga nima deyish kerakligi noaniq bo'lgan holatlar uchun. Bozor va raqobatchilarni o'rganamiz, brend platformasini shakllantiramiz — va faqat shundan keyin dizaynga o'tamiz. Shunda qarorlar did masalasi bo'lmay qoladi.",
        includes: [
          "Joriy brend va raqobatchilar auditi",
          "Auditoriya portreti va insaytlar",
          "Pozitsiyalash, qadriyatlar, xarakter",
          "Tone of voice va asosiy xabarlar",
          "Mahsulot liniyalari uchun brend arxitekturasi",
        ],
        result: "Brend platformasi — dizayn, marketing va kommunikatsiya tayanadigan hujjat.",
      },
      {
        title: "Neyming",
        summary:
          "Yangi brend yoki mahsulot uchun nom, deskriptor va slogan. Nom rus, o'zbek va ingliz tillarida qanday jaranglashi va o'qilishini, domen, ijtimoiy tarmoqlar va peshlavhada qanday ishlashini tekshiramiz.",
        includes: [
          "Nom mezonlari va ma'no hududi",
          "Asoslangan long-list va short-list",
          "Uch tilda jaranglash tekshiruvi",
          "Domen va akkauntlar bandligini tekshirish",
          "Deskriptor va slogan",
        ],
        result: "Tavsiya bilan short-list va tovar belgisini ro'yxatdan o'tkazishga olib borish mumkin bo'lgan nom.",
      },
      {
        title: "Qadoqlash",
        summary:
          "Qadoq va etiketka dizayni: bitta mahsulotdan tortib o'nlab SKUga kengayadigan liniyagacha. Maketlarni bosmaxona uchun texnik hujjatlar bilan print-ready fayllargacha yetkazamiz.",
        includes: [
          "Liniya konsepsiyasi va arxitekturasi",
          "Old va axborot tomonlari dizayni",
          "Format va materiallarga moslashtirish",
          "Print-ready fayllar va spetsifikatsiyalar",
          "Birinchi tirajgacha bosmaxonani kuzatib borish",
        ],
        result: "Bosmaxona savolsiz qabul qiladigan maketlar va keyingi mahsulotlar uchun tizim.",
      },
      {
        title: "Rebrending",
        summary:
          "O'z uslubidan o'sib ketgan brendni yangilash: mahsulot, auditoriya yoki miqyos o'zgargan. To'plangan tanilishni saqlaymiz, xalaqit berayotganini olib tashlaymiz va peshlavhalar, hujjatlar va digital tartibsizliksiz yangilanishi uchun o'tishni rejalashtiramiz.",
        includes: [
          "Aydentika va barcha tashuvchilar auditi",
          "Strategiya: nimani saqlash, nimani o'zgartirish",
          "Yangi vizual tizim",
          "Tashuvchilar va ustuvorliklar bo'yicha o'tish rejasi",
          "Jamoa va pudratchilar uchun gaydlayn",
        ],
        result: "Yangilangan brend va tushunarli joriy etish rejasi.",
      },
      {
        title: "Tashuvchilar va kommunikatsiya",
        summary:
          "Brend ishga tushgandan keyin odamlar bilan uchrashadigan hamma narsa: navigatsiya va peshlavhalar, taqdimotlar va hisobotlar, reklama kampaniyalari, ijtimoiy tarmoqlar, merch. Jamoangizning davomi sifatida ishlaymiz — mavjud gaydlayn yoki biznikiga ko'ra.",
        includes: [
          "Navigatsiya, peshlavhalar, makonlarni bezash",
          "Taqdimotlar, yillik hisobotlar, korporativ hujjatlar",
          "Reklama kampaniyalari va key visual",
          "Ijtimoiy tarmoqlar va digital uchun shablonlar",
          "Merch va suvenir mahsulotlari",
        ],
        result: "O'nta pudratchi emas, bitta brend kabi ko'rinadigan tashuvchilar.",
      },
    ],
    process: {
      title: "Ish qanday tashkil etiladi",
      subtitle: "(bosqichma-bosqich)",
      prevAria: "Oldingi bosqich",
      nextAria: "Keyingi bosqich",
      steps: [
        {
          title: "Brif va loyiha chegaralari",
          text: "Vazifa, auditoriya va natija mezonlarini aniqlaymiz. Hajm, muddat va narxni ishni boshlashdan oldin belgilaymiz.",
        },
        {
          title: "Tadqiqot",
          text: "Bozor, raqobatchilar va brendning hozirgi qabul qilinishini o'rganamiz. Nimaga tayanib ajralib turishni topamiz.",
        },
        {
          title: "Strategiya va yo'nalishlar",
          text: "Pozitsiyalashni shakllantiramiz va kontsept-yo'nalishlarni taqdim etamiz. Bittasini tanlaymiz.",
        },
        {
          title: "Tizimni ishlab chiqish",
          text: "Belgi, tipografika, rang va qo'llash qoidalari. Bosqichlar soni oldindan ma'lum.",
        },
        {
          title: "Prodakshn va hujjatlashtirish",
          text: "Gaydlayn, yakuniy fayllar, pudratchilar uchun texnik hujjatlar. Huquqlar to'liq sizga o'tadi.",
        },
        {
          title: "Ishga tushirish va qo'llab-quvvatlash",
          text: "Jamoaga tizimni ishga tushirilgandan keyin qo'llashda yordam beramiz. Brendlar joriy etishda buziladi, dizaynda emas.",
        },
      ],
    },
  },
  work: {
    title: "Ishlar",
    all: "Barchasi",
  },
  partners: { title: "Hamkorlar va mijozlar" },
  projectNav: {
    back: "Orqaga",
    previous: "Oldingi",
    next: "Keyingi",
    related: "O'xshash loyihalar",
  },
  projectInfo: { toggle: "Loyiha haqida", aboutLabel: "Loyiha tavsifi" },
  gallery: { view: "Ko'rish", openImage: "Rasmni ochish", openVideo: "Videoni ochish" },
  answers: { title: "Savollar" },
  contact: {
    title: "Aloqa",
    lead:
      "Kompaniya va vazifa haqida bir necha satr yozing: qanday brend, qaysi bosqichda, nimani o'zgartirmoqchisiz. Tayyor brif shart emas — hammasini birinchi qo'ng'iroqda hal qilamiz.",
    channelsTitle: "To'g'ridan-to'g'ri",
    location: "Toshkent, O'zbekiston",
    timezone: "GMT+5 · ish kuni davomida javob beramiz",
    ndaNote: "Loyiha maxfiymi? Shuni yozing — tafsilotlarni muhokama qilishdan oldin NDA imzolaymiz.",
    formTitle: "Bizga yozing",
    formName: "Ism",
    formEmail: "Email",
    formPhone: "Telefon yoki Telegram",
    formPhoneHint: "Ixtiyoriy — agar bu emaildan qulayroq bo'lsa",
    formMessage: "Vazifa haqida",
    formMessageHint: "Kompaniya, nima qilish kerak, istalgan muddatlar",
    formSubmit: "Yuborish",
    formSubmitting: "Yuborilmoqda...",
    formSuccess: "Rahmat, xabaringizni oldik.",
    formSuccessHint: "Ish kuni davomida ko'rsatilgan email yoki messenjerga javob beramiz.",
    formError: "Yuborib bo'lmadi. Qaytadan urinib ko'ring yoki Telegramga yozing.",
    privacyNote: "Formadagi ma'lumotlardan faqat so'rovingizga javob berish uchun foydalanamiz.",
  },
  contactPopup: {
    title: "Vazifa haqida so'zlab bering",
    intro: "Kompaniya va vazifa haqida bir necha satr — ish kuni davomida javob beramiz va suhbat uchun vaqt taklif qilamiz.",
    closeAria: "Yopish",
    openAria: "Aloqa formasini ochish",
  },
  endCta: {
    line1: "Murosasiz brending",
    cta: "Loyihani muhokama qilish",
  },
  footer: {
    tagline:
      "Strategiya, dizayn va ishlab chiqarishni birlashtiramiz — brend ko'rinadigan har bir joyda yaxlit qolishi uchun.",
    navTitle: "Bo'limlar",
    contactTitle: "Aloqa",
    socialTitle: "Ijtimoiy tarmoqlar",
    languageTitle: "Til",
    rights: "Barcha huquqlar himoyalangan",
    location: "Toshkent, O'zbekiston",
  },
  notFound: {
    title: "Sahifa topilmadi",
    text: "Havola eskirgan yoki manzilda xato bo'lishi mumkin.",
    cta: "Bosh sahifaga",
  },
};

export default dictionary;
