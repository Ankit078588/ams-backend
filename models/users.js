const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  email: {
    type: String, // Email ID
    required: true,
    unique: true,
  },
  password: {
    type: String, // Password
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});




userSchema.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')) next();

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    }catch(err){
        console.log('Error: '+ err);
        next(err);
    }
});




userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
};



const User = mongoose.model('User', userSchema);
module.exports = User;