$(document).ready(function () {
  $("#submitName").click(function () {
    $.get(window.location.href + 'openfile?name=' + encodeURI($("#authorName").val()), function(data) {
      $("#resultImg").attr({src : data});
     
    });
  });
  $("#authorName").keypress(function (event) {
    if(event.which == 13) {
      //event.preventDefault()
      $.get(window.location.href + 'openfile?name=' + encodeURI($("#authorName").val()), function(data) {
        $("#resultImg").attr({src : data});
      });
    }
  });
  $("#authorName").click(function (event) {
    $("#authorName").val("");
  });
});