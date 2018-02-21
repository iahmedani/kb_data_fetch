require('dotenv').config();

const
  express = require('express'),
  mongoose = require('mongoose'),
  engine = require('ejs-mate'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),  
  request = require('request'),
  util = require('util'),
  flash = require('connect-flash'),
  parseString = require('xml2js').parseString,
  passport = require('passport'),
  passportConf = require('./config/passport'),
  app = express();

mongoose.connect(process.env.DB_URL, (err)=>{
  if(err) return console.log('DB connection failed');
  console.log('Db connected');
});

app.use(express.static(__dirname+'/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({url: process.env.DB_URL, autoReconnect: true})
}));
app.use(flash());
app.use(function (req, res, next) {
  app.locals.user = req.user;
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(passport.initialize());
app.use(passport.session());



// var options = { method: 'GET',
//   url: 'http://me.wfp.org.pk:8001/wfppakistan/forms/94/form.xml',
//   headers: 
//    { 'Postman-Token': '2935daec-a881-863e-38ce-b55eb3d733d8',
//      'Cache-Control': 'no-cache',
//      Authorization: 'Token 6001d69ff8eeeca1a2f8853a6fb23eafe53ae114' } };


//      app.get('/', (req, res)=>{
//       request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//        parseString(body, (err, result)=>{
//          console.log(typeof result);
//         var formId = Object.keys(result["h:html"]["h:head"][0]["model"][0]["instance"][0]);
//         var formQuestions = result["h:html"]["h:head"][0]["model"][0]["instance"][0][formId][0];
//         res.send(Object.keys(formQuestions));

//        })
//       });
//      })

require('./routes/test')(app, passport);




app.listen(process.env.PORT, (err)=>{
  if(err) return console.log(err);
  console.log(`App is running on port ${process.env.PORT}`);
});