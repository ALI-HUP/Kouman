import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="relative bg-orange-100 rounded-3xl shadow-xl p-10 sm:p-14 text-center max-w-lg w-full overflow-hidden">
        <div
          className="absolute -top-10 -left-10 w-40 h-40 bg-orange-300/50 rounded-full blur-2xl animate-floatBalanced pointer-events-none"
          style={{ animationDuration: "9s" }}
        />
        <div
          className="absolute -bottom-12 -right-8 w-44 h-44 bg-yellow-200/50 rounded-full blur-2xl animate-floatBalanced pointer-events-none"
          style={{ animationDuration: "11s", animationDelay: "2s" }}
        />

        <p className="text-7xl sm:text-9xl font-black text-orange-600 drop-shadow-lg">
          ۴۰۴
        </p>
        <h1 className="text-2xl sm:text-3xl font-black mt-4 text-gray-900">
          صفحه پیدا نشد!
        </h1>
        <p className="text-gray-700 mt-4 leading-relaxed">
          صفحه‌ای که دنبالش بودید وجود نداره. برگردید خونه یا یه سری به فروشگاه
          بزنید!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            بازگشت به خانه
          </Link>
          <Link
            href="/store"
            className="bg-white hover:bg-orange-50 text-orange-600 ring-1 ring-orange-300 font-bold py-3 px-8 rounded-full transition-colors"
          >
            فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
