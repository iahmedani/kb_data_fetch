const User = require('../models/user'),
      isLoggedIn = require('../models/utils').isLoggedIn;
module.exports = function(app, passport){
  app.get('/', (req, res)=>{
    res.render('pages/index');
  });
  app.route('/register')
    .get((req, res)=>{
      if(!req.user){
      res.render('pages/register')        
      } else {
        res.redirect('/')
      }
    })
    .post((req, res)=>{
      var newUser = User();
      newUser.email = req.body.email
      newUser.password = newUser.genHash(req.body.password);
      newUser.save((err, user)=>{
        if(err) return console.log(err);
        req.flash('info', `User registered, please login to access portal`);
        res.redirect('/login');
      })
    });
  app.route('/login')
    .get((req, res)=>{
      if(!req.user){
      res.render('pages/login')        
      } else {
        res.redirect('/')
      }
    })
  .post(passport.authenticate('local'),(req, res)=>{
    req.flash('info', 'User logged in');
    res.redirect('/');
  });
  app.get('/connectors',isLoggedIn, (req, res)=> {
    res.render('pages/connectors');
  });
  app.route('/connectors/kobo')
    .get(isLoggedIn, (req, res)=>{
      res.render('pages/kobo')
    })
    .post(isLoggedIn, (req, res)=>{
      var conType = 'kobo';
      User.findById(req.user._id, (err, user)=>{
        user.connectors.push({
          name: req.body.name,
          conType: conType,
          url: req.body.url,
          authKey: req.body.token
        });
        user.save((err, newUser)=>{
          req.flash('info', `Connector namely ${newUser.connectors(newUser.connectors.length -1).name} added successfully`);
          res.redirect('/connectors');
        });
      });
    });
  
}