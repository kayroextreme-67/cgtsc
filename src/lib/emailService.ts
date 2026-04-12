import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = 'service_c0zuocl';
const TEMPLATE_ID = 'template_bzcb7s6';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ncZ3h9XPi9OjWMjg8';

export const sendApprovalEmail = async (name: string, email: string) => {
  try {
    const templateParams = {
      name: name,
      email: email,
      message: 'Your account has been successfully approved. You can now access your dashboard, notices, and results.',
      login_url: `https://${window.location.hostname}/login`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email sent successfully!', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
