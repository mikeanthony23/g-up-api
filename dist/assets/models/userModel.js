const crypto=require("crypto"),mongoose=require("mongoose"),validator=require("validator"),bcrypt=require("bcryptjs"),userSchema=new mongoose.Schema({firstName:{type:String,required:[!0,"A user must have a First Name"],minLength:2,maxlength:255},lastName:{type:String,required:[!0,"A user must have a Last Name"],minLength:2,maxlength:255},photo:{type:String,default:"default.png"},email:{type:String,required:[!0,"A user must have an email"],unique:!0},phoneNumber:{type:String,required:[!0,"A user must have a password"],minLength:11,maxlength:11,unique:!0,immutable:!0},password:{type:String,required:[!0,"Please provide a password"],minlength:8,select:!1},passwordConfirm:{type:String,required:[!0,"Please add your confirmation password"],validate:{validator:function(e){return e===this.password},message:"Passwords are not the same"},select:!1},role:{type:String,enum:["user","admin"],default:"user"},createdAt:{type:Date,default:Date.now()},passwordChangedAt:Date,passwordResetToken:String,passwordResetExpires:Date,active:{type:Boolean,default:!0,select:!1}});userSchema.pre("save",(async function(e){if(!this.isModified("password"))return e();this.password=await bcrypt.hash(this.password,12),this.passwordConfirm=void 0})),userSchema.pre("save",(function(e){if(!this.isModified("password")||this.isNew)return e();this.passwordChangedAt=Date.now()-1e3,e()})),userSchema.methods.correctPassword=async function(e,s){return await bcrypt.compare(e,s)},userSchema.methods.changePasswordAfter=function(e){if(this.passwordChangedAt)return e<parseInt(this.passwordChangedAt.getTime()/1e3,10)},userSchema.methods.createPasswordResetToken=function(){const e=crypto.randomBytes(32).toString("hex");return this.passwordResetToken=crypto.createHash("sha256").update(e).digest("hex"),this.passwordResetExpires=Date.now()+6e5,e},userSchema.pre(/^find/,(function(e){this.find({active:{$ne:!1}}),e()}));const User=mongoose.model("user",userSchema);module.exports=User;