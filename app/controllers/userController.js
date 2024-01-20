const User = require('../models/userModel')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const AppError = require('../utils/appError')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    message: 'success',
    results: users.length,
    data: users,
  })
})

exports.updateCurrentUser = catchAsyncErrors(async (req, res, next) => {
  // Give error message if users post password
  if (req.body.password) {
    next(new AppError('You are not allowed update password in this route', 401))
  }

  // allowd fields to be updated
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email')

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

exports.deactivate = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null,
  })
})
