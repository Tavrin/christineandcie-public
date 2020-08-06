

$(document).ready(function(){

axios.get('/api/articles')
  .then(addBlogposts)
  .catch(function (error) {
    console.log(error);
  });

	$('.modal').on('show.bs.modal', function (e) {
		console.log("e: " + e);
		var $trigger = $(e.relatedTarget);
		$("#modalOui").on('click', function(e){
			e.stopPropagation();
			console.log($trigger.parent().parent());
			removeTodo($trigger.parent().parent());
			return false
		})
});
	



  

	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	// if(!Modernizr.input.placeholder){
	// 	$('[placeholder]').focus(function() {
	// 		var input = $(this);
	// 		if (input.val() == input.attr('placeholder')) {
	// 			input.val('');
	// 	  	}
	// 	}).blur(function() {
	// 	 	var input = $(this);
	// 	  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
	// 			input.val(input.attr('placeholder'));
	// 	  	}
	// 	}).blur();
	// 	$('[placeholder]').parents('form').submit(function() {
	// 	  	$(this).find('[placeholder]').each(function() {
	// 			var input = $(this);
	// 			if (input.val() == input.attr('placeholder')) {
	// 		 		input.val('');
	// 			}
	// 	  	})
	// 	});
	// }
});


function removeTodo(todo){
	console.log("todo: "+ todo);
  var clickedId = todo.data('id');
  var deleteUrl = '/api/articles/' + clickedId; 
  $.ajax({
    method: 'DELETE',
    url: deleteUrl
  })
  .done(function(data){
		$('#exampleModal').modal('hide');
		$('.modal-backdrop').hide();
		$("body").removeClass("modal-open");
		todo.fadeOut(500, function(){
		todo.remove();
	})
  })
}


function addBlogposts(blogposts) {
    console.log(blogposts.data);
    blogposts.data.forEach(function(blogpost){
      addBlogpost(blogpost);
    });
  }

  function addBlogpost(blogpost){
     if(blogpost.description){
		let newBlogpost = $('<tr class="ligne"><td><a href=\"/blog/view/'+blogpost._id+'\">'+ blogpost.title + '</a></td><td><a href=\"/blog/view/'+blogpost._id+'\">'+ blogpost.description.substring(0,50) + '<span class =\"text-muted\">...</span></a> </td><td align=\"right\"> <a class=\"btn btn-admin-editer\" href=\"/blog/'+blogpost._id+'/editer\"> Editer </a> <a data-toggle="modal" data-target="#exampleModal" class=\"btn btn-danger\" href=\"#\"> Supprimer </a></td></tr>');
		newBlogpost.data('id', blogpost._id);
		$('.posts').append(newBlogpost);
		 }
		 else{
			let newBlogpost = $('<tr class="ligne"><td><a href=\"/blog/view/'+blogpost._id+'\">'+ blogpost.title +'</a></td><td><a href=\"/blog/view/'+blogpost._id+'\">Pas de description</a></td><td align=\"right\"><a class=\"btn btn-admin-editer\" href=\"/blog/'+blogpost._id+'/editer\"> Editer </a> <a data-toggle="modal" data-target="#exampleModal" class=\"btn btn-danger\" href=\"#\"> Supprimer </a></td></tr>');
			newBlogpost.data('id', blogpost._id);
			$('.posts').append(newBlogpost);
		 }
    // newBlogpost.data('id', blogpost._id);
    

  }

