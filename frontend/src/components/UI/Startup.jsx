import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Startup = ({ setHasLaunched }) => {
  const [phase, setPhase] = useState(1);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showCursor, setShowCursor] = useState(false);
  const [infoText, setInfoText] = useState("Click to log in via X...");

  const [loggingIn, setLoggingIn] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let response = await fetch(`${API_URL}/verifyloggedin`, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 200) {
          console.log("✅ User is authenticated");
          setHasLaunched(true);
        } else {
          console.log("❌ Not authenticated, staying on Startup");
        }
      } catch (error) {
        console.error("❌ Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [setHasLaunched, API_URL]); // Runs only on first render

  useEffect(() => {
    if (phase === 1) {
      let index = 0;
      let speedPattern = [
        600, 400, 300, 200, 150, 100, 75, 50, 50, 50, 75, 100, 150, 200, 300,
        400, 500,
      ];

      const startupLines = [
        "MAMMOTHBOARD™ BIOS v1.0.3 - Copyright (C) 1995 Mammoth Inc.",
        "BIOS Date 02/24/25 12:34:56 Ver: 95.01.42",
        "CPU: MammothCore X2000 @ 66 MHz",
        "Speed: 66.6 MHz (Overclock detected: Proceed with caution!)",
        "This VGA/PCI BIOS is released under the MLGPL (Mammoth License GNU Public License)",
        "",
        "Press F1 for Mammoth Help Center™",
        "Press F2 to Feed the Mammoth™",
        "",
        "Memory Clock: 128 MHz, Tcl:5 Trcd:4 Trp:6 Tras:15 (Single Mammoth Mode)",
        "Memory Test: 512000K OK (Half a Mammoth Brain Activated)",
        "",
        "PMU ROM/Version: 4201",
        "NVMM ROM Version: 1.42.88",
        "Initializing Mammoth Extensions... Done.",
        "256MB OK (Mammoth Mode Engaged)",
        "",
        "Detected Devices:",
        "- 1 MammothType Keyboard",
        "- 1 MammothBall Mouse",
        "- 1 Mammoth Storage Unit (MSU)",
        "- 1 USB Flash Drive (Labeled: 'DON'T OPEN THIS')",
        "",
        "Auto-detecting Mammoth Storage Devices...",
        "Device #01: MSU 5000X - 'Storage So Big, Even a Mammoth Approves'",
        "01 Storage Device Found and Configured.",
        "",
        "(C) Mammoth Inc. - Powered by MammothDrive™",
        "64-420-9000-19951101-240295-42AOV003-MMT1UC",
        "",
        "Booting into MammothOS...",
        "Loading Wooly Kernel v3.1.4...",
        "Executing: 'DO_NOT_CRASH.BAT'",
        "MammothOS Ready. Welcome Back, Chief!",
        "",
      ];

      const addLine = () => {
        if (index >= startupLines.length) {
          setTimeout(() => {
            setDisplayedLines((prevLines) => [...prevLines, "C:\\>"]);
            setShowCursor(true);
          }, 200);

          // Phase 1 tamamlandıktan sonra 3 saniye bekleyip Phase 2'ye geç
          setTimeout(() => setPhase(2), 3000);
          return;
        }

        setDisplayedLines((prevLines) => [...prevLines, startupLines[index]]);
        let nextSpeed = speedPattern[index] || 75;
        index++;
        setTimeout(addLine, nextSpeed);
      };

      setTimeout(addLine, 1000);
    }
  }, [phase]);

  useEffect(() => {
    if (showCursor) {
      const cursorInterval = setInterval(() => {
        setDisplayedLines((prevLines) => {
          if (prevLines.length === 0) return prevLines;

          let lastLine = prevLines[prevLines.length - 1] || "C:\\>";

          if (lastLine.endsWith("_")) {
            return [...prevLines.slice(0, -1), "C:\\>"];
          } else {
            return [...prevLines.slice(0, -1), "C:\\>_"];
          }
        });
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [showCursor]);

  useEffect(() => {
    if (phase === 2) {
      setTimeout(() => setPhase(3), 4000);
    }
  }, [phase]);

  const logIn = async () => {
    if (phase !== 3 || loggingIn) return;
    setLoggingIn(true);

    try {
      // ✅ Step 1: Request OAuth URL
      let response = await fetch(`${API_URL}/oauthurl`);
      let data = await response.json();

      if (!data.oAuthURL || !data.sessionId) {
        console.error("❌ Failed to retrieve OAuth URL or sessionId");
        setLoggingIn(false);
        return;
      }

      setInfoText("Connecting to X...");

      const oAuthURL = data.oAuthURL;
      const sessionId = data.sessionId;

      // ✅ Step 2: Open OAuth popup
      window.open(oAuthURL, "oAuthPopup", "popup=true");

      setInfoText("Creating a wallet...");

      response = await fetch(`${API_URL}/oauthstatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      });

      data = await response.json();

      if (data.message === "Successfully logged in!") {
        console.log("✅ Successfully logged in!");
        setHasLaunched(true);
        setLoggingIn(false);
        return;
      }

      // ❌ Maksimum deneme sayısına ulaşıldıysa, hata mesajı göster
      console.error("❌ OAuth timeout: Login failed after multiple attempts.");
      setInfoText("OAuth process took too long. Please refresh the page.");
      setLoggingIn(false);

      console.error("❌ OAuth login timeout!");
      setLoggingIn(false);
    } catch (error) {
      console.error("❌ API Error:", error);
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      {/* PHASE 1 - BIOS Terminal */}
      {phase === 1 && (
        <div className="text-green-500 font-mono p-4 w-full text-left">
          {displayedLines.map((line, idx) => (
            <div key={idx}>{line === "" ? "\u00A0" : line}</div>
          ))}
        </div>
      )}

      {/* PHASE 2 - Windows XP Tarzı Loading */}
      {(phase === 2 || phase === 3) && (
        <div
          onClick={logIn}
          className="relative w-full h-full flex flex-col items-center justify-center bg-black text-white"
        >
          <img
            src="assets/logobw.png"
            alt="MammothOS Logo"
            className="w-[300px] mb-6"
          />
          <div
            className={`relative w-[200px] h-4 border border-gray-300 rounded-sm overflow-hidden mx-auto ${
              phase === 3 ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
          >
            <div
              className={`absolute flex animate-xp-loading h-full items-center gap-[1px]`}
            >
              <div className="w-2 rounded-[1px] h-3/4 bg-gray-200"></div>
              <div className="w-2 rounded-[1px] h-3/4 bg-gray-200"></div>
              <div className="w-2 rounded-[1px] h-3/4 bg-gray-200"></div>
            </div>
          </div>
          <div
            className={`absolute mt-[600px] text-gray-200 ${
              phase === 3 ? "visibilty" : "hidden"
            } transition-opacity duration-300 animate-fade-in-out`}
          >
            <p className="italic">{infoText}</p>
          </div>

          {/* Sol altta Powered by Celestia */}
          <div className="absolute bottom-10 left-20 text-gray-100 text-sm">
            Built on <span className="italic">Celestia</span>
          </div>

          {/* Sağ alt köşede SVG */}
          <div className="absolute bottom-10 right-20 flex text-gray-100 gap-2">
            <p className="mt-auto mb-0 leading-[15px]">Powered by</p>
            <img className="w-[100px]" src="assets/para.svg" alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

Startup.propTypes = {
  setHasLaunched: PropTypes.func.isRequired,
};

export default Startup;
