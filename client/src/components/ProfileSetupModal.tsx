import React, { useState } from "react";
import { Dialog } from "@headlessui/react"; // nice accessible modal
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/FirebaseConfig";
import { useContext } from "react";
import { MyContext } from "../context/myContext";
// const storage = getStorage(app);

interface ProfileSetupModalProps {
  firestoreUser: any;
  onClose: () => void;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  firestoreUser,
  onClose,
}) => {
  const { currentUser, setFirestoreUser } = useContext(MyContext);

  const [formData, setFormData] = useState({
    username: firestoreUser?.username || "",
    specialty: firestoreUser?.specialty || "",
    location: firestoreUser?.location || "",
    description: firestoreUser?.description || "",
    avatar: firestoreUser?.avatar || "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.username || !formData.specialty || !formData.location) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      if (!currentUser?.uid) throw new Error("User ID not found!");

      const userRef = doc(fireDB, "users", currentUser.uid);

      // Optional: handle avatar
      let avatarUrl = firestoreUser?.avatar || "";
      if (formData.avatar && typeof formData.avatar === "object") {
        const storage = getStorage(app);
        const file = formData.avatar;
        const fileRef = ref(storage, `avatars/${file.name}`);
        await uploadBytes(fileRef, file);
        avatarUrl = await getDownloadURL(fileRef);
      }

      // ✅ Update Firestore
      await updateDoc(userRef, {
        username: formData.username,
        specialty: formData.specialty,
        location: formData.location,
        description: formData.description,
        avatar: avatarUrl,
        profileComplete: true,
      });

      // ✅ Update local context
      setFirestoreUser((prev) => ({
        ...prev,
        username: formData.username,
        specialty: formData.specialty,
        location: formData.location,
        description: formData.description,
        avatar: avatarUrl,
        profileComplete: true,
      }));

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4 text-center">
            Complete Your Profile
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter a unique username"
                required
              />
            </div>

            <div>
              <Label htmlFor="specialty">Specialty *</Label>
              <Input
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="Your specialty (e.g. Silk Weaving)"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Bio / Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell something about yourself..."
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <Label htmlFor="avatar">Avatar</Label>
              <input
                title="avatar"
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: e.target.files![0], // store the file temporarily
                    }));
                  }
                }}
                className="w-full"
              />
              {formData.avatar && typeof formData.avatar === "object" && (
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Preview"
                  className="mt-2 w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProfileSetupModal;
