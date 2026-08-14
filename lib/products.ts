export interface Product {
  id: number;
  name: string;
  price: number; // Rials — divided by 10 for Toman display
  imageUrl: string;
  category: "apparel" | "accessories" | "posters";
  description: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "تیشرت مشکی دسکتاپ",
    price: 35000000,
    imageUrl: "/product/iman-desptop-768x1152.png",
    category: "apparel",
    description:
      "تیشرت مشکی با طرح ایمان پشت دسکتاپ؛ مخصوص برنامه‌نویس‌ها و طرفدارای پروپاقرص کومان که همیشه پشت سیستم نشستن!",
    features: [
      "جنس پنبه مرغوب و تنفس‌پذیر",
      "چاپ دیجیتال باکیفیت و ماندگار",
      "موجود در سایزهای M تا XXL",
    ],
  },
  {
    id: 2,
    name: "تیشرت الحافوزلیق",
    price: 1200000,
    imageUrl: "/product/HALFOZIGH-back1.jpg",
    category: "apparel",
    description:
      "تیشرت کمدی با جمله به‌یادموندنی برنامه؛ برای اون‌هایی که توی هر چالشی دنبال یه توجیه تازه می‌گردن!",
    features: [
      "طرح طنز اختصاصی کومان",
      "دوخت تمیز و یقه مقاوم",
      "مناسب استفاده روزمره",
    ],
  },
  {
    id: 3,
    name: "تیشرت میالند",
    price: 8500000,
    imageUrl: "/product/mialand-front.png",
    category: "apparel",
    description:
      "تیشرت رنگارنگ دنیای میا؛ همون‌قدر شاد و پرانرژی که خود میالنده!",
    features: [
      "طرح اختصاصی میالند",
      "رنگ‌های شاد و ماندگار",
      "جنس نرم و سبک",
    ],
  },
  {
    id: 4,
    name: "ماگ آبی کومان",
    price: 450000,
    imageUrl: "/product/mug-blue2.jpg",
    category: "accessories",
    description:
      "ماگ آبی با لوگوی کومان؛ رفیق همیشگی چای و قهوه هنگام تماشای اپیزودهای جمعه!",
    features: [
      "سرامیک باکیفیت",
      "قابل استفاده در مایکروویو",
      "طرح چاپی مقاوم در شست‌وشو",
    ],
  },
  {
    id: 5,
    name: "ماگ قرمز کومان",
    price: 21000000,
    imageUrl: "/product/mug-red.jpg",
    category: "accessories",
    description:
      "ماگ قرمز پرانرژی برای شروع پرچالش‌ترین روزهای هفته؛ جمعه‌های نمکی!",
    features: [
      "سرامیک باکیفیت",
      "دسته ارگونومیک",
      "رنگ‌بندی جذاب و ماندگار",
    ],
  },
  {
    id: 6,
    name: "پوستر طرح قدیمی",
    price: 600000,
    imageUrl: "/product/kouman.jpg",
    category: "posters",
    description:
      "پوستر کلاسیک کومان با طراحی نوستالژیک؛ برای تزئین اتاق هر طرفدار واقعی!",
    features: [
      "چاپ باکیفیت روی کاغذ گلاسه",
      "سایز استاندارد قاب",
      "بسته‌بندی محافظ",
    ],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price / 10);

export const getProductById = (id: number) =>
  products.find((product) => product.id === id);

export const getRelatedProducts = (product: Product, count = 4) =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
