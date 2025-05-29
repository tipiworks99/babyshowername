import { useState } from "react"; // React hook for managing local component state
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation after form submission
import { initializeApp } from "firebase/app"; // Firebase SDK initialization
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestore DB functions

// --- Firebase Configuration & Initialization ---
firebase.initializeApp({
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
  measurementId: "YOUR_MEASUREMENT_ID_HERE"
});

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore instance
const db = getFirestore(app);

// --- Main Form Component ---
export default function BabyShowerForm() {
  // Local state to manage form data
  const [formData, setFormData] = useState({
    name: "",          // User's name (optional)
    boyNames: [""],    // Baby boy name suggestions
    girlNames: [""],   // Baby girl name suggestions
    genderGuess: "",   // New field: gender guess ("boy" or "girl")
  });

  // Hook to navigate to thank-you page after submission
  const navigate = useNavigate();

  // Handle change for name input
  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  // Handle change for boy or girl name fields
  const handleChange = (e, index, field) => {
    const updatedList = [...formData[field]];
    updatedList[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  // Add an extra name input field
  const handleAddField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  // Remove a specific name input field
  const handleRemoveField = (field, index) => {
    const updatedList = [...formData[field]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  // Handle gender guess radio button change
  const handleGenderGuessChange = (e) => {
    setFormData((prev) => ({ ...prev, genderGuess: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasAtLeastOneName =
      formData.boyNames.some((name) => name.trim() !== "") ||
      formData.girlNames.some((name) => name.trim() !== "");

    if (!hasAtLeastOneName) {
      alert("Please enter at least one baby name 💕");
      return;
    }
    if (!formData.genderGuess) {
        alert("Come on now, take a guess! Is it a boy or a girl? 😘");
        return;
      }

    try {
      // Save form data to Firestore
      await addDoc(collection(db, "babyNameSuggestions"), {
        ...formData,
        timestamp: new Date(),
      });
      navigate("/thank-you");
    } catch (error) {
      alert(`😵‍💫 Uh-oh! Couldn't save your magic:\n${error.message}`);
    }
  };

  // --- JSX for Form UI ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border-2 border-blue-200"
      >
        {/* Floating baby icon with cradle animation */}
        <div className="flex justify-center mb-6">
          <style>
            {`
              @keyframes cradle {
                0%, 100% { transform: rotate(-15deg); }
                80% { transform: rotate(15deg); }
              }
              .animate-cradle {
                animation: cradle 1s ease-in-out infinite;
              }
            `}
          </style>
          <img
            src="/baby.png"
            alt="Cute Baby Icon"
            className="w-24 h-24 animate-cradle"
          />
        </div>

        {/* Form Title */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Baby Name Suggestions
        </h1>

        {/* Name input (optional) */}
        <label className="block text-blue-700 font-medium mb-2">
          Your Name (Optional)
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className="w-full p-3 mb-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Enter your name"
        />

        {/* Gender guess selection (radio buttons) */}
        <label className="block text-purple-700 font-medium mb-2">
          Guess the Baby's Gender
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="boy"
              checked={formData.genderGuess === "boy"}
              onChange={handleGenderGuessChange}
              className="mr-2"
            />
            👶 Boy
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="girl"
              checked={formData.genderGuess === "girl"}
              onChange={handleGenderGuessChange}
              className="mr-2"
            />
            👧 Girl
          </label>
        </div>

        {/* Boy name suggestions */}
        <label className="block text-blue-700 font-medium mb-2">
          Baby Boy's Names
        </label>
        {formData.boyNames.map((boyName, index) => (
          <div key={index} className="relative">
            <input
              value={boyName}
              onChange={(e) => handleChange(e, index, "boyNames")}
              className="w-full p-3 mb-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={`Boy Name #${index + 1} (e.g., Aarav, Liam)`}
            />
            {formData.boyNames.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField("boyNames", index)}
                className="absolute right-3 top-3 text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("boyNames")}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ➕ Add another boy's name
        </button>

        {/* Girl name suggestions */}
        <label className="block text-pink-700 font-medium mb-2">
          Baby Girl's Names
        </label>
        {formData.girlNames.map((girlName, index) => (
          <div key={index} className="relative">
            <input
              value={girlName}
              onChange={(e) => handleChange(e, index, "girlNames")}
              className="w-full p-3 mb-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder={`Girl Name #${index + 1} (e.g., Aanya, Zoe)`}
            />
            {formData.girlNames.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField("girlNames", index)}
                className="absolute right-3 top-3 text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("girlNames")}
          className="mb-6 text-sm text-pink-600 hover:underline"
        >
          ➕ Add another girl's name
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-300 to-blue-300 text-white font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          💌 Submit Suggestion
        </button>
      </form>
    </div>
  );
}
