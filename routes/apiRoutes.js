var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
  app.get("/scrape", function(req, res) {
    axios
      .get("https://www.abc.net.au/news/justin/?page=1")
      .then(function(response) {
        var $ = cheerio.load(response.data);
        // array of data => map =>
        var data = [];
        $(".article-index li").each(function(i, element) {
          var result = {};
          if (
            $(this)
              .children("h3")
              .children("a")
              .text()
          ) {
            result.title = $(this)
              .children("h3")
              .children("a")
              .text();
            result.link =
              "https://www.abc.net.au" +
              $(this)
                .children("h3")
                .children("a")
                .attr("href");
            result.body = $(this)
              .children("p:nth-last-child(2)")
              .text();
          }
          data.push(result);
          console.log(result);
        });

        Promise.all(
          data.map(element =>
            db.Article.findOne({ title: element.title })
              .then(data => {
                if (!data) {
                  return db.Article.create(element)
                }
              }).then(function(article) {
                console.log(article);
              })
              .catch(function(err) {
                console.log(err);
              })
          )
        ).then(() => {
          res.status(200);
          res.end();
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(article) {
        console.log(article);
        res.render("articles", { articles: article, layout: false });
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(data => {
        res.json(data); // render here instead
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.post("/articles/:id", (req, res) => {
    db.Comment.create(req.body)
      .then(comment => {
        return db.Article.updateOne(
          { _id: req.params.id },
          { $push: { comment: comment._id } },
          { new: true }
        );
      })
      .then(article => {
        res.json(article); // can probably render here to update automatically
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.get("/comment/:id", (req, res) => {
    console.log(req.params.id);
    console.log(mongoose.Types.ObjectId(req.params.id))
    db.Comment.deleteOne({_id : mongoose.Types.ObjectId(req.params.id)}).then(data => {
      res.json(data);
    }).catch(err => {
      res.json(err);
    })
  })
};
