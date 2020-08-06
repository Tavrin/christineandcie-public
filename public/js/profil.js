$.when( $.ready ).then(function() {
let profileLevel = $('#userLevel')
console.log(profileLevel.text())
if(profileLevel.text() === "developpeur"){
    profileLevel.css( "color","#dc3545")
}
if(profileLevel.text() === "admin"){
    profileLevel.css( "color","#0062cc")
}
if(profileLevel.text() === "coach"){
    profileLevel.css( "color","#0bbb25")
}
})