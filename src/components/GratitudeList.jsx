import { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { Heart } from "lucide-react";
import {
  ref,
  query,
  orderByChild,
  limitToLast,
  endBefore,
  onChildAdded,
  get,
  off,
} from "firebase/database";
import { database } from "../firebase";
import GratitudeNote from "./GratitudeNote";

const GratitudeList = () => {
  const [gratitudes, setGratitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const loader = useRef(null);

  useEffect(() => {
    const gratitudeRef = ref(database, "gratitudes");
    const gratitudeQuery = query(
      gratitudeRef,
      orderByChild("timestamp"),
      limitToLast(10)
    );

    const loadInitialGratitudes = async () => {
      const snapshot = await get(gratitudeQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const gratitudeList = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setGratitudes(gratitudeList);
        setLastTimestamp(gratitudeList[gratitudeList.length - 1].timestamp);
      }
    };

    loadInitialGratitudes();

    // Listen for new gratitudes
    const handleNewGratitude = (snapshot) => {
      const newGratitude = { id: snapshot.key, ...snapshot.val() };
      setGratitudes((prev) => [newGratitude, ...prev]);
    };

    onChildAdded(gratitudeQuery, handleNewGratitude);

    return () => {
      // Clean up the listener
      off(gratitudeQuery, "child_added", handleNewGratitude);
    };
  }, []);

  const fetchMoreGratitudes = async () => {
    if (loading || !lastTimestamp) return;

    setLoading(true);
    const gratitudeRef = ref(database, "gratitudes");
    const gratitudeQuery = query(
      gratitudeRef,
      orderByChild("timestamp"),
      endBefore(lastTimestamp),
      limitToLast(10)
    );

    try {
      const snapshot = await get(gratitudeQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newGratitudes = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setGratitudes((prev) => [...prev, ...newGratitudes]);
        setLastTimestamp(newGratitudes[newGratitudes.length - 1].timestamp);
      }
    } catch (error) {
      console.error("Error fetching more gratitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreGratitudes();
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
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-pink-600 mb-2">
          Recent Gratitude Notes
        </h2>
        <p className="text-gray-600">
          Scroll down to see more heartwarming messages from our community.
        </p>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-0 md:-ml-4"
        columnClassName="pl-0 md:pl-8 bg-clip-padding"
      >
        {gratitudes.map((gratitude, index) => (
          <div key={gratitude.id} className="mb-4 md:mb-8">
            <GratitudeNote {...gratitude} id={index} />
          </div>
        ))}
      </Masonry>

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <Heart className="text-pink-500 animate-pulse" size={48} />
        </div>
      )}
      <div ref={loader} className="h-10"></div>
    </>
  );
};

export default GratitudeList;
