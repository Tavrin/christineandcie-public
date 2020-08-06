var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      realName:{
        type: String
      },
      location:{
        type:String
      },
      avatar:{
        type: String
      },
      bio:{
        type: String,
        maxlength: 160
      },
      url:{
        type: String
      },
    email:{
      type: String,
      required: true,
        unique: true
    },
    password: {
        type: String
        // required: true
      },
      isAdmin:{
        type: Boolean,
        default: false
      },
      level:{
        type: String,
       required: true,
       default: "user" 
      },
      isDev:{
        type: Boolean,
        default: false
      },
      articles: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Blogpost"
        }],
        formations: [
          {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Formation"
          }],
      signupDate:{
        type: Date,
        default: Date.now
      },
      resetPasswordToken: String,
      secretToken: String,
      keyId: {
        type: String,
        unique: true
      },
      keySecret: String,
      resetPasswordExpires: Date,
      active:{
        type: Boolean,
        default: false
      },
      totpStatus:{
        type: Boolean,
        default: false
      }
});

UserSchema.plugin(passportLocalMongoose, {
  // Set usernameUnique to false to avoid a mongodb index on the username column!
  usernameUnique: false,

  findByUsername: function(model, queryParameters) {
    // Add additional query parameter - AND condition - active: true
    queryParameters.active = true;
    return model.findOne(queryParameters);
  }
})

module.exports = mongoose.model("User", UserSchema);