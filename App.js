import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './WelcomeScreen';
import CountryListScreen from './CountryListScreen';
import FoodListScreen from './FoodListScreen';
import SearchScreen from './SearchScreen';
import DishDetailsScreen from './DishDetailsScreen';
import CartScreen from './CartScreen';
import BlankScreen from './BlankScreen'; 
import { CartProvider } from './CartContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CountryList" component={CountryListScreen} />
          <Stack.Screen name="YumList" component={FoodListScreen} />
          <Stack.Screen name="YumDetails" component={DishDetailsScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Blank" component={BlankScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
