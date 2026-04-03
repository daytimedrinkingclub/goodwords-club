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

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  }).format(new Date(timestamp));
};

const GratitudeNote = ({
  id,
  name,
  content,
  tags = [],
  timestamp,
  isHighlighted = false,
}) => {
  const color = getColor(id);
  const rotation = getRotation(id);
  const formattedDate = formatDate(timestamp);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] border border-white/50 p-5 shadow-[0_18px_35px_rgba(236,72,153,0.14)] ${color} ${rotation} transform transition-all duration-500 hover:scale-[1.03] ${
        isHighlighted
          ? "ring-4 ring-white/80 shadow-[0_0_0_10px_rgba(244,114,182,0.16),0_24px_50px_rgba(236,72,153,0.24)]"
          : ""
      }`}
    >
      {formattedDate && (
        <div className="absolute right-4 top-4 rotate-[4deg] rounded-full border border-white/45 bg-white/38 px-3 py-1 text-[1.02rem] text-slate-700/85 shadow-[0_4px_12px_rgba(15,23,42,0.05)] backdrop-blur-[2px]">
          <span style={{ fontFamily: '"Caveat", cursive' }}>
            {formattedDate}
          </span>
        </div>
      )}

      <div className="pr-24">
        <h3 className="mb-2 text-[1.9rem] font-bold leading-none text-slate-800">
          {name}
        </h3>
      </div>

      <p className="mb-4 text-lg leading-relaxed text-slate-800/90">{content}</p>

      {!!tags.length && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-white/60 px-3 py-1 text-sm text-slate-700 shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GratitudeNote;
