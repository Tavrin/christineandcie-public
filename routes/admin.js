const express = require("express");
const router  = express.Router();
const passport = require("passport");
var db = require("../models");
let middleware = require("../middleware");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_APIKEY);
const octokit = require('@octokit/rest')({
  debug: true
});
const bodyParser  = require("body-parser");
var domain = 'mail.christineandcie.fr';
var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_APIKEY, domain: domain});
var moment = require('moment');
moment.locale('fr');
octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
})


router.get('/',middleware.isLoggedAdmin, function(req,res){
  res.locals.title = `Admin - Tableau de Bord`; 
    db.Blogpost
    .count().exec(function(err, blogcount) {
            db.Contact
            .count().exec(function(err, contactCount) {
              db.Message
              .count().exec(function(err, messagecount) {
              if(err){
                  console.log(err);
              } else {   
                  res.render('pages/admin/index',{blogCount:blogcount, contactCount:contactCount, messageCount:messagecount})
                  }    
        })
      })
    })
  })



  router.get('/dashboard', middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Tableau de Bord`;
    res.render('pages/admin/dashboard')
  })

  router.get('/membres', middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Membres`;
    db.User
    .find({})
    .sort({date: 'descending'})
    .exec(function(err, allMembers){
    res.render('pages/admin/membres',{
        members:allMembers, 
        moment: moment})
    })
  })

  router.get('/blog', middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Blog`;
    res.render('pages/admin/blog')
  })


  router.get('/changelog', middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Changelog du site`;
    octokit.repos.getCommits({
      owner: 'Tavrin',
      repo: 'christine-et-cie',
      since: "2018-05-03T15:13:11Z",
      per_page: 100
    }).then(({data, headers, status}) => {
      res.render("pages/admin/changelog",{data:data,moment:moment});
    }).catch((message) => {
      res.send(message);
    })
    
  })

  router.get("/messagerie", middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Messagerie`;
    db.Message
    .find({})
    .sort({date: 'descending'})
    .exec(function(err, allMessages){
    res.render('pages/admin/messagerie',{
        messages:allMessages, 
        moment: moment})
    })
  })

  router.get("/formations", middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Formations`;
    db.Formation
    .find({})
    .populate("categories")
    .sort({date: 'descending'})
    .exec()
    .then(function(allFormations, err){

      // console.log(allFormations)
    res.render('pages/admin/formations', {
      formations : allFormations, 
      moment: moment
      })
    })
  })

  router.get("/formations/new", middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Nouvelle Formation`;
    res.render('pages/formations/new')
  })

  router.get("/formations/:id/modules/new", middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Nouveau Module`;
    db.Formation
    .findById(req.params.id)
    .exec()
    .then(function(formation, err){

    res.render('pages/modules/new', {
      formation : formation, 
      moment: moment
      })
    })
  })

  router.get("/formations/:id/modules/:moduleId/edit", middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Editer Module`;
    db.Module
    .findById(req.params.moduleId)
    .exec()
    .then(function(mod, err){

    res.render('pages/modules/edit', {
      module : mod, 
      moment: moment
      })
    })
  })

  router.get("/formations/:id", middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Formation`;
    db.Formation
    .findById(req.params.id)
    .populate("modules")
    .sort({date: 'descending'})
    .exec()
    .then(function(formation, err){

    res.render('pages/formations/edit', {
      formation : formation, 
      moment: moment
      })
    })
  })

 
  // router.post("/formations/:id", middleware.isLoggedAdmin,function(req,res){
  //   console.log('id =' + req.params.id)
  //   db.Formation
  //   .findById(req.params.id)
  //   .populate("categories")
  //   .sort({date: 'descending'})
  //   .exec()
  //   .then(function(formation, err){

  //   res.render('pages/admin/formation', {
  //     formation : formation, 
  //     moment: moment
  //     })
  //   })
  // })

  router.get('/mailData', middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - MailData`;
    db.Contact
    .find({})
    .sort({date: 'descending'})
    .exec(function(err, allContacts){
    res.render('pages/admin/mailData',{
        contacts:allContacts, 
        moment: moment})
    })
  })

  router.get('/listData', middleware.isLoggedAdmin,function(req,res){
    res.locals.title = `Admin - Liste de Contacts`;
    var list = mailgun.lists(`newsletter@${domain}`);
    // console.log(list)
    db.Contactlist
    .find({})
    .populate("contacts")
    .sort({date: 'descending'})
    .exec(function(err, allLists){
      // list.members().list(function (err, members) {
        // console.log(members)
        res.render('pages/admin/listesContacts',{
          lists:allLists, 
          moment: moment})
      });
    // res.render('pages/admin/listesContacts',{
    //     lists:allLists, 
    //     moment: moment})
    // })
  })

  module.exports = router;