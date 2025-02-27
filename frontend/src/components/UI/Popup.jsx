/**
 * Popup.jsx
 *
 * Represents a draggable popup window for MammothOS notifications.
 * Displays a message, allows interaction, and optionally mints an NFT onchain.
 */

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { mintNFT } from "../../hooks/useWeb3";

const Popup = ({ title, message, closePopup, gameName }) => {
  const [position, setPosition] = useState({ x: 760, y: 305 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [completion, setCompletion] = useState("");
  const [updatedOnchain, setUpdatedOnchain] = useState(false);

  const popupWidth = 400;
  const popupHeight = 200;

  /** Handles mouse press for dragging */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  /** Handles movement while dragging */
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;

    // Prevents dragging outside the screen boundaries
    newX = Math.max(0, Math.min(screenWidth - popupWidth, newX));
    newY = Math.max(0, Math.min(screenHeight - popupHeight, newY));

    setPosition({ x: newX, y: newY });
  };

  /** Stops dragging when mouse is released */
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /** Plays a warning sound when the popup appears */
  const playNotificationSound = () => {
    const audio = new Audio("assets/audio/warning.mp3");
    audio.play().catch((error) => console.error("Audio playback failed:", error));
  };

  useEffect(() => {
    playNotificationSound();
  }, []);

  /** Closes the popup unless an operation is in progress */
  const handleClose = () => {
    if (!loading) closePopup();
  };

  /** Handles minting an NFT onchain */
  const updateOnchain = async () => {
    if (loading || !gameName) return;

    // Assign GameID based on gameName
    const GameID = {
      Tetris: 1,
      Mammoths: 2,
      Mockey: 3,
    }[gameName] || 1;

    setLoading(true);
    const response = await mintNFT(GameID);
    setUpdatedOnchain(true);

    if (!response) {
      setCompletion("An error occurred while minting!");
      setLoading(false);
      return;
    }

    if (response.success) {
      setCompletion(
        <div className="flex flex-col gap-1">
          <p>NFT has been successfully minted on Sepolia!</p>
          <a
            className="text-gray-500"
            href={`https://sepolia.etherscan.io/tx/${response.txReceipt.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
          <a
            className="text-blue-500"
            href="https://testnets.opensea.io/collection/mammothos-prestige-badges"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on OpenSea
          </a>
        </div>
      );
    } else if (response.message === "NFT already minted.") {
      setCompletion("This NFT has already been minted and cannot be duplicated!");
    } else {
      console.error(response.errorMessage);
      setCompletion("An error occurred while minting!");
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed flex flex-col items-center px-[4px] py-[3px] w-[400px] h-[200px] bg-[#c0c0c0] border98"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header Bar (Draggable) */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-[#0000a8] w-full h-[25px] text-white pl-2 pr-1 text-[15px] flex items-center justify-between cursor-move"
      >
        <p>MammothOS Message System</p>
        <div
          onClick={handleClose}
          className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[20px] w-[24px] justify-center font-bold text-[14px]"
        >
          <img className="-ml-[1px] w-[11px] h-[11px]" src="assets/close.svg" alt="Close" />
        </div>
      </div>

      {/* Popup Content */}
      <div className="flex flex-col gap-2 w-[370px] h-[150px] my-auto">
        <div className="flex gap-2 items-center">
          <img
            className="w-[32px] h-[32px]"
            src="https://win98icons.alexmeub.com/icons/png/media_player_stream_no.png"
            alt="Alert"
          />
          <p className="font-bold text-[19px]">{title}</p>
        </div>
        {completion || message}

        {/* Buttons */}
        <div className="flex gap-2 ml-auto mr-5 mt-auto mb-1">
          <div
            onClick={handleClose}
            className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[25px] w-[100px] justify-center text-[14px]"
          >
            <p>Replay</p>
          </div>
          {!loading && !updatedOnchain && (
            <div
              onClick={updateOnchain}
              className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[25px] w-[100px] justify-center text-[14px]"
            >
              <p>Save Onchain</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  closePopup: PropTypes.func.isRequired,
  gameName: PropTypes.string.isRequired,
};

export default Popup;