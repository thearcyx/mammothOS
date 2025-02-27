/**
 * IExplorer.jsx
 *
 * A nostalgic Internet Explorer-style search page mimicking early Google UI.
 * Includes a Google logo, search bar, and two action buttons.
 */

const IExplorer = () => {
  return (
    <div className="w-full h-full relative bg-white flex flex-col items-center gap-4 font-[Tahoma] text-[13px] border border-gray-500 shadow-[3px_3px_5px_rgba(0,0,0,0.2)] p-6">
      
      {/* Google Logo */}
      <img
        className="w-[250px] mb-3 mt-22"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Google_logo_%282010-2013%29.svg/800px-Google_logo_%282010-2013%29.svg.png?20210912062906"
        alt="Google Logo"
      />

      {/* Search Input Field */}
      <input
        className="w-[400px] px-3 py-1 border border-gray-400 bg-white text-black outline-none focus:border-blue-600"
        type="text"
        placeholder=""
      />

      {/* Action Buttons */}
      <div className="flex gap-1">
        {["Google Search", "I'm Feeling Lucky"].map((label) => (
          <button
            key={label}
            className="border border-gray-400 bg-gray-100 cursor-pointer px-3 py-[2px] shadow-sm hover:border-gray-500 active:border-gray-600 active:translate-y-[1px]"
          >
            {label}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default IExplorer;