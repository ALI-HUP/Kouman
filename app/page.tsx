import Image from "next/image";
import Banner from "@/public/banners/channels4_banner (1).jpg";

export default function Home() {
  return (
    <div>
      <header className="">
        <Image src={Banner} alt="first banner" className="w-[100%]"/>
      </header>
      <h1 className="text-2xl">چنل کوماندو</h1>
    </div>
  );
}
