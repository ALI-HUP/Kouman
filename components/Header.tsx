import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/png/kouman.png";

export default function Header() {
  return (
    <header className="m-5 rounded-full bg-orange-200 w-[70%] mx-auto flex justify-between items-center p-3 px-6">
      <div className="flex gap-5">
        <Link href="/">
          <Image className="w-20" src={Logo} alt="Kouman Logo" />
        </Link>
      </div>

      <div className="flex text-lg gap-5">
        <Link href="/episodes">
          <p>اپیزودها</p>
        </Link>
        <Link href="/universe">
          <p>دنیای کومان</p>
        </Link>
        <Link href="/store">
          <p>فروشگاه</p>
        </Link>
      </div>
    </header>
  );
}