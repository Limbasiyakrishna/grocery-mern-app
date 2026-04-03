import axios from "axios";

(async () => {
  try {
    console.log('starting register call');
    const register = await axios.post('http://127.0.0.1:5000/api/user/register', {
      name: 'testuser3', email: 'testuser3+api@example.com', password: 'Password123!'
    });
    console.log('register success', register.data);
  } catch (e) {
    console.error('register error', e.code, e.message);
    if (e.response) {
      console.error('status', e.response.status, e.response.data);
    }
  }
})();
