import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, Modal, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import Constants from 'expo-constants';

const PUSH_REGISTRATION_ENDPOINT = 'http://72d9a5c7.ngrok.io/token';
const MESSAGE_ENPOINT = ' http://72d9a5c7.ngrok.io/message';

export default class App extends Component {
  state = {
    notification: null,
    messageText: ''
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
    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token
        },
        user: {
          username: 'marley',
          name: 'Dan Ward'
        },
      }),
    });
  }

  handleNotification = (notification) => {
    this.setState({ notification: notification });
    console.log(this.state);
  }

  handleChangeText = (text) => {
    this.setState({ messageText: text });
  }

  sendMessage = async () => {
    fetch(MESSAGE_ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: this.state.messageText,
      }),
    });
    this.setState({ messageText: '' });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.messageText}
          onChangeText={this.handleChangeText}
          style={styles.textInput}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={this.sendMessage}
        >
        <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#474747',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 50,
    width: 300,
    borderColor: '#f6f6f6',
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  button: {
    padding: 10
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  },
  label: {
    fontSize: 18
  }
});
