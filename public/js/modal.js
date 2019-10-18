$(".button-container").on("click", function(event) {
  let id = $(this).children("button").attr("data-id");
  $.get("/articles/" + id, function(data) {
    console.log(data);
    $(".modal-title").text(data.title);
    if(data.comment) {
      data.comment.forEach(element => {
        $(".comment-area").prepend("<p>" + element.body + "</p>");
      })
    }
    $(".modal").css("display", "block");
  })
});

$(".close").on("click", event => {
  $(".modal").css("display", "none");
});
