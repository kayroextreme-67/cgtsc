exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' })
    };
  }

  try {
    // Parse the incoming student data from the frontend
    const data = JSON.parse(event.body);
    
    // =====================================================================
    // 🔒 SECURE CONFIGURATION (Never exposed to frontend)
    // =====================================================================
    const RUPANTOR_API_URL = "https://payment.rupantorpay.com/api/payment/checkout"; 
    const API_KEY = process.env.RUPANTOR_API_KEY; // Must be set in Netlify Environment Variables
    const DOMAIN = process.env.FRONTEND_DOMAIN || "cgtsc.netlify.app"; // Your domain for X-CLIENT header
    
    if (!API_KEY) {
      console.error("Missing RUPANTOR_API_KEY environment variable");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Payment gateway configuration missing on server." })
      };
    }
    
    // Use the amount from the frontend, fallback to 500 if not provided
    const ADMISSION_FEE = data.amount || "500"; 
    
    const SUCCESS_URL = `https://${DOMAIN}/payment-success`; 
    const CANCEL_URL = `https://${DOMAIN}/apply`;
    // =====================================================================

    // Construct payload for Rupantor Pay API based on documentation
    const paymentPayload = JSON.stringify({
      fullname: data.name,
      email: data.email,
      amount: ADMISSION_FEE,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      metadata: {
        phone: data.phone,
        address: data.address,
        classToApply: data.classToApply
      }
    });

    const https = require('https');
    const url = new URL(RUPANTOR_API_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'X-CLIENT': DOMAIN,
        'Content-Length': Buffer.byteLength(paymentPayload)
      }
    };

    const result = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: JSON.parse(responseBody)
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              data: responseBody
            });
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(paymentPayload);
      req.end();
    });

    // Check if the gateway returned a valid payment URL
    if (result.statusCode >= 200 && result.statusCode < 300 && result.data && result.data.payment_url) {
      // Return the secure payment URL back to the frontend
      return {
        statusCode: 200,
        body: JSON.stringify({ payment_url: result.data.payment_url })
      };
    } else {
      console.error("Rupantor API Error Response:", result.data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "Failed to generate payment URL from gateway.",
          details: result.data 
        })
      };
    }

  } catch (error) {
    console.error("Netlify Function Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error. Could not process payment request.", message: error.message })
    };
  }
};
