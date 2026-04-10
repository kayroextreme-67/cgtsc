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
    const API_KEY = process.env.RUPANTOR_API_KEY || "iL0lFlwFPatsCs9gDh9lGBPvm7wE"; // Fallback for local testing
    const DOMAIN = process.env.FRONTEND_DOMAIN || "cgtsc.netlify.app"; // Your domain for X-CLIENT header
    
    // Use the amount from the frontend, fallback to 500 if not provided
    const ADMISSION_FEE = data.amount || "500"; 
    
    const SUCCESS_URL = `https://${DOMAIN}/payment-success`; 
    const CANCEL_URL = `https://${DOMAIN}/apply`;
    // =====================================================================

    // Construct payload for Rupantor Pay API based on documentation
    const paymentPayload = {
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
    };

    // Call Rupantor Pay API
    const response = await fetch(RUPANTOR_API_URL, {
      method: 'POST',
      headers: { 
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'X-CLIENT': DOMAIN
      },
      body: JSON.stringify(paymentPayload)
    });

    const result = await response.json();

    // Check if the gateway returned a valid payment URL
    if (response.ok && result && result.payment_url) {
      // Return the secure payment URL back to the frontend
      return {
        statusCode: 200,
        body: JSON.stringify({ payment_url: result.payment_url })
      };
    } else {
      console.error("Rupantor API Error Response:", result);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "Failed to generate payment URL from gateway.",
          details: result 
        })
      };
    }

  } catch (error) {
    console.error("Netlify Function Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error. Could not process payment request." })
    };
  }
};
