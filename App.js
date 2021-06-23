import * as React from 'react';
import { Text, View, StyleSheet ,Image} from 'react-native';
import {createAppContainer} from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookTransactions from './screens/BookTransactions'
import  SearchScreen  from './screens/SearchScreen'

export default class App extends React.Component{
  render(){
 return (
   <AppContainer/>
  );
  }
 
}

const TabNavigator = createBottomTabNavigator({
  Transaction: {screen: BookTransactions},
  Search : {screen: SearchScreen}
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon : ({})=>{
        var routeName = navigation.state.routeName;
        if(routeName === 'Transaction'){
          return (
            <Image source={ require('./assets/book.png')}
               style={{width: 40,height: 40}}
                  />
       )
        }
        else if (routeName === "Search") {
          return(
              <Image source={ require('./assets/searchingbook.png')}
              style={{width: 40,height: 40}} />
        )
      }
        }
      })
  })

var AppContainer = createAppContainer(TabNavigator)