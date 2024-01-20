const crypto=require("crypto"),bcrypt=require("bcryptjs"),{promisify}=require("util"),jwt=require("jsonwebtoken"),User=require("../models/userModel"),AppError=require("../utils/appError"),catchAsyncErrors=require("../utils/catchAsyncErrors"),Email=require("../utils/email"),signToken=e=>jwt.sign({id:e},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN}),createSendToken=(e,r,s,o)=>{const a=signToken(e._id);o.cookie("jwt",a,{expires:new Date(Date.now()+24*process.env.JWT_COOKIE_EXPIRES_IN*60*60*1e3),httpOnly:!0}),e.password=void 0,o.status(r).json({status:"success",token:a,data:{user:e}})};exports.signup=catchAsyncErrors((async(e,r,s)=>{const o=await User.create({firstName:e.body.firstName,lastName:e.body.lastName,email:e.body.email,phoneNumber:e.body.phoneNumber,password:e.body.password,passwordConfirm:e.body.passwordConfirm,role:e.body.role});o&&await(new Email).sendEmail(),createSendToken(o,201,0,r)})),exports.login=catchAsyncErrors((async(e,r,s)=>{const{email:o,password:a}=e.body;if(!o||!a)return s(new AppError("Please provide number and password!",400));const t=await User.findOne({email:o}).select("+password");if(!t||!await t.correctPassword(a,t.password))return s(new AppError("Incorrect number or password",401));createSendToken(t,200,0,r)})),exports.logout=(e,r,s)=>{r.cookie("jwt","loggedout",{expires:new Date(Date.now()+1e4),httpOnly:!0}),r.status(200).json({status:"success"})},exports.authenticated=catchAsyncErrors((async(e,r,s)=>{let o;if(e.headers.authorization&&e.headers.authorization.startsWith("Bearer")?o=e.headers.authorization.split(" ")[1]:e.cookies.jwt&&(o=e.cookies.jwt),!o)return s(new AppError("You are not logged in!! Please login in to get access.",401));const a=await promisify(jwt.verify)(o,process.env.JWT_SECRET),t=await User.findById(a.id);return t?t.changePasswordAfter(a.iat)?s(new AppError("User recently changed password! Please login again",401)):(e.user=t,void s()):s(new AppError("The token belongs to this user does not exist"))})),exports.restrictTo=(...e)=>(r,s,o)=>{if(!e.includes(r.user.role))return o(new AppError("You dont have enough permission to perform this operation",401));o()},exports.forgotPassword=catchAsyncErrors((async(e,r,s)=>{const o=await User.findOne({email:e.body.email});if(!o)return s(new AppError("There is no user with email address",404));const a=o.createPasswordResetToken();await o.save({validateBeforeSave:!1});try{const s=`${e.protocol}://${e.get("host")}/api/v1/users/resetPassword/${a}`;console.log(s),await(new Email).sendEmailPassword(s),r.status(200).json({status:"success",message:"Token sent to email!!"})}catch(e){return console.log(e),o.passwordResetToken=void 0,o.passwordResetExpires=void 0,await o.save({validateBeforeSave:!1}),s(new AppError("There was an error sending the email. Pls try again later"),500)}})),exports.resetPassword=catchAsyncErrors((async(e,r,s)=>{const o=crypto.createHash("sha256").update(e.params.token).digest("hex"),a=await User.findOne({passwordResetToken:o,passwordResetExpires:{$gt:Date.now()}});if(!a)return s(new AppError("Token is invalid or has expired",400));a.password=e.body.password,a.passwordConfirm=e.body.passwordConfirm,a.passwordResetToken=void 0,a.passwordResetExpires=void 0,await a.save(),createSendToken(a,200,0,r)})),exports.updatePassword=catchAsyncErrors((async(e,r,s)=>{const o=await User.findById(e.user.id).select("+password");if(!await o.correctPassword(e.body.passwordCurrent,o.password))return s(new AppError("Your current password is wrong.",401));o.password=e.body.password,o.passwordConfirm=e.body.passwordConfirm,await o.save(),createSendToken(o,200,0,r)}));