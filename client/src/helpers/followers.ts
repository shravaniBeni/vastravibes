import {
    doc,
    collection,
    setDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    updateDoc,
    increment,
    deleteDoc
} from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";

export const toggleFollow = async (followerId: string, followingId: string) => {
    if (followerId === followingId) {
        throw new Error("User cannot follow themselves");
    }

    try {
        const followersCol = collection(fireDB, "followers");
        const usersCol = collection(fireDB, "users");

        // Check if follow already exists
        const existingFollowQuery = query(
            followersCol,
            where("follower_id", "==", followerId),
            where("following_id", "==", followingId)
        );

        const existingSnapshot = await getDocs(existingFollowQuery);

        if (!existingSnapshot.empty) {
            // Unfollow: delete the follow document
            const docId = existingSnapshot.docs[0].id;
            await deleteDoc(doc(followersCol, docId));

            // Update counts
            await updateDoc(doc(usersCol, followerId), {
                following_count: increment(-1)
            });
            await updateDoc(doc(usersCol, followingId), {
                followers_count: increment(-1)
            });

            // Check if it was mutual and update the other user's document
            const mutualQuery = query(
                followersCol,
                where("follower_id", "==", followingId),
                where("following_id", "==", followerId)
            );
            const mutualSnapshot = await getDocs(mutualQuery);
            if (!mutualSnapshot.empty) {
                await updateDoc(doc(followersCol, mutualSnapshot.docs[0].id), { mutual: false });
            }

            console.log(`User ${followerId} unfollowed ${followingId}`);
        } else {
            // Follow: check mutual follow
            const mutualQuery = query(
                followersCol,
                where("follower_id", "==", followingId),
                where("following_id", "==", followerId)
            );
            const mutualSnapshot = await getDocs(mutualQuery);
            const isMutual = !mutualSnapshot.empty;

            // Add follow document
            const newFollowRef = doc(followersCol);
            await setDoc(newFollowRef, {
                follower_id: followerId,
                following_id: followingId,
                created_at: serverTimestamp(),
                mutual: isMutual
            });

            // Update mutual flag if needed
            if (isMutual) {
                await updateDoc(doc(followersCol, mutualSnapshot.docs[0].id), { mutual: true });
            }

            // Update counts
            await updateDoc(doc(usersCol, followerId), {
                following_count: increment(1)
            });
            await updateDoc(doc(usersCol, followingId), {
                followers_count: increment(1)
            });

            console.log(`User ${followerId} is now following ${followingId} ${isMutual ? "(mutual)" : ""}`);
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
    }
};
