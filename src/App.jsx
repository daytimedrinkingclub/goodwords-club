import GratitudeForm from "./components/GratitudeForm";
import GratitudeList from "./components/GratitudeList";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            Good Words Club
          </h1>
          <p className="text-gray-600">
            Spread positivity and share what you&apos;re grateful for!
            <a
              href="https://github.com/ptmaroct/goodwords-club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0366d6] hover:text-[#0366d6]"
            >
              {" "}
              Built
            </a>{" "}
            with ❤️ by{" "}
            <a
              href="https://agisharma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-500"
            >
              Anuj
            </a>
          </p>
        </header>

        <GratitudeForm />
        <GratitudeList />
      </div>
    </div>
  );
};

export default App;
