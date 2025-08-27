import { useEffect, useState, useContext } from "react";
 // your Firebase Auth context
import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebase.config"; // your Firestore instance
import { AuthContext } from "../Provider/AuthProvider";

const useUserInfo = () => {
  const { user } = useContext(AuthContext); 
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", user.uid); // assuming collection 'users'
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          setUserInfo(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  return { userInfo, loading };
};

export default useUserInfo;
