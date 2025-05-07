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
import DiscountOffersScreen from './DiscountOffersScreen';
import { CartProvider } from './CartContext';


const Stack = createStackNavigator();

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8f8f8',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CountryList" component={CountryListScreen} options={{ title: 'Countries' }} />
          <Stack.Screen name="YumList" component={FoodListScreen} options={({ route }) => ({ title: `${route.params.country} Cuisine` })} />
          <Stack.Screen name="YumDetails" component={DishDetailsScreen} options={{ title: 'Dish Details' }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Menu' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
          <Stack.Screen name="Blank" component={BlankScreen} options={{ title: 'Order Confirmation' }} />
          <Stack.Screen name="DiscountOffers" component={DiscountOffersScreen} options={{ title: 'Discounts & Offers' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;