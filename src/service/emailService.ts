import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || '' });

const sendEmail = async (to: string, subject: string, text: string) => {
    return mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
        from: 'Your Service <your_email@domain.com>',
        to,
        subject,
        text,
    });
};

export default { sendEmail };
