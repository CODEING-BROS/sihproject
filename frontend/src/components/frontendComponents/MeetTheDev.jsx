import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const MeetTheCreator = () => {
  return (
    <section className="text-center px-4 py-16 bg-[#1a1a1a] rounded-xl">
      <h2 className="text-3xl font-bold mb-6">
        👋 Meet the Creator: Deepak Tiwari
      </h2>
      <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-6">
        Hey there! I'm{" "}
        <span className="text-blue-400 font-semibold">Deepak Tiwari</span>,
        a 20-year-old full-stack developer from India. My coding journey
        began in a tier-3 college, where I often felt isolated and struggled
        to find peers to collaborate with. That feeling of coding alone is
        what inspired me to build DevPair.
      </p>
      <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-6">
        DevPair isn't just a platform—it's the solution to a problem I
        personally faced. I wanted to create a space where developers,
        regardless of their location or background, could easily connect,
        solve problems together, and build a strong professional network.
      </p>
      <p className="text-gray-400 max-w-2xl mx-auto mb-4">
        My expertise lies in modern web technologies, including{" "}
        <span className="text-white font-medium">
          React, Node.js, Express, and MongoDB
        </span>
        . Beyond coding, I'm passionate about building tools that empower
        the developer community, contributing to open-source, and sharing my
        journey through tech content on Instagram.
      </p>
      <p className="text-gray-400 max-w-2xl mx-auto mb-4">
        Let’s connect and build something amazing together!
      </p>
      <div className="flex justify-center gap-6 mt-6">
        <a
          href="https://www.linkedin.com/in/dev-deepaktiwari"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-blue-400 text-2xl hover:text-blue-600 transition"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a
          href="https://www.instagram.com/coding.shaka/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-pink-400 text-2xl hover:text-pink-600 transition"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://github.com/CODEING-BROS"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-gray-300 text-2xl hover:text-white transition"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
    </section>
  );
};

export default MeetTheCreator;