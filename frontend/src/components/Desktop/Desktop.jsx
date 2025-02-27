/**
 * Desktop.jsx
 *
 * Represents the main desktop UI for MammothOS.
 * Handles opening and closing of windows, popups, and wallet interface.
 */

import { useState } from "react";
import DesktopApp from "./DesktopApp";
import Window from "../UI/Window";
import Popup from "../UI/Popup";
import Wallet from "../UI/Wallet";

const Desktop = () => {
  // State for tracking open applications
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [wallet, setWallet] = useState([]);
  const [window, setWindow] = useState([]);
  const [popup, setPopup] = useState([]);

  /**
   * Opens or toggles the wallet window.
   */
  const openWallet = () => {
    if (isWalletOpen) closeWallet();
    setIsWalletOpen(true);
    setWallet([]);
  };

  /**
   * Opens a new application window.
   * @param {string} title - Window title.
   * @param {JSX.Element} app - Application component.
   * @param {boolean} squared - Whether the window should be squared.
   */
  const openWindow = (title, app, squared) => {
    if (isWindowOpen) closeWindow();
    setIsWindowOpen(true);
    setWindow([title, app, squared]);
  };

  /**
   * Opens a popup message.
   * @param {string} title - Popup title.
   * @param {string} message - Popup message.
   * @param {string} gameName - Name of the game associated with the popup.
   */
  const openPopup = (title, message, gameName) => {
    setIsPopupOpen(true);
    setPopup([title, message, gameName]);
  };

  /**
   * Closes the wallet window.
   */
  const closeWallet = () => {
    setIsWalletOpen(false);
    setWallet([]);
  };

  /**
   * Closes the currently open application window.
   */
  const closeWindow = () => {
    setIsWindowOpen(false);
    setWindow([]);
  };

  /**
   * Closes the popup message.
   */
  const closePopup = () => {
    setIsPopupOpen(false);
    setPopup([]);
  };

  return (
    <div className="w-full h-full bg-[#008181] flex gap-2 px-5 py-8 select-none">
      <img className="absolute left-1/2 -translate-x-1/2 top-40 w-[500px]" src="assets/logobg.png" alt="" />
      {/* Left-Side Icons */}
      <div className="flex flex-col gap-4 items-center">
        <DesktopApp openWindow={openWindow} name="My Computer" image="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" />
        <DesktopApp openWindow={openWindow} name="Documents" image="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-5.png" />
        <DesktopApp openWindow={openWindow} name="Recycle Bin" image="https://win98icons.alexmeub.com/icons/png/recycle_bin_full-2.png" />
        <DesktopApp openWindow={openWindow} name="Discord" image="https://i.imgur.com/gd4lhIo.png" />
        <DesktopApp openWindow={openWindow} name="Internet Explorer" image="https://win98icons.alexmeub.com/icons/png/msie1-2.png" />
        <DesktopApp openWindow={openWindow} name="X" image="https://i.imgur.com/loWp3sn.png" />
        <DesktopApp openWindow={openWindow} name="Mammoth" image="https://win98icons.alexmeub.com/icons/png/msagent-4.png" />
      </div>

      {/* Right-Side Icons */}
      <div className="flex gap-2 ml-auto mr-0">
        <div className="flex flex-col gap-4 items-center">
          <DesktopApp openWindow={openWindow} name="Tetris" image="assets/icons/tetris.png" />
          <DesktopApp openWindow={openWindow} name="Mammoths" image="assets/icons/mammoths.png" />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <DesktopApp openWindow={openWindow} name="Soon" image="assets/icons/asteroids.png" />
          <DesktopApp openWindow={openWindow} name="Mockey" image="assets/icons/mockey.png" />
          <div className="mt-auto mb-0">
            <DesktopApp openWindow={openWallet} name="My Wallet" image="https://win98icons.alexmeub.com/icons/png/briefcase-2.png" />
          </div>
        </div>
      </div>

      {/* Render Windows & Popups */}
      {isWalletOpen && <Wallet wallet={wallet} closeWallet={closeWallet} openPopup={openPopup} />}
      {isWindowOpen && <Window title={window[0]} app={window[1]} closeWindow={closeWindow} openPopup={openPopup} squared={window[2]} />}
      {isPopupOpen && <Popup title={popup[0]} message={popup[1]} closePopup={closePopup} gameName={popup[2]} />}
    </div>
  );
};

export default Desktop;