"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        location: "",
        about: "",
    });

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        router.push("/dashboard/dashboard");
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">

                {/* Image Container */}
                <div className="relative h-48 bg-gray-300">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            Upload Profile Image
                        </div>
                    )}

                    {/* Camera Button */}
                    <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-3 right-3 bg-blue-600 w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg"
                    >
                        📷
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* Form */}
                <div className="p-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />

                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    >
                        <option value="">Select Location</option>
                        <option value="USA">USA</option>
                        <option value="India">India</option>
                        <option value="UK">UK</option>
                    </select>

                    <textarea
                        name="about"
                        placeholder="About you"
                        value={formData.about}
                        onChange={handleChange}
                        rows={3}
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </main>
    );
}
