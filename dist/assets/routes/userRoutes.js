const express=require("express"),authController=require("../controllers/authController"),userController=require("../controllers/userController"),router=express.Router();router.post("/signup",authController.signup),router.post("/login",authController.login),router.post("/forgotPassword",authController.forgotPassword),router.patch("/resetPassword/:token",authController.resetPassword),router.use(authController.authenticated),router.get("/",authController.restrictTo("admin"),userController.getAllUser),router.patch("/me",userController.updateCurrentUser),router.patch("/updateMyPassword",authController.updatePassword),router.get("/deactivate",userController.deactivate),module.exports=router;