export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // Parse form data - Vercel handles this automatically
    let name, email, message;
  
    // Check if data is in body or needs parsing
    if (req.body) {
      name = req.body.name;
      email = req.body.email;
      message = req.body.message;
    }
  
    // Log received data for debugging
    console.log('=== FORM SUBMISSION ===');
    console.log('Method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body:', req.body);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('=====================');
  
    // Validate data
    if (!name || !email || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { name, email, message }
      });
    }
  
    try {
      // Send email using Resend (if you have API key set up)
      if (process.env.RESEND_API_KEY && process.env.YOUR_EMAIL) {
        const response = await fetch('https://api.resend.com/emails', {
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
  
        const data = await response.json();
  
        if (!response.ok) {
          console.error('❌ Resend error:', data);
        } else {
          console.log('✅ Email sent successfully:', data);
        }
      } else {
        console.log('⚠️ Email API not configured - skipping email send');
      }
  
      // Always redirect to thank you page
      console.log('✅ Redirecting to thank you page...');
      return res.redirect(307, '/thankyou.html');
      
    } catch (error) {
      console.error('❌ Error:', error);
      
      // Still redirect even if email fails
      return res.redirect(307, '/thankyou.html');
    }
  }