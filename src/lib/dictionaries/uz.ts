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
          "Agentlik ishining asosiy formati. Vizual tizimni loyihalaymiz — belgi, rang, tipografika, grafik til va ularni qo'llash qoidalari. Tizim shunday quriladiki, u bilan boshqa odamlar ishlay boshlaganda ham yaxlit qoladi: ichki marketing, bosmaxona, peshlavha pudratchilari, digital jamoa.",
        includes: [
          "Belgi va logotip: variantlar, himoya maydoni, masshtablash qoidalari",
          "Bosma va ekran uchun texnik qiymatlar bilan rang tizimi",
          "Tipografik ierarxiya va matn terish qoidalari",
          "Grafik til: patternlar, illyustratsiya, fotouslub tamoyillari",
          "Asosiy tashuvchilar: hujjatlar, taqdimot, digital, peshlavha",
          "Qo'llash qoidalari va tipik xatolar bilan brendbuk",
        ],
        result:
          "Istalgan pudratchi sizsiz qo'llay oladigan tizim. Siz endi har bir maketni tasdiqlovchi bo'g'in bo'lib qolmaysiz.",
      },
      {
        title: "Brend strategiyasi va pozitsiyalash",
        summary:
          "Brend nimasi bilan farq qilishi va auditoriyaga nima deyish kerakligi noaniq bo'lgan holatlar uchun. Kategoriya, raqobat maydoni va hozirgi qabul qilinishni o'rganamiz, brend platformasini shakllantiramiz — va faqat shundan keyin vizual qismga o'tamiz. Aynan shu dizayn qarorlarini did masalasidan asoslangan qarorga aylantiradi.",
        includes: [
          "Joriy brend va raqobat maydoni auditi",
          "Kompaniyaning asosiy xodimlari bilan intervyu",
          "Auditoriya portreti va ishchi insaytlar",
          "Pozitsiyalash, qadriyatlar, brend xarakteri",
          "Tone of voice va asosiy xabarlar",
          "Mahsulot liniyalari uchun brend arxitekturasi",
        ],
        result:
          "Brend platformasi — dizayn, marketing va kommunikatsiya tayanadigan hujjat. «Qanday to'g'ri» degan ichki bahslar obro' bilan emas, hujjat bilan hal qilina boshlaydi.",
      },
      {
        title: "Neyming",
        summary:
          "Yangi brend yoki mahsulot uchun nom, deskriptor va slogan. Nom real hayotda qanday ishlashini tekshiramiz: uch tilda qanday jaranglaydi va o'qiladi, domen va ijtimoiy tarmoqlarda ishlaydimi, peshlavhaga sig'adimi, ro'yxatdan o'tgan belgilar bilan to'qnashmaydimi.",
        includes: [
          "Nom mezonlari va ma'no hududi",
          "Har bir yo'nalish asoslangan long-list",
          "Tavsiya bilan short-list",
          "Rus, o'zbek va ingliz tillarida jaranglash tekshiruvi",
          "Domen va akkauntlar bandligini tekshirish",
          "Deskriptor va slogan",
        ],
        result:
          "Tovar belgisini ro'yxatdan o'tkazishga olib borish mumkin bo'lgan nom va direktorlar kengashiga olib borish mumkin bo'lgan asos.",
      },
      {
        title: "Qadoqlash",
        summary:
          "Qadoq va etiketka dizayni: bitta mahsulotdan tortib o'nlab SKUga kengayadigan liniyagacha. Print-ready fayllar va texnik hujjatlargacha ishlaymiz — taqdimotda chiroyli ko'rinadigan, lekin bosmaxonada buziladigan maket ish hisoblanmaydi.",
        includes: [
          "Liniya konsepsiyasi va arxitekturasi",
          "Old va axborot tomonlari dizayni",
          "Format, material va bosish usullariga moslashtirish",
          "Spetsifikatsiyalar bilan print-ready fayllar",
          "Birinchi tirajgacha bosmaxonani kuzatib borish",
        ],
        result:
          "Bosmaxona tuzatishlarsiz qabul qiladigan maketlar va liniyaning keyingi mahsulotlari yangi loyihasiz yig'iladigan tizim.",
      },
      {
        title: "Rebrending",
        summary:
          "O'z uslubidan o'sib ketgan brendni yangilash: mahsulot, auditoriya, miqyos yoki egasi o'zgargan. Bu yerdagi asosiy ish yangi belgida emas, balki to'plangan tanilishning nimasini saqlashni hal qilishda va o'tish rejasida — chunki brendlar aynan o'tishda buziladi.",
        includes: [
          "Aydentika auditi va tashuvchilarning to'liq inventarizatsiyasi",
          "O'tish strategiyasi: nimani saqlash, nimani o'zgartirish, nimadan voz kechish",
          "Yangi vizual tizim",
          "Tashuvchilar va ustuvorliklar bo'yicha bosqichma-bosqich joriy etish rejasi",
          "Ichki jamoa va pudratchilar uchun gaydlayn",
        ],
        result:
          "Yangilangan brend va peshlavhalar, hujjatlar va digital yangi tizimga kompaniya ikki xil ko'rinadigan davrsiz o'tadigan reja.",
      },
      {
        title: "Tashuvchilar va kommunikatsiya",
        summary:
          "Brend ishga tushgandan keyin odamlar bilan uchrashadigan hamma narsa: navigatsiya va peshlavhalar, yillik hisobotlar va taqdimotlar, kampaniyalar, digital, merch. Jamoangizning davomi sifatida ishlaymiz — mavjud gaydlayn yoki biznikiga ko'ra.",
        includes: [
          "Navigatsiya, peshlavhalar, makonlarni bezash",
          "Taqdimotlar, yillik hisobotlar, korporativ hujjatlar",
          "Reklama kampaniyalari va key visual",
          "Digital va ijtimoiy tarmoqlar uchun shablonlar",
          "Merch va suvenir mahsulotlari",
        ],
        result:
          "Bitta kompaniya ichidagi o'nta turli pudratchi kabi emas, bitta brend kabi ko'rinadigan tashuvchilar.",
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
