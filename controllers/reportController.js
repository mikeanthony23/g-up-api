const Report = require('../models/reportModel')
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
  console.log(reports)
  res.status(200).json({
    message: 'success',
    results: reports.length,
    data: reports,
  })
})
