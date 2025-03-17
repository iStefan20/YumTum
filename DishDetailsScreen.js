import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CartContext } from './CartContext';

const DishDetailsScreen = ({ route }) => {
  const { addToCart } = useContext(CartContext);
  const { dish } = route.params;

  const handleAddToCart = () => {
    addToCart(dish);
    Alert.alert("Added to Cart", `${dish.name} has been added to the cart.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dishName}>{dish.name}</Text>
      <Text style={styles.dishPrice}>{dish.price}</Text>
      <Text style={styles.dishDescription}>{dish.description}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dishPrice: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  dishDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default DishDetailsScreen;
