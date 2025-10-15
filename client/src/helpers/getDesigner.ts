import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";

export interface UserData {
    uid: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    specialty?: string;
    location?: string;
    rating?: number;
    reviews?: number;
    products?: number;
    followers?: number;
    following?: number;
    joinDate?: string;
    description?: string;
    avatar?: string;
    verified?: boolean;
    postsCount?: number;
}

/**
 * Fetch a user from Firestore by UID
 * @param uid - UID of the user to fetch
 * @returns UserData object or null if not found
 */
export const fetchUserByUid = async (uid: string): Promise<UserData | null> => {
    try {
        const usersRef = collection(fireDB, "users"); // make sure your collection name is correct
        const q = query(usersRef, where("uid", "==", uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            return {
                uid: docData.uid,
                firstName: docData.firstName,
                lastName: docData.lastName,
                username: docData.username,
                specialty: docData.specialty,
                location: docData.location,
                rating: docData.rating,
                reviews: docData.reviews,
                products: docData.products,
                followers: docData.followers,
                following: docData.following,
                joinDate: docData.joinDate,
                description: docData.description,
                avatar: docData.avatar,
                verified: docData.verified,
                postsCount: docData.postsCount,
            };
        } else {
            console.warn(`User with UID ${uid} not found`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};
