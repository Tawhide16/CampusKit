import React, { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase.config";
import { AuthContext } from "../Provider/AuthProvider";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import NavBar from "../Components/NavBar";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );

  if (!user) return <p className="text-center mt-20">Please log in to see your profile.</p>;

  // Auth user as fallback if Firestore doc missing
  const profilePic = userData?.photoURL || user.photoURL || "https://via.placeholder.com/150";
  const displayName = userData?.displayName || user.displayName || "No Name";
  const email = userData?.email || user.email || "No Email";

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto  p-6 border rounded-lg shadow-lg mt-25">
        <img
          src={profilePic}
          alt={displayName}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-center">{displayName}</h2>
        <p className="text-center text-gray-600 mb-2">
          <FaEnvelope className="inline mr-2" /> {email}
        </p>
      </div>
    </>
  );
};

export default MyProfile;
