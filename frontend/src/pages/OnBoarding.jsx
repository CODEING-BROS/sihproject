import React, { useState, useRef } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaGlobe } from "react-icons/fa";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import useGetAllUsers from "@/hooks/useGetAllUsers";
import { useNavigate } from "react-router-dom";
import { Camera, X } from 'lucide-react';

const tailwind = {
  bodyBg: "bg-gradient-to-tr from-[#121417] via-[#232b3a] to-[#121417]",
  cardBg: "bg-[#232b3a]",
  inputBg: "bg-[#2e344e]",
  inputFocusRing: "focus:ring-[#2563eb]",
  btnGradient: "bg-gradient-to-r from-[#3b82f6] to-[#2563eb]",
  btnHoverGradient:
    "hover:bg-gradient-to-r hover:from-[#2563eb] hover:to-[#1e40af]",
  btnText: "text-[#e0e7ff]",
  sectionTitle: "text-[#3b82f6]",
  labelText: "text-[#94a3b8]",
};

export default function OnBoarding({ token }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [skills, setSkills] = useState([]);
  const [socialmedia, setSocialmedia] = useState([]);
  const [website, setWebsite] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [experiencelevel, setExperiencelevel] = useState("");
  const [availability, setAvailability] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skillsRaw, setSkillsRaw] = useState("");
  const navigate = useNavigate();

  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const fileInputRef = useRef(null);
  const { users, error } = useGetAllUsers(token);

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const isFormEmpty = () => {
    return (
      !name.trim() &&
      !bio.trim() &&
      !gender.trim() &&
      !about.trim() &&
      !city.trim() &&
      !country.trim() &&
      !skillsRaw.trim() &&
      !website.trim() &&
      !dateofbirth.trim() &&
      !experiencelevel.trim() &&
      !availability.trim() &&
      socialmedia.length === 0 &&
      !profilePicture
    );
  };

  const handleImageChange = async (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setLoading(true);
      setProfilePicture(selected);
      try {
        const dataUrl = await readFileAsDataURL(selected);
        setPreviewImage(dataUrl);
      } catch {
        toast.error("Failed to preview image.");
        setProfilePicture(null);
        setPreviewImage(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = () => {
    setProfilePicture(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const splitSkills = (str) => {
    let result = [];
    let current = "";
    let parenDepth = 0;

    for (let char of str) {
      if (char === "(") parenDepth++;
      if (char === ")") parenDepth--;
      if (char === "," && parenDepth === 0) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) result.push(current.trim());
    return result.filter((s) => s.length > 0);
  };

  const handleSkillsChange = (e) => {
    setSkillsRaw(e.target.value);
  };

  const addSocial = () => {
    setSocialmedia((prev) => [...prev, { platform: "", url: "" }]);
  };

  const removeSocial = (index) => {
    const updated = socialmedia.filter((_, i) => i !== index);
    setSocialmedia(updated);
  };

  const handleSocialChange = (index, field, value) => {
    const updated = [...socialmedia];
    updated[index][field] = value;
    setSocialmedia(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormEmpty()) {
      toast.error("Please fill at least one field before submitting.");
      return;
    }

    const skillsArray = splitSkills(skillsRaw);

    const socialmediaMap = socialmedia.reduce((acc, { platform, url }) => {
      if (platform && url) {
        acc[platform] = url;
      }
      return acc;
    }, {});

    const form = new FormData();
    form.append("name", name);
    form.append("bio", bio);
    form.append("gender", gender);
    form.append("about", about);
    form.append("city", city);
    form.append("country", country);
    form.append("skills", skillsArray.join(","));
    form.append("website", website);
    form.append("dateofbirth", dateofbirth);
    form.append("experiencelevel", experiencelevel);
    form.append("availability", availability);
    form.append("socialmedia", JSON.stringify(socialmediaMap));
    if (profilePicture) form.append("profilePicture", profilePicture);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/user/onboarding",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` // This is the crucial line to add
          },
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.data.success) {
        setAuthUser(res.data.user, res.data.token);
        toast.success("Profile updated!");
        setName("");
        setBio("");
        setGender("");
        setAbout("");
        setCity("");
        setCountry("");
        setSkillsRaw("");
        setWebsite("");
        setDateofbirth("");
        setExperiencelevel("");
        setAvailability("");
        setSocialmedia([]);
        setProfilePicture(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        navigate("/profile");
      }
    } catch (error) {
      console.error("Submission error:", error); // Use a more descriptive error log
      toast.error("Something went wrong. Please check your token or server permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-gradient-to-tr from-[#121417] via-[#232b3a] to-[#121417] min-h-screen flex items-center justify-center py-10 px-4"
    >
      <form
        className="bg-[#232b3a] w-full max-w-3xl rounded-3xl shadow-xl border border-[#2e3340] p-8 flex flex-col gap-10"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Title */}
        <h1
          className="text-3xl font-extrabold text-center tracking-wide text-[#3b82f6] mb-6 select-none"
        >
          Complete Your Profile
        </h1>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-4">
          <label className="text-gray-100 font-semibold">Choose Profile Picture</label>
          <div className="relative w-32 h-32">
            <label
              htmlFor="profile-picture-upload"
              className="cursor-pointer w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-10 h-10 text-gray-500" />
              )}
            </label>
            <input
              id="profile-picture-upload"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            {previewImage && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateofbirth"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              Date of Birth
            </label>
            <input
              id="dateofbirth"
              name="dateofbirth"
              type="date"
              value={dateofbirth}
              onChange={(e) => setDateofbirth(e.target.value)}
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white focus:outline-none transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label
              htmlFor="experiencelevel"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              Experience Level
            </label>
            <select
              id="experiencelevel"
              name="experiencelevel"
              value={experiencelevel}
              onChange={(e) => setExperiencelevel(e.target.value)}
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white focus:outline-none transition"
            >
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="availability"
              className="block mb-1 font-semibold text-[#94a3b8]"
            >
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white focus:outline-none transition"
            >
              <option value="">Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block mb-1 font-semibold text-[#94a3b8]"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio (multi-line allowed)"
            rows={3}
            className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none resize-none transition"
          />
        </div>

        {/* About */}
        <div>
          <label
            htmlFor="about"
            className="block mb-1 font-semibold text-[#94a3b8]"
          >
            About
          </label>
          <textarea
            id="about"
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="Tell us about yourself"
            className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none resize-none transition"
          />
        </div>

        {/* Skills */}
        <div>
          <label
            htmlFor="skills"
            className="block mb-1 font-semibold text-[#94a3b8]"
          >
            Skills{" "}
            <span className="text-xs text-gray-500">(comma separated)</span>
          </label>
          <input
            id="skills"
            name="skills"
            value={skillsRaw}
            onChange={handleSkillsChange}
            placeholder="React, Node.js, MongoDB"
            className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition"
          />
        </div>

        {/* Personal Website */}
        <div>
          <label
            htmlFor="website"
            className="mb-1 font-semibold flex items-center gap-2 text-[#94a3b8]"
          >
            <FaGlobe className="text-blue-500" /> Website
          </label>
          <input
            id="website"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="bg-[#2e344e] focus:ring-[#2563eb] w-full rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition"
          />
        </div>

        {/* Social Media Section */}
        <section
          aria-label="Social Media Links"
          className="bg-[#232b3a] p-5 rounded-xl shadow-md"
        >
          <div className="flex justify-between items-center mb-5">
            <h2
              className="text-xl font-bold text-[#3b82f6] select-none"
            >
              Social Media Links
            </h2>
            <button
              type="button"
              onClick={addSocial}
              className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-[#e0e7ff] px-4 py-1 rounded-full flex items-center gap-2 text-sm font-semibold shadow-md transition-all duration-300 hover:brightness-110"
              aria-label="Add social media platform"
            >
              <FaPlus />
              Add Platform
            </button>
          </div>

          {socialmedia.length === 0 && (
            <p className="text-gray-400 text-sm select-none">
              No social links added yet.
            </p>
          )}

          {socialmedia.map((social, i) => (
            <div
              key={i}
              className="flex gap-3 items-center mb-4 flex-wrap sm:flex-nowrap"
            >
              {/* Platform Input */}
              <input
                type="text"
                placeholder="Platform"
                value={social.platform}
                onChange={(e) =>
                  handleSocialChange(i, "platform", e.target.value)
                }
                list="socialPlatforms"
                className="bg-[#2e344e] p-2 rounded-lg w-[130px] text-white placeholder-gray-400 focus:outline-none focus:ring-[#2563eb] transition"
                aria-label={`Social media platform name #${i + 1}`}
                spellCheck={false}
              />
              <datalist id="socialPlatforms">
                <option value="LinkedIn" />
                <option value="GitHub" />
                <option value="Twitter" />
                <option value="Facebook" />
                <option value="Instagram" />
                <option value="YouTube" />
                <option value="TikTok" />
                <option value="Reddit" />
                <option value="Dribbble" />
                <option value="Stack Overflow" />
              </datalist>

              {/* URL Input */}
              <input
                type="url"
                placeholder="Profile URL"
                value={social.url}
                onChange={(e) => handleSocialChange(i, "url", e.target.value)}
                className="bg-[#2e344e] p-2 rounded-lg flex-1 text-white placeholder-gray-400 focus:outline-none focus:ring-[#2563eb] transition"
                aria-label={`URL for social media platform #${i + 1}`}
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeSocial(i)}
                className="text-red-500 hover:text-red-700 p-2 rounded transition"
                aria-label={`Remove social media link #${i + 1}`}
                title="Remove"
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-[#e0e7ff] py-4 rounded-3xl font-extrabold text-lg shadow-lg transition-transform hover:scale-105"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}