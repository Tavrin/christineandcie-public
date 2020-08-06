const express = require("express");
const router  = express.Router();
var validator = require('validator');
const passport = require("passport");
const path = require('path');
const _ = require('lodash');
var db = require("../models");
let middleware = require("../middleware");
const async = require("async");
let {PythonShell} = require('python-shell');
var xss = require("xss");
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');
var Base64 = require('js-base64').Base64;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
var domain = 'mail.christineandcie.fr';
var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_APIKEY, domain: domain});
sgMail.setApiKey(process.env.SG_APIKEY);




//nodemailer

    // create reusable transporter object using the default SMTP transport
    // const transporter = nodemailer.createTransport({
    //     host: 'mail.privateemail.com',
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //         user: "contact@christineandcie.fr", // generated ethereal user
    //         pass: process.env.MAIL_PASS // generated ethereal password
    //     }
    // })

    const transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587, // true for 465, false for other ports
        auth: {
            user: "postmaster@mail.christineandcie.fr", // generated ethereal user
            pass: process.env.MAILGUN_PASS // generated ethereal password
        }
    })
    





router.get("/", function(req, res){
    res.locals.title = "Christine and Cie - Page d'Accueil"; 
    res.render("pages/indexTemporaire");
});

router.get('/*', function(req,res){
   return res.status(404).render("./pages/404")
})

 //mdp oublié
 router.get("/oubli", function(req, res){
    res.locals.title = `Mot de Passe oublié`; 
    res.render('pages/forgot')
 });


 router.post("/oubli", function(req, res){
     async.waterfall([
         function(done){
             crypto.randomBytes(20, function(err,buf){
            let token = buf.toString("hex");
            done(err,token)
            })
        },
        function(token, done){
            console.log(req.body.email)
        db.User.findOne({email : req.body.email}, function(err, user){
            console.log(user)
            if(!user){
                req.flash("error", "cette addresse email n'est associée à aucun compte")
                return res.redirect('/oubli');
            }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000 //1 heure
            user.save(function(err){
                done(err, token, user);
                console.log(user);
            })
        })
    },
    function(token,user,done){
        

    let mailOptions = {
        from: '"Christine and Cie" <contact@mail.christineandcie.fr>', // sender address
        to: user.email, // list of receivers
        subject: 'Demande de modification du mot de passe', // Subject line
        // text: 'Vous avez effectué une demande de réinitialisation de mot de passe, pour l\'effectuer veuillez suivre ce lien ci dessous :', // plain text body
        html: 'Vous avez effectué une demande de réinitialisation de mot de passe, pour l\'effectuer veuillez suivre ce lien ci dessous :<br><a href="https://christineandcie.fr/reset/'+token+'">Cliquer ici</a><br><br> Si vous n\'avez pas fait cette demande merci d\'ignorer ce message. ', // html body
        "o:tag" : 'reset mot de passe'
    };

    // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     console.log(info);
    //     if (error) {
    //         req.flash("error", "Une erreur est survenue, veuillez réessayer")
    //         transporter.close();
    //         return console.log('error ' + error);
           
    //             return res.redirect('back');
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     // Preview only available when sending through an Ethereal account
    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //     transporter.close();
    //     req.flash("success", "Message envoyé ! Vous avez une heure pour modifier votre mot de passe.");
    //     return res.redirect('back');
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });

    mailgun.messages().send(mailOptions, function (error, info) {
        console.log(info);
        if (error) {
            req.flash("error", "Une erreur est survenue, veuillez réessayer")

            return console.log('error ' + error);
           
                return res.redirect('back');
        }


        req.flash("success", "Message envoyé ! Vous avez une heure pour modifier votre mot de passe.");
        return res.redirect('back');

      });
               

    }
     ])
 });

 router.get('/reset/:token', function (req, res) {
    res.locals.title = `Reset du mot de passe`; 
    console.log(req.params.token)
    db.User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
        console.log(user)
        if(!user || user.resetPasswordExpires < Date.now()){
            req.flash("error", "Ce lien est invalide ou le délai de réinitialisation est dépassé")
            return res.redirect('/login');
        }

        res.render("pages/reset",{token:req.params.token});
  })
})

router.post('/reset/:token', function (req, res) {

    db.User.findOne({resetPasswordToken :req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user) {
        if(!user || user.resetPasswordExpires < Date.now()){
            req.flash("error", "Ce lien est invalide ou le délai de réinitialisation est dépassé")
            return res.redirect('/login')
        }
        if(req.body.password === req.body.passwordConfirm) {
            user.setPassword(req.body.password, function(err,userPassword){
                if(err){
                    console.log(err)
                    req.flash('error', 'Une erreur est survenue, veuillez réessayer')
                    return res.redirect('back')
                } else {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;


                    //nodemailer
                    let mailOptions = {
                        from: '"Christine and Cie" <contact@mail.christineandcie.fr>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Modification de mot de passe réussie', // Subject line
                        // text: 'Vous avez effectué une demande de réinitialisation de mot de passe, pour l\'effectuer veuillez suivre ce lien ci dessous :', // plain text body
                        html: '<p>Votre mot de passe a été modifié avec succès. <br><br>Si cette demande n\'est pas provenue de vous, cliquez immédiatement <a href="https://christineandcie.fr/oubli">ICI</a> afin de faire une nouvelle demande de réinitialisation de mot de passe.',
                        "o:tag" : 'confirmation reset mot de passe' // html body
                    };
                    // transporter.sendMail(mailOptions, (error, info) => {
                    //     console.log(info);
                    //     if (error) {
                    //         return console.log('error ' + error);
                    //         req.flash("error", "Une erreur est survenue, veuillez réessayer")
                    //         transporter.close();
                    //             return res.redirect('back');
                    //     }
                    //     console.log('Message sent: %s', info.messageId);
                    //     // Preview only available when sending through an Ethereal account
                    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    //     transporter.close();
                    //     req.flash("success", "Message envoyé !");
                    //     return res.redirect('back');
                    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    // });

                   
                
                    user.save(function(err){
                      
                            mailgun.messages().send(mailOptions, function (error, info) {
                                console.log(info);
                                if (error) {
        
                        
                                    console.log('error ' + error);
                                   

                                }
                                req.flash('success', 'Mot de passe réinitialisé, Connecté')
                                req.login(user, function(err){
                                   
                                return res.redirect('/');
                                })
                                

                        
                              });

                            
                            
                        })
                    }
                })
             } else{
                    req.flash('error', 'Les mots de passe ne correspondent pas')
                   return  res.redirect('/login');
        }

    })
})


//handling login logic
router.get("/login", function(req, res){
    res.locals.title = `Christine and Cie - Connexion`; 
    if(req.isAuthenticated()){
        return res.send("déjà connecté !");
    }
   res.render("pages/login"); 
});


router.post("/login",middleware.limiteRate, passport.authenticate("local", 
    {
        successRedirect: "/",
       failureRedirect: "/login",
       failureFlash: 'Nom d\'Utilisateur ou Mot de Passe erroné'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Deconnecté !");
    res.redirect("/");
 });
 router.get('/health-check', (req, res) => res.sendStatus(200));



//root route



// show register form
router.get("/register",middleware.isLoggedIn,function(req, res){
    res.locals.title = "Création de compte"; 
    if(req.isAuthenticated()){
        console.log("connecté");
        res.send("déjà connecté !");
    }
   res.render("pages/register"); 
});

//handle sign up logic
router.post("/register",middleware.isLoggedIn,function(req, res){
    var newUser = new db.User({username: req.body.username,email:req.body.email});
    db.User.register(newUser, req.body.password, function(err, user){
        if(err){
            if(err.code == 11000){
                req.flash("error", "Cette addresse e-mail est déjà prise");
            return res.redirect("/register");
            }
            if(err.name == "UserExistsError"){
                req.flash("error", "Ce nom d'utilisateur est déjà pris");
            return res.redirect("/register");
            }
            console.log(err);
            req.flash("error", "Une erreur est survenue, veuillez réessayer");
            return res.redirect("/register");
        }
        crypto.randomBytes(20, function(err,buf){
            let token = buf.toString("hex");
            user.secretToken = token;
            user.save(function(err){
                
                let mailOptions = {
                    from: '"Christine and Cie" <contact@mail.christineandcie.fr>', // sender address
                    to: user.email, // list of receivers
                    subject: "Confirmation d'inscription", // Subject line
                    // text: 'Vous avez effectué une demande de réinitialisation de mot de passe, pour l\'effectuer veuillez suivre ce lien ci dessous :', // plain text body
                    html: '<p>Votre inscription sur Christine and Cie est presque terminée ! Il vous suffit de cliquer sur ce lien ci-dessous :<br> <a href="https://christineandcie.fr/confirmation/'+token+'">Confirmer</a>',
                    "o:tag" : 'mail de verification inscription' // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    console.log(info);
                    if (error) {
                        return console.log('error ' + error);
                        req.flash("error", "Une erreur est survenue, veuillez réessayer")
                        transporter.close();
                            return res.redirect('back');
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    transporter.close();
                    req.flash("success", "Message envoyé !");
                    return res.redirect('back');
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
        
                    req.flash("success", "Bienvenue " + user.username + " !");
                    res.redirect("/bienvenue/"+user._id);
                    
                })
       
            })
        
        
    });
});

router.get("/bienvenue/:id",function(req, res){
let id = req.params.id; 
    db.User.findById(id, function(err, user){
        res.locals.title = `Bienvenue ${user.username}`; 
        res.render('pages/bienvenue', {currUser: user})
        })
    })

router.post("/bienvenue/:id",function(req, res){
        let id = req.params.id;
        db.User.findById(id, function(err, user){
            let mailOptions = {
                from: '"Christine and Cie" <contact@mail.christineandcie.fr>', // sender address
                to: user.email, // list of receivers
                subject: "Confirmation d'inscription", // Subject line
                // text: 'Vous avez effectué une demande de réinitialisation de mot de passe, pour l\'effectuer veuillez suivre ce lien ci dessous :', // plain text body
                html: `<p>Votre inscription sur Christine and Cie est presque terminée ! Il vous suffit de cliquer sur ce lien ci-dessous :<br>
                <form method="POST" action> </form> <a href="https://christineandcie.fr/confirmation/`+user.secretToken+`">Confirmer</a>` // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                console.log(info);
                if (error) {
                    return console.log('error ' + error);
                    req.flash("error", "Une erreur est survenue, veuillez réessayer")
                    transporter.close();
                        return res.redirect('back');
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                transporter.close();
                req.flash("success", "Message envoyé !");
                return res.redirect('back');
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            })

       
            
    })

router.get("/confirmation/:token",function(req, res){
    res.locals.title = `Confirmation de Token`; 
    let token = req.params.token;
    console.log(token)
    db.User.findOne({secretToken: token}, function(err, user){
        if(err){
           
            return res.render("pages/confirm",{error:  "Une erreur est survenue !"})
           
          } 
        if(!user){
            return res.render("pages/confirm",{error:  "Ce token n'est associé à aucun compte ou bien celui-ci a déjà été activé, si cela est le cas connectez vous <a href='/login'>ICI</a>"} )
        }
        user.active = true;
        user.secretToken = undefined;
         let apiKey = Base64.encodeURI(uuidv4())
        user.keyId = apiKey;
       
        crypto.randomBytes(24, function(err,buf){
           let apiSecret = buf.toString("hex");
           console.log(apiSecret)
           bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(apiSecret, salt, function(err, hash) {
                user.keySecret = hash;
                user.save(function(err){

                    return  res.render("pages/confirm",{currUser:user, success: "Inscription réussie !"});
                   
                    
        
        
                })
            });
        });
        })
        
      
    })
})
// router.get("/formations", function(req, res){
//     res.render("pages/formations"); 
//  });
 
 router.get("/bunker", function(req, res){
    res.locals.title = `Bunker`; 
    res.render("pages/bunker"); 
 });

 router.post("/contactSave",function(req,res){
    // var list = mailgun.lists(`newsletter@${domain}`);
    // var member = {
    //     subscribed: true,
    //     address: req.body.email,
    //     name: req.body.nom
    //     }
    //     list.members().create(member, function (error, data) {
            
    //         console.log(data);
    //         console.log("-------------------------------");

            var newContact = {name: req.body.nom, email: req.body.email}
            // console.log(newContact)
            db.Contact.findOne({email:req.body.email})
            .then( function(found, err){
                if(err){
                    console.log(err)
                }
                if(found){
                    req.flash("error", "Cette adresse email est déjà inscrite dans la newsletter !");
                    return res.redirect("/formations");
                   
                }
                else{

                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var bool = re.test(String(req.body.email).toLowerCase());
    if(bool === false || !req.body.nom || req.body.nom == null || req.body.nom == undefined || req.body.nom.length < 4 || req.body.nom.length > 20 ){
        req.flash("error", `Nom ou email invalide ! Le nom doit se situer entre 4 et 20 caractères`);
        return res.redirect("/");
    }
                    db.Contact.create(newContact, function(err, newlyCreated){
                        if(err){
                            console.log(err);
                            req.flash("error", "Un problème est survenu !");
                            return res.redirect("/");
                            
                        } else {
                      
                            // console.log(newlyCreated);
                            // console.log("success")
                            req.flash("success", "Inscription réussie !");
                        return res.redirect("/guide-gratuit");
                           
                            
                            }
                        });
                }
                
            })
    
        //   });
    
    
    
 })

 router.get("/guide-gratuit", function(req,res){
    res.locals.title = `Guide Gratuit`; 
    res.render('pages/formations/bunker/ebookpage')
})

 router.get("/settings", middleware.isLoggedIn,function(req,res){
    db.User.findById(id, function(err, currUser){
        res.locals.title = `Préférences`; 
    res.render("pages/profile", {user: currUser});
    })
})
//send mail
router.post("/sendmail", middleware.isLoggedIn,function(req,res){
    const admMsg = {
        email : xss(req.body.email),
        subject : xss(req.body.subject),
        name : xss(req.body.name),
        message : xss(req.body.message)
    }
    const msg = {
        to: 'etienne.doux@gmail.com',
        from: xss(req.body.email),
        subject: 'Message de la part de :'+ xss(req.body.name),
        html: xss(req.body.message)
      };
    db.Message.create(admMsg, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            sgMail.send(msg);
            req.flash("success", "Message envoyé !");
         res.redirect("/");
            }
        })
     
})
//show login form


router.get('/utilisateurs/:id',function(req,res){
    res.locals.title = `Profil`; 
    db.User.findById(req.params.id)
    .exec()
    .then(function(foundUser){
        return res.render('pages/profil', {user:foundUser})
    })
    .catch(function(err){
        return res.redirect("/404")
    })
    
  })

  

 

  router.get('/contact', middleware.isLoggedIn,function(req,res){
    res.locals.title = `Contact`; 
    res.render('pages/contact')
  })

  router.get('/a-propos', function(req,res){
    res.locals.title = `Christine and Cie - A propos`; 
    res.render('pages/about')
  })

  router.get('/infos', middleware.isLoggedIn,function(req,res){
    res.locals.title = `Infos`; 
    res.render('pages/infos')
  })


  router.get('/mentions',function(req,res){
    res.locals.title = `Mentions Légales`; 
    res.render('pages/mentions')
  })




module.exports = router;