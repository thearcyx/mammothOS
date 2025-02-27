/**
 * TwitterWidget.jsx
 *
 * A React component that displays a list of Twitter profiles
 * with a follow button, avoiding X API limitations.
 */

function TwitterWidget() {
  const profiles = [
    {
      name: "MammothOS",
      description: "Mammoth-based Windows 98-style OS.",
      image: "https://pbs.twimg.com/profile_images/1894882233141374976/BEGr4oFs_400x400.jpg",
      link: "https://x.com/mammothos",
    },
    {
      name: "Mammoth Overlord",
      description: "Mammoths are on @Formachain. Add a Mammoth to your bio today.",
      image: "https://pbs.twimg.com/profile_images/1861555700234887171/mbpXkKx5_400x400.jpg",
      link: "https://x.com/MammothOverlord",
    },
    {
      name: "Celestia 🦣",
      description: "The modular blockchain powering unstoppable applications with full-stack customizability. Build whatever 👉 https://celestia.org/build",
      image: "https://pbs.twimg.com/profile_images/1883969077510885376/vg1ZnBHl_400x400.png",
      link: "https://x.com/celestia",
    },
    {
      name: "Encode Club",
      description: "Learn, build and advance your career in Emerging Tech with our community of 500,000 talented professionals worldwide.",
      image: "https://pbs.twimg.com/profile_images/1888995491557326849/qBupl7hj_400x400.jpg",
      link: "https://x.com/encodeclub",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-2 items-center bg-[#000000] px-2 py-2">
      {profiles.map(({ name, description, image, link }) => (
        <div key={name} className="w-full h-[90px] border-[1px] border-[#3d3d3d] flex items-center px-4 gap-4 rounded-sm">
          <img className="rounded-full w-[64px] h-[64px]" src={image} alt={name} />
          <div className="flex flex-col">
            <p className="text-white text-[18px]">{name}</p>
            <p className="text-gray-300 text-[12px] w-[400px]">{description}</p>
          </div>
          <div className="w-[80px] h-[30px] ml-auto mr-4 bg-white flex items-center justify-center rounded-full">
            <p onClick={() => window.open(link, "_blank")} className="text-[14px] font-bold cursor-pointer">
              Follow
            </p>
          </div>
        </div>
      ))}
      <p className="text-gray-300 text-[14px] mt-[20px] mx-[10px] text-center">
        X API costs more than a Mammoth&#39;s weight in gold, and the embed widget is as stable as a mammoth on ice...
        So, we built our own X!
      </p>
    </div>
  );
}

export default TwitterWidget;