import { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { Heart } from "lucide-react";

const colors = [
  "bg-yellow-200",
  "bg-pink-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-red-200",
  "bg-orange-200",
  "bg-teal-200",
  "bg-indigo-200",
  "bg-gray-200",
  "bg-lime-200",
  "bg-amber-200",
  "bg-cyan-200",
  "bg-rose-200",
  "bg-fuchsia-200",
];

const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];

const getColor = (id) => colors[id % colors.length];
const getRotation = (id) => rotations[id % rotations.length];

const GratitudeNote = ({ id, name, content, tags }) => {
  const color = getColor(id);
  const rotation = getRotation(id);

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${color} ${rotation} transform transition-transform duration-300 hover:scale-105`}
    >
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className="mb-4">{content}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-white bg-opacity-50 px-2 py-1 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [gratitudes, setGratitudes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchGratitudes = async () => {
    setLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      const newGratitudes = Array(10)
        .fill()
        .map((_, i) => ({
          id: gratitudes.length + i + 1,
          name: `Anonymous ${gratitudes.length + i + 1}`,
          content: `I'm grateful for ${
            [
              "the sunshine",
              "my family",
              "good health",
              "my friends",
              "this opportunity",
            ][Math.floor(Math.random() * 5)]
          }!`,
          tags: ["gratitude", "happiness", "life", "music", "art", "nature"]
            .sort(() => 0.5 - Math.random())
            .slice(0, 2),
        }));
      setGratitudes((prev) => [...prev, ...newGratitudes]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchGratitudes();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchGratitudes();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            Good Words Club
          </h1>
          <p className="text-gray-600">
            Spread positivity and share what you&apos;re grateful for! Built by{" "}
            <a
              href="https://agisharma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-500"
            >
              Anuj Sharma
            </a>
          </p>
        </header>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-0 md:-ml-4"
          columnClassName="pl-0 md:pl-8 bg-clip-padding"
        >
          {gratitudes.map((gratitude) => (
            <div key={gratitude.id} className="mb-4 md:mb-8">
              <GratitudeNote {...gratitude} />
            </div>
          ))}
        </Masonry>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <Heart className="text-pink-500 animate-pulse" size={48} />
          </div>
        )}
        <div ref={loader} className="h-10"></div>
      </div>
    </div>
  );
};

export default App;
