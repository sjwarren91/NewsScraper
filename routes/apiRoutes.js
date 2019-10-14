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
            // console.log(result);
          }

          db.Article.create(result)
            .then(function(article) {
              console.log(article);
            })
            .catch(function(err) {
              console.log(err);
            });

        });
      });
  });
};
