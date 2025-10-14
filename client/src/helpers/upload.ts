export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", `vastravibes/${file.name}-${Date.now()}`);

    const endpoint = file.type.startsWith("video/")
        ? `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`
        : `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

    try {
        const res = await fetch(endpoint, { method: "POST", body: formData });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error.message || "Upload failed");
        }
        const data = await res.json();
        console.log("Uploaded URL:", data.secure_url);
        return data.secure_url;
    } catch (err) {
        console.error("Upload failed:", err);
    }
};
