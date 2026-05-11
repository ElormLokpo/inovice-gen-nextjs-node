type MailMessage = {
  to: string;
  subject: string;
  text: string;
};

export const sendDemoMail = async (message: MailMessage) => {
  console.log("Demo email");
  console.log(`To: ${message.to}`);
  console.log(`Subject: ${message.subject}`);
  console.log(message.text);
};
