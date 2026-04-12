export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const data = req.body;
    
    // =====================================================================
    // 🔒 SECURE CONFIGURATION (Never exposed to frontend)
    // =====================================================================
    const RUPANTOR_API_URL = "https://payment.rupantorpay.com/api/payment/checkout"; 
    const API_KEY = process.env.RUPANTOR_API_KEY; 
    const DOMAIN = process.env.FRONTEND_DOMAIN || "cgtsc.vercel.app"; 
    
    if (!API_KEY) {
      console.error("Missing RUPANTOR_API_KEY environment variable");
      return res.status(500).json({ error: "Payment gateway configuration missing on server." });
    }
    
    const ADMISSION_FEE = data.amount || "500"; 
    
    const SUCCESS_URL = `https://${DOMAIN}/payment-success`; 
    const CANCEL_URL = `https://${DOMAIN}/apply`;
    // =====================================================================

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

    const response = await fetch(RUPANTOR_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'X-CLIENT': DOMAIN
      },
      body: paymentPayload
    });

    const resultData = await response.json();

    if (response.ok && resultData && resultData.payment_url) {
      return res.status(200).json({ payment_url: resultData.payment_url });
    } else {
      console.error("Rupantor API Error Response:", resultData);
      return res.status(500).json({ 
        error: "Failed to generate payment URL from gateway.",
        details: resultData 
      });
    }

  } catch (error) {
    console.error("Vercel Function Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error. Could not process payment request.", message: error.message });
  }
}
