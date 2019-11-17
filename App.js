// React Dependencies
import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, Modal, TouchableOpacity } from 'react-native';
import {createAppContainer, NavigationEvents} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

// Expo dependencies
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

//Component dependencies
import Home from './screens/home';
import Notitication from './screens/notifications';

const AppNavBar = createBottomTabNavigator(
  {
    HomePage: {
      screen: Home,
      navigationOptions: {
        tabBarLabel:"Home",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-home" size={32} color={tintColor} />
        )
      },
    },
    NotificationsPage: {
      screen: Notitication,
      navigationOptions: {
        tabBarLabel:"Settings",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-notifications" size={32} color={tintColor} />
        )
      }
    },
  },

  {
    order: ['HomePage', 'NotificationsPage'],
    tabBarOptions: {
      activeTintColor: '#3780BE',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'white',
      },
      showLabel: false
    },
  },
);
 
//making a StackNavigator to export as default
const App = createStackNavigator({
  TabScreen: {
    screen: AppNavBar,
    navigationOptions: {
      headerTintColor: '#FFFFFF',
      title: '',
    },
  },
});


export default createAppContainer(App);
