const express = require("express");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const fs = require('fs');
const router  = express.Router();
var validator = require('validator');
const passport = require("passport");
const path = require('path');
const _ = require('lodash');
var db = require("../models");
let middleware = require("../middleware");
const mv = require('mv');
const fileType = require('file-type');
const fileUpload = require('express-fileupload');
const del = require('del');
var xss = require("xss");
var Base64 = require('js-base64').Base64;


router.get("/", function(req,res){
    res.locals.title = `Mes Formations`; 
    res.render('pages/formations/index')
})

router.get("/bunker", function(req,res){
    res.locals.title = `Bunker`; 
    res.render('pages/formations/bunker/marketingPage')
})

router.get("/kit-de-survie", function(req,res){
    res.locals.title = `Kit de Survie`; 
    res.render('pages/formations/kitSurvie/marketingPage')
})

// router.get("/bunker/ebook", function(req,res){
//     res.render('pages/formations/bunker/ebookpage')
// })

router.post("/:id", middleware.isLoggedAdmin, function(req,res){
    let formationId = req.params.id
    db.Formation.findById(formationId)
    .exec()
    .then(function(formation){
        // console.log(user)
        console.log(formation)
        formation.name = xss(req.body.name);


        formation.description = xss(req.body.description);

        formation.type = xss(req.body.type);

        if(req.files && req.files.thumbnail){
            if (!fs.existsSync(path.join(__dirname,'../public/upload/formations/'+formation._id))){
                fs.mkdirSync(path.join(__dirname,'../public/upload/formations/'+formation._id));
            }
            let file =  req.files.thumbnail.data;
            if(!(fileType(file).ext ==='png' || fileType(file).ext === 'jpg')&& !(fileType(file).mime === 'image/png' || fileType(file).mime === 'image/jpeg')){
                console.log(fileType(file).ext)
                req.flash("error", "Le type de fichier de l'image n'est pas autorisé")
                return res.redirect("/admin/formations/" + formationId)
            }
            else{
                let fileExt = fileType(file).ext
                console.log(req.files.thumbnail)
            if(formation.thumbnail){
                if(formation.thumbnail != "/upload/placeholder.png"){
                    del((path.join(__dirname,"../public",formation.thumbnail))).then(paths => {
                        let thumbnail = req.files.thumbnail;
                        console.log(thumbnail)
                    var thumbTitle = Date.now()
                    thumbnail.mv((path.join(__dirname,'../public/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt)), function(err) {
                
                        formation.thumbnail = '/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt
                    formation.save()
                    // return res.redirect("/parametres/profil")
                    })
                })
                }
                else{
                    let thumbnail = req.files.thumbnail;
                        console.log(thumbnail)
                    var thumbTitle = Date.now()
                    thumbnail.mv((path.join(__dirname,'../public/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt)), function(err) {
                
                        formation.thumbnail = '/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt
                    formation.save()
                    // return res.redirect("/parametres/profil")
                    })
                }
                
            }
            else{
                let thumbnail = req.files.thumbnail;
                    console.log(thumbnail)
                var thumbTitle = Date.now()
                thumbnail.mv((path.join(__dirname,'../public/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt)), function(err) {
            
                    formation.thumbnail = '/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt
                    formation.save()
                // return res.redirect("/parametres/profil")

            })
        }
        formation.save()
        req.flash("success","Formation modifiée avec succès")
        return res.redirect("/admin/formations/" + formationId)
            }
            
    }
    else{
        formation.save()
        req.flash("success","Formation modifiée avec succès")
        return res.redirect("/admin/formations/" + formationId)
    }


        // formation.save()
        // req.flash("success","Formation modifiée avec succès")
        // return res.redirect("/admin/formations/" + formationId)
    
})
    .catch(function(err){
        console.log(err)
    })
    
})


router.get('/mes-formations', middleware.isLoggedIn, function(req, res){
    res.locals.title = `Mes Formations`; 
    db.User.findById(req.user._id)
    .populate("formations")
    .exec()
    
    .then(function(foundUser){
        return res.render('pages/mes-formations', {user:foundUser})
    })
})

router.get('/mes-formations/:id', middleware.isLoggedIn, function(req, res){
    db.User.findById(req.user._id)
    .exec()
    .then(function(foundUser){

        var index = _.find(foundUser.formations, function(ch) {
            return ch ==  req.params.id ;
    })

    if(index!=undefined || foundUser.isAdmin === true){
        db.Formation.findById(req.params.id)
                .populate("modules")
                .then(function(formation){
                    return res.render('pages/maFormation',{formation:formation})
                })
                .catch(function(err){
                    console.log(err)
                })
                
    }
    else{
        req.flash("error", "Accès interdit")
                return res.redirect("/") 
    }


        
        
        
        
    })
})

router.get('/mes-formations/:id/ressources', middleware.isLoggedIn, function(req, res){
    db.User.findById(req.user._id)
    .exec()
    .then(function(foundUser){

        var index = _.find(foundUser.formations, function(ch) {
            return ch ==  req.params.id ;
    })

    if(index!=undefined || foundUser.isAdmin === true){
        db.Formation.findById(req.params.id)
                .populate("modules")
                .then(function(formation){
                    return res.render('pages/formations/ressources',{formation:formation})
                })
                .catch(function(err){
                    console.log(err)
                })
                
    }
    else{
        req.flash("error", "Accès interdit")
                return res.redirect("/") 
    }
    })
})

router.get('/mes-formations/:id/messages', middleware.isLoggedIn, function(req, res){
    db.User.findById(req.user._id)
    .exec()
    .then(function(foundUser){

        var index = _.find(foundUser.formations, function(ch) {
            return ch ==  req.params.id ;
    })

    if(index!=undefined || foundUser.isAdmin === true){
        db.Formation.findById(req.params.id)
                .populate("modules")
                .then(function(formation){
                    return res.render('pages/formations/messages',{formation:formation})
                })
                .catch(function(err){
                    console.log(err)
                })
                
    }
    else{
        req.flash("error", "Accès interdit")
                return res.redirect("/") 
    }
    })
})

router.get('/mes-formations/:id/news', middleware.isLoggedIn, function(req, res){
    db.User.findById(req.user._id)
    .exec()
    .then(function(foundUser){

        var index = _.find(foundUser.formations, function(ch) {
            return ch ==  req.params.id ;
    })

    if(index!=undefined || foundUser.isAdmin === true){
        db.Formation.findById(req.params.id)
                .populate("modules")
                .then(function(formation){
                    return res.render('pages/formations/news',{formation:formation})
                })
                .catch(function(err){
                    console.log(err)
                })
                
    }
    else{
        req.flash("error", "Accès interdit")
                return res.redirect("/") 
    }
    })
})
// router.get('/mes-formations/:id/modules/moduleId', middleware.isLoggedIn, function(req, res){
//     db.User.findById(req.user._id)
//     .exec()
//     .then(function(foundUser){

//         var index = _.find(foundUser.formations, function(ch) {
//             return ch ==  req.params.id ;
//     })

//     if(index!=undefined){
//         db.Formation.findById(req.params.id)
//                 .populate("modules")
//                 .then(function(formation){
//                     return res.render('pages/maFormation',{formation:formation})
//                 })
//                 .catch(function(err){
//                     console.log(err)
//                 })
                
//     }
//     else{
//         req.flash("error", "Accès interdit")
//                 return res.redirect("/") 
//         }        
        
//     })
// })


router.post("/", middleware.isLoggedAdmin, function(req,res){
        let newformation = {}
        newformation.name = xss(req.body.name);


        newformation.description = xss(req.body.description);

        newformation.type = xss(req.body.type);

        db.Formation.create(newformation)
    .then(function(formation){

        if (!fs.existsSync(path.join(__dirname,'../public/upload/formations/'+formation._id))){
            fs.mkdirSync(path.join(__dirname,'../public/upload/formations/'+formation._id));
        }

        if(req.files && req.files.thumbnail){
            
            let file =  req.files.thumbnail.data;
            if(!(fileType(file).ext ==='png' || fileType(file).ext === 'jpg')&& !(fileType(file).mime === 'image/png' || fileType(file).mime === 'image/jpeg')){
                console.log(fileType(file).ext)
                req.flash("error", "Le type de fichier de l'image n'est pas autorisé")
                return res.redirect("/admin/formations/" + formation._id)
            }
            else{
                let fileExt = fileType(file).ext
                console.log(req.files.thumbnail)

                let thumbnail = req.files.thumbnail;
                var thumbTitle = Date.now()
                thumbnail.mv((path.join(__dirname,'../public/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt)), function(err) {
            
                    formation.thumbnail = '/upload/formations/'+formation._id + '/' + thumbTitle+'.'+fileExt
                    formation.save()
                // return res.redirect("/parametres/profil")

            })
        
        formation.save()
        req.flash("success","Formation créée avec succès")
        return res.redirect("/admin/formations/" + formation._id)
            }
            
    }
    else{
        formation.save()
        req.flash("success","Formation créée avec succès")
        return res.redirect("/admin/formations/" + formation._id)
    }

        
    })
    .catch(function(err){
        console.log(err)
    })

        
    

        // formation.save()
        // req.flash("success","Formation modifiée avec succès")
        // return res.redirect("/admin/formations/" + formationId)
    

    // .catch(function(err){
    //     console.log(err)
    // })
    
    

   
   
})

module.exports = router;