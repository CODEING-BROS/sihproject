import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrashAlt,
  FaUserMinus,
  FaShareAlt,
  FaStar,
  FaExclamationCircle,
  FaHeart,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CommentDialog from "./CommentDialog";

import useAuthStore from "@/store/authStore";
import usePostStore from "@/store/postStore";
import useCommentStore from "@/store/commentStore";

const DiagonalAvatar = ({ src, fallback, alt }) => (
  <span className="relative inline-flex items-center justify-center w-12 h-12">
    <span
      className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-600 via-pink-400 to-blue-500 pointer-events-none"
      style={{ zIndex: 0 }}
    />
    <span
      className="absolute inset-0 rounded-full border-[3px] border-pink-600 border-b-yellow-400 border-r-blue-400 pointer-events-none"
      style={{ zIndex: 1 }}
    />
    <Avatar className="w-11 h-11 z-10 bg-[#151626] p-1">
      <AvatarImage src={src} alt={alt} className="rounded-full object-cover" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  </span>
);

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const { user, toggleBookmark } = useAuthStore();
  const { posts, setPosts, setSelectedPost, toggleLike } = usePostStore();
  const { comments: allComments, setComments } = useCommentStore();

  const [text, setText] = useState("");
  const [liked, setLiked] = useState(
    post?.likes?.includes(user?._id) || false
  );
  const [postLikes, setPostLikes] = useState(post?.likes?.length);
  const [commentOpen, setCommentOpen] = useState(false);

  const saved = user?.bookmarks?.includes(post?._id) || false;

  const handleCommentOpen = () => {
    setSelectedPost(post);
    setCommentOpen(true);
  };

  const isAuthor = user?._id === post?.author?._id;

  const handleProfileCheck = () => {
    if (post?.author?.username === user?.username) {
      navigate("/profile");
    } else {
      navigate(`/profile/${post.author.username}`);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        setPosts(updatedPosts);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post.");
      console.error("Error deleting post:", error);
    }
  };

  const likeDislikeHandler = async () => {
    try {
      const action = liked ? "unlike" : "like";
      const res = await axios.post(
        `http://localhost:4000/post/${action}/${post._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setLiked(!liked);
        setPostLikes(updatedLikes);
        
        const updatedPostData = posts.map((p) => {
          if (!p || !p._id) return p;
          if (p._id === post._id) {
            return {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            };
          }
          return p;
        });
        setPosts(updatedPostData);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to like/dislike post."
      );
      console.error("Error liking/disliking post:", error);
    }
  };

  const postCommentHandler = async (e) => {
    e.preventDefault();

    if (!text) {
      toast.error("Please enter a comment.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/post/${post._id}/comment`,
        { message: text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newComment = response.data.comment;
        setComments([...allComments, newComment]);
        setText("");
        toast.success(response.data.message);
        
        // ✅ FIX: Update the post's comments array in the global post store
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: [...p.comments, newComment],
            };
          }
          return p;
        });
        setPosts(updatedPosts);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to comment on post."
      );
      console.error("Error commenting on post:", error);
    }
  };

  const savePostHandler = async () => {
  // ✅ Check if the post object is valid before proceeding
  if (!post || !post._id) {
    toast.error("Invalid post data.");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:4000/post/bookmark/${post._id}`,
      {},
      { withCredentials: true }
    );

    const { success, message } = response.data;

    if (success) {
      toggleBookmark(post._id);
      toast.success(message);
    } else {
      toast.error(message || "Failed to save/unsave post");
    }
  } catch (error) {
    toast.error("Bookmark action failed ❌");
    console.error("Bookmark error:", error);
    console.log(error);
  }
};

  if (!post) {
    return null;
  }

  const { image, title, tags, author, comments } = post;

  return (
    <div className="bg-gradient-to-b from-[#23243a] to-[#151626] rounded-2xl border border-[#28293e] w-full max-w-[420px] mx-auto text-white shadow-xl overflow-hidden transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#23243a]">
        <div onClick={handleProfileCheck} className="flex gap-3 items-center cursor-pointer">
          <DiagonalAvatar
            src={author?.profilePicture}
            alt={`@${author?.username}`}
            fallback={author?.username?.slice(0, 2).toUpperCase()}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white/90">
                @{author?.username}
              </span>
              {isAuthor && (
                <Badge variant="secondary" className="bg-pink-600 text-white border-none rounded-full text-xs px-2 py-0.5 font-bold tracking-wide shadow">
                  Author
                </Badge>
              )}
            </div>
            <p className="text-sm text-white/60">
              {author?.bio
                ? author.bio.length > 40
                  ? author.bio.slice(0, 40) + "..."
                  : author.bio
                : "No bio provided"}
            </p>
          </div>
        </div>
        {/* Options Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Options" className="hover:bg-[#343454] rounded">
              <MoreHorizontal className="w-5 h-5 text-white/80 hover:text-pink-400 transition" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1b2a]/95 backdrop-blur-xl rounded-xl w-72 shadow-2xl border-0 p-0 overflow-hidden">
            <div className="flex items-center border-b-2 border-gray-500 pb-2 gap-3 px-6 pt-4">
              <Avatar className="w-10 text-white border border-pink-600 bg-[#151626] h-10">
                <AvatarImage src={author?.profilePicture} />
                <AvatarFallback>
                  {author?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-md text-gray-200">
                @{author?.username}
              </span>
            </div>
            <div className="flex flex-col gap-2 pb-2 w-full">
              {isAuthor ? (
                <>
                  <Button variant="ghost" className="justify-start w-full gap-3 px-6 text-red-400 hover:bg-red-800/20 hover:text-red-300 text-sm font-bold rounded-none" onClick={() => deletePostHandler()}>
                    <FaTrashAlt className="mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={savePostHandler} 
                    variant="ghost"
                    className="justify-start w-full gap-3 px-6 py-3 text-pink-400 hover:bg-pink-600/10 hover:text-white text-sm font-medium rounded-none">
                    <FaStar className="w-4 h-4" />
                    Add to Bookmarks
                  </Button>
                  <div className="border-t border-[#343454]/60 mx-3" />
                  
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start w-full gap-3 px-6 py-3 text-red-400 hover:bg-red-800/20 hover:text-red-300 text-sm font-bold rounded-none">
                    <FaUserMinus className="mr-2" />
                    Unfollow
                  </Button>
                  <Button
                    onClick={savePostHandler} 
                    variant="ghost"
                    className="justify-start w-full gap-3 px-6 py-3 text-pink-400 hover:bg-pink-600/10 hover:text-white text-sm font-medium rounded-none">
                    <FaStar className="w-4 h-4" />
                    Add to Bookmarks
                  </Button>
                  <div className="border-t border-[#343454]/60 mx-3" />
                  <Button variant="ghost" className="justify-start w-full gap-3 px-6 py-3 text-red-600 hover:bg-red-800/20 hover:text-red-300 text-sm font-bold rounded-none" onClick={() => toast("Report post!")}>
                    <FaExclamationCircle className="w-4 h-4" />
                    Report
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Post Image */}
      {image && (
        <div className="relative max-h-[360px] overflow-hidden">
          <img src={image} alt="post" className="w-full object-cover aspect-video transition-transform duration-300 hover:scale-105" />
        </div>
      )}
      {/* Post Content */}
      <div className="px-6 py-4">
        <p className="text-gray-200 mb-3 font-semibold leading-tight tracking-wide text-[1.08rem]">
          {title}
        </p>
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-[#28293e] text-pink-300 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-pink-600 hover:text-white/90 transition">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center justify-around px-6 py-2 text-sm text-gray-400 border-t border-[#23243a] gap-2">
        <button
          onClick={likeDislikeHandler}
          className={`flex items-center gap-1 font-medium rounded-full px-2 py-1 transition-colors duration-200 ${
            liked
              ? "text-pink-500 bg-pink-500/10"
              : "hover:text-pink-400 hover:bg-pink-400/10"
          }`} aria-label="Like post" type="button">
          <svg width={20} height={20} fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 21s-4.36-3.63-7-6.31C2.24 12.07 2.5 8.5 5.5 7A4.1 4.1 0 0112 9.13 4.12 4.12 0 0118.5 7c3 1.5 3.26 5.07.5 7.69C16.36 17.37 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold">{postLikes} Likes</span>
        </button>
        <button
          onClick={() => {
            setSelectedPost(post);
            setCommentOpen(true);
          }} className="flex items-center gap-1 rounded-full px-2 py-1 font-medium text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors duration-200 cursor-pointer" aria-label="Comments count" type="button">
          <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold">{comments.length}</span>
        </button>
        <button onClick={() => toast("Shared post!")} className="flex items-center gap-1 rounded-full px-2 py-1 font-medium hover:text-green-400 hover:bg-green-400/10 transition-colors duration-200" aria-label="Share post" type="button">
          <FaShareAlt size={20} />
        </button>
        <button onClick={savePostHandler} className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium transition-colors duration-200 ${
            saved
              ? "text-blue-400 bg-blue-400/10"
              : "hover:text-blue-400 hover:bg-blue-400/10"
          }`} aria-label="Save post" type="button">
          <svg width={20} height={20} fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M5 3v18l7-5 7 5V3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {/* Comment Form - always visible */}
      <form
        className="flex items-center gap-3 px-6 py-4 border-t border-[#23243a] bg-[#151626]"
        onSubmit={postCommentHandler}
      >
        <input
          className="flex-1 bg-transparent rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
          placeholder="Add a comment..."
          type="text"
          value={text}
          onChange={handleChange}
          aria-label="Add a comment"
        />
        {text && (
          <Button
            type="submit"
            className="bg-pink-600 text-white font-semibold rounded shadow-pink-500/10 hover:bg-pink-700 transition-all duration-200 disabled:bg-pink-600/50 disabled:cursor-not-allowed"
          >
            Post
          </Button>
        )}
      </form>
      <CommentDialog open={commentOpen} setOpen={setCommentOpen} postId={post._id} />
    </div>
  );
};

export default PostCard;