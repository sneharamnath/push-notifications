// React Dependencies
import React, { Component } from 'react';
import { View, Text } from 'react-native';

// Expo dependencies
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

const PUSH_REGISTRATION_ENDPOINT = 'http://a805b47e.ngrok.io/token';
export class Home extends Component {
  
  state = {
    notification: null
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
    this.notificationSubscription = Notifications.addListener(this.handleNotification);
  }

  // Handle registering push notification token to the server
  registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token
        }
      }),
    });
  }

  handleNotification = (notification) => {
    this.setState({ notification });
    const {navigate} = this.props.navigation;
    navigate('NotificationsPage');
  }

  render() {
    return (
      <View>
        <Text>This is the home screen</Text>
      </View>
    )
  }
}

export default Home