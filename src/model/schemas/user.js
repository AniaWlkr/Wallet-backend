const bcrypt = require('bcryptjs');
// const gravatar = require('gravatar');
const { Schema } = require('mongoose');
// const { Subscription } = require('../../helpers/constants');
const SALT_FACTOR = 10;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    accessToken: {
      type: String,
      default: null,
    },
    accessTokenExpireAt: {
      type: Date,
      min: '2020-01-01',
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    refreshTokenExpireAt: {
      type: Date,
      min: '2020-01-01',
      default: null,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0.0,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(
    this.password,
    bcrypt.genSaltSync(SALT_FACTOR),
  );
  next();
});

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = { userSchema };
