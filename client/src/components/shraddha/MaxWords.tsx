import { useState } from "react";

export default function MaxWords({ description }: { description: string }) {
    const [showFull, setShowFull] = useState(false);

    // Split description into words
    const words = description.split(" ");
    const shortDesc = words.slice(0, 10).join(" "); // first 10 words

    return (
        <p className="text-white/80 text-xs mb-2">
            {showFull ? description : shortDesc + (words.length > 10 ? "..." : "")}{" "}
            {words.length > 10 && (
                <span
                    className="text-blue-400 cursor-pointer"
                    onClick={() => setShowFull(!showFull)}
                >
                    {showFull ? "Show less" : "More"}
                </span>
            )}
        </p>
    );
}
