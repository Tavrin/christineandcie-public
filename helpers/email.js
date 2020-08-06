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
const forge = require('node-forge');

exports.createMessage = function(req, res){
    console.log("test email-----------------------------------------------------------")
    console.log(req.body)
    console.log("-----------------------------------------------------------")
    console.log(req.body['stripped-text'])
//     var hmac = forge.hmac.create();
// hmac.start('sha256', process.env.MAILGUN_APIKEY);
// hmac.update(code);
// console.log(hmac.digest().toHex());
    verify(req.body.timestamp,req.body.token, req.body.signature,req,res)
}
module.exports = exports;

function verify(timestamp,token, signature,req,res){
    let code = timestamp+token;
    var hmac = forge.hmac.create();
    hmac.start('sha256', process.env.MAILGUN_APIKEY);
    hmac.update(code);
    let hmacResult = (hmac.digest().toHex());

    printOk(hmacResult === signature, req,res);
}

function printOk(result,req,res){
    if (result === true){

       let data = {}
       data.email = req.body.sender;
       data.name = req.body.from.substr(0,req.body.from.indexOf(' '));
       data.subject = req.body.subject;
       data.message = req.body['stripped-text'];
       db.Message.create(data).
       then(function(newMessage){
           console.log(newMessage)
        return res.status(200).json({
            status: 200
        })
       })
       .catch(function(err){
           console.log(err)
       })
       
    }
    else{
        return res.status(406).json({
            status: 406
        })
    }
}