var db = require('../models');
var middleware = require("../middleware");
const path = require('path')
const _ = require('lodash');
const mv = require('mv');
var multer  = require('multer');
const inspect = require('util').inspect;
const fs = require('fs');
const fileType = require('file-type');
const fileUpload = require('express-fileupload');
const del = require('del');
var xss = require("xss");


//FORMATIONS
exports.getFormations = function(req, res){
    console.log("test")
    db.Formation.find()
    .sort({creationDate: 'descending'})
    .select('_id name description link enabled type members creationDate')
    .then(function(formations){
        const response ={
            count: formations.length,
            formations: formations.map(formation =>{
                return {
                    name: formation.name,
                    description: formation.description,
                    link: formation.link,
                    enabled: formation.enabled,
                    type: formation.type,
                    members: formation.members.length,
                    creationDate: formation.creationDate,
                    _id: formation._id,
                    request: {
                        type: 'GET',
                        url: '/api/formations/'+formation._id
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

exports.createFormation = function(req, res){
  db.Formation.create(req.body)
  .then(function(newFormation){
      res.status(201).json({
          message: "Formation créée avec succès",
          Formation: {
            name: newFormation.name,
            description: newFormation.description,
            link: newFormation.link,
              _id: newFormation._id,
              creationDate: newFormation.creationDate,
              get: {
                  type: 'GET',
                  url: '/api/formations/'+ newFormation._id
              }
          }
      });
  })
  .catch(function(err){
      res.send(err);
  })
}

exports.getFormation = function(req, res){

    return res.status(200).json({
        name: req.formation.name,
        description: req.formation.description,
        link: req.formation.link,
        members: req.formation.members,
        enabled: req.formation.enabled,
        type: req.formation.type,
        _id: req.formation._id,
        creationDate: req.formation.creationDate,
        request: {
            type: 'GET',
            url: '/api/formations/'}
        });
}

exports.updateFormation =  function(req, res){
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(404).json({message: "aucun paramètre donné"})
      }
      db.Formation.findOneAndUpdate({_id: req.formation._id},req.body, {new: true})
      .select('_id name description link enabled type members creationDate')
    .then(function(formation){
    return res.status(200).json({message: "Formation mise à jour",
    request: {
        type: 'GET',
        url: '/api/formations/'+formation._id
    }});
    })
    .catch(function(err){
        res.status(500).json({error:"une erreur est survenue"});
    })
}


exports.deleteFormation = function(req, res){
    db.Formation.findById(req.formation._id)
    .then(function(formation){
        formation.members.forEach(function(member){
            db.User.findById(member)
            .then(function(user){
                user.formations.pull(req.formation._id)
                user.save()
            })
            formation.remove() 
            res.json({message: 'Formation supprimée'});
        })
    })
    .catch(function(err){
        res.send(err);
    }) 

   
}

//MEMBRES
exports.getMembers = function(req, res){
    db.Formation.findById(req.params.formationId).
    populate({path: 'members',  select: 'username'}).
    then(function(formation){
        console.log(formation)
        return res.status(200).json({
            formation: formation._id,
            members: formation.members,
            status: "get"})
    })
}

exports.getMember = function(req, res){
    db.User.findById(req.params.memberId)
    .then( function(user){
        if (!user){
            return res.status(404).json({
                erreur: "Cet utilisateur n'existe pas"
            })
        }
        var index = _.find(user.formations, function(ch) {
            return ch == req.params.formationId ;
    })

    if(index!=undefined){
        db.Formation.findById(req.params.formationId).
        populate({path: 'members', match: {_id: req.params.memberId}, select:'username'}).
        then(function(formation){
            console.log(formation)
            return res.status(200).json({
                formation: formation._id,
                member: formation.members,
                status: "get"})
        })
        .catch(function(err){
            return res.status(500).json({
                erreur: "Une erreur a été rencontrée lors de la recherche de cette formation"
            })
        })
    }
    else{
        return res.status(404).json({
        erreur: "Cet utilisateur n'est pas inscrit dans cette formation'"
    })

    }
    
})
.catch(function(err){
    return res.status(404).json({
        erreur: "Cet utilisateur n'existe pas"
    })
})
}

exports.addMember= function(req, res){
   
    db.Formation.findById(req.params.formationId).
    then(function(formation){
        let formationMembers = formation.members
        let bodyMember = req.body.member

        var index = _.find(formationMembers, function(ch) {
            return ch == bodyMember ;
        });

        if ( index!=undefined ) {
            return res.status(200).json({
                erreur: "Ce membre est déjà inscrit dans la formation"})
        } else {
            formation.members.push(bodyMember)
            formation.save()
            db.User.findById(bodyMember).
            then(function(user){
                var index = _.find(user.formations, function(ch) {
                    return ch == req.formation ;
                });
                if ( index!=undefined ) {
                    return res.status(200).json({
                        member: formationMembers,
                        status: "added"})
                }
                else{
                    user.formations.push(req.formation)
                    user.save()
                    return res.status(200).json({
                        member: formationMembers,
                        status: "added"})
                }
            })
            
        }
    })
}


exports.updateMember = function(req,res){
    
}


exports.deleteMember = function(req, res){
    db.User.findById(req.params.memberId)
    .then( function(user){
        if (!user){
            return res.status(404).json({
                erreur: "Cet utilisateur n'existe pas"
            })
        }
        var index = _.find(user.formations, function(ch) {
            return ch == req.params.formationId ;
    })

    if(index!=undefined){
        let bodyMember = req.params.memberId
        db.Formation.findById(req.formation._id).
        then(function(formation){
            formation.members.pull(bodyMember)
            formation.save()
            db.User.findById(bodyMember)
            .then(function(user){
                user.formations.pull(req.formation._id)
                user.save()
                return res.status(200).json({
                    member: formation.member,
                    status: "deleted"})
            })
            
        })
        .catch(function(err){
            return res.status(500).json({
                erreur: "Une erreur a été rencontrée lors de la recherche de cette formation"
            })
        })
    }
    else{
        return res.status(404).json({
        erreur: "Cet utilisateur n'est pas inscrit dans cette formation'"
    })

    }
})
.catch(function(err){
    return res.status(404).json({
        erreur: "Cet utilisateur n'existe pas"
    })
})
    
}


//MODULES

exports.getModules = function(req, res){
    db.Formation.findById(req.params.formationId).
    populate({path: 'modules'}).
    then(function(formation){
        return res.status(200).json({
            formation: formation._id,
            members: formation.modules,
            status: "get"})
    })
}

exports.getModule = function(req, res){
    db.Module.findById(req.params.moduleId)
    .then( function(foundModule){
        if (!foundModule){
            return res.status(404).json({
                erreur: "Ce module n'existe pas"
            })
        }
        var index = _.find(foundModule.formation, function(ch) {
            return ch == req.params.formationId ;
    })

    if(index!=undefined){
 
            return res.status(200).json({
                module: foundModule,
                formation: foundModule.formation[0],
                status: "get"})

    }
    else{
        return res.status(404).json({
        erreur: "Ce module n'est pas associé à cette formation"
    })

    }
    
})
.catch(function(err){
    return res.status(404).json({
        erreur: "Ce module n'existe pas"
    })
})
}

exports.createModule= function(req, res){
    console.log(req.body)
    let newModule = {}
        newModule.name = xss(req.body.name);

        newModule.formation =(req.params.formationId)
        newModule.description = xss(req.body.description);

        newModule.content = xss(req.body.content);
   
        if (req.body.tags){
            var tags = req.body.tags
            newModule.tags = tags.split(",").map(item => item.trim());
        }
        else{
            newModule.tags = undefined;
        }
        db.Module.create(newModule)

        .then(function(createdModule){
            // if (!fs.existsSync(path.join(__dirname,'../public/upload/formations/'+newModule.formation+'/'+createdModule._id))){
            //     fs.mkdirSync(path.join(__dirname,'../public/upload/formations/'+newModule.formation+'/'+createdModule._id));
            // }

            if (req.files && (req.files.thumbnail  || req.files.video)){
                toDo = Object.keys(req.files).length

                if(req.files.thumbnail){
                    if(req.files.video){
                        var vidToo = true
                    }
                    else{
                        var vidToo = false
                    }

                    console.log(Object.keys(req.files).length)
                    let thumbnailFile =  req.files.thumbnail
                    addFile(thumbnailFile, createdModule,"image", vidToo,req, res,getPath)
                    
                    
                    function getPath( path ) {

                        createdModule.thumbnail = path;
                        toDo -= 1;

                    };
                    
            }
            if(req.files.video){

                let videoFile =  req.files.video
                addFile(videoFile, createdModule,"video",false, req, res, getPath)

                function getPath( path ) {
                    createdModule.video = path;

                    toDo -= 1;

                };
            }

            var interval = setInterval(function() { 

                if (toDo == 0 ) {
                    createdModule.save()
                toDo -= 1;
                    clearInterval(interval)
                }

            }, 1000);
        
        }
        else{
            toDo = -1
        }
        var interval3 = setInterval(function() { 
            console.log(toDo)
        addToFormation(req.params.formationId, createdModule._id, req, res)
        toDo -= 1;
        clearInterval(interval3)
        }, 1000)


    //     var interval2 = setInterval(function() { 
    //         if (toDo < -1 ) {
    //             toDo -= 1;
    //             clearInterval(interval2 )
    //             console.log("todo : " + toDo)
    //          res.status(200).json({message: "Module créé avec succès",
    // id : createdModule._id,
    // request: {
    //     type: 'GET',
    //     url: "/api/formations/"+req.params.formationId+"/modules/"+createdModule._id
    // }});
    //         }
    //     }, 1000)
        })
        .catch(function(err){
            console.log(err)
        })
    

    
}

exports.updateModule = function(req,res){


    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(404).json({message: "aucun paramètre donné"})
      }
      if(req.files && req.files.thumbnail){
          var boolWait = true;
      }
      else{
          var boolWait = false;
      }
      var info ={}
    //   if (req.files != null && req.files.thumbnail != null){
    //     db.Blogpost.findById(req.params.blogpostId)
    //     .then(function(foundBlogpost){
    //         del((path.join(__dirname,"../public",foundBlogpost.thumbnail))).then(paths => {
    //             var thumbnail = req.files.thumbnail;
    //         var thumbTitle = Date.now()
    //      thumbnail.mv((path.join(__dirname,'../public/upload/img/'+thumbTitle+'.jpg')), function(err) {
        
    //         info.thumbnail = '/upload/img/'+thumbTitle+'.jpg'
    //         db.Blogpost.findOneAndUpdate({_id: req.params.blogpostId}, info, {new: true})
    //         .then(function(blogpost){
    //         res.json(blogpost);
    //         })
    //         .catch(function(err){
    //             res.send(err);
    //         })

    //         })
    //     })
    

 
    // })
    // }
    if(req.body.name){
        info.name = req.body.name;
    }if(req.body.tags){
        info.tags = req.body.tags;
    }if(req.body.content){
        info.content = req.body.content;
    }if(req.body.description){
        info.description = xss(req.body.description);
    }


    if (req.files && (req.files.thumbnail  || req.files.video)){
        var toDo = Object.keys(req.files).length
        db.Module.findById(req.params.moduleId)
        .then(function(foundMod){
             toDo = Object.keys(req.files).length
            console.log("boolWait: " + boolWait)
                if(req.files.thumbnail){
                    if(req.files.video){
                        var vidToo = true
                    }
                    else{
                        var vidToo = false
                    }

                    console.log(Object.keys(req.files).length)
                    let thumbnailFile =  req.files.thumbnail
                    addFile(thumbnailFile, foundMod,"image", vidToo,req, res,getPath)
                    boolWait = false
                    
                    function getPath( path ) {

                        foundMod.thumbnail = path;
                        toDo -= 1;

                    };
                    
            }
            if(req.files.video && boolWait === false){

                let videoFile =  req.files.video
                addFile(videoFile, foundMod,"video",false, req, res, getPath)

                function getPath( path ) {
                    foundMod.video = path;

                    toDo -= 1;

                };
            }

            var interval = setInterval(function() { 

                if (toDo == 0 ) {
                foundMod.save()
                toDo -= 1;
                    clearInterval(interval)
                }

            }, 1000);
        //     setTimeout(function(){console.log("todo out of callback : " + toDo)
        //     if(toDo <1){
        //         console.log("-----------------------------------------")
        //         console.log(toDo)
        //         console.log("foundmod")
        //     console.log(foundMod)
        //     foundMod.save()
        //     toDo -= 1;
        //     }
        // }, 3000)


    })
    }
    else{
        var toDo = -1
    }
   
     
    var interval2 = setInterval(function() { 
        console.log("toDo")
        console.log(toDo)
        if (toDo < 0 ) {
            
         db.Module.findOneAndUpdate({_id: req.params.moduleId},info, {new: true})
      .select('_id name description thumbnail enabled video tags content creationDate formation')
    .then(function(mod){
        console.log("info: " + info)
    return res.status(200).json({message: "Module mis à jour",
    id : mod._id,
    request: {
        type: 'GET',
        url: "/api/formations/"+req.params.formationId+"/modules/"+mod._id
    }});
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({error:"une erreur est survenue"});
    })
    toDo -= 1;
    clearInterval(interval2)
}

}, 1000);

}

exports.deleteModule = function(req, res){
    db.Module.findById(req.params.moduleId)
    .then( function(foundModule){
        console.log("module trouvé")
        if (!foundModule){
            return res.status(404).json({
                erreur: "Ce module n'existe pas"
            })
        }
        var index = _.find(foundModule.formation, function(ch) {
            return ch == req.params.formationId ;
    })

    if(index!=undefined){
        console.log("index fonctionnel")
        let bodyModule = req.params.moduleId
        db.Formation.findById(req.params.formationId).
        then(function(formation){
            formation.modules.pull(bodyModule)
            formation.save()
            db.Module.findById(bodyModule)
            .then(function(mod){
                del((path.join(__dirname,"../public",mod.thumbnail))).then(paths => {

                    console.log('Deleted files and folders:\n', paths.join('\n'));
                    db.Module.remove({_id:req.params.moduleId}) 
                    .then(function(request){
                        return res.json({message : "module supprimé avec succès"});
                    })
                    .catch(function(err){
                        return res.status(500).json({error:err});
                    })
                });
            })
            
        })
        .catch(function(err){
            return res.status(500).json({
                erreur: "Une erreur a été rencontrée lors de la recherche de cette formation"
            })
        })
    }
    else{
        return res.status(404).json({
        erreur: "Ce module n'appartient pas à cette formation'"
    })

    }
})
.catch(function(err){
    return res.status(404).json({
        erreur: "Ce module n'existe pas"
    })
})
    
}

module.exports = exports;


function addFile(file, document, type, vidToo, req, res, callback){
    console.log(document)
    let fileData =  file.data;
    if(type=="image"){

    
                if(!(fileType(fileData).ext ==='png' || fileType(fileData).ext === 'jpg' || fileType(fileData).ext ==='gif')&& !(fileType(fileData).mime === 'image/png' || fileType(fileData).mime === 'image/jpeg'|| fileType(fileData).mime === 'image/gif')){
                    console.log(fileType(fileData).ext)
                    req.flash("error", "Le type de fichier de l'image n'est pas autorisé")

                }
                else{
                    let fileExt = fileType(fileData).ext

                if(document.thumbnail !="/upload/placeholder.png"){
                    del((path.join(__dirname,"../public",document.thumbnail))).then(paths => {
                        let thumbnail = file;
                        var thumbTitle = Date.now()
                        thumbnail.mv((path.join(__dirname,'../public/upload/formations/'+document.formation + '/' + thumbTitle+'.'+fileExt)), function(err) {
                    
                            var thumbnailPath  = '/upload/formations/'+document.formation + '/' + thumbTitle+'.'+fileExt
                            // if(vidToo == false){
                            //     document.save()
                            // }
                            console.log("vidToo: " + vidToo)
                            console.log("test image :" + document.thumbnail)
                            if(callback) {callback(thumbnailPath)
                                console.log("callback done")
                                        }
                                    })
                                })
                         }
                         else{
                            let thumbnail = file;
                            var thumbTitle = Date.now()
                            thumbnail.mv((path.join(__dirname,'../public/upload/formations/'+document.formation + '/' + thumbTitle+'.'+fileExt)), function(err) {
                        
                                var thumbnailPath = '/upload/formations/'+document.formation + '/' + thumbTitle+'.'+fileExt
                                if(vidToo == false){
                                    
                                }
                                console.log("vidToo: " + vidToo)
                                console.log("test image :" + thumbnailPath)
                                if(callback) {callback(thumbnailPath)
                                    console.log("callback done")
                                            }
                        
                                        })
                         }

    
                    

                }
        }
        if(type=="video"){
            console.log("test video :" + document.video)
                    if(!(fileType(fileData).ext ==='mov' || fileType(fileData).ext ==='wmv' || fileType(fileData).ext === 'mp4')&& !(fileType(fileData).mime === 'video/quicktime' || fileType(fileData).mime === 'video/mp4' || fileType(fileData).mime === 'video/x-ms-wmv')){
                        console.log(fileType(fileData).ext)
                        req.flash("error", "Le type de fichier de la vidéo n'est pas autorisé")

                    }
                    else{
                        let fileExt = fileType(fileData).ext
                        if (document.video != undefined || document.video != null ){
                            del((path.join(__dirname,"../public",document.video))).then(paths => {

                                let video = file;
                                var videoTitle = "video"+Date.now()
                                video.mv((path.join(__dirname,'../public/upload/formations/'+document.formation + '/' + videoTitle+'.'+fileExt)), function(err) {
                            
                                    var videoPath = '/upload/formations/'+document.formation + '/' + videoTitle+'.'+fileExt
                                    if(callback) {callback(videoPath)
                                        console.log("path : " + videoPath)
                                        console.log("callback done")
                                                }
                                    
        
                        })
        
          
        
                    })
                }
                else{
                    let video = file;
                    var videoTitle = "video"+Date.now()
                    video.mv((path.join(__dirname,'../public/upload/formations/'+document.formation + '/' + videoTitle+'.'+fileExt)), function(err) {
                
                        var videoPath = '/upload/formations/'+document.formation + '/' + videoTitle+'.'+fileExt
                                    if(callback) {callback(videoPath)
                                        console.log("path : " + videoPath)
                                        console.log("callback done")
                                                }
                })
                        
        }
    }

}
}


// function addVideo(){
//     let file =  req.files.video.data;
//     if(!(fileType(file).ext ==='mov' || fileType(file).ext ==='wmv' || fileType(file).ext === 'mp4')&& !(fileType(file).mime === 'video/quicktime' || fileType(file).mime === 'video/mp4' || fileType(file).mime === 'video/x-ms-wmv')){
//         console.log(fileType(file).ext)
//         req.flash("error", "Le type de fichier de la vidéo n'est pas autorisé")
//         return res.redirect("/admin/formations/" + newModule.formation)
//     }
//     else{
//         let fileExt = fileType(file).ext
//         console.log(req.files.video)

//         let video = req.files.video;
//         var videoTitle = "video"+Date.now()
//         video.mv((path.join(__dirname,'../public/upload/formations/'+formation._id + '/' + videoTitle+'.'+fileExt)), function(err) {
    
//             createdModule.video = '/upload/formations/'+formation._id + '/' + videoTitle+'.'+fileExt
//             createdModule.save()
//         // return res.redirect("/parametres/profil")

//     })

//     createdModule.save()

//     }
// }

function addToFormation(formationId,idToAdd, req, res){
    db.Formation.findById(formationId).
    then(function(formation){
        let formationModules = formation.modules

        
            formation.modules.push(idToAdd)
            formation.save()
            db.Module.findById(idToAdd).
            then(function(mod){

                    return res.status(200).json({
                        module: mod,
                        status: "added"})
                

            })
            
        
    })
}