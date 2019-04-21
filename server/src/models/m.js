
import C from '../core/constants'
import bcrypt from 'bcrypt-nodejs'
import mongoose from '../core/mongoose'
let Schema = mongoose.Schema

let schemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
}

let validateLocalStrategyProperty = function (property) {
  return (this.provider !== 'local' && !this.updated) || property.length
}

let validateLocalStrategyPassword = function (password) {
  return this.provider !== 'local' || (password && password.length >= 6)
}

let UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be longer']
  },
  roles: {
    type: [
      {
        type: String,
        enum: [
          C.ROLE_ADMIN,
          C.ROLE_USER,
          C.ROLE_GUEST
        ]
      }
    ],
    default: [C.ROLE_USER]
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  verified: {
    type: Boolean,
    default: false
  },

  verifyToken: {
    type: String
  },

  lastLogin: {
    type: Date
  },

  metadata: {}

}, schemaOptions)


/**
 * Password hashing
 */
UserSchema.pre('save', function (next) {
  let user = this
  if (!user.isModified('password'))
    return next()
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      user.password = hash
      next()
    })
  })
})

/**
 * Password compare
 */
UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    cb(err, isMatch)
  })
}


let User = mongoose.model('User', UserSchema)

module.exports = User
