$(document).ready(() => {
  $.get("/scrape", () => {
    console.log("Scrape Complete");
  }).then(() => {
    $.get("/articles", data => {
      $(".container").html(data);    
    });
  })
});
