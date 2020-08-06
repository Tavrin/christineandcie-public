require('dotenv').config();
const https = require('https');
const http = require('http');
var morgan = require('morgan');
const fs = require('fs');
const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const helmet = require('helmet')
const path = require('path')
const PORT = process.env.PORT || 5000
var multer  = require('multer');
const bodyParser  = require("body-parser")
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash       = require("connect-flash")
const passport    = require("passport")
const LocalStrategy = require("passport-local").Strategy
const methodOverride = require("method-override")
const Busboy  = require("busboy");
const fileUpload = require('express-fileupload');
const mv = require('mv');
const passportJwt = require('./config/passportJwt.js')
var db = require("./models");








// const seedDB      = require("./seed")
app.use(helmet())
app.use(helmet.hsts({
  // Must be at least 1 year to be approved
  maxAge: 31536000,

  // Must be enabled to be approved
  includeSubDomains: true,
  preload: true
}))
app.use(cookieParser(process.env.SESSION_SECRET)),
morgan.token('remote-addr', function (req) {
  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
app.use(favicon(path.join(__dirname, 'public/favicon', 'favicon.ico')))
// if(process.env.ENVIRONMENT == "prod"){
//   app.all('*', ensureSecure); // at top of routing calls
// }

app.use(fileUpload({ limits: { fileSize: 300 * 1024 * 1024 },
  abortOnLimit: true,
  useTempFiles : true,
  tempFileDir :path.join(__dirname, 'public/upload/tmp')
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//requiring routes

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
const    blogRoutes  = require("./routes/blog"),
         ApiRoutes  = require("./routes/api"),
         indexRoutes = require("./routes/index"),
         adminRoutes = require("./routes/admin"),
         settingsRoutes = require('./routes/parametres');
         formationsRoutes = require('./routes/formations')

// seedDB();
var options = { useNewUrlParser: true, keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 } ;
let uri = process.env.DATABASEURL;
mongoose.set('useCreateIndex', true);
mongoose.connect(uri, options);

mongoose.connection.on('connected', function(){
  
  dbConnexion = true;
  console.log("db connectée")
})
mongoose.connection.on('disconnected', function(){
  dbConnexion = false;
  console.log("db non connectée")
})



 app.use(express.static(path.join(__dirname, 'public'), { maxAge: "24 hours" }))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.use(methodOverride("_method"));
  app.use(flash());

// PASSPORT CONFIGURATION
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge: 7200000,
          httpOnly: true
          },
  resave: false,
  saveUninitialized: false
}));  
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});



//  app.use(function(req,res, next){
//    res.header('Access-Control-Allow-Origin', "*");
//    res.header(
//      "Access-Control-Allow-Headers",
//      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//    );
//    if(req.method==='OPTIONS'){
//      res.header("Access-Control-Allow-Methods","PUT, POST, DEL, GET");
//      return res.status(200).json({}); 
//    }
//  })


 app.use("/", indexRoutes);
//  app.use("/blog", blogRoutes);
//  app.use("/api",ApiRoutes);
//  app.use("/admin",adminRoutes);
//  app.use("/parametres",settingsRoutes);
//  app.use("/formations",formationsRoutes);
 app.use(function (req, res, next) {
  // backURL=req.header('Referer') || '/';
  res.locals.title = `Christine and Cie`; 
  res.status(404).render("./pages/404")
 })


app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status||500);
  res.send("Une erreur serveur est survenue");
  next();
})

const httpsOptions = {
  ca: fs.readFileSync(path.join(__dirname,'cert',"COMODO_DV_SHA-256_bundle.crt")),
  cert: fs.readFileSync(path.join(__dirname,'cert',"christineandcie_fr.crt")),
  key: fs.readFileSync(path.join(__dirname,'cert',"christineandcie_fr.key"))
};
if(process.env.ENVIRONMENT == "dev"){
  http.createServer(app).listen(80, function() {
    console.log('Http App started on port ' + 80);
    
  })
  https.createServer(httpsOptions,app).listen(PORT, function() {
    console.log('Https App started on port ' + PORT);
    
  });

}

if(process.env.ENVIRONMENT == "prod"){
  app.listen(3000, "localhost", console.log("Server running"));

}


function ensureSecure(req, res, next){
  if(req.secure){
    // OK, continue
    return next();
  };
  // handle port numbers if you need non defaults
  res.redirect('https://' + req.hostname + req.url); // express 4.x
}


  // app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
