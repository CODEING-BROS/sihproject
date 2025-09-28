import React, { useState, useRef } from "react";
import {
  FaTag,
  FaEye,
  FaEyeSlash,
  FaCloudUploadAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";

// ✅ Import Zustand stores
import usePostStore from "@/store/postStore";
import useAuthStore from "@/store/authStore";

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

const MAX_FORM_HEIGHT = 520;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [visibility, setVisibility] = useState("Public");
  const [loading, setLoading] = useState(false);
  const [removeBtnHover, setRemoveBtnHover] = useState(false);

  const fileInputRef = useRef(null);

  // ✅ Get state and actions directly from Zustand stores
  const { user } = useAuthStore();
  const { posts, setPosts } = usePostStore();

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageChange = async (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setLoading(true);
      setImage(selected);
      try {
        const dataUrl = await readFileAsDataURL(selected);
        setImagePreview(dataUrl);
      } catch {
        toast.error("Failed to preview image.");
        setImage(null);
        setImagePreview(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !image) {
      toast.error("Add a title or image to post.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("tags", tags.join(", "));
    formData.append("visibility", visibility);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/post/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        // ✅ Call the Zustand store's action to update the posts
        setPosts([res.data.post, ...posts]);
        toast.success("Post published!");
        setTitle("");
        setTags([]);
        setTagInput("");
        removeImage();
      } else {
        toast.error(res.data.message || "Failed to post.");
      }
    } catch {
      toast.error("Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  // The rest of the component's JSX and inline styles remain the same
  const styles = {
    container: {
      maxWidth: '450px',
      margin: "40px auto",
      padding: 16,
      color: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      minHeight: 540,
    },
    heading: {
      fontSize: 24,
      fontWeight: "700",
      margin: 0,
      letterSpacing: "0.03em",
    },
    userPanel: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0px 0 16px",
      borderBottom: "1.5px solid #353b52",
      marginBottom: 8,
      flexShrink: 0,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: "50%",
      background: "linear-gradient(to right, purple, hotpink, gold)",
      backgroundColor: "#4c5477",
      objectFit: "cover",
      userSelect: "none",
    },
    avatarFallback: {
      width: 42,
      height: 42,
      borderRadius: "50%",
      backgroundColor: "#4c5477",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#b0b8d0",
      fontWeight: 700,
      fontSize: 19,
      userSelect: "none",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    username: {
      fontWeight: 700,
      fontSize: 16,
      color: "#eaf2ff",
      lineHeight: 1.18,
    },
    bio: {
      fontSize: 13,
      color: "#a2afd9",
      marginTop: 2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: 340,
    },
    formScrollContainer: {
      overflowY: "auto",
      maxHeight: MAX_FORM_HEIGHT,
      paddingRight: 8,
      boxSizing: "content-box",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: "1.5px solid #4c5477",
      background: "#1e2339",
      color: "#fff",
      marginBottom: 15,
      fontSize: 15,
      outline: "none",
      transition: "border-color 0.3s",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    label: {
      fontWeight: 600,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 14,
      color: "#c1c9e3",
    },
    previewWrapper: {
      position: "relative",
      width: "100%",
      maxWidth: 450,
      height: 160,
      overflow: "hidden",
      borderRadius: 15,
      marginBottom: 18,
      background: "#10131d",
      boxShadow: "inset 0 0 12px #0e1325",
    },
    previewImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      userSelect: "none",
      pointerEvents: "none",
      borderRadius: 15,
      transition: "transform 0.3s",
    },
    removeBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.57)",
      color: "#ff5c5c",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      padding: 8,
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.27s, color 0.22s",
    },
    removeBtnHover: {
      backgroundColor: "#ff5c5c",
      color: "#fff",
    },
    visibilityToggle: {
      display: "flex",
      gap: 12,
      marginBottom: 18,
      userSelect: "none",
    },
    toggleBtn: (active) => ({
      padding: "9px 18px",
      borderRadius: 9,
      border: "none",
      background: active ? "#4d7cf7" : "#33394b",
      color: active ? "#fff" : "#b8c6e0",
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      fontWeight: active ? "700" : "600",
      fontSize: 15,
      userSelect: "none",
      transition: "background 0.22s, color 0.22s",
      boxShadow: active ? "0 3px 10px #4376e540" : undefined,
    }),
    chooseBtn: {
      background: "#232841",
      color: "#8faafc",
      border: "1.5px solid #4d7cf7",
      borderRadius: 12,
      padding: "11px 22px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 15,
      boxShadow: "0 2px 10px #4d7cf71a",
      outline: "none",
      userSelect: "none",
      opacity: 0.9,
      marginBottom: 18,
      transition: "background 0.18s",
    },
    chooseBtnDisabled: {
      cursor: "not-allowed",
      opacity: 0.6,
      borderColor: "#4c5477",
      color: "#98aad3",
    },
    submitBtn: {
      background: "#4d7cf7",
      color: "#fff",
      padding: "8px 30px",
      border: "none",
      borderRadius: 16,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 16,
      transition: "background-color 0.27s",
      userSelect: "none",
      boxShadow: "0 6px 17px #3f74ff44",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    spinner: {
      border: "3px solid rgba(255,255,255,0.2)",
      borderTop: "3px solid #fff",
      borderRadius: "50%",
      width: 18,
      height: 18,
      animation: "spin 1s linear infinite",
      verticalAlign: "middle",
      marginLeft: 8,
    },
    tagChip: {
      background: "#4d7cf7",
      color: "#fff",
      padding: "6px 13px",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: 8,
      userSelect: "none",
      cursor: "default",
      marginBottom: 6,
      boxShadow: "0 1px 6px #3259d633",
    },
    tagRemoveBtn: {
      background: "transparent",
      border: "none",
      color: "#ccd6ffcc",
      cursor: "pointer",
      fontSize: 14,
      lineHeight: 1,
      padding: 0,
      margin: 0,
      userSelect: "none",
      transition: "color 0.17s",
    },
  };

  return (
    <div style={styles.container}>
      {/* Heading */}
      <h1 style={styles.heading}>Create New Post</h1>

      {/* User Info Panel */}
      <div style={styles.userPanel}>
        <div className="w-[46px] h-[46px] rounded-full p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={`${user.username}'s avatar`}
            style={styles.avatar}
            draggable={false}
          />
        ) : (
          <div style={styles.avatarFallback}>
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.username}>@{user?.username || "User"}</div>
          <div style={styles.bio}>{user?.bio || "No bio available."}</div>
        </div>
      </div>

      {/* Scrollable Form Area */}
      <div
        style={{
          ...styles.formScrollContainer,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="scroll-container"
      >
        <form onSubmit={handleSubmit} noValidate>
          {/* Post Title */}
          <label style={styles.label} htmlFor="title">
            Post Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            style={styles.input}
            spellCheck={false}
            autoComplete="off"
            disabled={loading}
          />

          {/* Tags input */}
          <label style={styles.label} htmlFor="tags">
            <FaTag /> Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
            style={styles.input}
            spellCheck={false}
            disabled={loading}
          />
          {/* Tag chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: -16,
              marginBottom: 18,
            }}
          >
            {tags.map((tag, idx) => (
              <div key={idx} style={styles.tagChip}>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  style={styles.tagRemoveBtn}
                  aria-label={`Remove tag ${tag}`}
                  disabled={loading}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#ccd6ffcc")
                  }
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Image upload */}
          <label style={styles.label}>
            <FaCloudUploadAlt /> Image 
          </label>
          <div style={{ marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                ...styles.chooseBtn,
                ...(loading ? styles.chooseBtnDisabled : {}),
              }}
              disabled={loading}
              tabIndex={0}
            >
              <FaCloudUploadAlt style={{ fontSize: 18 }} />
              Choose from device
            </button>
            <input
              ref={fileInputRef}
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={loading}
            />
          </div>
          {/* Image preview */}
          {imagePreview && (
            <div style={styles.previewWrapper}>
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.previewImage}
                draggable={false}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  ...styles.removeBtn,
                  ...(removeBtnHover ? styles.removeBtnHover : {}),
                }}
                onMouseEnter={() => setRemoveBtnHover(true)}
                onMouseLeave={() => setRemoveBtnHover(false)}
                disabled={loading}
                aria-label="Remove image"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}

          {/* Visibility toggle */}
          {/* <label style={styles.label}>Visibility</label>
          <div style={styles.visibilityToggle}>
            <button
              type="button"
              style={styles.toggleBtn(visibility === "Public")}
              onClick={() => setVisibility("Public")}
              disabled={loading}
              aria-pressed={visibility === "Public"}
              aria-label="Set visibility to Public"
            >
              <FaEye />
              Public
            </button>
            <button
              type="button"
              style={styles.toggleBtn(visibility === "Private")}
              onClick={() => setVisibility("Private")}
              disabled={loading}
              aria-pressed={visibility === "Private"}
              aria-label="Set visibility to Private"
            >
              <FaEyeSlash />
              Private
            </button>
          </div> */}
          <div style={{ height: 10 }} />
        </form>
      </div>

      {/* Submit button aligned right */}
      <div style={{ textAlign: "right", marginTop: -10 }}>
        <button
          type="submit"
          form=""
          style={{
            ...styles.submitBtn,
            ...(loading ? styles.submitBtnDisabled : {}),
          }}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              Posting...
              <span style={styles.spinner} />
            </>
          ) : (
            "Publish"
          )}
        </button>
      </div>

      {/* Hide scrollbars globally */}
      <style>{`
        .scroll-container::-webkit-scrollbar {display: none;}
        .scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin {0% { transform: rotate(0deg);}100% {transform: rotate(360deg);}}
      `}</style>
    </div>
  );
};

export default CreatePost;