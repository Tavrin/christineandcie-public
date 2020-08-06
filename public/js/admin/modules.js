

$(document).ready(function(){
  $(document).on("click", ".link-to-module", function(e){

    localStorage.setItem("moduleStorage", $(this).data('target-module')); // dynamic assignment     
    console.log(localStorage.getItem('moduleStorage'))  
  });

    axios.get('/api/formations/'+formationId+'/modules')
      .then(addModules)
      .catch(function (error) {
        console.log(error);
      });
    
        $('.modal').on('show.bs.modal', function (e) {
            console.log("e: " + e);
            var $trigger = $(e.relatedTarget);
            $("#modalOui").on('click', function(e){
                e.stopPropagation();
                console.log($trigger.parent().parent());
                removeModule($trigger.parent().parent());
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
    
    
    function removeModule(mod){
        console.log("todo: "+ mod);
      var clickedId = mod.data('id');
      var deleteUrl = '/api/formations/'+ formationId + '/modules/' + clickedId; 
      $.ajax({
        method: 'DELETE',
        url: deleteUrl
      })
      .done(function(data){
            $('#exampleModal').modal('hide');
            $('.modal-backdrop').hide();
            $("body").removeClass("modal-open");
            mod.fadeOut(500, function(){
            mod.remove();
            $('.container-flash').html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    ${data.message}
                                    <button type="button" class="close fade show" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </div>`)
        })
      })
      .fail(function(err){
        $('.container-flash').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <p>Une erreur a été rencontrée durant la suppression</p>
                                    <hr>
                                    <p class="mb-0">${err.responseJSON.erreur}</p>
                                    <button type="button" class="close fade show" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </div>`)
      })
    }
    
    
    function addModules(modules) {
        console.log(modules.data.members);
        modules.data.members.forEach(function(mod){
          addModule(mod);
        });
      }
    
      function addModule(mod){
         if(mod.description){
            let newModule = $('<tr class="ligne"><td><a class=\"link-to-module\" href=\"/formations/mes-formations/'+formationId+'\" data-target-module=\'#' + mod._id+'\'>'+ mod.name + '</a></td><td><a href=\"/admin/formations/'+formationId+'/modules/'+mod._id+'\">'+ mod.description.substring(0,50) + '<span class =\"text-muted\">...</span></a> </td><td align=\"right\"> <a class=\"btn btn-admin-editer\" href=\"//admin/formations/'+formationId+'/modules/'+mod._id+'/edit\"> Editer </a> <a data-toggle="modal" data-target="#exampleModal" class=\"btn btn-danger\" href=\"#\"> Supprimer </a></td></tr>');
            newModule.data('id', mod._id);
            $('.posts').append(newModule);
             }
             else{
                let newModule = $('<tr class="ligne"><td><a class=\"link-to-module\" href=\"/formations/mes-formations/'+formationId+'\" data-target-module=\'#' + mod._id+'\'>'+ mod.name +'</a></td><td><a href=\"/admin/formations/'+formationId+'/modules/'+mod._id+'\">Pas de description</a></td><td align=\"right\"><a class=\"btn btn-admin-editer\" href=\"/admin/formations/'+formationId+'/modules/'+mod._id+'/edit\"> Editer </a> <a data-toggle="modal" data-target="#exampleModal" class=\"btn btn-danger\" href=\"#\"> Supprimer </a></td></tr>');
                newModule.data('id', mod._id);
                $('.posts').append(newModule);
             }
        // newBlogpost.data('id', blogpost._id);
        
    
      }
    
    