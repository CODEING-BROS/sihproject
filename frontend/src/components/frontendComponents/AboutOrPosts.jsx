import React from "react";
// ✅ Import the Zustand stores
import useProfileUiStore from "@/store/profileUiStore";
import useAuthStore from "@/store/authStore";
import usePostStore from "@/store/postStore";

import UserPosts from "./UserPosts";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaReddit,
  FaDribbble,
  FaStackOverflow,
  FaGlobe,
} from "react-icons/fa";

function SectionTitle({ children }) {
  return <h3 className="text-xl font-semibold mb-3 text-white">{children}</h3>;
}

const socialIcons = {
  github: { icon: FaGithub, name: "GitHub" },
  linkedin: { icon: FaLinkedin, name: "LinkedIn" },
  twitter: { icon: FaTwitter, name: "Twitter" },
  facebook: { icon: FaFacebook, name: "Facebook" },
  instagram: { icon: FaInstagram, name: "Instagram" },
  youtube: { icon: FaYoutube, name: "YouTube" },
  tiktok: { icon: FaTiktok, name: "TikTok" },
  reddit: { icon: FaReddit, name: "Reddit" },
  dribbble: { icon: FaDribbble, name: "Dribbble" },
  stackoverflow: { icon: FaStackOverflow, name: "StackOverflow" },
};

// ✅ No props needed, data is fetched from stores
export default function AboutOrPosts() {
  const { activeTab } = useProfileUiStore();
  const { user: authUser, userprofile } = useAuthStore();
  const { posts: allPosts } = usePostStore();

  const isOwnProfile = authUser?._id === userprofile?._id;
  
  if (!userprofile) {
    return null;
  }

  // Determine which posts to display based on the active tab
  let displayedPosts = [];
  if (activeTab === "posts") {
    displayedPosts = allPosts.filter(
      (post) => post.author?._id === userprofile?._id
    );
  } else if (activeTab === "bookmarked") {
    if (isOwnProfile) {
      const bookmarkedPostIds = new Set(authUser?.bookmarks || []);
      displayedPosts = allPosts.filter((post) => bookmarkedPostIds.has(post._id));
    }
  }

  return (
    <div className="flex-1 px-6 py-4">
      {activeTab === "details" ? (
        <div className="space-y-8">
          {/* About Me */}
          <section>
            <SectionTitle>About Me</SectionTitle>
            <p className="text-gray-300 leading-relaxed text-sm">{userprofile.about || "No 'about me' section provided yet."}</p>
          </section>

          {/* Skills */}
          <section>
            <SectionTitle>Skills</SectionTitle>
            {userprofile.skills?.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {userprofile.skills.map((skill, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full"
                  >
                    #{skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No skills listed yet.</p>
            )}
          </section>

          {/* Website */}
          <section>
            <SectionTitle>Website</SectionTitle>
            {userprofile.website ? (
              <a
                href={userprofile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-white transition-all duration-200"
              >
                <FaGlobe className="text-2xl" />
                <span className="text-base font-medium">{userprofile.website}</span>
              </a>
            ) : (
              <p className="text-gray-400 text-sm">No website provided.</p>
            )}
          </section>

          {/* Social Links */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-white">
              Social Links
            </h2>
            {Object.keys(userprofile.socialmedia || {}).length === 0 ? (
              <p className="text-gray-400 text-sm">No social links provided.</p>
            ) : (
              <ul className="flex flex-wrap gap-6">
                {Object.entries(userprofile.socialmedia).map(([platform, url]) => {
                  if (!url) return null;

                  const normalized = platform?.toLowerCase();
                  const Icon = socialIcons[normalized]?.icon;
                  const displayName =
                    socialIcons[normalized]?.name ?? platform;

                  return (
                    <li key={platform}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-white transition-all duration-200"
                        aria-label={platform}
                      >
                        {Icon && <Icon className="text-2xl" />}
                        <span className="text-base font-medium">
                          {displayName}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      ) : displayedPosts.length > 0 ? (
        <UserPosts posts={displayedPosts} />
      ) : (
        <p className="text-gray-400 text-sm text-center">No posts yet.</p>
      )}
    </div>
  );
}