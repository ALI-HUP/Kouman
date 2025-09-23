import next from "next";
import Image from "next/image";
import Poster from "@/public/poster/Kouman-poster.png";
import Logo from "@/public/png/kouman.png";
import Twitter from "@/public/png/twitter.png";
import Instagram from "@/public/png/instagram.png";
import Youtube from "@/public/png/youtube.png";


export default function Home() {
  return (
    <div>
      <header className="m-5 rounded-full bg-orange-200 w-[70%] mx-auto flex justify-between items-center p-3 px-6">
        <div className="flex gap-5">
          <Image className="w-20" src={Logo} alt="Kouman Logo" />
        </div>

        <div className="flex text-lg gap-5">
          <p>فروشگاه</p>
          <p>دنیای کومان</p>
          <p>اپیزودها</p>
        </div>
      </header>

      <div className="w-[800px] bg-amber-100 mx-auto mt-10">
        <Image
          className="animate-[breathe_4s_ease-in-out_infinite]"
          src={Poster}
          alt="Kouman Poster"
        />
      </div>

      <div className="m-20 text-center">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-black">جمعه‌های نمکی با کومان!!!؟</h1>
          <p className="text-xl">برنامه‌ی <strong className="text-2xl">کومان</strong> جاییه که هر جمعه‌ کورش، ایمان و میا با یه چالش جدید غیرمنتظره شما رو همراه خودشون می‌برن <br /> تا هر‌جور غذایی که فکرشو بکنین بخورن، عجیب‌ترین محصولات اینترنتی رو امتحان کنن، به تاریخ ایران زمین سفر کنن <br /> و تو فرهنگ غنیش جست و جو کنن و تو بازی‌های مختلف با هم مسابقه بدن!</p>
        </div>
      </div>

      <div className="bg-orange-200 flex flex-col gap-10 items-center p-5">
        <div className="flex gap-24 font-bold">
          <h2 className="flex gap-2 items-center">
            Twitter
            <Image
            src={Twitter}
            className="w-7"
            alt="Kouman Twitter"
            />
          </h2>
          <h2 className="flex gap-2 items-center">
            Instagram
            <Image
            src={Instagram}
            className="w-7"
            alt="Kouman Instagram"
            />
          </h2>
          <h2 className="flex gap-2 items-center">
            Youtube
            <Image
            src={Youtube}
            className="w-7"
            alt="Kouman Youtube"
            />
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <p>For business inquiries and correspondence, please contact us at info@kouman.net</p>
          <p>All Right Reseved By Kouman | @2025</p>
        </div>
      </div>
    </div>
  );
} 