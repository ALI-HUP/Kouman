import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/png/kouman.png";

export default function Header() {
  return (
    <header className="m-5 w-[70%] mx-auto flex justify-between items-center p-3 px-6 
      rounded-full bg-orange-200/90 backdrop-blur-md 
      shadow-[0_12px_25px_-5px_rgba(0,0,0,0.35),-10px_0_20px_-6px_rgba(0,0,0,0.25),10px_0_20px_-6px_rgba(0,0,0,0.25)]
      transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_18px_30px_-4px_rgba(0,0,0,0.45),-12px_0_24px_-6px_rgba(0,0,0,0.3),12px_0_24px_-6px_rgba(0,0,0,0.3)]">
      
      <div className="flex gap-5">
        <Link href="/">
          <Image className="w-20 hover:scale-115 transition-transform duration-200" src={Logo} alt="Kouman Logo" />
        </Link>
      </div>

      <div className="flex text-lg gap-8 font-bold">
        <Link href="/episodes" className="relative group">
          <span className="group-hover:text-orange-700 transition-colors">اپیزودها</span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
        </Link>

        <Link href="/universe" className="relative group">
          <span className="group-hover:text-orange-700 transition-colors">دنیای کومان</span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
        </Link>

        <Link href="/store" className="relative group">
          <span className="group-hover:text-orange-700 transition-colors">فروشگاه</span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
        </Link>
      </div>
    </header>
  );
}