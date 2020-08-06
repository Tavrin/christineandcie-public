var express = require("express");
var router  = express.Router();
var db = require("../models");
var middleware = require("../middleware");
const path = require('path')
var helpers = require("../helpers");
const passport = require("passport");



//EMAIL
router.route('/email/reply')
    .post(helpers.email.createMessage)

// ARTICLES
router.route('/articles')
    .get( helpers.blogposts.getBlogposts)
    .post( middleware.isLoggedAdminApi,helpers.blogposts.createBlogpost)

router.route('/articles/:blogpostId')
    .get(middleware.lookupArticle, helpers.blogposts.getBlogpost)
    .put(middleware.isLoggedAdminApi,middleware.lookupArticle, helpers.blogposts.updateBlogpost)
    .delete(middleware.isLoggedAdminApi,middleware.lookupArticle, helpers.blogposts.deleteBlogpost)

// UTILISATEURS
router.route('/users')
    .get(middleware.isLoggedAdminApi, helpers.users.getUsers)
    .post(middleware.isLoggedAdminApi,helpers.users.createUser)

router.route('/users/:userId')
    .get(middleware.isLoggedAdminApi,middleware.lookupUser, helpers.users.getUser)
    .put(middleware.isLoggedAdminApi,middleware.lookupUser, helpers.users.updateUser)
    .delete( middleware.isLoggedAdminApi,middleware.lookupUser, helpers.users.deleteUser)

router.post('/users/:userId/userKey', middleware.isLoggedIn, helpers.users.updateKey)

//CONTACTS MAIL
router.route('/contacts')
    .get(middleware.isLoggedAdminApi,helpers.contacts.getContacts)
    .post( middleware.isLoggedAdminApi,helpers.contacts.createContact)

router.route('/contacts/:contactId')
    .get( middleware.isLoggedAdminApi,helpers.contacts.getContact)
    .put( middleware.isLoggedAdminApi,helpers.contacts.updateContact)
    .delete( middleware.isLoggedAdminApi,helpers.contacts.deleteContact)

//LISTES DE CONTACTS
router.route('/lists')
    .get( middleware.isLoggedAdminApi,helpers.lists.getLists)
    .post( middleware.isLoggedAdminApi,helpers.lists.createList)

router.route('/lists/:listId/contacts/')
    .get( middleware.isLoggedAdminApi,helpers.lists.getContacts)

router.route('/lists/:listId/contacts/:contactId')
    .get( middleware.isLoggedAdminApi,helpers.lists.getContact)
    
    // .put( helpers.lists.updateList)
    .delete( middleware.isLoggedAdminApi,helpers.lists.deleteContact)

router.route('/lists/:listId')
    .get( middleware.isLoggedAdminApi,helpers.lists.getList)
    .post( middleware.isLoggedAdminApi,helpers.lists.addContact)
    .put( middleware.isLoggedAdminApi,helpers.lists.updateList)
    .delete( middleware.isLoggedAdminApi,helpers.lists.deleteList)

//FORMATIONS
router.route('/formations')
    .get(middleware.isLoggedInApi, helpers.formations.getFormations)
    .post(middleware.isLoggedAdminApi, helpers.formations.createFormation)

router.route('/formations/:formationId')
    .get(middleware.isLoggedInApi, middleware.lookupFormation, helpers.formations.getFormation)
    .put(middleware.isLoggedAdminApi, middleware.lookupFormation, helpers.formations.updateFormation)
    .delete(middleware.isLoggedAdminApi, middleware.lookupFormation, helpers.formations.deleteFormation)
    .post( middleware.isLoggedAdminApi, middleware.lookupFormation, helpers.formations.addMember)

router.route('/formations/:formationId/members')
    .get( middleware.isLoggedAdminApi,middleware.lookupFormation,helpers.formations.getMembers)
    .post( middleware.isLoggedAdminApi, middleware.lookupFormation, helpers.formations.addMember)

    // var moduleUpload = upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }])

router.route('/formations/:formationId/modules')
    .get( middleware.lookupFormation,helpers.formations.getModules)
    .post( middleware.isLoggedAdminApi,helpers.formations.createModule)

router.route('/formations/:formationId/members/:memberId')
    .get( middleware.isLoggedAdminApi,middleware.lookupFormation,helpers.formations.getMember)
    .put( middleware.isLoggedAdminApi,helpers.formations.updateMember)
    .delete( middleware.isLoggedAdminApi,helpers.formations.deleteMember)

  
router.route('/formations/:formationId/modules/:moduleId')
    .get( middleware.lookupFormation,helpers.formations.getModule)
    .put( middleware.isLoggedAdminApi,helpers.formations.updateModule)
    .delete( middleware.isLoggedAdminApi,helpers.formations.deleteModule)




router.route('/*', function(req,res){
    res.status(404).json({erreur:"Ce lien est invalide"})
})
module.exports = router;

