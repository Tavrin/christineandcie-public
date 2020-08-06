$(document).on("ready", function(){

    $('#boutonNouvelleListe').on("click", function(e){$
        e.preventDefault();
        var form = new FormData()
        form.append("name", $("#listName").val())
        form.append("description", $("#listDescription").val())
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/lists",
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }
        $.ajax(settings)
        .done(function (response) {
            console.log(response)
        })
    })
})