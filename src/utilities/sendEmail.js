require("dotenv").config();
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS is automatically used
  auth: {
    user: process.env.Brevo_loggedIn_id,
    pass: process.env.Brevo_smt_key,
  },
  debug: true, // Add this to enable detailed logs
  logger: true, // And this
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"ConnectDev" <${process.env.Otp_Sender_EmailId}>`,
      to,
      subject,
      html,
    });

    return true; // Indicate success
  } catch (error) {
    throw error; // Re-throw the error so the caller knows it failed
  }
};

module.exports = sendEmail;
