/**
 * DesktopApp.jsx
 *
 * Represents an individual desktop icon that opens specific applications.
 * Handles click events and dynamically loads the corresponding application.
 */

import PropTypes from "prop-types";
import IExplorer from "../../apps/IExplorer";
import Tetris from "../../apps/Tetris";
import Mammoths from "../../apps/Mammoths";
import Mockey from "../../apps/Mockey";
import Discord from "../../apps/Discord";
import Mammoth from "../../apps/Mammoth";
import Documents from "../../apps/Documents";
import Twitter from "../../apps/Twitter";
import Recycle from "../../apps/Recycle";

const DesktopApp = ({ name, image, openWindow }) => {
  /**
   * Handles click event on the desktop icon.
   * Opens the corresponding application or navigates to external links.
   */
  const clickHandler = () => {
    switch (name) {
      case "My Computer":
        window.open("https://mammothos.gitbook.io/mammothos", "_blank");
        break;
      case "Internet Explorer":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="https://win98icons.alexmeub.com/icons/png/msie1-2.png" className="w-[18px] h-[18px]" alt="" />
            MammothOS Internet Explorer
          </p>,
          <IExplorer />,
          false
        );
        break;
      case "Recycle Bin":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_full-2.png" className="w-[18px] h-[18px]" alt="" />
            Recycle Bin
          </p>,
          <Recycle />,
          false
        );
        break;
      case "Documents":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-5.png" className="w-[18px] h-[18px]" alt="" />
            C:\Users\Mammoth\Documents
          </p>,
          <Documents />,
          false
        );
        break;
      case "Discord":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="https://i.imgur.com/gd4lhIo.png" className="w-[18px] h-[18px]" alt="" />
            Discord
          </p>,
          <Discord />,
          false
        );
        break;
      case "X":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="https://i.imgur.com/loWp3sn.png" className="w-[18px] h-[18px]" alt="" />
            Twitter
          </p>,
          <Twitter />,
          false
        );
        break;
      case "Mammoth":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="https://win98icons.alexmeub.com/icons/png/msagent-4.png" className="w-[18px] h-[18px]" alt="" />
            Mammoth
          </p>,
          <Mammoth />,
          true
        );
        break;
      case "Tetris":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="assets/icons/tetris.png" className="w-[18px] h-[18px]" alt="" />
            Tetris
          </p>,
          <Tetris />,
          false
        );
        break;
      case "Mammoths":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="assets/icons/mammoths.png" className="w-[18px] h-[18px]" alt="" />
            Mammoths
          </p>,
          <Mammoths />,
          false
        );
        break;
      case "Mockey":
        openWindow(
          <p className="tracking-wider flex items-center gap-1">
            <img src="assets/icons/mockey.png" className="w-[18px] h-[18px]" alt="" />
            Mockey
          </p>,
          <Mockey />,
          false
        );
        break;
      case "My Wallet":
        openWindow(); // Open the wallet window
        break;
      default:
        break;
    }
  };

  return (
    <div onClick={clickHandler} className="flex flex-col w-[75px] gap-[3px] items-center text-white text-[11px] cursor-pointer">
      <img src={image} className="w-[48px] h-[48px]" alt={name} />
      <p className="text-center tracking-widest">{name}</p>
    </div>
  );
};

DesktopApp.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  openWindow: PropTypes.func.isRequired
};

export default DesktopApp;
