const nodeMailer=require("nodemailer");module.exports=class{constructor(){this.from="Mike Anthony"}transporter(){return nodeMailer.createTransport({host:"sandbox.smtp.mailtrap.io",auth:{user:"7302bc4eb44a55",pass:"deb5751a3434a9"}})}async sendEmail(t="G-UP Registration"){const o={from:this.from,to:"mikeanthony594@gmail.com",subject:t,text:"Welcome to G-UP xD",html:"<h1>Welcome to G-UP xD</h1>"};await this.transporter().sendMail(o),console.log("Email Sent")}async sendEmailPassword(t){const o={from:this.from,to:"mikeanthony594@gmail.com",subject:"Password Reset Token",text:"Welcome to G-UP xD",html:`<h1>Your reset password url is ${t}</h1>`};await this.transporter().sendMail(o),console.log("Email Sent")}};