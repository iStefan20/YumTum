import React, { useContext, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from './CartContext';
import { foodData } from './FoodListData';
import Colour from './Colour';

const { width } = Dimensions.get('window');

const DiscountOffersScreen = ({ navigation }) => {
  const { applyDiscount, addToCart, cart } = useContext(CartContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Discounts & Offers',
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}
        >
          <Ionicons name="cart" size={24} color={Colour.primary} />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, cart]);

  const discounts = [
    { id: '1', name: '10% Off', code: 'SAVE10', value: 0.1, icon: 'pricetag' },
    { id: '2', name: '15% Off', code: 'SAVE15', value: 0.15, icon: 'pricetag' },
    { id: '3', name: '20% Off', code: 'SAVE20', value: 0.2, icon: 'pricetag' },
  ];

  const mealDeals = [
    { id: '1', name: 'Balkan Combo', description: 'Mici + Pork Steak + Mustard + Palincă ', discount: 0.15, items: ['3', '7', '100', '14'] },
    { id: '3', name: 'American Favorites', description: 'Burger + BBQ Ribs + Apple Pie + Milkshake ', discount: 0.1, items: ['85', '86', '91', '98'] },
    { id: '4', name: 'Balkan Feast', description: 'Ciorbă de perișoare + Tochitură + Baklava', discount: 0.15, items: ['6', '2', '41', '16'] },
    { id: '5', name: 'Mediterranean Trio', description: 'Tzatziki + Spaghetti allo Scoglio + Galaktoboureko', discount: 0.1, items: ['44', '26', '42', '16'] },
    { id: '6', name: 'Asian Explorer', description: 'Dumplings + Tonkatsu + Mochi', discount: 0.2, items: ['51', '74', '76', '81'] },
    { id: '7', name: 'Latin Fiesta', description: 'Guacamole + Tacos + Tres leches', discount: 0.15, items: ['57', '63', '68'] },
    { id: '8', name: 'Vegetarian World Tour', description: 'Spanakopita + Pasta Quattro Formaggi + Papanasi', discount: 0.1, items: ['40', '27', '10', '15'] },
    { id: '9', name: 'Meat Lover\'s Dream', description: 'Mici + BBQ Ribs + Cozonac', discount: 0.15, items: ['3', '86', '11', '14'] },
    { id: '10', name: 'Date Night Package', description: 'Peking Duck + Fettuccine Alfredo + Tiramisu', discount: 0.2, items: ['48', '24', '28', '16'] },
    { id: '11', name: 'Street Food Sampler', description: 'Tacos + Souvlaki + Okonomiyaki + Churros', discount: 0.2, items: ['57', '38', '75', '63', '83'] },
    { id: '12', name: 'Quick Lunch: Gyros Combo', description: 'Gyros + Fries + Orange juice', discount: 0.2, items: ['39', '101', '106'] },
    { id: '13', name: 'Quick Lunch: Burger Combo', description: 'Burger + Onion rings + Milkshake', discount: 0.1, items: ['85', '101', '98'] }
  ];

  const handleApplyDiscount = (discount) => {
    applyDiscount(discount.value, discount.name);
    Alert.alert(
      '🎉 Discount Applied',
      `${discount.name} (${discount.code}) has been activated!`,
      [{ text: 'OK', onPress: () => navigation.navigate('Cart') }]
    );
  };

  const handleMealDealSelection = (deal) => {
    deal.items.forEach(itemId => {
      const foodItem = foodData.find(item => item.id === itemId);
      if (foodItem) addToCart(foodItem);
    });
    applyDiscount(deal.discount, deal.name);
    
    Alert.alert(
      '🍽️ Added to Cart',
      `"${deal.name}" with ${deal.discount * 100}% discount has been added to your cart!`,
      [{ text: 'OK' }]  // Changed from "VIEW CART" to "OK"
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Discount Vouchers Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="pricetag" size={22} color={Colour.accent} />
          <Text style={styles.sectionTitle}>Discount Vouchers</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Apply these codes at checkout</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {discounts.map((discount) => (
            <TouchableOpacity 
              key={discount.id}
              style={styles.discountCard}
              onPress={() => handleApplyDiscount(discount)}
            >
              <View style={styles.discountIconContainer}>
                <Ionicons name={discount.icon} size={24} color={Colour.primary} />
              </View>
              <Text style={styles.discountName}>{discount.name}</Text>
              <Text style={styles.discountCode}>{discount.code}</Text>
              
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Meal Deals Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant" size={22} color={Colour.accent} />
          <Text style={styles.sectionTitle}>Featured Meal Deals</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Complete meals at discounted prices</Text>
        
        <View style={styles.mealDealsContainer}>
          {mealDeals.map((deal) => (
            <View key={deal.id} style={styles.mealDealCard}>
              {deal.image && (
                <Image 
                  source={{ uri: deal.image }} 
                  style={styles.mealDealImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.mealDealContent}>
                <View style={styles.mealDealHeader}>
                  <Text style={styles.mealDealName}>{deal.name}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{deal.discount * 100}% OFF</Text>
                  </View>
                </View>
                
                <Text style={styles.mealDealDescription}>{deal.description}</Text>
                
                <View style={styles.mealItemsContainer}>
                  {deal.items.slice(0, 3).map(itemId => {
                    const item = foodData.find(f => f.id === itemId);
                    return (
                      <View key={itemId} style={styles.mealItem}>
                        <Ionicons name="restaurant" size={14} color={Colour.accent} />
                        <Text style={styles.mealItemName}>{item?.name}</Text>
                      </View>
                    );
                  })}
                  {deal.items.length > 3 && (
                    <Text style={styles.moreItems}>+ {deal.items.length - 3} more items</Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => handleMealDealSelection(deal)}
                >
                  <Text style={styles.addButtonText}>ADD TO CART</Text>
                  <Ionicons name="cart" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colour.background,
  },
  cartButton: {
    marginRight: 15,
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colour.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colour.muted,
    marginBottom: 15,
    marginLeft: 32,
  },
  horizontalScroll: {
    paddingLeft: 10,
    paddingBottom: 15,
  },
  discountCard: {
    width: 160,
    padding: 20,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: Colour.card,
    borderWidth: 1,
    borderColor: Colour.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discountIconContainer: {
    backgroundColor: Colour.primary + '20',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  discountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colour.text,
  },
  discountCode: {
    fontSize: 14,
    color: Colour.muted,
    marginTop: 5,
  },
  discountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colour.accent,
    marginTop: 10,
  },
  mealDealsContainer: {
    marginTop: 10,
  },
  mealDealCard: {
    backgroundColor: Colour.card,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colour.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealDealImage: {
    width: '100%',
    height: 150,
  },
  mealDealContent: {
    padding: 20,
  },
  mealDealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealDealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colour.text,
    flex: 1,
  },
  discountBadge: {
    backgroundColor: Colour.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  discountBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mealDealDescription: {
    fontSize: 14,
    color: Colour.muted,
    marginBottom: 15,
    lineHeight: 20,
  },
  mealItemsContainer: {
    marginBottom: 15,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealItemName: {
    fontSize: 13,
    color: Colour.text,
    marginLeft: 8,
  },
  moreItems: {
    fontSize: 12,
    color: Colour.muted,
    marginTop: 5,
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colour.primary,
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 14,
  },
});

export default DiscountOffersScreen;