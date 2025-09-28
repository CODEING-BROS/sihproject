import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopwatch,
  faBullseye,
  faGlobe,
  faUser,
  faHandshake,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import MeetTheCreator from "@/components/frontendComponents/MeetTheDev";
//import AuthNavbar from "@/components/frontendComponents/AuthNavbar"; // Assuming this is your Navbar component

const AboutUs = () => {
  const navigate = useNavigate();

  // --- Data for the page ---
  const steps = [
    {
      title: "1. Sign Up",
      icon: faUser,
      desc: "Create an account using email or GitHub. Set up your dev profile and tell us what you're learning or building.",
    },
    {
      title: "2. Match",
      icon: faHandshake,
      desc: "Get matched with other developers in topic rooms like #React, #Python, or #Beginner based on your goals and tech stack.",
    },
    {
      title: "3. Collaborate",
      icon: faUsers,
      desc: "Start chatting, screen sharing, or co-coding directly inside rooms. Build small projects, learn by doing, and help others too.",
    },
  ];

  const features = [
    {
      title: "Real-Time Pairing",
      icon: faStopwatch,
      desc: "Code live with other devs on shared projects or help debug each other’s code.",
    },
    {
      title: "Skill-Based Matching",
      icon: faBullseye,
      desc: "We connect you to devs at your level—or above—so you grow faster.",
    },
    {
      title: "Global Community",
      icon: faGlobe,
      desc: "Collaborate with developers from different countries and cultures.",
    },
  ];

  const testimonials = [
    {
      quote:
        "I matched with a coding partner within minutes. We collaborated on a project and even submitted it to a hackathon together. Amazing experience!",
      name: "Priya Sharma",
      role: "Frontend Developer, India",
    },
    {
      quote:
        "It feels like pair programming meets community building. The real-time matching and shared goals kept me accountable and motivated.",
      name: "Lucas Wang",
      role: "Full-Stack Dev, Singapore",
    },
    {
      quote:
        "Being part of a global skill-based network is a game-changer. I’ve learned new tools and connected with people I never thought I would.",
      name: "Ayesha Khan",
      role: "Machine Learning Enthusiast, UAE",
    },
  ];

  // --- State for Contact Form ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearForm = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:4000/contact", {
        name,
        email,
        message,
      });
      setSuccess(response.data.message || "Message sent successfully.");
      toast.success(response.data.message || "Message sent successfully.");
      clearForm();
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to send message.");
      toast.error(error?.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0d0d0d] to-[#121212] min-h-screen text-white">
    
      <div className="px-4 py-12 md:px-20 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Pair Up. Code Better.
          </h1>
          <p className="text-blue-300 text-lg font-semibold">
            Build skills and friendships, one collaboration at a time.
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            DevPair connects developers to build, learn, and grow through
            real-time collaboration. Whether you're stuck on a bug or starting
            your first project — don't code alone.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Join the Community
          </button>
        </section>

        {/* How It Works Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            How DevPair Works
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {steps.map(({ title, icon, desc }, i) => (
              <div
                key={i}
                className="bg-[#1c1c1c] max-w-xs p-6 rounded-xl text-center hover:scale-105 transition duration-200 shadow-md"
              >
                <div className="w-16 h-16 rounded-full bg-[#15253d] text-[#4a9ee1] text-2xl flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={icon} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Developers Love DevPair
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {features.map(({ title, icon, desc }, i) => (
              <div
                key={i}
                className="bg-[#1c1c1c] max-w-xs p-6 rounded-xl text-center hover:scale-105 transition duration-200 shadow-md"
              >
                <div className="w-14 h-14 rounded-full bg-[#15253d] text-[#4a9ee1] text-2xl flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={icon} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map(({ quote, name, role }, i) => (
              <div
                key={i}
                className="bg-[#181c23] shadow-lg p-6 rounded-2xl flex flex-col justify-between"
              >
                <p className="text-gray-200 mb-4">“{quote}”</p>
                <div>
                  <div className="font-semibold text-blue-400">{name}</div>
                  <div className="text-sm text-gray-400">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Creator Section */}
        {/* <section className="text-center px-4 py-16 bg-[#1a1a1a] rounded-xl">
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
        </section> */}

        <div>
          <MeetTheCreator />
        </div>

        {/* Contact Form Section */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2 text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2 text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2 text-white"
                placeholder="Tell us what's on your mind..."
              ></textarea>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition w-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        {/* Final CTA Section */}
        <section className="text-center space-y-5 pt-8">
          <h2 className="text-3xl font-bold">Ready to Code Together?</h2>
          <p className="text-gray-300 text-lg">
            Sign up now and unlock a better way to learn and build with
            developers like you.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Login / Sign Up
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;