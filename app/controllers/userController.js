const User = require('../models/userModel')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const AppError = require('../utils/appError')
const sharp = require('sharp')

const multer = require('multer')
const multerStorage = multer.memoryStorage()

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false)
  }
}
const uploadProfile = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.uploadProfilePhoto = uploadProfile.single('avatar')
exports.resizeUserPhoto = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    // .toFile(`app/uploads/images/users/${req.file.filename}`)
    .toFile(`http://nh-banner.kesug.com/uploads/${req.file.filename}`)

  next()
})

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
  if (req.file) filteredBody.photo = req.file.filename

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
