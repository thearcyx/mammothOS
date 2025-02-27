/**
 * Window.jsx
 *
 * This component represents a draggable window UI in MammothOS.
 * It dynamically adjusts size based on the "squared" prop and allows dragging.
 */

import { useState, useRef, cloneElement } from "react";
import PropTypes from "prop-types";

const Window = ({ title, app, closeWindow, openPopup, squared }) => {
  const [position, setPosition] = useState({ x: 650, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const WINDOW_WIDTH = squared ? 420 : 650;
  const WINDOW_HEIGHT = squared ? 450 : 550;

  /**
   * Handles window dragging logic.
   */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Prevent window from being dragged outside the screen
    let newX = Math.max(0, Math.min(screenWidth - WINDOW_WIDTH, e.clientX - offset.current.x));
    let newY = Math.max(0, Math.min(screenHeight - WINDOW_HEIGHT, e.clientY - offset.current.y));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className={`fixed flex flex-col items-center px-[4px] py-[3px] ${
        squared ? "w-[420px] h-[450px]" : "w-[650px] h-[550px]"
      } bg-[#c0c0c0] border98`}
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Window Header (Draggable) */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-[#0000a8] w-full h-[25px] text-white pl-2 pr-1 text-[15px] flex items-center justify-between cursor-move"
      >
        {title}
        <div
          onClick={closeWindow}
          className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[20px] w-[24px] justify-center font-bold text-[14px]"
        >
          <img className="-ml-[1px] w-[11px] h-[11px]" src="assets/close.svg" alt="Close" />
        </div>
      </div>

      {/* Window Content */}
      <div className={`bg-black ${squared ? "w-[400px] h-[400px]" : "w-[630px] h-[500px]"} my-auto`}>
        {cloneElement(app, { openPopup, closeWindow })}
      </div>
    </div>
  );
};

Window.propTypes = {
  title: PropTypes.node.isRequired,
  app: PropTypes.node.isRequired,
  closeWindow: PropTypes.func.isRequired,
  openPopup: PropTypes.func.isRequired,
  squared: PropTypes.bool.isRequired,
};

export default Window;