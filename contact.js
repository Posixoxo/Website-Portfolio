export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // Get form data
    const { name, email, message } = req.body;
  
    // Validate data
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      // Send email using Resend
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
        console.error('Resend error:', data);
        throw new Error('Failed to send email');
      }
  
      console.log('Email sent successfully:', data);
  
      // Redirect to thank you page
      return res.redirect(307, '/thankyou.html');
      
    } catch (error) {
      console.error('Error sending email:', error);
      return res.redirect(307, '/thankyou.html');
    }
  }