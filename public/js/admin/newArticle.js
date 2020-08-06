var formBlog = document.querySelector('#quill-new');

$.when( $.ready ).then(function() {
    if(formBlog){
        formBlog.onsubmit = function(e){
            e.preventDefault();
    
        var content = document.querySelector('input[name=content]');
        content.value = JSON.stringify(quill.getContents());
    
        var form = new FormData();
        form.append("category", $('#category').val());
        form.append("author", $('#author').val());
        form.append("tags", $('#tags').val());
        form.append("title", $('#title').val());
        form.append("description", $('#description').val());
        form.append("content", quill.root.innerHTML);
        form.append("thumbnail", $("#thumbnail")[0].files[0]);
        
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "/api/articles/",
          "method": "POST",
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "data": form
        }
        $.ajax(settings).done(function (response) {
            var parsed_data = JSON.parse(response)
            window.location.replace("/blog/view/"+parsed_data._id);
          });
          
        };  }

})

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#inputImage')
                .attr('src', e.target.result)
                .width(150)
                .height(300);
        };
        reader.readAsDataURL(input.files[0]);
    }
}