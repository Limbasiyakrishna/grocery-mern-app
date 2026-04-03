import { sendWelcomeEmail } from './utils/messageService.js';

console.log('Testing welcome email to your actual Gmail account...');
await sendWelcomeEmail({
  name: 'FreshNest User',
  email: 'freshnestmart8@gmail.com'
});
console.log('✅ Email sent! Check your Gmail inbox and spam folder for the welcome email.');
console.log('📧 If you see it, the email system is working perfectly!');