var db = require('../models');
var middleware = require("../middleware");
const path = require('path')
const mv = require('mv');
const fileUpload = require('express-fileupload');
const del = require('del');
var xss = require("xss");


exports.getBlogposts = function(req, res){
    db.Blogpost.find().sort({order: 'descending'})
    .then(function(blogposts){
        res.json(blogposts);
    })
    .catch(function(err){
        res.send(err);
    })
}

exports.createBlogpost = function(req, res){

    var title = xss(req.body.title);
// var thumbnail = req.body.thumbnail;
var thumbnail = req.files.thumbnail;
var content = req.body.content;
var description = xss(req.body.description);
var author = xss(req.body.author);
var category = xss(req.body.category);
if (req.body.tags){
    var tags = req.body.tags
    var tagsArray = tags.split(",").map(item => item.trim());
}
else{
    tagsArray = undefined;
}
var thumbTitle = Date.now()
thumbnail.mv((path.join(__dirname,'../public/upload/img/'+thumbTitle+'.jpg')), function(err) {
  if (err){
    return res.status(500).send(err);
  }
var thumblink = '/upload/img/'+thumbTitle+'.jpg'
db.Blogpost.count({}, function(err, count){

    var newBlogpost = {title: title, thumbnail: thumblink, content: content, author: author, tags : tagsArray, description:description, category: category, order : count }
  db.Blogpost.create(newBlogpost)
  .then(function(newBlogpost){
      db.User.findById(author).
      then(function(foundUser){
          foundUser.articles.push(newBlogpost._id)
          foundUser.save()
          res.status(201).json(newBlogpost);
      })
      
  })
  .catch(function(err){
      res.status(500).json({
          'error': err
      })
  })


    console.log( "Number of docs: ", count );
});

})
}

exports.getBlogpost = function(req, res){
   db.Blogpost.findById(req.params.blogpostId)
   .populate({path:"author", select: 'username'})
   .then(function(foundBlogpost){
       res.json(foundBlogpost);
   })
   .catch(function(err){
       res.send(err);
   })
}

exports.updateBlogpost =  function(req, res){
    var info ={}
    if(req.body.order){
        info.order = xss(req.body.order);
    }if(req.body.title){
        info.title = xss(req.body.title);
    }if(req.body.content){
        info.content = req.body.content;
    }if(req.body.description){
        info.description = xss(req.body.description);
    }if(req.body.category){
        info.category = xss(req.body.category);
    }
    if (req.body.tags){
        var tags = xss(req.body.tags)
        info.tags = tags.split(",").map(item => item.trim());
    }
    if (req.files != null && req.files.thumbnail != null){
        db.Blogpost.findById(req.params.blogpostId)
        .then(function(foundBlogpost){
            del((path.join(__dirname,"../public",foundBlogpost.thumbnail))).then(paths => {
                var thumbnail = req.files.thumbnail;
            var thumbTitle = Date.now()
         thumbnail.mv((path.join(__dirname,'../public/upload/img/'+thumbTitle+'.jpg')), function(err) {
        
            info.thumbnail = '/upload/img/'+thumbTitle+'.jpg'
            db.Blogpost.findOneAndUpdate({_id: req.params.blogpostId}, info, {new: true})
            .then(function(blogpost){
            res.json(blogpost);
            })
            .catch(function(err){
                res.send(err);
            })

            })
        })
    

 
    })
    }
    db.Blogpost.findOneAndUpdate({_id: req.params.blogpostId}, info, {new: true})
        .then(function(blogpost){
            console.log(blogpost)
        res.json(blogpost);
        })
        .catch(function(err){
            res.send(err);
        })
   
   
}

exports.deleteBlogpost = function(req, res){
    let article = req.article._id;
    db.Blogpost.findById(article)
    .then(function(foundBlogpost){
        del((path.join(__dirname,"../public",foundBlogpost.thumbnail))).then(paths => {

            console.log('Deleted files and folders:\n', paths.join('\n'));
            db.Blogpost.remove({_id:article}) 
            .then(function(request){
                return res.json({message : "article supprimé avec succès"});
            })
            .catch(function(err){
                return res.status(500).json({error:err});
            })
        });
        
    })
    .catch(function(err){
        res.send(err);
        console.log(err)
    })
 }


module.exports = exports;