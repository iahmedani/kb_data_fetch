module.exports.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash('warning', 'Please login to access portal');
    res.redirect('/');
  }
};