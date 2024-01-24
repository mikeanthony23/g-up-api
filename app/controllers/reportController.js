const sharp = require('sharp')
const multer = require('multer')

const Report = require('../models/reportModel')
const AppError = require('../utils/appError')
const catchAsyncErrors = require('../utils/catchAsyncErrors')

const multerStorage = multer.memoryStorage()

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

exports.uploadReportImages = uploadProfile.fields([{ name: 'gallery' }])
exports.resizeReportImages = catchAsyncErrors(async (req, res, next) => {
  if (!req.files) return next()

  // create file names
  const fileNames = req.files.gallery.map(
    (file, i) => (file.filename = `user-${req.user.id}-${Date.now()}-${i + 1}.jpeg`),
  )
  req.filenames = fileNames
  const galleryFileNames = req.filenames

  // upload images
  await req.files.gallery.forEach(async file => {
    await sharp(file.buffer).toFormat('jpeg').toFile(`app/uploads/images/reports/${file.filename}`)
  })

  res.status(201).json({
    status: 'success',
    images: galleryFileNames,
  })
})

exports.createReport = catchAsyncErrors(async (req, res, next) => {
  const report = await Report.create(req.body)
  res.status(201).json({
    message: 'success',
    report,
  })
})

exports.getAllReport = catchAsyncErrors(async (req, res, next) => {
  const reports = await Report.find()
  res.status(200).json({
    message: 'success',
    results: reports.length,
    data: reports,
  })
})

exports.updateReportStatus = catchAsyncErrors(async (req, res, next) => {
  const { reportId, status } = req.query
  const report = await Report.findByIdAndUpdate(
    reportId,
    { status },
    {
      new: true,
      runValidators: true,
    },
  )
  if (!report) {
    next(new AppError('No Report found by that report ID', 404))
  }

  res.status(200).json({
    message: 'success',
    report,
  })
})
