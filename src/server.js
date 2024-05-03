
const express = require('express');
const app = express();
const port = 3000; // You can choose any available port

var admin = require("firebase-admin");

// var serviceAccount = require("E:/Cutomerfeedbackapi/config/serviceAccountKey.json");
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://opinionai-a2613-default-rtdb.firebaseio.com'
});

// Initialize Firebase Admin SDK

 // Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");

try {

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlHmvf9A4uY6osrbtw5AjnXK6Kw2jWjv4",
  authDomain: "opinionai-a2613.firebaseapp.com",
  projectId: "opinionai-a2613",
  storageBucket: "opinionai-a2613.appspot.com",
  messagingSenderId: "808932314858",
  appId: "1:808932314858:web:fb06c8554e38fbd84a1193"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1); // Exit the process if Firebase initialization fails
}

const axios = require('axios');



// Endpoint to fetch data from Instagram and save to Firebase
// app.get('/fetch-instagram-data', async (req, res) => {
//   try {
//     const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,
//     caption&access_token=IGQWRQYTZACcVkzbnhzcmlnRnJNV0VHMWtxOVRfQjR2dWZAOUksxekh2XzhUa3FFNVpCNENKdWlrS01teGZAUTnVPNkdmLVNUcDFvT3lLUmJ0emlaNmdHSDNXUkFIVWF2Tk5rTUw3eWdoOFpGSmN3eDl4anhFTU5sRm8ZD`);
//     // const db = admin.database();
//     const db = admin.firestore();

//     const ref = db.ref('instagramData');
//     await ref.set(response.data);
//     res.json({ success: true, message: 'Instagram data saved to firestore' });
//   } catch (error) {
//     console.error('Error fetching Instagram data:', error);
//     res.status(500).json({ success: false, message: 'Error fetching Instagram data' });
//   }
// });

app.get('/fetch-instagram-data', async (req, res) => {
  const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN
  try {
    const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,timestamp,permalink,username,thumbnail_url,children,
    caption&access_token=${IG_ACCESS_TOKEN}`);

    // Firestore setup (assuming you have initialized Firebase)
    const firestore = admin.firestore();
    const collectionRef = firestore.collection('instagramPosts'); // Replace with your desired collection name

    // Loop through each media post in the response
    for (const post of response.data.data) {
      // Convert timestamp string to a JavaScript Date object
      const timestamp = new Date(post.timestamp);

      // Add each post with timestamp as a Timestamp object
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


// app.get('/fetch-instagram-data', async (req, res) => {
//   try {
//     // const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,
//     // caption,timestamp,permalink,username,thumbnail_url,children,comments_count,like_count,
//     // caption&access_token=IGQWRQYTZACcVkzbnhzcmlnRnJNV0VHMWtxOVRfQjR2dWZAOUksxekh2XzhUa3FFNVpCNENKdWlrS01teGZAUTnVPNkdmLVNUcDFvT3lLUmJ0emlaNmdHSDNXUkFIVWF2Tk5rTUw3eWdoOFpGSmN3eDl4anhFTU5sRm8ZD`);
    
    
//     const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,timestamp,permalink,username,thumbnail_url,children,
//     caption&access_token=IGQWRNWW04Y1BIUlp3ZAzFDdXRfeGpQWkEwR3QxcmFpMGVlYVRvdTJoa18wVFYxbGpzNjJ1dFI0a3lSb2hxWk0xekRVWGhmaTFJbXNoX2N2dUV3bjdhUGFsMko2TGk3VE4zSkVRV1dHSU1sRXlkX2tXTEpkbUdhT1EZD`);

//     // Firestore setup (assuming you have initialized Firebase)
//     const firestore = admin.firestore();
//     const collectionRef = firestore.collection('instagramPosts'); // Replace with your desired collection name

//     // Loop through each media post in the response
//     for (const post of response.data.data) {
//       await collectionRef.add(post);  // Add each post as a document
//     }

//     res.json({ success: true, message: 'Instagram data saved to Firestore' });
//   } catch (error) {
//     console.error('Error fetching Instagram data:', error);
//     res.status(500).json({ success: false, message: 'Error fetching Instagram data' });
//   }
// });


// // Define a basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


