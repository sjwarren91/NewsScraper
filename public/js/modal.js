$(".button-container").on("click", function(event) {
  let id = $(this)
    .children("button")
    .attr("data-id");
  $(".submit").attr("data-id", id);
  updateComments(id);
  $(".submit").on("click", function() {
    var id = $(this).attr("data-id");
    var body = {
      body: $("#comment-input").val()
    }
    $("#comment-input").val("");
    $.post("/articles/" + id, body, function(data) {
      console.log(data);
    }).done(() => {
      updateComments(id);
    })
  })
});

$(".close").on("click", event => {
  $(".modal").css("display", "none");
  $(".submit").off();
  $(".delete-comment").off();
});


function updateComments(id) {
  $(".comment-area").empty();
  $.get("/articles/" + id, function(data) {
    $(".modal-title").text(data.title);
    if (data.comment) {
      data.comment.forEach(element => {
        $(".comment-area").prepend(
          "<p class='comment'>" +
            element.body +
            `<span class="delete-comment"><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-x-circle"
          data-id=${element._id}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg></span></p>`
        );
      });
    }
    $(".modal").css("display", "block");

    $(".delete-comment").on("click", function() {
      console.log($(this).children("svg").attr("data-id"))
      $.get("/comment/" + $(this).children("svg").attr("data-id"), function(data) {
        console.log(data);
      }).done(() => {
        console.log("Comment deleted");
        updateComments(id)
      })
    });
  });
}