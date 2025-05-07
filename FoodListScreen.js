import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import DropdownList from './DropdownList';
import { foodData } from './FoodListData'; // Import the restructured foodData

const FoodListScreen = ({ route, navigation }) => {
  const { country } = route.params;

  // Define flag colors for each country
  const flagColors = {
    Romania: '#fdd116', // Yellow
    Italy: '#009246', // Green
    Greece: '#0D5EAF', // Blue
    China: '#DE2810', // Red
    Mexico: '#c5861f',
    Japan: '#ba012b',
    USA: '#200092',
    Worldwide: '#69359c',
  };

  // Get the scroll bar color based on the selected country
  const scrollBarColor = flagColors[country] || '#007BFF'; // Default to blue if no color is found

  // Filter foodData to get dishes for the selected country
  const foodCategories = foodData
    .filter((item) => item.country === country) // Filter dishes by country
    .reduce((acc, item) => {
      // Group dishes by category
      const category = item.category || 'Uncategorized'; // Use 'Uncategorized' if no category is provided
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

  // Convert the grouped dishes into an array of categories
  const foodCategoriesArray = Object.entries(foodCategories).map(([name, items]) => ({
    id: name, // Use category name as ID
    name, // Category name
    items, // List of dishes in this category
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={Platform.OS === 'ios'} // Show scroll bar only on iOS
        indicatorStyle={Platform.OS === 'ios' ? 'black' : 'default'} // iOS only
      >
        <Text style={styles.title}>Top Foods in {country}</Text>
        {foodCategoriesArray.map((category) => (
          <DropdownList
            key={category.id}
            title={category.name}
            items={category.items || []} // Ensure items is always an array
            onSelect={(dish) => navigation.navigate('YumDetails', { dish })} // Navigate to DishDetailsScreen
          />
        ))}
      </ScrollView>
      {/* Custom side bar for Android */}
      {Platform.OS === 'android' && (
        <View style={[styles.sideBar, { backgroundColor: scrollBarColor }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sideBar: {
    width: 5, // Width of the side bar
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default FoodListScreen;