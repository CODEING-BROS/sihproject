import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  FaEdit,
  FaUserMinus,
  FaTrashAlt,
  FaExclamationCircle,
  FaHeart,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// ✅ Correct imports
import useGetAllComments from "@/hooks/useGetAllComments";
import usePostStore from "@/store/postStore";
import useAuthStore from "@/store/authStore";
import useCommentStore from "@/store/commentStore";

const CommentDialog = ({ open, setOpen, postId }) => {
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  // ✅ Access state and actions directly from Zustand stores
  const { posts, selectedPost, setPosts, setSelectedPost } = usePostStore();
  const { user } = useAuthStore();
  const { comments, setComments, updateCommentLikes } = useCommentStore();

  // Your refactored hook to fetch comments
  // ✅ The `refetch` function will now update the Zustand store internally
  const { refetch } = useGetAllComments(postId, open);

  const isAuthor = user?._id && selectedPost?.author?._id === user._id;

  const currentComments = selectedPost
    ? comments.filter((comment) => comment.post === selectedPost._id)
    : [];

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost?._id)
      return toast.error("Please write something.");

    try {
      const res = await axios.post(
        `http://localhost:4000/post/${selectedPost._id}/comment`,
        { message: commentText },
        { withCredentials: true }
      );

      if (res.data.success) {
        const newComment = res.data.comment;

        // ✅ Update the posts state in the Zustand store
        const updatedPosts = posts.map((post) =>
          post._id === selectedPost._id
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        );
        setPosts(updatedPosts);

        // ✅ Update the selected post state in the Zustand store
        setSelectedPost({
          ...selectedPost,
          comments: [...selectedPost.comments, newComment],
        });

        // ✅ Update the comments state in the Zustand store
        setComments([...comments, newComment]);
        setCommentText("");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedPost) return;

    try {
      const confirmed = window.confirm("Are you sure you want to delete this comment?");
      if (!confirmed) return;

      const res = await axios.delete(
        `http://localhost:4000/comment/${commentId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ Update comments state
        setComments(comments.filter((c) => c._id !== commentId));

        // ✅ Update selected post state
        const updatedPost = {
          ...selectedPost,
          comments: selectedPost.comments.filter((id) => id !== commentId),
        };
        setSelectedPost(updatedPost);

        toast.success("Comment deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting comment");
    }
  };

  const deletePostHandler = async () => {
    if (!selectedPost) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/post/delete/${selectedPost._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // ✅ Update posts state
        const updatedPosts = posts.filter((p) => p._id !== selectedPost._id);
        setPosts(updatedPosts);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post.");
    }
  };

  const toggleLike = async (commentId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/comment/like/${commentId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ Use the Zustand store action to update likes
        updateCommentLikes({
          commentId,
          userId: user._id,
          liked: res.data.message.includes("liked"),
        });

        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like comment.");
    }
  };

  if (!selectedPost) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <p className="text-center text-gray-500">Loading post...</p>
        </DialogContent>
      </Dialog>
    );
  }

  const { image, title, tags, author } = selectedPost;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-5xl p-0 overflow-hidden bg-[#1a1b2a] text-white border border-[#343454] rounded-xl">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Image Section */}
          <div className="md:w-1/2 w-full bg-[#2a2b3d] overflow-hidden group">
            {image ? (
              <img
                src={image}
                alt="Post"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="text-muted-foreground text-sm flex items-center justify-center h-full">
                No image
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className="md:w-1/2 w-full flex flex-col justify-between p-4">
            <div className="mb-2">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold leading-tight">
                  {title || "Untitled Post"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-wrap gap-2 mt-3">
                {tags?.map((tag, i) => (
                  <Badge
                    key={i}
                    className="bg-[#343454] text-white text-xs px-2 py-1 rounded-md"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Author Section */}
            <div className="flex items-center justify-between px-4 border-y py-3 border-[#343454]">
              {author && (
                <div
                  onClick={() => navigate(`/profile/${author.username}`)}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <div className="rounded-full p-[2px] bg-gradient-to-tr from-pink-600 via-purple-500 to-indigo-500">
                    <Avatar className="w-10 h-10 bg-[#151626] text-white border-2 border-black">
                      <AvatarImage src={author?.profilePicture} alt={author?.username} />
                      <AvatarFallback>
                        {author?.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">
                        @{author?.username || "Unknown"}
                      </p>
                      {isAuthor && (
                        <Badge
                          variant="secondary"
                          className="bg-pink-600 text-white border-none rounded-full text-xs px-2 py-0.5 font-bold tracking-wide shadow"
                        >
                          Author
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {author?.bio || "No bio provided"}
                    </p>
                  </div>
                </div>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-7 h-7 text-white/80" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-64 bg-[#1f2235] text-white border border-[#343454] shadow-lg z-50 rounded-md"
                >
                  {isAuthor ? (
                    <>
                      <Button
                        variant="ghost"
                        className="px-6 w-full text-left rounded-md hover:bg-[#2b2e45]"
                        onClick={() => toast("Edit clicked")}
                      >
                        <FaEdit className="mr-2" />
                        Edit Post
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-6 w-full text-left rounded-md text-red-500 hover:bg-[#2b2e45]"
                        onClick={deletePostHandler}
                      >
                        <FaTrashAlt className="mr-2" />
                        Delete Post
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="px-6 w-full text-left rounded-md hover:bg-[#2b2e45]"
                      >
                        <FaUserMinus className="mr-2" />
                        Unfollow
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-6 w-full text-left rounded-md text-red-500 hover:bg-[#2b2e45]"
                        onClick={() => toast("Reported")}
                      >
                        <FaExclamationCircle className="mr-2" />
                        Report
                      </Button>
                    </>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 mt-2 custom-scroll-hide">
              {currentComments.length > 0 ? (
                currentComments.map((comment) => {
                  const isLiked = comment.likes.includes(user._id);
                  return (
                    <div
                      key={comment._id}
                      className="flex justify-between items-start gap-3 bg-[#2a2b3d] px-4 py-3 rounded-lg hover:bg-[#323347]"
                    >
                      <div
                        onClick={() => navigate(`/profile/${comment.author?.username}`)}
                        className="flex cursor-pointer gap-3"
                      >
                        <Avatar className="w-9 h-9 border border-pink-600">
                          <AvatarImage src={comment.author?.profilePicture} />
                          <AvatarFallback>
                            {comment.author?.username?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{comment.text}</p>
                          <p className="text-xs text-muted-foreground">
                            @{comment.author?.username || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(comment._id)}
                          className="text-pink-500 hover:text-pink-400"
                        >
                          {isLiked ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <span className="text-xs text-muted-foreground">
                          {comment.likes.length}
                        </span>
                        {user._id === comment.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center">No comments yet.</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2 pt-4">
              <Input
                className="bg-[#2a2b3d] border-[#343454] text-white"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <Button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-700">
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;