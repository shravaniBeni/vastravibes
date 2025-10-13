import { MyContext } from "./myContext";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, fireDB } from "../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const MyState = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Listen to Firebase auth changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch Firestore user data
        const userDocRef = doc(fireDB, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setFirestoreUser(data);
          setIsProfileComplete(!!data.isProfileComplete);
        } else {
          setFirestoreUser(null);
          setIsProfileComplete(false);
        }
      } else {
        setFirestoreUser(null);
        setIsProfileComplete(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <MyContext.Provider
      value={{
        loading,
        setLoading,
        currentUser,
        firestoreUser,
        setFirestoreUser,
        isProfileComplete,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyState;
