import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { foodData } from './FoodListScreen'; // Import foodData

const CountryListScreen = ({ navigation }) => {
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

  // Add search and cart icons to the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          {/* Search Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Search', { foodData })} // Navigate to the SearchScreen
            style={{ marginRight: 20 }}
          >
            <Ionicons name="search" size={24} color="black" /> {/* Search icon */}
          </TouchableOpacity>

          {/* Cart Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart" size={24} color="black" /> {/* Cart icon */}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleCountrySelect = (country) => {
    navigation.navigate('YumList', { country: country.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Country</Text>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.countryItem}
            onPress={() => handleCountrySelect(item)}
          >
            <Text style={styles.countryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  countryName: {
    fontSize: 18,
  },
});

export default CountryListScreen;