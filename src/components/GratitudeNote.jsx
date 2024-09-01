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

const GratitudeNote = ({ id, name, content, tags = [] }) => {
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

export default GratitudeNote;
