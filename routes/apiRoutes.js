var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/scrape", function(req, res) {
    axios
      .get("https://www.abc.net.au/news/justin/?page=1")
      .then(function(response) {
        var $ = cheerio.load(response.data);

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

          db.Article.findOne({ title: result.title })
            .then(data => {
              if (data) {
                db.Article.create(result)
                  .then(function(article) {
                    // console.log(article);
                  })
                  .catch(function(err) {
                    console.log(err);
                  });
              }
            })
            .catch(err => {
              console.error(err);
            });
        });
        res.status(200);
        res.end();
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(article) {
        res.render("articles", { articles: article, layout: false });
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
