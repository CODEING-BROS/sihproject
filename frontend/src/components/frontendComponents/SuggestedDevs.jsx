import React from "react";

const devs = [
  { name: "Alex Smith", role: "Frontend Dev", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Lisa Ray", role: "Fullstack Dev", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Michael Johnson", role: "Backend Engineer", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Emily Chen", role: "UI/UX Designer", img: "https://randomuser.me/api/portraits/women/50.jpg" },
  { name: "David Lee", role: "Mobile Developer", img: "https://randomuser.me/api/portraits/men/66.jpg" }
];

const SuggestedDevs = () => (
  <aside
    className="rounded-xl shadow-lg max-w-full px-4 py-5
    bg-[rgba(18,22,43,0.98)] border border-blue-700/20
    backdrop-blur-sm"
    style={{
      boxShadow:
        "0 3px 20px 0 rgba(48,117,255,0.06), 0 0.5px 0.5px 0 rgba(31,41,55,0.08)",
    }}
    aria-label="Suggested Developers"
  >
    <h2 className="text-sm font-bold text-blue-100 mb-4 tracking-wide px-1 uppercase">
      Suggested Devs
    </h2>
    <ul className="space-y-2 max-h-[280px] overflow-y-auto hide-scrollbar pr-1">
      {devs.map((dev, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 rounded-md px-1 py-1.5
          hover:bg-blue-700/10 transition cursor-pointer"
          tabIndex={0}
          role="button"
        >
          <img
            src={dev.img}
            alt={`Avatar of ${dev.name}`}
            className="w-8 h-8 rounded-full border border-blue-400 object-cover shadow-sm"
            loading="lazy"
          />
          <div>
            <p className="text-white font-medium text-sm leading-tight">{dev.name}</p>
            <p className="text-sky-300 text-xs">{dev.role}</p>
          </div>
        </li>
      ))}
    </ul>
  </aside>
);

export default SuggestedDevs;
