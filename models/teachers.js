const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const teacherSchema = new mongoose.Schema({
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




teacherSchema.pre('save', async function(next) {
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




teacherSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
};



const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;