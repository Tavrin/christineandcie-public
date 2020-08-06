var express = require("express");
var router  = express.Router();
var db = require("../models");
var middleware = require("../middleware");
const bodyParser  = require("body-parser");
var moment = require('moment');
moment.locale('fr');
const fileUpload = require('express-fileupload');
// var helpers = require("../helpers/blogposts");



router.post("/", middleware.isLoggedIn, function(req, res){

  // get data from form and add to campgrounds array

var title = req.body.title;
// var thumbnail = req.body.thumbnail;
var thumbnail = req.files.thumbnail;
var content = req.body.content;

sampleFile.mv('../public/upload/img/'+title+'.jpg', function(err) {
  if (err)
    return res.status(500).send(err);

var thumblink = '../public/upload/img/'+title+'.jpg'
var newBlogpost = {title: title, thumbnail: thumblink, content: content}

  // Create a new campground and save to DB

  db.Blogpost.create(newBlogpost, function(err, newlyCreated){
  if(err){
      console.log(err);
  } else {

      // redirect back to campgrounds page
      console.log(title);
      console.log(content);
      console.log("image: " +thumbnail);
      console.log(newlyCreated);
      // res.redirect("/blog");
      }
  });
})

// var author = {
//     id: req.user._id,
//     username: req.user.username
// }

});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res){
  res.locals.title = `Nouvel Article`; 
res.render("pages/blog/new"); 
});

router.get("/view/:id", function(req, res){
  // res.locals.title = `Article de Blog`; 
  console.log("id: " + req.params.id)
  db.Blogpost
  .findById(req.params.id)
  .populate("author")
  .exec(function(err, foundBlogpost){
    if(foundBlogpost){
      return res.render("pages/blog/show", {blogpost: foundBlogpost, moment: moment });
  }
      else{
        req.flash('error', "Cet article n'existe pas");
        return res.redirect("/blog/1")
      }
  })
  });
  
  router.get("/:id/editer", middleware.isLoggedIn,function(req, res){
    res.locals.title = `Edition d'article de Blog`; 
    db.Blogpost.findById(req.params.id)
    .populate("author")
    .exec( function(err, foundBlogpost){
      if(foundBlogpost){
        return res.render("pages/blog/edit", {blogpost: foundBlogpost});
      }
     else{
       req.flash("error", "Cette page n'existe pas");
       res.redirect('back');
     }
    })
        
    
});
router.get('/', function(req, res,next){
  res.locals.title = `Blog de Christine and Cie`; 
  res.redirect("/blog/1")
})
router.get('/tag/:tag/:page', function(req, res,next){
 
  var tag = req.params.tag;
  var perPage = 6
  var page = req.params.page || 1
  res.locals.title = `Blog de Christine and Cie - ${tag}`; 
    db.Blogpost
    .find({tags: tag})
    .populate("author")
    .sort({date: 'descending'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, allBlogposts){
      if (err){
       return res.send(err)
      }
      if(allBlogposts.length == 0 ){
        return  res.redirect("/blog/1")
      }
      db.Blogpost.count()
      .exec(function(err, count) {
        if(err){
          console.log(err);
        } else {
          console.log(allBlogposts)
          return res.render('pages/blog/tags',
           {
            blogposts:allBlogposts, 
            moment: moment,
            current: page,
            pages: Math.ceil(count / perPage),
            tag: tag
          })
        }
      }) 
    })
});

router.get('/tag/:tag/', function(req, res,next){
  res.locals.title = `Blog de Christine and Cie`; 
  var tag = req.params.tag
  db.Blogpost
    .find({tags: tag})
    .exec(function(err,allBlogposts){
      if(allBlogposts.length > 0 ){
       return res.redirect(`/blog/tag/${tag}/1`)
      }
      else{
        return res.redirect("/blog/1")
      }
    })
  
})

router.get('/categorie/:category/:page', function(req, res,next){
 
  var category = req.params.category;

  if(category != "lifestyle" && category != "sante" && category != "bien-etre" && category != "travail" & category != "sport" && category != "beaute"){
    return res.redirect("/blog/1")
   }

  var perPage = 6
  var page = req.params.page || 1
  res.locals.title = `Blog de Christine and Cie - ${category}`; 
    db.Blogpost
    .find({category: category})
    .populate("author")
    .sort({date: 'descending'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, allBlogposts){
      if (err){
       return res.send(err)
      }

      db.Blogpost.count()
      .exec(function(err, count) {
        if(err){
          console.log(err);
        } else {
          console.log(allBlogposts)
           return res.render('pages/blog/categories',
           {
            blogposts:allBlogposts, 
            moment: moment,
            current: page,
            pages: Math.ceil(count / perPage),
            category: category
          })
        }
      }) 
    })
});
router.get('/categorie/:category/', function(req, res,next){
  res.locals.title = `Blog de Christine and Cie`; 
  let category = req.params.category
  if(category == "lifestyle" || category == "sante" || category == "bien-etre" || category == "travail" || category == "sport" || category == "beaute"){
   return res.redirect(`/blog/categorie/${category}/1`)
  }
  else {return res.redirect("/blog/1")}
})
router.get('/:page', function(req, res,next){
  res.locals.title = `Blog de Christine and Cie`; 
  if(dbConnexion == false){
    res.send("Erreur serveur")
  };
  var perPage = 5
  var page = req.params.page || 1
    db.Blogpost
    .find({})
    .populate("author")
    .sort({order: 'descending'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, allBlogposts){
      if (err){
        res.send(err)
      }
      db.Blogpost.count()
      .exec(function(err, count) {
        if(err){
          console.log(err);
        } else {
          if(allBlogposts.length > 0){
            console.log(allBlogposts)
            return res.render('pages/blog/index',
            {
             blogposts:allBlogposts, 
             moment: moment,
             current: page,
             pages: Math.ceil(count / perPage)
           })
          }
          else{
            console.log(allBlogposts)
           return res.redirect("/blog/1")
          }
          
        }
      }) 
    })
});

// router.route('/')
//     .get(helpers.getBlogposts)
//     .post(middleware.isLoggedIn, helpers.createBlogpost)

// router.route('/:blogpostId')
//     .get(helpers.getBlogpost)
//     .put(helpers.updateBlogpost)
//     .delete(helpers.deleteBlogpost)



module.exports = router;

