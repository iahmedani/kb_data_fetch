const mongoose = require('mongoose'),
      bcrypt = require('bcryptjs'),
      Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: String,
  connectors: [{
    name: String,
    conType: String,
    url: String,
    authKey: String
  }]
}, {timestamps: true});

UserSchema.methods.genHash = function(password){
  return bcrypt.hashSync(password, 10);
};

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);