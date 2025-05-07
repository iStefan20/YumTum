import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colour from './Colour';

const DropdownList = ({ title, items, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)} 
        style={[
          styles.header,
          isExpanded && styles.headerExpanded
        ]}
        activeOpacity={0.85}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.arrow}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => {
                onSelect(item);
                setIsExpanded(false);
              }} 
              style={[
                styles.item,
                index === items.length - 1 && styles.lastItem
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colour.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colour.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colour.card,
  },
  arrow: {
    color: Colour.card,
    fontSize: 14,
  },
  itemsContainer: {
    backgroundColor: Colour.card,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colour.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontSize: 16,
    color: Colour.text,
  },
});

export default DropdownList;
