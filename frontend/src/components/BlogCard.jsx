import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BlogCard({
  id,
  authorId,
  author,
  title,
  content,
  image,
  createdAt,
  profilePicture,
  likeCount = 0,
  likedByMe = false,
  comments = [],
}) {
  const navigate = useNavigate();

  const [liked, setLiked] =
    useState(likedByMe);

  const [likes, setLikes] =
    useState(likeCount);

  const [showComments, setShowComments] =
    useState(false);

  const [commentText, setCommentText] =
    useState("");

  const [blogComments, setBlogComments] =
    useState(comments);

  const [commentLoading, setCommentLoading] =
    useState(false);

  const handleLike = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const response =
        await fetch(
          `http://localhost:5000/api/blogs/${id}/like`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to like blog"
        );
      }

      setLiked(data.liked);
      setLikes(data.likeCount);
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      alert(error.message);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      setCommentLoading(true);

      const response =
        await fetch(
          `http://localhost:5000/api/blogs/${id}/comments`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              text:
                commentText,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add comment"
        );
      }

      setBlogComments(
        (previous) => [
          ...previous,
          data,
        ]
      );

      setCommentText("");
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      alert(error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (authorId) {
      navigate(
        `/profile/${authorId}`
      );
    }
  };

  return (
    <article className="blog-card">

      <div
        className="blog-author"
        onClick={
          handleProfileClick
        }
        style={{
          cursor: authorId
            ? "pointer"
            : "default",
        }}
      >
        <div className="profile-avatar">

          {profilePicture ? (
            <img
              src={profilePicture}
              alt={author}
            />
          ) : (
            author
              ? author
                  .charAt(0)
                  .toUpperCase()
              : "U"
          )}

        </div>

        <div>
          <strong>
            {author}
          </strong>

          <p>
            {createdAt
              ? new Date(
                  createdAt
                ).toLocaleString()
              : "Just now"}
          </p>
        </div>
      </div>

      <h2>
        {title}
      </h2>

      <p className="blog-content">
        {content}
      </p>

      {image && (
        <img
          src={image}
          alt={title}
          className="blog-image"
        />
      )}

      <div className="blog-actions">

        <button
          onClick={
            handleLike
          }
          className={
            liked
              ? "liked-button"
              : ""
          }
        >
          {liked
            ? "♥"
            : "♡"}{" "}
          Like {likes}
        </button>

        <button
          onClick={() =>
            setShowComments(
              !showComments
            )
          }
        >
          💬 Comment{" "}
          {blogComments.length}
        </button>

        <button>
          ↗ Share
        </button>

      </div>

      {showComments && (
        <div className="comments-section">

          <div className="comment-input-row">

            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(event) =>
                setCommentText(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  handleComment();
                }
              }}
            />

            <button
              onClick={
                handleComment
              }
              disabled={
                commentLoading
              }
            >
              {commentLoading
                ? "..."
                : "Post"}
            </button>

          </div>

          <div className="comments-list">

            {blogComments.length ===
            0 ? (
              <p className="no-comments">
                No comments yet.
              </p>
            ) : (
              blogComments.map(
                (comment) => (
                  <div
                    className="comment"
                    key={
                      comment.id
                    }
                  >

                    <div
                      className="comment-avatar"
                    >
                      {comment.profilePicture ? (
                        <img
                          src={
                            comment.profilePicture
                          }
                          alt={
                            comment.author
                          }
                        />
                      ) : (
                        comment.author
                          ?.charAt(
                            0
                          )
                          .toUpperCase()
                      )}
                    </div>

                    <div className="comment-body">

                      <strong>
                        {
                          comment.author
                        }
                      </strong>

                      <p>
                        {
                          comment.text
                        }
                      </p>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>
      )}

    </article>
  );
}

export default BlogCard;