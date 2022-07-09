//jshint esversion:6
require("dotenv").config();


const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require("./routes/users.js");
const homeRoute = require("./routes/home.js");
const app = express();
const pg = require("./pgConfig");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");
const initPassport = require("./passport-config");
const createPostRoute = require("./routes/createpost.js");
const commentRoute = require("./routes/comment.js");
initPassport(passport);

app.set('view engine', 'ejs');

app.use(session({
  store: new pgSession({
    pg: pg,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/users", userRoute);
app.use("/home", homeRoute);
app.use("/create", checkAuthenticated, createPostRoute);
app.use("/comment", checkAuthenticated, commentRoute);

let posts = [];


app.get("/", checkAuthenticated, async function (req, res) {
  try {
    const result = await pg.query("SELECT p.id, p.content, u.username  FROM posts as p, users as u WHERE p.user_id = u.id");
    posts = result.rows;
    console.log(posts);
    res.render("home", { data: posts });
  } catch (error) {
    console.log(error);
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.post("/login", (req, res) => {
  console.log(req.body);
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}
