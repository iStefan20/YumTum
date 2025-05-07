import React, { useLayoutEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colour from './Colour';
import { CartContext } from './CartContext';
import { foodData } from './FoodListData';

const CountryListScreen = ({ navigation }) => {
  const { cart } = useContext(CartContext); // Get cart from context
  const countries = [
    { id: '1', name: 'Romania' },
    { id: '2', name: 'Italy' },
    { id: '3', name: 'Greece' },
    { id: '4', name: 'China' },
    { id: '5', name: 'Mexico' },
    { id: '6', name: 'Japan' },
    { id: '7', name: 'USA' },
    { id: '8', name: 'Worldwide' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search', { foodData })}
            style={{ marginRight: 20 }}
          >
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')}
            style={styles.cartButton}
          >
            <Ionicons name="cart" size={24} color="black" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, cart]); // Add cart to dependencies

  const handleCountrySelect = (country) => {
    navigation.navigate('YumList', { country: country.name });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select a Country</Text>
        <FlatList
          data={countries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.countryItem} onPress={() => handleCountrySelect(item)}>
              <Text style={styles.countryName}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colour.muted} />
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('DiscountOffers')}
      >
        <Ionicons name="pricetags" size={32} color="#fff" />
        <Text style={styles.floatingButtonText}>Offers</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colour.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colour.primary,
  },
  countryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colour.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colour.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 18,
    color: Colour.text,
  },
  floatingButton: {
    position: 'absolute',
    width: 70,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colour.accent,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 80,
    left: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  // Add these new styles for the cart badge
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: Colour.accent,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CountryListScreen;