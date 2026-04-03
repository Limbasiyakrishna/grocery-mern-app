import { sendOrderConfirmationEmail, sendWelcomeEmail, sendPasswordResetEmail } from './utils/messageService.js';

// Sample data for testing
const sampleOrderData = {
  user: { name: 'Test User', email: 'test@example.com' },
  order: { _id: new Date().getTime().toString(), createdAt: new Date() },
  items: [
    { name: 'Apple', quantity: 2, price: 60, total: 120 },
    { name: 'Bread', quantity: 1, price: 45, total: 45 },
  ],
  address: {
    firstName: 'Test', lastName: 'User', houseNo: '101', area: 'Area', street: 'Street', city: 'City', state: 'State', zipCode: '123456', phone: '9999999999'
  },
  paymentType: 'COD', subtotal: 165, taxValue: 8.25, platformFee: 30, discount: { code: 'NONE', discountAmount: 0 }, totalAmount: 203.25
};

const sampleUserData = { name: 'Test User', email: 'test@example.com' };
const sampleResetData = { email: 'test@example.com', resetToken: 'abc123', userName: 'Test User' };

const run = async () => {
  console.log('Running email test...');
  await sendWelcomeEmail(sampleUserData);
  await sendOrderConfirmationEmail(sampleOrderData);
  await sendPasswordResetEmail(sampleResetData);
  console.log('Done');
};

run().catch(console.error);
