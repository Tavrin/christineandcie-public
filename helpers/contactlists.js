var db = require('../models');
const _ = require('lodash');

exports.getLists = function(req, res){
    db.Contactlist.find()
    .sort({date: 'descending'})
    .then(function(lists){
        res.status(200).json(lists);
    })
    .catch(function(err){
        res.statu(500).json({error:err});
    })
}

exports.createList = function(req, res){
    console.log (req.body)
  db.Contactlist.create(req.body)
  .then(function(newList){
      res.status(201).json(newList);
  })
  .catch(function(err){
      res.send(err);
  })
}

exports.getList = function(req, res){
   db.Contactlist.findById(req.params.listId)
   .then(function(foundList){
       if(foundList){
        res.status(200).json(foundList);
       }
       else{
        res.status(404).json({message:"Cette liste n'existe pas"}); 
       }
   })
   .catch(function(err){
       res.status(500).json({error:err});
   })
}

exports.updateList =  function(req, res){
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(404).json({message: "aucun paramètre donné"})
      }
        
 
   db.Contactlist.findById(req.params.listId)
   
   .then(function(list){
    if(list){
        if (req.body.name){
            list.name = req.body.name
        }
        
        if(req.body.contacts){
            let listContacts = list.contacts
            let bodyContact = req.body.contacts

            var index = _.find(listContacts, function(ch) {
                return ch == bodyContact ;
            });

            if ( index!=undefined ) {
                console.log("present :" + index)
                list.contacts.pull(bodyContact)
                list.save()
                return res.status(200).json({status: "deleted"})
            } else {
                console.log("pas présent")
                list.contacts.push(bodyContact)
                list.save()
                return res.status(200).json({status: "added"})
            }
        }
        else{
            
            list.save()
            return res.status(200).json({status: "added other than contact"})
            //  db.Contactlist.findOneAndUpdate({})

            }
    }
    else{
        res.status(404).json({message:"Cette liste n'existe pas"}); 
       }
   })
   .catch(function(err){
    res.status(500).json({error:err});
   })
}

exports.deleteList = function(req, res){
   db.Contactlist.remove({_id: req.params.listId}) 
   .then(function(){
       res.json({message: 'Liste supprimée'});
   })
   .catch(function(err){
       res.send(err);
   })
}


exports.getContacts = function(req, res){
    db.Contactlist.findById(req.params.listId).
    populate({path: 'contacts'}).
    then(function(list){
        console.log(list)
        return res.status(200).json({
            list: list._id,
            contacts: list.contacts,
            status: "get"})
    })
}
exports.getContact = function(req, res){
    db.Contactlist.findById(req.params.listId).
    populate({path: 'contacts', match: {_id: req.params.contactId}}).
    then(function(list){
        console.log(list)
        return res.status(200).json({
            list: list._id,
            contact: list.contacts,
            status: "get"})
    })
}

exports.addContact = function(req, res){
   
    db.Contactlist.findById(req.params.listId).
    // populate("contacts").
    then(function(list){
        console.log(req.body.contact)
        let listContacts = list.contacts
        let bodyContact = req.body.contact

        var index = _.find(listContacts, function(ch) {
            return ch == bodyContact ;
        });

        if ( index!=undefined ) {
            console.log("present :" + index)
            // list.contacts.pull(bodyContact)
            // list.save()
            return res.status(200).json({
                contact: listContacts,
                status: "Déjà présent"})
        } else {
            // console.log("pas présent")
            // list.contacts.push(bodyContact)
            // list.save()
            return res.status(200).json({
                contact: listContacts,
                status: "added"})
        }
    })
}

exports.deleteContact = function(req, res){
    db.Contactlist.findById(req.params.listId).
    populate("contacts", {select: req.params.contactId}).
    exec(function(contact){
        console.log(contact)
        return res.status(200).json({
            contact: contact,
            status: "deleted"})
    })
    
}


module.exports = exports;