import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { Heart } from "lucide-react";
import {
  ref,
  query,
  orderByChild,
  onChildAdded,
  onValue,
  off,
} from "firebase/database";
import { database } from "../firebase";
import GratitudeNote from "./GratitudeNote";

const GratitudeList = () => {
  const [gratitudes, setGratitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gratitudeRef = ref(database, "gratitudes");
    const gratitudeQuery = query(gratitudeRef, orderByChild("timestamp"));

    const handleSnapshot = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const gratitudeList = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setGratitudes(gratitudeList);
        setLoading(false);
      } else {
        setGratitudes([]);
        setLoading(false);
      }
    };

    const handleNewGratitude = (snapshot) => {
      const newGratitude = { id: snapshot.key, ...snapshot.val() };
      setGratitudes((prev) => [newGratitude, ...prev]);
    };

    onValue(gratitudeQuery, handleSnapshot);
    onChildAdded(gratitudeQuery, handleNewGratitude);

    return () => {
      off(gratitudeQuery, "value", handleSnapshot);
      off(gratitudeQuery, "child_added", handleNewGratitude);
    };
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-8">
        <Heart className="text-pink-500 animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-pink-600 mb-2">
          Recent Gratitude Notes
        </h2>
        <p className="text-gray-600">
          Heartwarming messages from our community.
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
    </>
  );
};

export default GratitudeList;
