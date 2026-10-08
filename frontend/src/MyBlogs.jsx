import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BlogCard from "./components/BlogCard";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const fetchMyBlogs = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/blogs"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const blogs = await response.json();

      const userBlogs = blogs.filter(
        (blog) =>
          user &&
          String(blog.authorId) === String(user.id)
      );

      setMyBlogs(userBlogs);
    } catch (error) {
      console.error(
        "Error fetching my blogs:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-layout">
        <Sidebar />

        <main className="home-content">
          <div className="page-header">
            <h1>My Blogs</h1>
            <p>Your published blogs.</p>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading your blogs...</p>
            </div>
          ) : myBlogs.length === 0 ? (
            <div className="empty-state">
              <h2>No blogs yet</h2>

              <p>
                You haven't published any blogs yet.
              </p>

              <Link
                to="/home"
                className="primary-button"
              >
                Write Your First Blog
              </Link>
            </div>
          ) : (
            <div className="blog-feed">
              {myBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  author={blog.author}
                  authorId={blog.authorId}
                  title={blog.title}
                  content={blog.content}
                  image={blog.image}
                  createdAt={blog.createdAt}
                  profilePicture={
                    user?.profilePicture || null
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MyBlogs;