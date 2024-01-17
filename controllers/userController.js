const User = require('../models/userModel')
const catchAsyncErrors = require('../utils/catchAsyncErrors')

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    message: 'success',
    results: users.length,
    data: users,
  })
})
