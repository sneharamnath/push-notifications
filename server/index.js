import express from 'express';
import Expo from 'expo-server-sdk';

const app = express(); // creates express server app
const expo = new Expo(); // new instance of expo server sdk

let savedPushTokens = []; // storing tokens that are registered with the app
const PORT_NUMBER = 5656; // port on which you want to run your server on

app.use(express.json());

// Save user expo token
const saveToken = (token) => {
    if (savedPushTokens.indexOf(token === -1)) {
      savedPushTokens.push(token);
    }
}
// Handler for sending push notifications
const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }
      notifications.push({
        to: pushToken,
        sound: 'default',
        title: 'Message received!',
        body: message,
        data: { message }
      })
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

// Express routes : TODO move it into a seperate file
// Default route
app.get('/', (req, res) => {
    res.send('Push Notification Server Running At port 5656');
});


// Endpoint for saving push notification token
app.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    res.send(`Received push token, ${req.body.token.value}`);
});

// Endpoint for receiving the message sent from the client
app.post('/message', (req, res) => {
    console.log(req.body);
    handlePushTokens(req.body.message);
    console.log(`Received message, ${req.body.message}`);
    res.send(`Received message, ${req.body.message}`);
});

app.listen(PORT_NUMBER, () => {
    console.log('Server Online on Port' + PORT_NUMBER);
});
