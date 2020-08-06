var db = require('../models');
const requestIp = require('request-ip');
var bcrypt = require('bcryptjs');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');


// rate-limiter-flexible options
mongoose.connection.on('connected', function(){

  
    const mongoConn = mongoose.connection;


const opts = {
    storeClient: mongoConn,
    points: 10, // Number of points
    duration: 1, // Per second(s)
  };
  
  const rateLimiterMongo = new RateLimiterMongo(opts);
})


  //----------------------------

// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){


    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Accès interdit");
    return res.redirect("/login");

}

middlewareObj.isLoggedInApi = function(req, res, next){
    if (req.headers.authorization) {
        console.log("test")
        let auth = (Base64.decode(req.headers.authorization.split(" ").splice(1,1)))
        let username = auth.substr(0,auth.indexOf(':'))
        let password = auth.substr(auth.indexOf(':')+1)
        db.User.find({keyId:username})
    .exec()
    .then(function(user){
        if(user.length === 0 || user === undefined || !user ){
            return res.send("pas d'utilisateur")
        }
        else{

            if(user[0].isAdmin == false){
                return res.send("privilèges insuffisants")
            }
            else{
                bcrypt.compare(password, user[0].keySecret, function(err, response) {
                    if(response===true){
                        
                        return next()
                       }
                    else{
                        return res.send("clé api incorrecte")
                      }
                });
            }
            
            
        }
        
    })
    .catch(function(err){
        console.log(err)
    })
    }
    else{
    if(req.isAuthenticated()){
        return next();
        }
        return res.status(403).json({message:"accès interdit"});
    }
    
}

middlewareObj.isLoggedAdmin = function(req, res, next){


        if(req.user && req.user.isAdmin){
            return next();
        }
        req.flash("error", "Accès interdit");
       return  res.redirect("/");

    
};

middlewareObj.isLoggedAdminApi = function(req, res, next){
    if (req.headers.authorization) {
        let auth = (Base64.decode(req.headers.authorization.split(" ").splice(1,1)))
        let username = auth.substr(0,auth.indexOf(':'))
        let password = auth.substr(auth.indexOf(':')+1)
        db.User.find({keyId:username})
    .exec()
    .then(function(user){
        if(user.length === 0 || user === undefined || !user ){
            return res.send("pas d'utilisateur")
        }
        else{

            if(user[0].isAdmin == false){
                return res.send("privilèges insuffisants")
            }
            else{
                bcrypt.compare(password, user[0].keySecret, function(err, response) {
                    if(response===true){
                        
                        return next()
                       }
                    else{
                        return res.send("clé api incorrecte")
                      }
                });
            }
            
            
        }
        
    })
    .catch(function(err){
        console.log(err)
    })
    }
    else{
        if(req.user && req.user.isAdmin){
            return next();
        }
        res.status(403).json({message:"accès interdit"});
    }
    
};

// inside middleware handler
middlewareObj.ipMiddleware = function(req, res, next) {
    req.clientIp = requestIp.getClientIp(req);
    console.log(req.clientIp) 
    next();
};

middlewareObj.lookupUser = function(req, res, next){
    console.log("name:::: middleware")
    console.log(req.body)
    db.User.findById(req.params.userId)
    .select('_id username real_name level isAdmin formations email articles signupDate')
   .then(function(foundUser){
       if(foundUser){
        req.user = foundUser;
        return next();
        // return res.status(200).json(foundUser);
       }
       else{
           console.log("pas trouvé")
        return res.status(404).json({message:"Cet utilisateur n'existe pas"}); 
       }
   })
   .catch(function(err){
    return res.status(500).json({error: "Une erreur est survenue dans la recherche de ce membre"});
   })
};

middlewareObj.lookupArticle = function(req, res, next){
    db.Blogpost.findById(req.params.blogpostId)
   .then(function(foundBlogpost){
       if(foundBlogpost){
        req.article = foundBlogpost;
        return next();
        // return res.status(200).json(foundUser);
       }
       else{
        return res.status(404).json({message:"Cet article n'existe pas"}); 
       }
   })
   .catch(function(err){
    return res.status(500).json({error: "Une erreur est survenue dans la recherche de cet article"});
   })
};

middlewareObj.lookupFormation = function(req, res, next){
    db.Formation.findById(req.params.formationId)
   .then(function(foundFormation){
       if(foundFormation){
        req.formation = foundFormation;
        return next();
        // return res.status(200).json(foundUser);
       }
       else{
        return res.status(404).json({message:"Cette formation n'existe pas"}); 
       }
   })
   .catch(function(err){
    return res.status(500).json({error: "Une erreur est survenue dans la recherche de cette formation"});
   })
};

middlewareObj.limiteRate = function(req, res, next){


  
        const mongoConn = mongoose.connection;
    
    
    const opts = {
        storeClient: mongoConn,
        points: 10, // Number of points
        duration: 60, // Per second(s)
      };
      
      const rateLimiterMongo = new RateLimiterMongo(opts);


    rateLimiterMongo.consume(req.ip)
    .then(() => {
      next();
    })
    .catch((rejRes) => {
      res.status(429).send('Trop de tentatives, veuillez reessayer dans quelques instants');
    })
};
module.exports = middlewareObj;