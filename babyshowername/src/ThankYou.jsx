import Confetti from "react-confetti"; // Confetti animation for celebration vibes 🎉
import { useWindowSize } from "react-use"; // Hook to get current window size — needed for full-screen confetti
import { useEffect } from "react"; // React hook to handle side effects (like lifecycle events)

export default function ThankYou() {
  // Get current window width and height to make confetti cover the entire screen
  const { width, height } = useWindowSize();

  useEffect(() => {
    // When the component mounts, push a dummy entry into the browser history stack
    // This is a clever trick to disable the browser back button on this page
    window.history.pushState(null, "", window.location.href);

    // Define a handler that listens for "popstate" events (triggered by back/forward navigation)
    const onPopState = () => {
      // Whenever user tries to go back, push them forward again — no escape! 😏
      window.history.pushState(null, "", window.location.href);
    };

    // Attach the handler to the popstate event
    window.addEventListener("popstate", onPopState);

    // Cleanup function runs when component unmounts: remove the popstate listener to avoid memory leaks
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []); // Empty dependency array means this runs only once when component mounts

  // The JSX for rendering the thank-you page:
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-pink-50">
      {/* Confetti explosion covers entire viewport for that celebratory mood! */}
      <Confetti width={width} height={height} />
      
      {/* Content box with shadow and rounded corners, sitting above the confetti */}
      <div className="bg-white p-8 rounded-xl shadow-lg text-center z-10 relative">
        {/* Big, bold, pink thank you message with a cute party emoji 🥳 */}
        <h1 className="text-3xl font-bold text-pink-700 mb-4">🎉 Thank You!</h1>
        {/* Sweet message letting user know their suggestion was received */}
        <p className="text-gray-700">Your baby name suggestions were received with love! 💖</p>
      </div>
    </div>
  );
}
