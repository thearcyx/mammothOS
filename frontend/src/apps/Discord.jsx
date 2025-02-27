import { useState, useEffect } from "react";

const Discord = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const discordURL = "https://discord.com/widget?id=1330437203360485396&theme=dark";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#c0c0c0]">
      {isLoaded ? (
        <>
        <p className="absolute top-[24px] text-white text-xl font-bold">MammothsOverlord</p>
        <iframe
          src={discordURL}
          className="w-[630px] h-[500px] max-w-[630px] max-h-[500px] border-none"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          title="Discord Widget"
        ></iframe>
        </>
      ) : (
        <p className="text-black text-lg">Loading Discord Widget...</p>
      )}
    </div>
  );
};

export default Discord;
