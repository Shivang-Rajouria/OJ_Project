const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    passwordHash: {type: String, required:true},
    rating: {type:Number, default: 1500}
})

// export default mongoose.model('User', userSchema);
module.exports=mongoose.model('User',userSchema);