
$(document).ready(function(){
	$('.modal').on('show.bs.modal', function (e) {
		// console.log("e: " + e);
		var $trigger = $(e.relatedTarget);
		$("#modalOui").on('click', function(e){
			e.stopPropagation();
			// console.log($trigger.parent().parent());
			removeTodo($trigger.parent().parent());
			return false
		})
});

$('#boutonNouveauContact').on("click", function(e){$
    // console.log(e)
    e.preventDefault();
    var form = new FormData()
    form.append("name", $("#contactName").val())
    form.append("email", $("#contactEmail").val())
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/api/contacts",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings)
    .done(function (response) {
        console.log(response.status)
        var data = JSON.parse(response)
        console.log(data)
    })
})
	

})


function removeTodo(todo){
    console.log("todo: "+ todo);
  var clickedId = todo.data('id');
  console.log("did it " + clickedId)
  var deleteUrl = '/api/contacts/' + clickedId; 
  $.ajax({
    method: 'DELETE',
    url: deleteUrl
  })
  .done(function(data){
      console.log("data: " + data)
        $('#exampleModal2').modal('hide');
        $('.modal-backdrop').hide();
        $("body").removeClass("modal-open");
        todo.fadeOut(500, function(){
        todo.remove();
    })
  })
}