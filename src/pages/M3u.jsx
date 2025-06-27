import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";

const M3u = () => {
 const [channelList, setChannelList] = useState([]);
 const [selectedChannel, setSelectedChannel] = useState(null);
 const [availableQualities, setAvailableQualities] = useState([]);
 const [selectedQuality, setSelectedQuality] = useState("auto");

 const videoRef = useRef();
 const hlsRef = useRef(null);

 // ✅ Default M3U Files
 const defaultPlaylists = [
  {
   name: "USA",
   url: "/m3u/United_States.m3u",
  },
  {
   name: "Algeria",
   url: "/m3u/Algeria.m3u",
  },
  {
   name: "Arabic",
   url: "/m3u/ara.m3u",
  },
  {
   name: "Morocco",
   url: "/m3u/Morocco.m3u",
  },
  {
   name: "Russia",
   url: "/m3u/Russia.m3u",
  },
  {
   name: "Spain",
   url: "/m3u/Spain.m3u",
  },
  {
   name: "Sports",
   url: "/m3u/sports.m3u",
  },
 ];

 const parseM3UContent = (text) => {
  const lines = text.split("\n");
  const channels = [];

  for (let i = 0; i < lines.length; i++) {
   if (lines[i].startsWith("#EXTINF")) {
    const nameMatch = lines[i].match(/,(.*)/);
    const name = nameMatch ? nameMatch[1].trim() : `Channel ${i}`;
    // ✅ Extract logo if present
    const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
    const logo = logoMatch ? logoMatch[1] : null;

    const url = lines[i + 1]?.trim();
    if (url) {
     channels.push({ name, url, logo });
    }
   }
  }

  setChannelList(channels);
  setSelectedChannel(null);
  setAvailableQualities([]);
 };

 const handleFileUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
   parseM3UContent(event.target.result);
  };

  reader.readAsText(file);
 };

 const handleLoadDefault = async (url) => {
  try {
   const response = await fetch(url);
   const text = await response.text();
   parseM3UContent(text);
  } catch (err) {
   console.error("Failed to load playlist:", err);
  }
 };

 useEffect(() => {
  if (!selectedChannel || !videoRef.current) return;

  if (hlsRef.current) {
   hlsRef.current.destroy();
   hlsRef.current = null;
  }

  if (Hls.isSupported()) {
   const hls = new Hls();
   hls.loadSource(selectedChannel);
   hls.attachMedia(videoRef.current);
   hls.on(Hls.Events.MANIFEST_PARSED, () => {
    const levels = hls.levels.map((level, index) => ({
     index,
     resolution: `${level.height}p`,
    }));
    setAvailableQualities(levels);
    setSelectedQuality("auto");
   });

   hlsRef.current = hls;
  } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
   videoRef.current.src = selectedChannel;
  }

  return () => {
   if (hlsRef.current) hlsRef.current.destroy();
  };
 }, [selectedChannel]);

 useEffect(() => {
  if (hlsRef.current) {
   hlsRef.current.currentLevel =
    selectedQuality === "auto" ? -1 : parseInt(selectedQuality);
  }
 }, [selectedQuality]);

 return (
  <div className="p-6 bg-gray-100 min-h-screen">
   <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-2xl font-bold mb-4 text-center">📺 IPTV M3U Player</h2>

    {/* 🔘 Default Playlists */}
    <div className="mb-6 text-center">
     <h3 className="text-lg font-semibold mb-2">
      Or choose a built-in playlist:
     </h3>
     <div className="flex flex-wrap justify-center gap-4 mb-4">
      {defaultPlaylists.map((list, idx) => (
       <button
        key={idx}
        onClick={() => handleLoadDefault(list.url)}
        className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
       >
        {list.name}
       </button>
      ))}
     </div>

     <div className="text-center text-sm text-gray-600 mb-2">
      ...or upload your own .m3u file:
     </div>
     <input
      type="file"
      accept=".m3u"
      onChange={handleFileUpload}
      className="block mx-auto w-fit text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
     />
    </div>

    {/* 🎥 Playlist + Video Player */}
    {channelList.length > 0 && (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Channel List */}
      <div className="bg-gray-50 border rounded-lg p-4 max-h-[500px] overflow-y-auto">
       <h3 className="text-lg font-semibold mb-2">📝 Playlist</h3>
       <ul className="space-y-2">
        {channelList.map((channel, index) => (
         <li
          key={index}
          onClick={() => {
           setSelectedChannel(channel.url);
           setAvailableQualities([]);
          }}
          className={`cursor-pointer p-2 rounded-md border flex items-center gap-3 hover:bg-blue-50 transition ${
           selectedChannel === channel.url
            ? "bg-blue-100 border-blue-400"
            : "bg-white border-gray-200"
          }`}
         >
          {channel.logo && (
           <img
            src={channel.logo}
            alt={`${channel.name} logo`}
            className="w-8 h-8 object-contain rounded"
           />
          )}
          <span className="text-sm font-medium">{channel.name}</span>
         </li>
        ))}
       </ul>
      </div>

      {/* Video Player */}
      <div className="md:col-span-2 space-y-4">
       <h3 className="text-lg font-semibold">▶️ Now Playing</h3>

       {selectedChannel ? (
        <>
         <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full rounded-lg border border-gray-300 shadow"
         />

         {availableQualities.length > 0 && (
          <div className="flex items-center gap-4">
           <label className="text-sm font-medium">Quality:</label>
           <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="border px-3 py-1 rounded-md text-sm"
           >
            <option value="auto">Auto</option>
            {availableQualities.map((q) => (
             <option key={q.index} value={q.index}>
              {q.resolution}
             </option>
            ))}
           </select>
          </div>
         )}
        </>
       ) : (
        <div className="text-gray-500 italic">
         Select a channel to start streaming.
        </div>
       )}
      </div>
     </div>
    )}
   </div>
  </div>
 );
};

export default M3u;
