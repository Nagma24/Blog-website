const homeRoute = require('express').Router();

const data = [{
    title: "Post 1",
    body: "This is post 1"
}, {
    title: "Post 2",
    body: "This is post 2"
}
];

homeRoute.get('/', (req, res) => {
    res.render('home', { data });
});

module.exports = homeRoute