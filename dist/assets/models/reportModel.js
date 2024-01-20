const mongoose=require("mongoose"),reportSchema=new mongoose.Schema({gcashNumber:{type:Number,required:[!0,"A report must have a gcash number"]},gcashName:{type:String,required:[!0,"A report must have a gcash name"]},gcashRefNum:{type:Number,required:[!0,"A report must have a reference number"]},amount:{type:Number,required:[!0,"A report must have a amount"]},field:{type:String,required:[!0,"A report must have a field"]},date:{type:Date,required:[!0,"A report must have a date"]},createdAt:{type:Date,default:Date.now()},incidentReport:{type:String},status:{type:String,enum:["pending","approved","rejected","deleted"],default:"pending"},user:{type:mongoose.Schema.ObjectId,ref:"User",required:[!0,"Report must belong to a user."]}},{toJSON:{virtuals:!0},toObject:{virtuals:!0}}),Report=mongoose.model("Report",reportSchema);module.exports=Report;