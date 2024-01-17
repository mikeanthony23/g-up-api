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
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'mikeanthony595@gmail.com',
        pass: 'wsrmzoigikdgjmjs',
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
}
