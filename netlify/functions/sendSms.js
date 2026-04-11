exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { phone, message } = JSON.parse(event.body);

    if (!phone || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Phone and message are required' }) };
    }

    const apiKey = process.env.RUPANTOR_API_KEY;
    
    if (!apiKey) {
      console.warn('RUPANTOR_API_KEY is not set');
      return { statusCode: 500, body: JSON.stringify({ error: 'SMS service is not configured' }) };
    }

    // Rupantor SMS API endpoint (typical format, adjust if needed)
    const response = await fetch('https://rupantorsms.com/api/v2/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        recipient: phone,
        message: message,
        sender_id: 'CGTSC' // Assuming a default sender ID
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };
  } catch (error) {
    console.error('SMS Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send SMS' })
    };
  }
};
