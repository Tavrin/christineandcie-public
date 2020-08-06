$.when($.ready).then(function(){
    var VidOn = false;
    var categoryHref = localStorage.getItem("moduleStorage")
    if(categoryHref ){ // if the value exists
        console.log("categoryhref= " +categoryHref)
        $('a[href="'+categoryHref  +'"]').trigger('click'); 
        localStorage.removeItem("categoryLink"); // remove it after first use    
      }


    $(".moduleLink").on("click", function(e){
        e.preventDefault()
        var addressValue = $(this).data("link");
        loadVideoTab(addressValue)
        
        // alert(addressValue );
    })

    $(document).on("click", ".link-video", function(e){
        console.log($(this))
        e.preventDefault()
        var addressValue =  $(this).data("id");
        loadVideoTab(addressValue)
        
      })

    $(document).on("click", ".link-text", function(e){
        e.preventDefault()
        var addressValue =  $(this).data("id");
        loadTextTab(addressValue)
        
      })

      $("#darkModeButton").on("click", function(e){
        e.preventDefault()
        $("#content").toggleClass("dark-mode")
        var text = $('#darkModeButton').text();
        $('#darkModeButton').text(
            text == "Mode Nuit" ? "Mode Jour" : "Mode Nuit");

        
        // alert(addressValue );
    })
    
})



function loadVideoTab(address){
    axios({
        baseURL: address,
        timeout: 200000,
        responseType: 'json',
        method: 'get'
    }).then((response) => {
       console.log(response.data.module)
       var oldPlayer = document.getElementById('my-video');
        if(oldPlayer !== null && oldPlayer != undefined){
            console.log(oldPlayer)

            videojs(oldPlayer).dispose();
        }
       
       $(".module-zone").fadeOut(100,function(){
        $(this).empty()
        
        $(this).html(`
        <div class="nav-zone  mb-5 pb-5"> 
            <nav class=" navbar navbar-dark bg-dark nav justify-content-center nav-fill">
                 <li class="nav-item">
                    <a class="nav-link active link-video" data-id="/api/formations/${response.data.module.formation}/modules/${response.data.module._id}" href="#">Vidéo</a>
                </li>
                <li class="nav-item">
                     <a class="nav-link link-text" data-id="/api/formations/${response.data.module.formation}/modules/${response.data.module._id}" href="#">Texte</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Fichiers</a>
                </li>
            </nav>
        </div>

        <div class="module-title">
            <h2 class="text-center zone-titre text-capitalize pb-4 mb-4">${response.data.module.name}</h2>
        </div>

        <div class="module-video mb-5 pb-5">
        ${response.data.module.video != undefined ? `<video id='my-video' class='video-js vjs-default-skin vjs-big-play-centered' controls preload='auto' width='820' height='460'  poster="${response.data.module.thumbnail}" >
        <source src=\"${response.data.module.video}\">
           <p class='vjs-no-js'>
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href='https://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>
       </p>  
           </video>` : 
                        

                 `Ce module ne contient pas de vidéo`}
        </div>`
    
        ) 
if(response.data.module.video != undefined ){
    vidOn = true
    videojs("my-video", {}, function(){
    })
}
else{
    vidOn = false
}
        
    }).fadeIn()
})
    .catch((error) => {
        console.log(error)
    });


}


function loadTextTab(address){
    console.log(address)
    axios({
        baseURL: address,
        timeout: 200000,
        responseType: 'json',
        method: 'get'
    }).then((response) => {
        
       console.log(vidOn)
       if( vidOn == true){
        var oldPlayer = document.getElementById('my-video');

        videojs(oldPlayer).dispose();
    }
       $(".module-zone").fadeOut(100,function(){
        $(this).empty()
        
        $(this).html(`
        <div class="nav-zone  mb-5 pb-5"> 
            <nav class=" navbar navbar-dark bg-dark nav justify-content-center nav-fill">
                 <li class="nav-item">
                 <a class="nav-link  link-video" data-id="/api/formations/${response.data.module.formation}/modules/${response.data.module._id}" href="#">Vidéo</a>
                </li>
                <li class="nav-item">
                     <a class="nav-link active link-text" data-id="${response.data.module._id}" href="#">Texte</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Fichiers</a>
                </li>
            </nav>
        </div>

        <div class="module-title">
            <h2 class="text-center zone-titre text-capitalize pb-4 mb-4">${response.data.module.name}</h2>
        </div>

        <div class = "module-thumbnail">
            <img src = "${response.data.module.thumbnail}" class="thumbnail">
        </div>
        <div class="module-content">
      ${response.data.module.content}
    </div>`
    
        ) 

    }).fadeIn()
})
    .catch((error) => {
        console.log(error)
    });


}

