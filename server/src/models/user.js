import mongoose from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId


const Schema = new mongoose.Schema({
  email: {type: String, require: true},
  name: { type: String },
  createDate: {type: Date, default: Date.now}
})

const User = mongoose.model('User', Schema)

export default User
