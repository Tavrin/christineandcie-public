var db = require('../models');

exports.getContacts = function(req, res){
    db.Contact.find().sort({date: 'descending'})
    .then(function(contacts){
        res.status(200).json(contacts);
    })
    .catch(function(err){
        res.statu(500).json({error:err});
    })
}

exports.createContact = function(req, res){
    console.log (req.body)
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var bool = re.test(String(req.body.email).toLowerCase());
    if(bool === false || !req.body.name || req.body.name == null || req.body.name == undefined || req.body.name.length < 4 || req.body.name.length > 25 ){
        return res.status(400).json({message: "wrong data"});
    }
  db.Contact.create(req.body)
  .then(function(newContact){
      return res.status(201).json(newContact);
  })
  .catch(function(err){
      return res.send(err);
  })
}

exports.getContact = function(req, res){
   db.Contact.findById(req.params.contactId)
   .then(function(foundContact){
       if(foundContact){
        res.status(200).json(foundContact);
       }
       else{
        res.status(404).json({message:"Ce contact n'existe pas"}); 
       }
   })
   .catch(function(err){
       res.status(500).json({error:err});
   })
}

exports.updateContact =  function(req, res){
   db.Contact.findOneAndUpdate({_id: req.params.contacttId}, req.body, {new: true})
   .then(function(contact){
    if(contact){
    res.status(200).json(contact);
    }
    else{
        res.status(404).json({message:"Ce contact n'existe pas"}); 
       }
   })
   .catch(function(err){
    res.status(500).json({error:err});
   })
}

exports.deleteContact = function(req, res){
   db.Contact.remove({_id: req.params.contactId}) 
   .then(function(){
       res.json({message: 'Contact supprimé'});
   })
   .catch(function(err){
       res.send(err);
   })
}

module.exports = exports;