const express = require('express');
const app = express();
const port = 3000;

// Firebase Admin SDK initialization
var admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://opinionai-a2613-default-rtdb.firebaseio.com'
});

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");

try {
  const firebaseConfig = {
    apiKey: "AIzaSyDlHmvf9A4uY6osrbtw5AjnXK6Kw2jWjv4",
    authDomain: "opinionai-a2613.firebaseapp.com",
    projectId: "opinionai-a2613",
    storageBucket: "opinionai-a2613.appspot.com",
    messagingSenderId: "808932314858",
    appId: "1:808932314858:web:fb06c8554e38fbd84a1193"
  };

  initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

const axios = require('axios');

// Route to fetch Instagram data
app.get('/fetch-instagram-data', async (req, res) => {
  const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
  try {
    const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,timestamp,permalink,username,thumbnail_url,children,
    caption&access_token=${IG_ACCESS_TOKEN}`);

    const firestore = admin.firestore();
    const collectionRef = firestore.collection('instagramPosts');

    for (const post of response.data.data) {
      const timestamp = new Date(post.timestamp);
      await collectionRef.add({
        ...post,
        timestamp: admin.firestore.Timestamp.fromDate(timestamp)
      });
    }

    res.json({ success: true, message: 'Instagram data saved to Firestore' });
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).json({ success: false, message: 'Error fetching Instagram data' });
  }
});

// Landing page route with route table
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Routes</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            text-align: center;
            margin: 0;
            padding: 0;
          }
          h1 {
            color: #4CAF50;
            margin: 20px 0;
          }
          table {
            margin: 20px auto;
            border-collapse: collapse;
            width: 80%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px 20px;
            text-align: left;
          }
          th {
            background-color: #4CAF50;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          tr:hover {
            background-color: #ddd;
          }
          td a {
            color: #4CAF50;
            text-decoration: none;
          }
          td a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to the API</h1>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="/">/</a></td>
              <td>Landing page</td>
            </tr>
            <tr>
              <td><a href="/fetch-instagram-data">/fetch-instagram-data</a></td>
              <td>Fetch data from Instagram and save to Firestore</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
