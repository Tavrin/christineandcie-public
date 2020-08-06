const express = require("express");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const router  = express.Router();
const passport = require("passport");
const crypto = require('crypto');
const readChunk = require('read-chunk');
const fileType = require('file-type');
var bcrypt = require('bcryptjs');
// var salt = bcrypt.genSaltSync(10);
var db = require("../models");
let middleware = require("../middleware");
var base64Img = require('base64-img');
const path = require('path')
const mv = require('mv');
const fileUpload = require('express-fileupload');
const del = require('del');
var xss = require("xss");
var Base64 = require('js-base64').Base64;
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');

//nodemailer

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "contact@christineandcie.fr", // generated ethereal user
            pass: process.env.MAIL_PASS // generated ethereal password
        }
    })

    router.get("/", middleware.isLoggedIn,function(req,res){
        res.locals.title = `Paramètres`; 
        res.redirect("/parametres/profil");
    })
    
    router.get("/profil", middleware.isLoggedIn,function(req,res){
        res.locals.title = `Paramètres`; 
        req.session.canModifyProfile = {bool :true, time : Date.now()};
        db.User.findById(req.user._id)
        .exec()
        .then(function(user){
            return res.render("pages/parametres/profil",{user:user});
        })
        
    })

    router.post("/profil", middleware.isLoggedIn, function(req,res){

        // console.log(req.session)
        console.log("calcul : " + (Date.now() - req.session.canModifyProfile.time) + ` bool is ${req.session.canModifyProfile.bool}`)

        if(!req.session.canModifyProfile || req.session.canModifyProfile.bool != true || Date.now() - req.session.canModifyProfile.time < 3000 ){
            console.log(req.session.canModifyProfile.bool)
            req.session.canModifyProfile.bool = false;
             req.flash("error", "Veuillez attendre la mise à jour du profil")
            return res.redirect("/parametres/profil")
            
        }

        else if (req.session.canModifyProfile.bool == true){
            
        db.User.findById(req.user._id)
        .exec()
        .then(function(user){
            // console.log(user)

                user.realName = xss(req.body.realName);


                user.bio = xss(req.body.bio);

                user.location = xss(req.body.location);


                user.url = xss(req.body.url);

            if(req.files && req.files.avatar && req.session.canModifyProfile.bool == true){
                console.log(req.session.canModifyProfile)
                req.session.canModifyProfile.bool = false;

               if(req.session.canModifyProfile.bool == false){
                console.log(req.session.canModifyProfile)
                let file =  req.files.avatar.data;
                if(!file || file == null || fileType(file)== null){
                    req.flash("error", "Le type de fichier de l'image n'est pas autorisé")
                    return res.redirect('/parametres/profil')
                }
                else{
                    
                
                if(!(fileType(file).ext ==='png' || fileType(file).ext === 'jpg')&& !(fileType(file).mime === 'image/png' || fileType(file).mime === 'image/jpeg' )){
                    req.flash("error", "Le type de fichier de l'image n'est pas autorisé")
                    return res.redirect('/parametres/profil')
                }
                else{
                    let fileExt = fileType(file).ext
                    // console.log(req.files.avatar)
                if(user.avatar){
                    del((path.join(__dirname,"../public",user.avatar))).then(paths => {
                        let avatar = req.files.avatar;
                        // console.log(avatar)
                    var thumbTitle = Date.now()
                    avatar.mv((path.join(__dirname,'../public/upload/img-profil/'+thumbTitle+'.'+fileExt)), function(err) {
                
                    user.avatar = '/upload/img-profil/'+thumbTitle+'.'+fileExt
                    user.save()
                    // return res.redirect("/parametres/profil")
                    })
                })
                }
                else{
                    let avatar = req.files.avatar;
                        // console.log(avatar)
                    var thumbTitle = Date.now()
                    avatar.mv((path.join(__dirname,'../public/upload/img-profil/'+thumbTitle+'.'+fileExt)), function(err) {
                
                    user.avatar = '/upload/img-profil/'+thumbTitle+'.'+fileExt
                    user.save()
                    // return res.redirect("/parametres/profil")

                })
            }
            user.save()
            return res.redirect("/parametres/profil")
                }
            }
          }
          else{
              console.log(req.session.canModifyProfile)
            req.session.canModifyProfile = false;
            req.flash("error", "Veuillez attendre la mise à jour du profil 2")
           return res.redirect("/parametres/profil")

          }
        }
        else{
            user.save()
            return res.redirect("/parametres/profil")
        }
        
    })
        .catch(function(err){
            console.log(err)
        })
        
        

       
    }
    })


router.get('/compte', middleware.isLoggedIn, function(req,res){
    res.locals.title = `Paramètres`; 
    db.User.findById(req.user._id)
        .exec()
        .then(function(user){
            return res.render("pages/parametres/compte",{user:user});
        })
})

router.post('/compte', middleware.isLoggedIn, function(req,res){
    db.User.findById(req.user._id)
        .exec()
        .then(function(user){
            if(req.body.newPassword === req.body.newPasswordConfirm){
                if(req.body.oldPassword=== req.body.newPassword){
                    req.flash("error","Le nouveau mot de passe ne peut pas être similaire à l'ancien")
                    return res.redirect("/parametres/compte")
                }
                user.changePassword(req.body.oldPassword, req.body.newPassword, function(err,userPass){
                    if(err){
                        console.log(err)
                        req.flash("error","Mot de passe erroné")
                        return res.redirect("/parametres/compte")
                    }
                    user.save()
                    console.log(userPass)
                    req.flash("success","Mot de passe modifié avec succès")
                    return res.redirect("/parametres/compte")

                } )
            }
            else{
                req.flash('error', 'Les mots de passe ne correspondent pas')
               return  res.redirect('/parametres/compte');
            }
        })
})

router.get('/developpeurs', middleware.isLoggedIn, function(req,res){
    res.locals.title = `Paramètres`; 
    db.User.findById(req.user._id)
        .exec()
        .then(function(user){
            if(!user.isDev){
                return res.redirect("/parametres/profil")
            }
            else{
                return res.render("pages/parametres/developpeurs",{user:user});
            }
            
        })
})

router.get('/auth/configure/setCookie', middleware.isLoggedIn, function(req,res){
    res.cookie('paramSigned', 'true' +req.user._id,{expires: new Date(Date.now() + 300000),httpOnly:true, signed: true});
    return res.send("cookie set")
})
router.get('/auth/configure', middleware.isLoggedIn, function(req,res){
    console.log(req.cookies)
    console.log('--------------------')
    console.log(req.signedCookies)
    if(!req.signedCookies.paramSigned || req.signedCookies.paramSigned != "true" + req.user._id || req.signedCookies.paramSigned === false){
        req.session.hasTotp = false;
        console.log(req.session)
       
        return res.send("no cookie")
       
    }
    else{
        console.log(req.session)
        return res.send("ok")
    }
    res.locals.title = `Configuration de l'authentification à deux étapes`; 
    
    db.User.findById(req.user._id)
        .exec()
        .then(function(user,err){
            if(err){
                res.send("erreur")
                return console.log(err)
            }
            else{
                // console.log(user)
                // res.cookie('paramSigned', 'true',{expires: new Date(Date.now() + 300000),httpOnly:true});
                return res.render("pages/parametres/auth/configure",{user:user});
            }
            
        })
})


    module.exports = router;