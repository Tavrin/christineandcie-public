var db = require('../models');
var middleware = require("../middleware");
const crypto = require('crypto');
var bcrypt = require('bcryptjs');
var Base64 = require('js-base64').Base64;
const uuidv4 = require('uuid/v4');

exports.getUsers = function(req, res){
    db.User.find()
    .sort({date: 'descending'})
    .select('_id username real_name formations isDev isAdmin level email articles signupDate')
    .then(function(users){
        const response ={
            count: users.length,
            users: users.map(user =>{
                return {
                    username: user.username,
                    email: user.email,
                    isDev: user.isDev,
                    isAdmin: user.isAdmin,
                    real_name: user.real_name,
                    level: user.level,
                    formations: user.formations.length,
                    signupDate: user.signupDate,
                    articles: user.articles,
                    _id: user._id,
                    request: {
                        type: 'GET',
                        url: '/api/users/'+user._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(function(err){
        res.status(500).json({error:err});
    })
}

exports.createUser = function(req, res){
  db.User.create(req.body)
  .then(function(newUser){
      res.status(201).json({
          message: "Utilisateur créé avec succès",
          utilisateur: {
              username: newUser.username,
              email: newUser.email,
              level: newUser.level,
              _id: newUser._id,
              signupDate: newUser.signupDate,
              get: {
                  type: 'GET',
                  url: '/api/users/'+ newUser._id
              }
          }
      });
  })
  .catch(function(err){
      res.send(err);
  })
}

exports.getUser = function(req, res){

    return res.status(200).json({
        username: req.user.username,
        email: req.user.email,
        level: req.user.level,
        isAdmin: req.user.isAdmin,
        formations: req.user.formations,
        articles: req.user.articles,
        signupDate: req.user.signupDate,
        _id: req.user._id,
        request: {
            type: 'GET',
            url: '/api/users/'}
        });
}

exports.updateUser =  function(req, res){
    console.log("name:::: helper")
    console.log(req.body)
    console.log(Object.keys(req.body).length)
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log("bug1")
        return res.status(404).json({message: "aucun paramètre donné"})
      }
    //   console.log(req.body)
      db.User.findOneAndUpdate({_id: req.user._id},req.body, {new: true})
      .select('_id username real_name level isAdmin email articles signupDate')
    .then(function(user){
    return res.status(200).json(user);
    })
    .catch(function(err){
        res.status(500).json({error:"une erreur est survenue"});
    })
}

exports.updateKey =  function(req, res){
    console.log(req.body.keyId)
    console.log( req.user.isDev)
      if(req.user._id != req.params.userId){
        return res.status(404).json({message: "erreur"})
      }
      db.User.findById(req.user._id)
      .exec()
    .then(function(user){
        if((user.keyId === req.body.keyId && user.keyId.length > 5 && user.keyId != undefined && user.keyId != null) || user.isDev === true){
            let apiKey = Base64.encodeURI(uuidv4())
        user.keyId = apiKey;
       
        crypto.randomBytes(24, function(err,buf){
           let apiSecret = buf.toString("hex");
           console.log(apiSecret)
           bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(apiSecret, salt, function(err, hash) {
                user.keySecret = hash;
                user.save()
                return res.status(200).json({apiKey:apiKey, apiSecret:apiSecret});
            });
        });
        })
        }
        else{
            return res.status(403).json({message: "interdit"})
        }
        // return res.status(404).json({message: "erreur"})
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({error:"une erreur est survenue"});
    })
}
exports.deleteUser = function(req, res){
   db.User.remove({_id: req.user._id}) 
   .then(function(){
       res.json({message: 'Utilisateur supprimé'});
   })
   .catch(function(err){
       res.send(err);
   })
}

module.exports = exports;