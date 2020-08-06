$.when( $.ready ).then(function() {
    $('#imagemap').imageMapResize();
let titre = $('#bio-titre');
let bio = $("#bio-details");

let christel = $("#christel");
let etienne = $("#etienne");
let marine = $("#marine");
let fabien = $("#fabien");
let maeva = $("#maeva");
let julia = $("#julia");

let toggle = null;


christel.on('click', function(e){
    if(toggle !="christel"){

        christel.removeClass('img-unclicked').addClass('img-clicked');
        
        etienne.addClass('img-unclicked').removeClass('img-clicked');
        marine.addClass('img-unclicked').removeClass('img-clicked');
        fabien.addClass('img-unclicked').removeClass('img-clicked');
        maeva.addClass('img-unclicked').removeClass('img-clicked');
        julia.addClass('img-unclicked').removeClass('img-clicked');
    let bio = $("#bio-details");
    titre.fadeOut(200,function(){
        $(this).text("Christel")
    }).fadeIn()

    
    bio.fadeOut(200,function(){
        $(this).replaceWith(`
                    <ul id="bio-details" class="list-unstyled">
                        <li class="bio-list-item"><span style="color:#1A6496">P</span>sychologue du Travail : soutien organisationnel, aide au recrutement et au management </li>
                        <li class="bio-list-item"><span style="color:#D6374C">P</span>rofessionnelle formée à la méthodologie de l’Activation du Développement Vocationnel et Personnel (ADVP)</li>
                        <li class="bio-list-item"><span style="color:#51B551">P</span>rofessionnelle formée à l’entretien du Développement des Intérêts et Valeurs de l’Adulte (DIVA)</li>
                        <li class="bio-list-item"><span style="color:#51B551">C</span>onseillère en Orientation Professionnelle </li>
                        <li class="bio-list-item"><span style="color:#51B551">A</span>ccompagnatrice à la scolarité des collégiens : ateliers de confiance en soi et d'orientation </li>
                        <li class="bio-list-item"><span style="color:#51B551">C</span>hef de projet  pour la Conception du livre « Le bonheur au Travail »</li>
                        <li class="bio-list-item"><span style="color:#437432">P</span>réparation Militaire Supérieure</li>
                        <li class="bio-list-item"><span style="color:#033B45">H</span>obbies :  lecture (développement et perfectionnement personnel, business, rentabilité, efficacité, organisation), yoga, voyages</li>
                    </ul>`
                    )
                }).fadeIn()
                toggle = "christel"
            }
});

marine.on('click', function(e){

    if(toggle !="marine"){

        marine.removeClass('img-unclicked').addClass('img-clicked');
        
        etienne.addClass('img-unclicked').removeClass('img-clicked');
        christel.addClass('img-unclicked').removeClass('img-clicked');
        fabien.addClass('img-unclicked').removeClass('img-clicked');
        maeva.addClass('img-unclicked').removeClass('img-clicked');
        julia.addClass('img-unclicked').removeClass('img-clicked');

    let bio = $("#bio-details");

    titre.fadeOut(200,function(){
        $(this).text("Marine")
    }).fadeIn()

    bio.fadeOut(200,function(){
        $(this).replaceWith(`
                    <ul id="bio-details" class="list-unstyled">
                            <li class="bio-list-item">Assistante de Service Social diplômée d'État</li>
                            <li class="bio-list-item">Conseillère en Insertion Socio-Professionnelle - Justice</li>
                            <li class="bio-list-item">Accompagnatrice à la scolarité : organisation et animation d’ateliers éducatifs </li>
                           
                            <br>
                            <li class="bio-list-item" style="font-weight: 700; color: #0E5E45 !important">Compétences spécifiques : </li>
                            <li class="bio-list-item">Détection de talents cachés</li>
                            <li class="bio-list-item">Aide au perfectionnement du plan financier intérieur</li>
                            <li class="bio-list-item"> Gestion de projet et organisation d’événements</li>

                            <br>

                            <li class="bio-list-item">Hobbies : le Basket Ball, les livres de développement - perfectionnement personnel, le droit, le yoga et son chat </li>
                    </ul>`
                    )
                }).fadeIn()
                toggle = "marine"
            }
})

fabien.on('click', function(e){
    if(toggle !="fabien"){

        fabien.removeClass('img-unclicked').addClass('img-clicked');

        etienne.addClass('img-unclicked').removeClass('img-clicked');
        christel.addClass('img-unclicked').removeClass('img-clicked');
        marine.addClass('img-unclicked').removeClass('img-clicked');
        maeva.addClass('img-unclicked').removeClass('img-clicked');
        julia.addClass('img-unclicked').removeClass('img-clicked');
    let bio = $("#bio-details");
    titre.fadeOut(200,function(){
        $(this).text("Fabien")
    }).fadeIn()

    
    bio.fadeOut(200,function(){
        $(this).replaceWith(`
                    <ul id="bio-details" class="list-unstyled">
                        <li class="bio-list-item"><span style="color:#1A6496">S</span>pa praticien (massage bien-être et conseil bien-être)</li>
                        <li class="bio-list-item"><span style="color:#D6374C">P</span>hotographe (initiation à la photo-thérapie, portrait, paysage, nature…)</li>
                        <li class="bio-list-item"><span style="color:#51B551">H</span>obbies: photographie, musique, retouche photos, montage vidéo, sport, bien être et passer du temps avec ma famille</li>
                    </ul>`
                    )
                }).fadeIn()
                toggle = "fabien"
            }
})

maeva.on('click', function(e){
    if(toggle !="maeva"){

        maeva.removeClass('img-unclicked').addClass('img-clicked');
        
        etienne.addClass('img-unclicked').removeClass('img-clicked');
        marine.addClass('img-unclicked').removeClass('img-clicked');
        fabien.addClass('img-unclicked').removeClass('img-clicked');
        christel.addClass('img-unclicked').removeClass('img-clicked');
        julia.addClass('img-unclicked').removeClass('img-clicked');
    
    let bio = $("#bio-details");
    titre.fadeOut(200,function(){
        $(this).text("Maeva")
    }).fadeIn()

    
    bio.fadeOut(200,function(){
        $(this).replaceWith(`
                    <ul id="bio-details" class="list-unstyled">
                        <li class="bio-list-item"><span style="color:#1A6496">I</span>nfirmière diplômée d’état</li>
                        <li class="bio-list-item"><span style="color:#D6374C">C</span>onseillère vente à distance (aide, écoute, vente) </li>
                        <li class="bio-list-item"><span style="color:#51B551">C</span>onsultante aménagement d’intérieur et décoration</li>
                        <li class="bio-list-item"><span style="color:#EEDE54">H</span>obbies : mode, déco, voyages</li>
                       
                    </ul>`
                    )
                }).fadeIn()
                toggle = "maeva"
            }
});

julia.on('click', function(e){
    if(toggle !="julia"){

        julia.removeClass('img-unclicked').addClass('img-clicked');

        etienne.addClass('img-unclicked').removeClass('img-clicked');
        marine.addClass('img-unclicked').removeClass('img-clicked');
        fabien.addClass('img-unclicked').removeClass('img-clicked');
        christel.addClass('img-unclicked').removeClass('img-clicked');
        maeva.addClass('img-unclicked').removeClass('img-clicked');

    let bio = $("#bio-details");
    titre.fadeOut(200,function(){
        $(this).text("Julia")
    }).fadeIn()

    
    bio.fadeOut(200,function(){
        $(this).replaceWith(`
                    <ul id="bio-details" class="list-unstyled">
                        <li class="bio-list-item"><span style="color:#1A6496">A</span>nimatrice Socio-culturelle</li>
                        <li class="bio-list-item"><span style="color:#D6374C">D</span>irectrice en devenir (en cours de formation)</li>
                        <li class="bio-list-item"><span style="color:#51B551">C</span>onsultante en relaxation et bien être</li>
                        <li class="bio-list-item"><span style="color:#EEDE54">B</span>énévolat : Aide aux devoirs, animation d'activités à destination des personnes atteintes d’Alzheimer</li>
                        <li class="bio-list-item"><span style="color:#033B45">H</span>obbies : Dessin, lecture, développement personnel, éducation bienveillante, musique, mon amoureux et mes proches</li>
                    </ul>`
                    )
                }).fadeIn()
                toggle = "julia"
            }
});

etienne.on('click', function(e){
    if(toggle !="etienne"){

        etienne.removeClass('img-unclicked').addClass('img-clicked');
        
        marine.addClass('img-unclicked').removeClass('img-clicked');
        fabien.addClass('img-unclicked').removeClass('img-clicked');
        christel.addClass('img-unclicked').removeClass('img-clicked');
        maeva.addClass('img-unclicked').removeClass('img-clicked');
        julia.addClass('img-unclicked').removeClass('img-clicked');
    let bio = $("#bio-details");
    titre.fadeOut(200,function(){
        $(this).text("Etienne")
    }).fadeIn()

    
    bio.fadeOut(200,function(){
        $(this).replaceWith(`
                    <ul id="bio-details" class="list-unstyled">
                        <li class="bio-list-item"><span style="color:#1A6496">D</span>éveloppeur Web (Back-end / Front-end)</li>
                        <li class="bio-list-item"><span style="color:#D6374C">D</span>esigner graphique / Web designer</li>
                        <li class="bio-list-item"><span style="color:#51B551">D</span>iplômé d'une Licence de psychologie (option cognitive)</li>
                        <li class="bio-list-item"><span style="color:#033B45">H</span>obbies: Le développement et la sécurité informatique, le dessin, la science-fiction, les MOOC, Dota 2, Binge watcher Mr Robot</li>
                        <li class="bio-list-item"><span style="color:#51B551">S</span>ite Portfolio: <strong><a href="#">Tavrin.co</a></strong></li>
                    </ul>`
                    )
                }).fadeIn()
                toggle = "etienne"
            }
});
})