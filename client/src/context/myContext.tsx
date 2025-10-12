import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, fireDB } from "../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Firestore user type
export interface FirestoreUser {
  uid: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  specialty?: string;
  location?: string;
  description?: string;
  createdAt?: any; 
  profileComplete?: boolean;
  [key: string]: any;
}

// Context type
interface MyContextType {
  loading: boolean;
  currentUser: User | null;
  firestoreUser: FirestoreUser | null;
  isProfileComplete: boolean;
  setFirestoreUser: React.Dispatch<React.SetStateAction<FirestoreUser | null>>;
}

export const MyContext = createContext<MyContextType>({
  loading: true,
  currentUser: null,
  firestoreUser: null,
  isProfileComplete: false,
  setFirestoreUser: () => {},
});

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(
    null
  );
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const docRef = doc(fireDB, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as FirestoreUser;
            setFirestoreUser(data);

            const complete =
              !!data.username &&
              !!data.specialty &&
              !!data.location &&
              !!data.description;
            setIsProfileComplete(complete);
          } else {
            setFirestoreUser(null);
            setIsProfileComplete(false);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
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
        currentUser,
        firestoreUser,
        isProfileComplete,
        setFirestoreUser,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
