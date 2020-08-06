$.when( $.ready ).then(function() {
    
// Zone about
    //Variables
    let aboutButton = $("#bouton-about")
    let aboutZone = $("#zone-about")
    let aboutContenu =$(".zone-about-contenu")

    //Events
    aboutContenu.on("mouseenter", function(e){
        $(".filtre-zone-about").addClass("about-hover")
    })
    aboutContenu.on("mouseleave", function(e){
        $(".filtre-zone-about").removeClass("about-hover")
    })

    aboutButton.on("mouseenter", function(e){
        $(".filtre-zone-about").addClass("hover-bouton-about")
    })
    aboutButton.on("mouseleave", function(e){
        $(".filtre-zone-about").removeClass("hover-bouton-about")
    })



    let aboutButton2 = $("#bouton-about-2")
    let aboutZone2 = $("#zone-about-2")
    let aboutContenu2 =$(".zone-about-contenu-2")

    //Events
    aboutContenu2.on("mouseenter", function(e){
        $(".filtre-zone-about-2").addClass("about-hover")
    })
    aboutContenu2.on("mouseleave", function(e){
        $(".filtre-zone-about-2").removeClass("about-hover")
    })

    aboutButton2.on("mouseenter", function(e){
        $(".filtre-zone-about-2").addClass("hover-bouton-about")
    })
    aboutButton2.on("mouseleave", function(e){
        $(".filtre-zone-about-2").removeClass("hover-bouton-about")
    })
//#############

//Zone bunker
    //Variables
    let bunkerButton = $("#bouton-bunker")
    let bunkerZone = $("#zone-bunker")
    let bunkerContenu =$(".zone-bunker-contenu")

    //Events
    bunkerContenu.on("mouseenter", function(e){
        $(".filtre-zone-bunker").addClass("bunker-hover")
    })
    bunkerContenu.on("mouseleave", function(e){
        $(".filtre-zone-bunker").removeClass("bunker-hover")
    })

    bunkerButton.on("mouseenter", function(e){
        $(".filtre-zone-bunker").addClass("hover-bouton-bunker")
        // bunkerButton.addClass("hover-bouton-bunker2");
    })
    bunkerButton.on("mouseleave", function(e){
        $(".filtre-zone-bunker").removeClass("hover-bouton-bunker")
        // bunkerButton.removeClass("hover-bouton-bunker2");
    })
//#############

//Zone avenir
    //Variables
    let avenirButton = $("#landing-form")
    let avenirZone = $("#zone-avenir")
    let  avenirContenu=$(".zone-avenir-contenu")

    //Events
    avenirContenu.on("mouseenter", function(e){
        $(".filtre-zone-avenir").addClass("avenir-hover")
    })
    avenirContenu.on("mouseleave", function(e){
        $(".filtre-zone-avenir").removeClass("avenir-hover")
    })

    avenirButton.on("mouseenter", function(e){
        $(".filtre-zone-avenir").addClass("hover-form-avenir")
        // bunkerButton.addClass("hover-bouton-bunker2");
    })
    avenirButton.on("mouseleave", function(e){
        $(".filtre-zone-avenir").removeClass("hover-form-avenir")
        // bunkerButton.removeClass("hover-bouton-bunker2");
    })
//#############
})