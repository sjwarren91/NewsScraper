$(".button-container").on("click", event => {
  console.log("wut");
  $(".modal").css("display", "block");
});

$(".close").on("click", event => {
  $("#myModal").css("display", "none");
});
