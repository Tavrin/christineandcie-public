var formBlog = document.querySelector('#quill-new');
var formBlogEdit = document.querySelector('#quill-edit');

$.when( $.ready ).then(function() {


    if(formBlog){
        formBlog.onsubmit = function(e){
            e.preventDefault();
    
        var content = document.querySelector('input[name=content]');
        content.value = JSON.stringify(quill.getContents());
    
        var form = new FormData();

        form.append("tags", $('#tags').val());
        form.append("name", $('#name').val());
        form.append("formation", formationId);
        form.append("description", $('#description').val());
        form.append("content", quill.root.innerHTML);
        form.append("thumbnail", $("#thumbnail")[0].files[0]);
        form.append("video", $("#video")[0].files[0]);
        
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "/api/formations/"+formationId+'/modules',
          "method": "POST",
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "data": form
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            var parsed_data = JSON.parse(response)
            window.location.replace("/admin/formations/"+formationId+"/modules/"+parsed_data.module._id+'/edit');
          });
          
        };  }


        if(formBlogEdit){
          formBlogEdit.onsubmit = function(e){
            
            e.preventDefault();
            var content = document.querySelector('input[name=content]');
            content.value = JSON.stringify(quill.getContents());
        
            var form = new FormData();
            form.append("tags", $('#tags').val());
            form.append("name", $('#name').val());
            form.append("description", $('#description').val());
            form.append("formation", formationId);
            form.append("content", quill.root.innerHTML);
            form.append("thumbnail", $("#thumbnail")[0].files[0]);
            form.append("video", $("#video")[0].files[0]);
            
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "/api/formations/"+formationId+'/modules/' +moduleId,
              "method": "PUT",
              "processData": false,
              "contentType": false,
              "mimeType": "multipart/form-data",
              "data": form
            }
            $.ajax(settings).done(function (response) {
              console.log(response)
                var parsed_data = JSON.parse(response)
                console.log(parsed_data)
                window.location.replace("/admin/formations/"+formationId+"/modules/"+parsed_data.id+"/edit");
              });
               }
                      }


$(document).on("change", ".file_multi_video", function(evt) {
  var $source = $('#video_here');
  $source[0].src = URL.createObjectURL(this.files[0]);
  $source.parent()[0].load();
});
})

function readURL(input) {
    if (input.files && input.files[0]) {
      loadMime(input.files[0], function(mime) {

        console.log(mime)
    });
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

// function readURL2(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $('#inputVideo')
//                 .attr('src', e.target.result)
//                 .width(150)
//                 .height(300);
//         };
//         reader.readAsDataURL(input.files[0]);
//     }
// }

function loadMime(file, callback) {
    
  //List of known mimes
  var mimes = [
      {
          mime: 'image/jpeg',
          pattern: [0xFF, 0xD8, 0xFF],
          mask: [0xFF, 0xFF, 0xFF],
      },
     
      
    {   mime: 'image/gif',
        pattern:[0x47,0x49,0x46,0x38,0x37,0x61],
        mask: [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF],
        extension: "gif"
  },
  {
    mime: 'image/png',
    pattern: [0x89, 0x50, 0x4E, 0x47],
    mask: [0xFF, 0xFF, 0xFF, 0xFF],
},
  {   mime: 'image/gif',
      pattern:[0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
      mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
      extension: "gif"
}
      // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
  ];

  function check(bytes, mime) {
      for (var i = 0, l = mime.mask.length; i < l; ++i) {
          if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
              return false;
          }
      }
      return true;
  }

  var blob = file.slice(0, 4); //read the first 4 bytes of the file

  var reader = new FileReader();
  reader.onloadend = function(e) {
      if (e.target.readyState === FileReader.DONE) {
          var bytes = new Uint8Array(e.target.result);

          for (var i=0, l = mimes.length; i<l; ++i) {
              if (check(bytes, mimes[i])) return callback("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
          }

          return callback("Mime: unknown <br> Browser:" + file.type);
      }
  };
  reader.readAsArrayBuffer(blob);
}
