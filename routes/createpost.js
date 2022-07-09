const pg = require("../pgConfig");

const createPostRoute = require('express').Router();

createPostRoute.post('/', async (req, res) => {
    console.log(req.body, req.user);
    const content = req.body.content;
    const user_id = req.user.id;
    try {
        const result = await pg.query("INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *", [content, user_id]);
        console.log(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
    res.redirect('/');
});

createPostRoute.post("/del", async (req, res) => {
    const id = req.query.id;
    try {
        const result = await pg.query("DELETE FROM posts WHERE id = $1", [id]);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/users/profile");
});

module.exports = createPostRoute;