const https = require('https');
https.get('https://rupantorpay.com/developers/docs', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const text = data.replace(/<[^>]*>?/gm, '');
    const start = text.lastIndexOf('Sample Request');
    console.log(text.substring(start, start + 4000));
  });
});
