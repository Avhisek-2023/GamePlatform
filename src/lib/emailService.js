// const sendResetPasswordEmail = async (name, email, token) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//     console.log(transporter);

//     const mailOptions = {
//       from: "app.testplatform123@gmail.com",
//       to: email,
//       subject: "For Reset password",
//       html: `<b>Hii ${name}, Please click this link <a href=http://localhost:8004/api/auth/reset-password?token=${token}>reset your password></a> </b>`,
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log("error", error);
//       } else {
//         console.log("Mail has been sent", info.response);
//       }
//     });
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// };
