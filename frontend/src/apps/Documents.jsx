/**
 * Documents.jsx
 * 
 * A Windows 98-style "Documents" folder UI with static directories.
 * This component mimics an old-school file explorer, displaying 
 * folders named after blockchain projects and related topics.
 */

const Documents = () => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      
      {/* Top Menu Bar (File, Edit, View, Tools, Help) */}
      <div className="flex items-center gap-2 bg-[#c0c0c0] h-[40px] text-[15px] mt-[1px] mx-[1px] px-2 border-b-[#808080] border-1 border-t-[#dfdfdf] border-l-white border-r-white">
        <div className="bg-[#e7e7e7] h-[30px] w-[4px] border-[1px] border-r-[#808080] border-b-[#808080] border-t-white border-l-white" />
        {["File", "Edit", "View", "Tools", "Help"].map((item) => (
          <p key={item} className="underline px-2 cursor-pointer">{item}</p>
        ))}
      </div>

      {/* Address Bar (Showing "Documents" path) */}
      <div className="flex items-center gap-2 bg-[#c0c0c0] h-[35px] text-[15px] mt-[2px] mx-[1px] px-2 py-1 border-b-[#808080] border-1 border-t-[#dfdfdf] border-l-white border-r-white">
        <div className="bg-[#e7e7e7] h-[25px] w-[4px] border-[1px] border-r-[#808080] border-b-[#808080] border-t-white border-l-white" />
        <p className="pr-2 cursor-pointer">Address</p>
        <div className="bg-white w-full h-full flex items-center pl-2 pr-[2px] gap-1 py-[2px]" style={{ boxShadow: 'inset 1px 1px #0a0a0a, inset -1px -1px #fff, inset 2px 2px grey, inset -2px -2px #dfdfdf' }}>
          <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-5.png" className="w-[15px] h-[15px] -mt-[1px]" alt="Documents Icon" />
          <p className="mt-[1px]">Documents</p>
          <div className="border98 w-[20px] bg-[#c0c0c0] h-full flex items-center justify-center ml-auto mr-0">
            <p>▼</p>
          </div>
        </div>
      </div>

      {/* Folder Content Grid */}
      <div className="w-full h-full pt-[20px] px-[20px] bg-[#e0e0e0]" style={{ boxShadow: 'inset 1px 1px grey, inset -1px -1px #fff, inset 2px 2px #0a0a0a, inset -2px -2px #dfdfdf' }}>
        <div className="grid grid-cols-5 w-full gap-y-4">
          {[
            "MammothOS",
            "Celestia",
            "Mammoths Overlord",
            "Forma",
            "Encode",
            "Arcyx",
            "HalitEmir",
            "Brscn"
          ].map((folderName) => (
            <div key={folderName} className="flex flex-col w-[70px] text-[15px] items-center h-[100px]">
              <img className="w-[50px]" src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" alt={`${folderName} Folder`} />
              <p className="text-center">{folderName}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Documents;