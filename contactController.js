require("dotenv").config({ path: "./credentials.env" });
const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Email to Admin
  const adminMailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    text: `
    Name: ${name}
    Email: ${email}
    Mobile: ${phone}
    Subject: ${subject}
    Message: ${message}
    `,
  };

   // Confirmation Email to User
   const userMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your message has been received",
    text: `
    Hi ${name},
    
    Thank you for reaching out! We have received your message and will get back to you shortly.
    
    Here are the details you provided:
    
    Name: ${name}
    Email: ${email}
    Mobile: ${phone}
    Subject: ${subject}
    Message: ${message}
    
    Best Regards,
    Versatile Chettinad Restaurant Team
    `,
  };

   try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
    res.status(200).json({ success: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to send email: ${error.message}` });
}
};

module.exports = sendMail;
