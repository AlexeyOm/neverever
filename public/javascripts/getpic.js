$(document).ready(function () {
  $("#submitName").click(function () {
    $.get(window.location.href + 'openfile?name=' + encodeURI($("#authorName").val()) + '&gender=' + $("input[name=gender]:radio:checked").val(), function(data) {
      $("#resultImg").attr({src : data});
     
    });
  });
  
  $("#authorName").keypress(function (event) {
    if(event.which == 13) {
      //event.preventDefault()
      $.get(window.location.href + 'openfile?name=' + encodeURI($("#authorName").val()) + '&gender=' + $("input[name=gender]:radio:checked").val(), function(data) {
        $("#resultImg").attr({src : data});
      });
    }
  });
  
  $("#authorName").click(function (event) {
    $("#authorName").val("");
  });
  
  $("input[name=gender]:radio").click(function() {
    console.log(this);
    if($(this).val() == 'f') {$("#submitName").val("Никогда я такого не говорила!");}
    else {$("#submitName").val("Никогда я такого не говорил!");}
  });
});