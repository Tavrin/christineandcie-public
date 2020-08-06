
	
$.ajaxSetup({global:true});

$.when( $.ready ).then(function() {
	var $loading = $('#spinner').hide();
	$(document).ajaxStart(function(){
		$loading.show();
	});
	$(document).ajaxComplete(function(){
		$loading.hide();
	});
	$(document).ajaxError(function(){
		$loading.hide();
	});
	var scrollTop = 0;
	$('#mainNav').removeClass('nav-perso');
	$(window).scroll(function(){

		scrollTop = $(window).scrollTop();
		if (scrollTop > 50) {
			$('#brand-quote').addClass('smaller')
			$('#mainNav').addClass('nav-perso');
			$('#profile-picture').addClass('picture-scrolled');
			$('#icone-stock').addClass('icone-stock-scrolled');
		  } else if (scrollTop <=50) {
			$('#brand-quote').removeClass('smaller')
			$('#mainNav').removeClass('nav-perso');
			$('#profile-picture').removeClass('picture-scrolled');
			$('#icone-stock').removeClass('icone-stock-scrolled');
		  } 
	})
	

	$("button.navbar-toggle").click(function(){
        $("button.navbar-toggle").toggleClass("collapse");
    });
    $("#bouton-hero").click( function(){
        $('html, body').animate({
            scrollTop: $("#zone-about").offset().top-100}, 1000);
    });




});

