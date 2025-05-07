import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { foodData } from './FoodListData'; // Import the restructured foodData

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState(''); // For search logic (no spaces)
  const [displayQuery, setDisplayQuery] = useState(''); // For displaying in the search bar (with spaces)
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (query) => {
    const trimmedQuery = query.trim().toLowerCase(); // Trim and convert to lowercase
    setDisplayQuery(query); // Keep the original query with spaces for display
    setSearchQuery(trimmedQuery.replace(/\s+/g, '')); // Store search query without spaces

    if (trimmedQuery.length === 0) {
      // If the query is empty, reset search results
      setSearchResult(null);
      return;
    }

    if (!foodData) {
      console.error('foodData is undefined');
      return;
    }

    // Normalize the search query to handle special characters
    const normalizedQuery = trimmedQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Filter foodData to find items that include the search query as a substring
    const result = foodData.filter((item) => {
      const normalizedItemName = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return normalizedItemName.includes(normalizedQuery); // Check if the query is a substring of the item name
    });

    setSearchResult(result.length > 0 ? result : null); // Update the search result (null if no results found)
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a dish..."
        value={displayQuery} // Display query with spaces in the input field
        onChangeText={handleSearch}
      />
      {searchResult ? (
        // Show results only when searchResult is not null
        searchResult.map((item, index) => (
          <Text key={index} style={styles.resultText}>
            {item.name} can be found in {item.country}.
          </Text>
        ))
      ) : searchQuery.length > 0 ? (
        <Text style={styles.noResultsText}>No results found.</Text>
      ) : null} {/* Only show the "No results found" message when there's a query */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchScreen;
