import React, { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase.config";
import { AuthContext } from "../Provider/AuthProvider";
import { FaUser, FaEnvelope, FaSpinner } from "react-icons/fa";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  if (loading) return <FaSpinner className="animate-spin text-4xl mx-auto mt-20" />;

  if (!userData) return <p className="text-center mt-20">User data not found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <img
        src={userData.photoURL || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-32 h-32 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold text-center">{userData.displayName || "No Name"}</h2>
      <p className="text-center text-gray-600 mb-2">
        <FaEnvelope className="inline mr-2" /> {userData.email}
      </p>
    </div>
  );
};

export default MyProfile;
