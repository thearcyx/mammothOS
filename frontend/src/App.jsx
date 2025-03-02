import { useEffect, useState } from "react";
import { Taskbar, Desktop } from "./components/Desktop";
import { Startup } from "./components/UI";

function App() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const inMaintenance = import.meta.env.VITE_STATUS;

  /**
   * Monitors screen size changes to ensure the application runs only on desktop devices.
   * If the screen width is below 1024px, the app displays an error message instead of loading.
   */
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize(); // Initial check on load
    window.addEventListener("resize", checkScreenSize); // Listen for window resizes

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (hasLaunched) {
      const audio = new Audio("assets/audio/intro.mp3");
      audio.play().catch((error) => console.log("Audio playback failed:", error));
    }
  }, [hasLaunched])
  
  /**
   * Displays a simulated "Blue Screen of Death" (BSoD) if the screen is too small.
   * This prevents users from running MammothOS on mobile devices.
   */
  if (!isDesktop) {
    return (
      <div className="flex flex-col justify-center items-center w-screen h-screen bg-[#0000AA] text-white text-center px-4 font-mono">
        <p className="text-6xl">💀</p>
        <p className="text-xl font-bold mt-4">A fatal error has occurred in MammothOS.</p>
        <p className="text-lg mt-2">
          The system has detected that your screen is <strong>too small</strong> for this ancient beast. 🦣
        </p>
        <p className="mt-4">
          Please restart MammothOS on a <strong>larger display</strong> and try again. <br />
          If this issue persists, consider upgrading to <strong>MammothOS Professional Edition™</strong>.
        </p>
        <p className="text-sm mt-8">
          <strong>Technical Info:</strong> <br />
          ERROR_CODE: <span className="text-yellow-400">🦣_DISPLAY_TOO_SMALL</span> <br />
          SYSTEM FAILURE: Screen size below <strong>1024px</strong>
        </p>
        <div className="mt-8 text-sm opacity-70">Press any key to continue...</div>
      </div>
    );
  }

  if (inMaintenance === "MAINTENANCE") {
    return (
      <div className="flex flex-col justify-center items-center w-screen h-screen bg-[#001f3f] text-white text-center px-4 font-mono">
        <p className="text-6xl">🦣</p>
        <p className="text-xl font-bold mt-4">MammothOS is Taking a Mammoth Nap! 😴❄️</p>
        <p className="text-lg mt-2">
          Even the mightiest mammoth needs a little rest and refresh! 🦣💨
        </p>
        <p className="mt-4">
          We’re busy sharpening our tusks, tuning up our ice-age tech, and making the system
          even stronger for all explorers.
        </p>
        <p className="mt-4">
          Hang tight—the tundra will be open for adventures again soon! ❄️
        </p>
        <p className="text-sm mt-8">
          <strong>Technical Info:</strong> <br />
          STATUS: <span className="text-yellow-400">Mammoth Maintenance Mode 🛠️</span><br />
          ESTIMATED RETURN: As soon as we shake off the frost! ⏳
        </p>
        <p className="mt-6 text-sm">
          Stay updated on our migration journey via <a href="https://x.com/mammothos" target="_blank" className="text-blue-400 underline">X</a>. 
        </p>
        <div className="mt-8 text-sm opacity-70">
          No mammoths were harmed during this maintenance. 🦣
        </div>
      </div>
    );
  }
  
  /**
   * Main application layout. If the startup sequence has completed,
   * it loads the desktop environment. Otherwise, it starts the boot process.
   */
  return (
    <div className="flex flex-col w-screen h-screen font-msserif">
      {hasLaunched ? (
        <>
          <Desktop />
          <Taskbar />
        </>
      ) : (
        <Startup setHasLaunched={setHasLaunched} />
      )}
    </div>
  );
}

export default App;