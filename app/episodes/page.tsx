import Link from "next/link";

export default function EpisodesPage() {
  const videos = [
    {
      id: "tITrP0at8gk",
      title: "Episode 1 Title",
      url: "https://youtu.be/tITrP0at8gk",
    },
    {
      id: "dlKsPl4ZYsI",
      title: "Episode 2 Title",
      url: "https://youtu.be/dlKsPl4ZYsI",
    },
    {
      id: "Kzt4FBi7fCg",
      title: "Episode 3 Title",
      url: "https://youtu.be/Kzt4FBi7fCg",
    },
    {
      id: "aXYNwPJxaZA",
      title: "Episode 4 Title",
      url: "https://youtu.be/aXYNwPJxaZA",
    },
    {
      id: "TIQ1gS9w1HI",
      title: "Episode 5 Title",
      url: "https://youtu.be/TIQ1gS9w1HI",
    },
    {
      id: "KP9Stsln9fM",
      title: "Episode 6 Title",
      url: "https://youtu.be/KP9Stsln9fM",
    },
    {
      id: "YkcaWjx3Y34",
      title: "Episode 7 Title",
      url: "https://youtu.be/YkcaWjx3Y34",
    },
  ];

  return (
    <div className=" mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">اپیزودها</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            ></iframe>
            <div className="p-4 flex gap-52">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{video.title}</h2>
              <Link href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                تماشا در یوتیوب
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
