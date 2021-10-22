require("dotenv").config();
const sgMail = require("@sendgrid/mail").setApiKey(
  process.env.SENDGRID_API_KEY
);
async function sendPasswordResetMail(name, to, token) {
  let url = `${process.env.BASEURL}/reset-password/${token}`;
  await sgMail.send({
    from: "vrajshah363@gmail.com",
    to,
    subject: "Password Reset",
    html:
      "<main style='margin-left:1rem;max-width:600px'><p style='font-size:1.7rem'>Hello " +
      name +
      "<p style='font-size:1rem'>A request has been received to change the password for your account.</p><button type='button' style='margin-top:1rem;margin-bottom:1rem;padding:0.5rem 1rem; background-color: white;border: 1px solid #03203C;'><a href='" +
      url +
      "' target='_blank' style='text-decoration:none;color: #03203C;'>Reset Password</a></button><p>If you didn't initiate this request, please contact us immediately at <a href='mailto:vrajshah363@gmail.com'>vrajshah363@gmail.com</a></p></main>",
  });
}

module.exports = sendPasswordResetMail;
