/**
 * Taskbar.jsx
 *
 * Represents the classic Windows-style taskbar at the bottom of the screen.
 * Includes a "Start" button, a system info section, and a clock display.
 */

const Taskbar = () => {
  return (
    <div
      className="flex items-center px-2 bg-[#c1c1c1] h-[32px] w-full border-white border-t-2 justify-between select-none"
      style={{ boxShadow: "inset 0 -1px #000" }}
    >
      {/* Start Button */}
      <div className="flex items-center gap-1 bg-[#c0c0c0] border98 px-[6px] py-[2px] font-bold text-[14px] cursor-pointer">
        <img
          className="w-[20px] h-[20px]"
          src="https://win98icons.alexmeub.com/icons/png/windows-0.png"
          alt="Start Icon"
        />
        <p>Start</p>
      </div>

      {/* System Information Section */}
      <div className="flex items-center ml-auto mr-2">
        <p>0</p>
        <img className="h-[12px]" src="assets/xp.png" alt="XP Icon" />
      </div>

      {/* Clock Section */}
      <div className="flex items-center gap-2 bg-[#c0c0c0] border-t-2 border-t-[#808080] border-l-[#808080] border-l-2 border-r-1 border-r-[#fff] border-b-2 border-b-[#979797] px-[6px] text-[14px]">
        <img
          className="w-[15px] h-[15px]"
          src="https://win98icons.alexmeub.com/icons/png/time_and_date-0.png"
          alt="Clock Icon"
        />
        <p>5:03 PM</p>
      </div>
    </div>
  );
};

export default Taskbar;