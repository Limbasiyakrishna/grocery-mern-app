const axios = require('axios').default;
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
axiosCookieJarSupport(axios);
const jar = new tough.CookieJar();
(async () => {
  try {
    const register = await axios.post('http://localhost:5000/api/user/register', { name: 'testuser', email: 'testuser+api@example.com', password: 'Password123!' }, { jar, withCredentials: true });
    console.log('register', register.data);

    const create = await axios.post('http://localhost:5000/api/payment/dummy/create-order', {
      userId: register.data.user ? register.data.user._id : null,
      items: [{ product: '000000000000000000000000', quantity: 1, price: 100 }],
      addressId: '000000000000000000000000',
      coupon: null,
      amount: 100,
      subtotal: 100,
      taxValue: 0,
      platformFee: 0,
      paymentType: 'CARD'
    }, { jar, withCredentials: true });
    console.log('create order', create.data);

    const orderId = create.data.orderId;
    const verify = await axios.post('http://localhost:5000/api/payment/dummy/verify', { orderId }, { jar, withCredentials: true });
    console.log('verify', verify.data);

    const status = await axios.get('http://localhost:5000/api/payment/status/' + orderId, { jar, withCredentials: true });
    console.log('status', status.data);
  } catch (e) {
    console.error('error', e.response ? e.response.data : e.message);
  }
})();
