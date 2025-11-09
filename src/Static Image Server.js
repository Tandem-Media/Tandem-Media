// A lightweight Express server to serve static files (images)
// This is perfect for hosting assets for the WhatsApp API.

const express = require('express');
const path = require('path');
const app = express();

// Zeabur automatically assigns a port via the environment variable PORT.
// We default to 3000 for local testing.
const PORT = process.env.PORT || 3000;

// --- CRITICAL STEP ---
// This middleware tells Express to look inside a directory named 'public'
// and serve any files it finds there directly.
// You MUST create a folder named 'public' in your project root and place
// all your images (like 'invite.png') inside it.
app.use(express.static(path.join(__dirname, 'public')));

// Simple root route for health check/confirmation
app.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>WhatsApp Image Host</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; background: #f0f4f8; color: #333; }
          .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h1 { color: #1e40af; }
          code { background: #e0e7ff; padding: 2px 5px; border-radius: 4px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Image Host Active!</h1>
          <p>This server is running on port ${PORT}.</p>
          <p>To access an image, ensure it is placed in the <code>/public</code> folder.</p>
          <p>If you upload a file named <code>invite.jpg</code>, the WhatsApp API URL will be:</p>
          <p><strong><code>[YOUR_ZEABUR_DOMAIN]/invite.jpg</code></strong></p>
          <small>Zeabur automatically provides HTTPS for security and API compatibility.</small>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Static Image Host server is running on port ${PORT}`);
});