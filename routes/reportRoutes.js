const express = require('express')

const reportController = require('../controllers/reportController')
const authController = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .post(reportController.createReport)
  .get(
    authController.authenticated,
    authController.restrictTo('admin'),
    reportController.getAllReport,
  )

module.exports = router
