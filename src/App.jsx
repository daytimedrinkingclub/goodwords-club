import { useState } from "react";
import { Github, Star } from "lucide-react";
import GratitudeForm from "./components/GratitudeForm";
import GratitudeList from "./components/GratitudeList";

const CELEBRATION_EMOJIS = ["✨", "💖", "🌸", "🫶", "🌼", "💫", "🌷", "🎉"];

const createEmojiBurst = () =>
  Array.from({ length: 28 }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
    left: 4 + Math.random() * 92,
    top: 8 + Math.random() * 72,
    driftX: (Math.random() - 0.5) * 150,
    driftY: -80 - Math.random() * 140,
    delay: Math.random() * 0.22,
    duration: 1.5 + Math.random() * 0.9,
    rotate: (Math.random() - 0.5) * 110,
    size: 1.1 + Math.random() * 0.9,
  }));

const App = () => {
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [emojiBurst, setEmojiBurst] = useState([]);

  const handleGoodTap = () => {
    setEmojiBurst(createEmojiBurst());
    setTimeout(() => setEmojiBurst([]), 2400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-blue-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 px-6 py-10 text-center shadow-[0_22px_60px_rgba(236,72,153,0.14)] backdrop-blur-sm md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.16),_transparent_28%)]" />
          <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-pink-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-sky-300/20 blur-2xl" />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-white/70 px-4 py-1.5 text-sm font-semibold tracking-[0.2em] text-pink-500 shadow-sm uppercase">
              <Star size={14} className="fill-pink-400 text-pink-400" />
              gratitude wall
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.06em] text-transparent md:text-7xl"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ec4899 0%, #db2777 42%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textShadow: "0 10px 30px rgba(236,72,153,0.14)",
              }}
            >
              <span
                onClick={handleGoodTap}
                className="cursor-pointer transition-transform duration-150 active:scale-110 inline-block"
              >Good</span> Words Club
            </h1>

            <a
              href="https://github.com/ptmaroct/goodwords-club"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub repository"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-white/72 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600 hover:shadow-[0_16px_30px_rgba(236,72,153,0.14)]"
            >
              <Github size={18} />
            </a>
          </div>
        </header>

        <GratitudeForm onSubmit={setRecentlyAddedId} />
        <GratitudeList highlightedId={recentlyAddedId} />
      </div>
      {emojiBurst.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {emojiBurst.map((particle) => (
            <span
              key={particle.id}
              className="emoji-burst-particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                fontSize: `${particle.size}rem`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                "--burst-drift-x": `${particle.driftX}px`,
                "--burst-drift-y": `${particle.driftY}px`,
                "--burst-rotate": `${particle.rotate}deg`,
              }}
            >
              {particle.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
