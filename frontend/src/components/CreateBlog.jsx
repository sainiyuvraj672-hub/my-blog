import { useState } from "react";

function CreateBlog({ onPublish }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const profilePicture =
    user?.profilePicture || null;

  const userName = user?.name || "User";

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePublish = () => {
    if (
      !title.trim() ||
      !content.trim()
    ) {
      alert(
        "Please add a title and write something before publishing."
      );
      return;
    }

    const newBlog = {
      title,
      content,
      image,
    };

    onPublish(newBlog);

    setTitle("");
    setContent("");
    setImage(null);
  };

  return (
    <section className="create-blog">
      <div className="create-blog-header">
        <div className="profile-avatar">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={userName}
            />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <h3>Create a new blog</h3>
          <p>
            Share something with the community.
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Blog title..."
        className="blog-title-input"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
      />

      <textarea
        placeholder="Write your blog..."
        className="blog-input"
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
      />

      {image && (
        <img
          src={image}
          alt="Blog preview"
          className="blog-image-preview"
        />
      )}

      <div className="create-blog-actions">
        <label className="image-button">
          📷 Add Image

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>

        <button
          className="publish-button"
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </section>
  );
}

export default CreateBlog;