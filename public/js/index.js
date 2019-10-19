$(document).ready(function() {
  scrapeUpdate()
});

function scrapeUpdate() {
  $.get("/scrape", function() {
  }).done(function() {
    $(".modal2").css("display", "none");
    $.get("/articles", function(data) {
      $(".container").html(data);    
    });
  });
}

$(".scrape").on("click", function() {
  $(".modal2").css("display", "block");
  scrapeUpdate();
})