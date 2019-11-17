import express from 'express';
import Expo from 'expo-server-sdk';
import kafka from 'kafka-node';

const app = express(); // creates express server app
const expo = new Expo(); // new instance of expo server sdk

let savedPushTokens = []; // storing tokens that are registered with the app
const PORT_NUMBER = 5656; // port on which you want to run your server on

app.use(express.json());

const Consumer = kafka.Consumer;
// The client specifies the ip of the Kafka producer and uses the zookeeper port 2181
const client = new kafka.KafkaClient("localhost:2181");
// The consumer object specifies the client and topic(s) it subscribes to
const consumer = new Consumer(client, [ { topic: 'employee', partition: 0 } ], { autoCommit: true });
consumer.on('message', function (message) {
    // grab the main content from the Kafka message
    var data = JSON.parse(message.value);
    handlePushTokens(data);
});

// Save user expo token
const saveToken = (token) => {
    if (savedPushTokens.indexOf(token === -1)) {
      savedPushTokens.push(token);
    }
}

// Handler for sending push notifications
const handlePushTokens = (message) => {
    let notifications = [];
    let response = {};
    switch(message.type){
        case 'IntimationCreatedKafkaEvent':
            response.title = 'WFH',
            response.content = 'Sneha is WFH today'
            break;
        case 'IntimationCancelledKafkaEvent':
            response.title = 'Cancelled WFH',
            response.content = 'Sneha has cancelled her WFH request'
            break;
        default:
            response.title = '',
            response.content = ''
            break;
    }  
    console.log(response);
    for (let pushToken of savedPushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }
      notifications.push({
        to: pushToken,
        sound: 'default',
        title: response.title,
        body: response.content,
        data: message
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
