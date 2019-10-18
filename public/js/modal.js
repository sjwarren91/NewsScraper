$(".button-container").on("click", function(event) {
  console.log("wut")
  let id = $(this).children("button").attr("data-id");
  $.get("/articles/" + id, function(data) {
    console.log(data);
    $(".modal-title").text(data.title);
    // if(data.comment) {
    //   data.comment
    // }
    $(".modal").css("display", "block");
  })
});

$(".close").on("click", event => {
  $(".modal").css("display", "none");
});
