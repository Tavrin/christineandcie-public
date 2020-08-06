$(document).on("ready", function(){



    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('member') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "/api/users/" + recipient,
                    "method": "GET",
                    "processData": false,
                    "contentType": false,
                    "mimeType": "application/x-www-form-urlencoded"
                }
                $.ajax(settings)
                .done(function (response) {
                    var data = JSON.parse(response)
                    console.log(data)
                    var modal = $("#exampleModal")
        modal.find('#nom-membre').text("Nom : " + data.username)
        modal.find('#boutonMembreEdit').data('id', data._id)
        
        modal.find('.modal-body .form-zone').html(`<form id="membreEdit">
                  <div class="form-group">

                          <label for="status">Administrateur :</label>
                          <select class="form-control" name="status" id="status" required>
                            <option  ${data.isAdmin == true ? `selected`: ''} value="true">Oui</option>
                            <option ${data.isAdmin == false ? 'selected': ''} value="false">Non</option>
                          </select>

                  </div>
                    
                </form>`)
                })

        
      })



    $('#boutonMembreEdit').on("click", function(e){$
        e.preventDefault();

        var recipient = $('#boutonMembreEdit').data('id')
        var form = new FormData();
        form.append("isAdmin", $("#status").val())
        console.log($("#status").val())
        var settings = {
            "async": true,
            "crossDomain": false,
            "url": "/api/users/" + recipient,
            "method": "PUT",
            "processData": false,
            "contentType": false,
            "mimeType": "application/x-www-form-urlencoded",
            "data": form
        }
        $.ajax(settings)
        .done(function (response) {
            console.log(response)
            location.reload();
        })
    })
})