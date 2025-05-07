import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CartContext } from './CartContext';
import Colour from './Colour';

const DishDetailsScreen = ({ route, navigation }) => {  // Added navigation to props
  const { addToCart } = useContext(CartContext);
  const { dish } = route.params;

  const handleAddToCart = () => {
    addToCart(dish);
    Alert.alert(
      "Added to Cart", 
      `${dish.name} has been added to the cart.`,
      [
        { 
          text: "OK", 
          onPress: () => navigation.goBack()  
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dishName}>{dish.name}</Text>
      <Text style={styles.dishPrice}>{dish.price}</Text>
      <Text style={styles.dishDescription}>{dish.description}</Text>
      <Button
        title="Add to Cart"
        color={Colour.accent}
        onPress={handleAddToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colour.background,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colour.primary,
  },
  dishPrice: {
    fontSize: 18,
    color: Colour.secondary,
    marginBottom: 20,
  },
  dishDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colour.text,
  },
});

export default DishDetailsScreen;
