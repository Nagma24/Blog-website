const commentRoute = require('express').Router();
const pg = require('../pgConfig');

commentRoute.get("/", async (req, res) => {
    const id = req.query.id;
    console.log(id);
    try {
        const result = await pg.query(`SELECT p.id, p.content, u.username  FROM posts as p, users as u WHERE p.user_id = u.id and p.id = $1`, [id]);
        const commentResult = await pg.query(`SELECT c.id, c.content, u.username  FROM comments as c, users as u WHERE c.user_id = u.id and c.post_id = $1`, [id]);
        // console.log(commentResult.rows);
        res.render('comments', {
            post: result.rows[0],
            comments: commentResult.rows
        });
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
})

commentRoute.post("/", async (req, res) => {
    const postId = req.query.id;
    const user_id = req.user.id;
    const content = req.body.comment;
    try {
        const result = await pg.query(`INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`, [user_id, postId, content]);
        console.log(result.rows);
        res.redirect("/comment?id=" + req.query.id);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }


})

module.exports = commentRoute;