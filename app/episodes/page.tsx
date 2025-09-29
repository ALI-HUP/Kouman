import Link from "next/link";

export default function EpisodesPage() {
  const videos = [
    { id: "tITrP0at8gk", title: "Episode 1 Title", url: "https://youtu.be/tITrP0at8gk" },
    { id: "dlKsPl4ZYsI", title: "Episode 2 Title", url: "https://youtu.be/dlKsPl4ZYsI" },
    { id: "Kzt4FBi7fCg", title: "Episode 3 Title", url: "https://youtu.be/Kzt4FBi7fCg" },
    { id: "aXYNwPJxaZA", title: "Episode 4 Title", url: "https://youtu.be/aXYNwPJxaZA" },
    { id: "TIQ1gS9w1HI", title: "Episode 5 Title", url: "https://youtu.be/TIQ1gS9w1HI" },
    { id: "KP9Stsln9fM", title: "Episode 6 Title", url: "https://youtu.be/KP9Stsln9fM" },
    { id: "YkcaWjx3Y34", title: "Episode 7 Title", url: "https://youtu.be/YkcaWjx3Y34" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8"> 
      <h1 className="text-4xl font-bold text-center mb-12">اپیزودها</h1>

      <div className="px-6 py-10"> 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="aspect-video relative"> 
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              <div className="p-4 flex flex-row-reverse justify-between items-center">
                <Link 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-orange-600 hover:underline flex-shrink-0 text-sm"
                >
                  تماشا در یوتیوب
                </Link>
                <h2 className="text-base font-medium line-clamp-2 text-right">
                  {video.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
