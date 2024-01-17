const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsyncErrors = require('../utils/catchAsyncErrors')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: req.secure || req.headers('x-forwarded-proto') === 'https',
  })

  // remove the password to the output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  })
  createSendToken(newUser, 201, req, res)
})

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { phoneNumber, password } = req.body

  //1.) Check if number and password exist
  if (!phoneNumber || !password) {
    return next(new AppError('Please provide number and password!', 400))
  }

  //2.) Check if user exsists and password is correct
  const user = await User.findOne({ phoneNumber }).select('+password')
  console.log(user)
  // console.log(password === user.password);

  await bcrypt.compare(password, user.password).then(res => {
    // res === true
    console.log(res)
  })
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect number or password', 401))
  }

  //3.) If everything is ok, send token to client
  createSendToken(user, 200, req, res)
})

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ status: 'success' })
}

exports.authenticated = catchAsyncErrors(async (req, res, next) => {
  // 1.) Getting token and check if its there
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError('You are not logged in!! Please login in to get access.', 401))
  }

  // 2.) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  // 3.) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError('The token belongs to this user does not exist'))
  }

  // 4.) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please login again', 401))
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`You dont have enough permission to perform this operation`, 401))
    }
    next()
  }
}

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // 1.) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with email address', 404))
  }

  // 2.) Generate the random token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
  // 3.) Send it to users email

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`

    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!!',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError('There was an error sending the email. Pls try again later'), 500)
  }
})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res)
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password')

  // 2) Check if Posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401))
  }

  // 3) If so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res)
})
