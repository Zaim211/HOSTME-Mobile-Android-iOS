const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema({
  username: { type:String, required:true },
  email: { type:String, required:true },
  password: { type:String, required:true },
  pictureProfile: {
    type:[String],
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    required:true
  },
}, { timestamps: true })

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel