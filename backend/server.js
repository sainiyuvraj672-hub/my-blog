const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5000;
const JWT_SECRET = "myblog-development-secret";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let users = [];
let blogs = [];

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "MyBlog API is running",
  });
});

// =========================
// AUTHENTICATION
// =========================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const user = users.find(
      (user) => user.id === decoded.userId
    );

    if (!user) {
      return res.status(401).json({
        message:
          "User not found. Please log in again.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// =========================
// OPTIONAL AUTH
// =========================

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const user = users.find(
      (user) => user.id === decoded.userId
    );

    req.user = user || null;
  } catch (error) {
    req.user = null;
  }

  next();
}

// =========================
// PUBLIC USER PROFILE
// =========================

app.get(
  "/api/users/:id",
  (req, res) => {
    const userId = Number(req.params.id);

    const user = users.find(
      (user) => user.id === userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profilePicture:
        user.profilePicture || null,
    });
  }
);

// =========================
// GET ALL BLOGS
// =========================

app.get(
  "/api/blogs",
  optionalAuth,
  (req, res) => {
    const blogsWithData = blogs.map(
      (blog) => {
        const author = users.find(
          (user) =>
            user.id === blog.authorId
        );

        const comments =
          (blog.comments || []).map(
            (comment) => {
              const commenter =
                users.find(
                  (user) =>
                    user.id ===
                    comment.userId
                );

              return {
                id: comment.id,
                text: comment.text,
                createdAt:
                  comment.createdAt,

                userId:
                  comment.userId,

                author:
                  commenter?.name ||
                  "Unknown User",

                profilePicture:
                  commenter?.profilePicture ||
                  null,
              };
            }
          );

        return {
          ...blog,

          authorId:
            blog.authorId,

          author:
            author?.name ||
            blog.author ||
            "Unknown User",

          authorEmail:
            author?.email ||
            blog.authorEmail ||
            null,

          profilePicture:
            author?.profilePicture ||
            null,

          bio:
            author?.bio || "",

          likeCount:
            (blog.likes || []).length,

          likedByMe:
            req.user
              ? (blog.likes || []).includes(
                  req.user.id
                )
              : false,

          comments,
        };
      }
    );

    res.json(blogsWithData);
  }
);

// =========================
// CREATE BLOG
// =========================

app.post(
  "/api/blogs",
  authenticateToken,
  (req, res) => {
    const {
      title,
      content,
      image,
    } = req.body;

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        message:
          "Title and content are required",
      });
    }

    const newBlog = {
      id: Date.now(),

      authorId:
        req.user.id,

      author:
        req.user.name,

      authorEmail:
        req.user.email,

      title:
        title.trim(),

      content:
        content.trim(),

      image:
        image || null,

      createdAt:
        new Date().toISOString(),

      likes: [],

      comments: [],
    };

    blogs.unshift(newBlog);

    res.status(201).json({
      ...newBlog,

      profilePicture:
        req.user.profilePicture ||
        null,

      bio:
        req.user.bio || "",

      likeCount: 0,

      likedByMe: false,

      comments: [],
    });
  }
);

// =========================
// LIKE / UNLIKE BLOG
// =========================

app.post(
  "/api/blogs/:id/like",
  authenticateToken,
  (req, res) => {
    const blogId =
      Number(req.params.id);

    const blog = blogs.find(
      (blog) =>
        blog.id === blogId
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (!blog.likes) {
      blog.likes = [];
    }

    const userIndex =
      blog.likes.indexOf(
        req.user.id
      );

    let liked;

    if (userIndex === -1) {
      blog.likes.push(
        req.user.id
      );

      liked = true;
    } else {
      blog.likes.splice(
        userIndex,
        1
      );

      liked = false;
    }

    res.json({
      liked,

      likeCount:
        blog.likes.length,
    });
  }
);

// =========================
// ADD COMMENT
// =========================

app.post(
  "/api/blogs/:id/comments",
  authenticateToken,
  (req, res) => {
    const blogId =
      Number(req.params.id);

    const blog = blogs.find(
      (blog) =>
        blog.id === blogId
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const { text } = req.body;

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      return res.status(400).json({
        message:
          "Comment cannot be empty",
      });
    }

    if (!blog.comments) {
      blog.comments = [];
    }

    const comment = {
      id: Date.now(),

      userId:
        req.user.id,

      text:
        text.trim(),

      createdAt:
        new Date().toISOString(),
    };

    blog.comments.push(comment);

    res.status(201).json({
      id: comment.id,

      userId:
        req.user.id,

      author:
        req.user.name,

      profilePicture:
        req.user.profilePicture ||
        null,

      text:
        comment.text,

      createdAt:
        comment.createdAt,
    });
  }
);

// =========================
// SIGNUP
// =========================

app.post(
  "/api/auth/signup",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Name, email and password are required",
        });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const existingUser =
        users.find(
          (user) =>
            user.email ===
            normalizedEmail
        );

      if (existingUser) {
        return res.status(409).json({
          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const newUser = {
        id: Date.now(),

        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        bio: "",

        profilePicture:
          null,
      };

      users.push(newUser);

      res.status(201).json({
        message:
          "Account created successfully",

        user: {
          id: newUser.id,

          name:
            newUser.name,

          email:
            newUser.email,

          bio:
            newUser.bio,

          profilePicture:
            newUser.profilePicture,
        },
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// =========================
// LOGIN
// =========================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Email and password are required",
        });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const user =
        users.find(
          (user) =>
            user.email ===
            normalizedEmail
        );

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const token =
        jwt.sign(
          {
            userId:
              user.id,

            email:
              user.email,
          },

          JWT_SECRET,

          {
            expiresIn:
              "1h",
          }
        );

      res.json({
        message:
          "Login successful",

        token,

        user: {
          id:
            user.id,

          name:
            user.name,

          email:
            user.email,

          bio:
            user.bio || "",

          profilePicture:
            user.profilePicture ||
            null,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

// =========================
// UPDATE PROFILE
// =========================

app.patch(
  "/api/auth/profile",
  authenticateToken,
  (req, res) => {
    const {
      name,
      bio,
      profilePicture,
    } = req.body;

    if (
      typeof name !==
      "undefined"
    ) {
      if (
        typeof name !==
          "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          message:
            "Name cannot be empty",
        });
      }

      req.user.name =
        name.trim();
    }

    if (
      typeof bio !==
      "undefined"
    ) {
      if (
        typeof bio !==
        "string"
      ) {
        return res.status(400).json({
          message:
            "Bio must be text",
        });
      }

      req.user.bio =
        bio;
    }

    if (
      typeof profilePicture !==
      "undefined"
    ) {
      req.user.profilePicture =
        profilePicture ||
        null;
    }

    res.json({
      message:
        "Profile updated successfully",

      user: {
        id:
          req.user.id,

        name:
          req.user.name,

        email:
          req.user.email,

        bio:
          req.user.bio || "",

        profilePicture:
          req.user.profilePicture ||
          null,
      },
    });
  }
);

// =========================
// START SERVER
// =========================

app.listen(
  PORT,
  () => {
    console.log(
      `MyBlog API running on http://localhost:${PORT}`
    );
  }
);