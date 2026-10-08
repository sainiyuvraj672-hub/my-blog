import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateBlog from "../components/CreateBlog";
import BlogCard from "../components/BlogCard";

function Home() {
  const [blogs, setBlogs] =
    useState([]);

  const fetchBlogs = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "http://localhost:5000/api/blogs",
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch blogs"
        );
      }

      const data =
        await response.json();

      setBlogs(data);
    } catch (error) {
      console.error(
        "Error fetching blogs:",
        error
      );
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePublish =
    async (newBlog) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          throw new Error(
            "You are not logged in."
          );
        }

        const response =
          await fetch(
            "http://localhost:5000/api/blogs",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                title:
                  newBlog.title,

                content:
                  newBlog.content,

                image:
                  newBlog.image ||
                  null,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to publish blog"
          );
        }

        setBlogs(
          (previousBlogs) => [
            data,
            ...previousBlogs,
          ]
        );
      } catch (error) {
        console.error(
          "Error publishing blog:",
          error
        );

        alert(error.message);
      }
    };

  return (
    <div className="home-page">

      <Navbar />

      <div className="home-layout">

        <Sidebar />

        <main className="home-content">

          <CreateBlog
            onPublish={
              handlePublish
            }
          />

          <div className="blog-feed">

            {blogs.map(
              (blog) => (
                <BlogCard
                  key={blog.id}

                  id={blog.id}

                  authorId={
                    blog.authorId
                  }

                  author={
                    blog.author
                  }

                  title={
                    blog.title
                  }

                  content={
                    blog.content
                  }

                  image={
                    blog.image
                  }

                  createdAt={
                    blog.createdAt
                  }

                  profilePicture={
                    blog.profilePicture
                  }

                  likeCount={
                    blog.likeCount
                  }

                  likedByMe={
                    blog.likedByMe
                  }

                  comments={
                    blog.comments
                  }
                />
              )
            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Home;