export const getApprovalEmailTemplate = (name: string, loginUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #2563eb; padding: 30px 20px;">
              <img src="https://i.postimg.cc/BbRmYQJ0/IMG-20260405-034640.jpg" alt="CGTSC Logo" width="80" style="display: block; border-radius: 50%; border: 3px solid #ffffff; margin-bottom: 15px; background-color: #ffffff;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Account Approved</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #0f172a; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #334155; line-height: 1.6;">
                Great news! Your account for the Chatkhil Government Technical School and College Student Portal has been successfully approved by an administrator.
                <br><br>
                You now have full access to your dashboard, notices, and academic results.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 30px; border-radius: 8px; transition: background-color 0.2s;">Login to Portal</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Chatkhil Government Technical School and College<br>
                &copy; 2026 All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendApprovalEmail = async (email: string, name: string) => {
  const RESEND_API_KEY = 're_UpjbSEAP_D9nTevzaSQEzePufdNdzt8E8';
  const loginUrl = window.location.origin;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CGTSC Portal <onboarding@resend.dev>',
        to: email,
        subject: 'Account Approved - CGTSC Portal',
        html: getApprovalEmailTemplate(name, loginUrl)
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending approval email:', error);
    return { success: false, error };
  }
};
