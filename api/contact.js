export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { name, email, message } = req.body;
  
    console.log('Received:', { name, email, message });
  
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Send email if configured
    if (process.env.RESEND_API_KEY && process.env.YOUR_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Contact Form <onboarding@resend.dev>',
            to: process.env.YOUR_EMAIL,
            subject: `New Contact from ${name}`,
            reply_to: email,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `
          })
        });
      } catch (error) {
        console.error('Email error:', error);
      }
    }
  
    return res.status(200).json({ success: true, redirect: '/thankyou.html' });
  }