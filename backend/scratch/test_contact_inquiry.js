const axios = require('axios');

async function testContactAPI() {
  try {
    console.log('--- Testing Contact Inquiry Submission ---');
    const submitRes = await axios.post('http://localhost:5000/api/contact/submit', {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.test@example.com',
      message: 'Hello IronPulse Gym! I want to join for 6 months membership with personal training. Please call me back.'
    });

    console.log('Submission Response:', submitRes.data);

    console.log('--- Logging in as Admin to test GET /api/contact ---');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'admin@ironpulse.com',
      password: 'admin123'
    });

    const token = loginRes.data.token;
    console.log('Admin Login Success, Token obtained.');

    const inquiriesRes = await axios.get('http://localhost:5000/api/contact', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`Fetched ${inquiriesRes.data.count} inquiries from MySQL:`);
    console.log(JSON.stringify(inquiriesRes.data.inquiries, null, 2));

    const inquiryId = inquiriesRes.data.inquiries[0].id;

    console.log(`--- Updating Inquiry #${inquiryId} Status to 'Contacted' ---`);
    const updateRes = await axios.patch(`http://localhost:5000/api/contact/${inquiryId}`, {
      status: 'Contacted',
      notes: 'Called Rahul on phone, scheduled gym visit for Thursday.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Update Response:', updateRes.data);

    console.log('🎉 ALL CONTACT INQUIRY TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
}

testContactAPI();
