import Image from "next/image";
import Banner from "@/public/banners/banner-NBG.png";

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-center flex-col">
        <Image src={Banner} alt="first banner" className="w-[750px]"/>
        <h1 className="text-2xl m-5">چنل کوماندو</h1>
      </header>
    </div>
  );
}
