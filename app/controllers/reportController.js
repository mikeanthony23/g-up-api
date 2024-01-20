const Report = require('../models/reportModel')
const AppError = require('../utils/appError')
const catchAsyncErrors = require('../utils/catchAsyncErrors')

exports.createReport = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body)
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
