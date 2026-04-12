export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required' });
    }

    const apiKey = process.env.RUPANTOR_API_KEY;
    
    if (!apiKey) {
      console.warn('RUPANTOR_API_KEY is not set');
      return res.status(500).json({ error: 'SMS service is not configured' });
    }

    const response = await fetch('https://rupantorsms.com/api/v2/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        recipient: phone,
        message: message,
        sender_id: 'CGTSC' 
      })
    });

    const data = await response.json();

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('SMS Error:', error);
    return res.status(500).json({ error: 'Failed to send SMS' });
  }
}
