import Nodemailer from "nodemailer";
import {MailtrapTransport} from "mailtrap";

type MailMessage = {
  to: string;
  subject: string;
  text: string;
};
const TOKEN = process.env.MAILTRAP_TOKEN;

const sender = {
  address: "benedictdev31@gmail.com",
  name: "InvoGen",
};



export const sendDemoMail = async (message: MailMessage) => {

  transport
  .sendMail({
    from: sender,
    to: message.to,
    subject: message.subject,
    text: message.text,
  })
  .then(console.log, console.error);
};




const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN!,
  })
);

