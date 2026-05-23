import transporter
from "../../Config/email.js";

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome",
      html: `
        <h2>Hello ${name}</h2>
        <p>Welcome to our company.</p>
      `,
    });

    console.log("Email Sent");

  } catch (error) {
    console.log(error);
  }
};