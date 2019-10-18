$(document).ready(function() {
  // $.get("/articles", data => {
  //   $(".container").html(data);
  // }).then(function() {
    scrapeUpdate();    
  // });
});

function scrapeUpdate() {
  $.get("/scrape", function() {
  }).done(function() {
    $.get("/articles", function(data) {
      $(".container").html(data);    
    });
  });
}