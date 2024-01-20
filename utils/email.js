const nodeMailer = require('nodemailer')

module.exports = class Email {
  constructor() {
    // this.to = user.email
    // this.firstName = user.name.split('')[0]
    // this.url = url
    this.from = `Mike Anthony`
  }

  transporter() {
    return nodeMailer.createTransport({
      // service: 'Gmail',
      // host: 'smtp.gmail.com',
      // auth: {
      //   user: 'mikeanthony595@gmail.com',
      //   pass: 'wsrmzoigikdgjmjs',
      // },
      host: 'sandbox.smtp.mailtrap.io',
      auth: {
        user: '7302bc4eb44a55',
        pass: 'deb5751a3434a9',
      },
    })
  }

  // Send the actual email
  async sendEmail(subject = 'G-UP Registration') {
    // email options
    const mailOptions = {
      from: this.from,
      // to: this.to,
      to: 'mikeanthony594@gmail.com',
      subject,
      text: 'Welcome to G-UP xD',
      html: '<h1>Welcome to G-UP xD</h1>',
    }

    // 3) Create a transport and send email
    await this.transporter().sendMail(mailOptions)

    console.log('Email Sent')
  }

  // Send the actual email for forgotpassword
  async sendEmailPassword(url) {
    // email options
    const mailOptions = {
      from: this.from,
      // to: this.to,
      to: 'mikeanthony594@gmail.com',
      subject: 'Password Reset Token',
      text: 'Welcome to G-UP xD',
      html: `<h1>Your reset password url is ${url}</h1>`,
    }

    // 3) Create a transport and send email
    await this.transporter().sendMail(mailOptions)

    console.log('Email Sent')
  }
}
