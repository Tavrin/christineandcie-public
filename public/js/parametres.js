formUser = document.querySelector("#form-user")
formApi = document.querySelector("#form-api")
$.when( $.ready ).then(function() {

    if(formApi){
        console.log("keyid: " + keyId)
        formApi.onsubmit = function(e){
                    e.preventDefault();
                var form = new FormData();
                form.append('keyId', keyId)
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "/api/users/"+userId+'/userKey',
          "method": "POST",
          "processData": false,
          "contentType": false,
          "mimeType": "application/x-www-form-urlencoded",
          "data": form
        }
        $.ajax(settings).done(function (response) {
            var parsed_data = JSON.parse(response)
            console.log(parsed_data.apiSecret)
            document.getElementById('user-keyId').value = parsed_data.apiKey
            document.getElementById('user-apiSecret').value = parsed_data.apiSecret
            // window.location.replace("/parametres/profil");
          });


    }
}
    // if(formUser){
    //     formUser.onsubmit = function(e){
    //         e.preventDefault();
    

    
    //     var form = new FormData();
    //     form.append("realName", $('#realName').val());
    //     form.append("bio", $('#bio').val());
    //     form.append("location", $('#location').val());
    //     form.append("url", $('#url').val());
    //     form.append("avatar", image);
        
    //     var settings = {
    //       "async": true,
    //       "crossDomain": true,
    //       "url": "/api/users/",
    //       "method": "PUT",
    //       "processData": false,
    //       "contentType": false,
    //       "mimeType": "multipart/form-data",
    //       "data": form
    //     }
    //     $.ajax(settings).done(function (response) {
    //         var parsed_data = JSON.parse(response)
    //         window.location.replace("/parametres/profil");
    //       });
          
    //     };  }
    })

    function readURL(input) {
        if (input.files && input.files[0]) {
            var currentFile = input.files[0];
            // console.log(currentFile)
            var x = document.querySelectorAll('.upload-state')
            // console.log(x)
            for(var i=0; i < x.length; i ++){
                console.log(x[i])
              x[i].style.display = "none"  

            }
                
            console.log(currentFile)
            if(currentFile.type !="image/png" && currentFile.type != "image/jpeg"){
                console.log(currentFile.type)
                return document.getElementsByClassName('bad-file')[0].style.display = "block"
            }
            if(currentFile.size > 1000000){
                console.log("too big");
                return  document.getElementsByClassName('too-big')[0].style.display = "block"
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#inputImage')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            // let image = reader.readAsDataURL($('#avatar').files[0]);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }