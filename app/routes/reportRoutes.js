const express = require('express')

const reportController = require('../controllers/reportController')
const authController = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .post(
    reportController.uploadReportImages,
    reportController.resizeReportImages,
    reportController.createReport,
  )
  .get(
    authController.authenticated,
    authController.restrictTo('admin'),
    reportController.getAllReport,
  )
  .patch(
    authController.authenticated,
    authController.restrictTo('admin'),
    reportController.updateReportStatus,
  )

router.post(
  '/reportImages',
  authController.authenticated,
  reportController.uploadReportImages,
  reportController.resizeReportImages,
)

router.patch(
  '/updateStatus/',
  authController.authenticated,
  authController.restrictTo('admin'),
  reportController.updateReportStatus,
)
module.exports = router
