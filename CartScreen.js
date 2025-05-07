import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Button, Alert, Modal, TextInput, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from './CartContext';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define which categories contain alcoholic drinks
const alcoholicCategories = [
  'Beverages', 
  'Mexican Beverages',
  'Japanese Beverages',
  'Italian Beverages'
];

const alcoholicDrinkNames = [
  'Țuică',
  'Palincă',
  'Romanian Wine',
  'Romanian Beer',
  'Peroni',
  'Sake',
  'Tequila',
  'Margarita',
  'Moscow Mule',
  'Aperol Spritz',
  'Fetească Neagră',
  'Assyrtiko'
];

const discountOptions = {
  'SAVE10': { value: 0.1, name: '10% Off' },
  'SAVE15': { value: 0.15, name: '15% Off' },
  'SAVE20': { value: 0.2, name: '20% Off' },
};

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <View style={styles.cartItem}>
    <View style={styles.itemInfo}>
      <Text style={styles.dishName}>{item.name}</Text>
      <Text style={styles.dishPrice}>{item.price}</Text>
    </View>
    <View style={styles.controlsContainer}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, discount, discountName, applyDiscount } = useContext(CartContext);
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [isAgeVerificationModalVisible, setAgeVerificationModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date(2000, 4, 15)); // Default to May 15, 2000
  const inputRef = useRef(null);

  useEffect(() => {
    if (isDiscountModalVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDiscountModalVisible]);

  const totalSum = cart.reduce((sum, item) => sum + parseFloat(item.price.slice(1)) * item.quantity, 0);
  const discountedTotal = totalSum * (1 - discount);

  const hasAlcoholicDrinks = cart.some(item => 
    alcoholicCategories.includes(item.category) || 
    alcoholicDrinkNames.includes(item.name)
  );

  const handleApplyDiscount = () => {
    const found = discountOptions[discountCode.toUpperCase()];
    if (found) {
      applyDiscount(found.value, found.name);
      setDiscountModalVisible(false);
      setDiscountCode('');
      Alert.alert('Discount Applied', `You've successfully applied ${found.name}!`);
    } else {
      Alert.alert('Invalid Code', 'The discount code you entered is not valid.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const verifyAge = () => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add some items before checking out.');
      return;
    }

    if (hasAlcoholicDrinks) {
      setAgeVerificationModalVisible(true);
    } else {
      proceedToCheckout();
    }
  };

  const proceedToCheckout = () => {
    if (hasAlcoholicDrinks && !verifyAge()) {
      Alert.alert(
        'Age Verification Failed', 
        'You must be at least 18 years old to order alcoholic drinks. Please remove them from your cart to proceed.',
        [
          { text: 'OK', onPress: () => setAgeVerificationModalVisible(false) }
        ]
      );
      return;
    }

    navigation.navigate('Blank', { cart });
    clearCart();
    setAgeVerificationModalVisible(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          {hasAlcoholicDrinks && (
            <View style={styles.ageWarning}>
              <Ionicons name="warning" size={20} color="#D1495B" />
              <Text style={styles.ageWarningText}>Your cart contains alcoholic drinks. Age verification will be required at checkout.</Text>
            </View>
          )}

          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            )}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.subtotal}>Subtotal: £{totalSum.toFixed(2)}</Text>

            {discount > 0 ? (
              <>
                <Text style={styles.discountApplied}>
                  Discount ({discountName}): -£{(totalSum * discount).toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => applyDiscount(0, '')} style={styles.removeDiscountButton}>
                  <Text style={styles.removeDiscountText}>Remove Discount</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setDiscountModalVisible(true)} style={styles.addDiscountButton}>
                <Ionicons name="pricetag" size={16} color="#D1495B" />
                <Text style={styles.addDiscountText}>Add Discount Code</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.totalSum}>Total: £{discountedTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Continue Shopping" onPress={() => navigation.goBack()} color="#A1A1A1" />
            <View style={styles.buttonSpacer} />
            <Button title="Check Out Now" onPress={handleCheckout} color="#D1495B" />
          </View>
        </>
      )}

      {/* Discount Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isDiscountModalVisible}
        onRequestClose={() => setDiscountModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Discount</Text>

            <TextInput
              ref={inputRef}
              style={styles.discountInput}
              placeholder="Enter discount code"
              value={discountCode}
              onChangeText={setDiscountCode}
              autoCapitalize="characters"
            />

            <Text style={styles.availableCodesText}>Available codes: SAVE10, SAVE15, SAVE20</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDiscountModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.applyButton]} onPress={handleApplyDiscount}>
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Age Verification Modal */}
            <Modal
        animationType="slide"
        transparent
        visible={isAgeVerificationModalVisible}
        onRequestClose={() => setAgeVerificationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: Platform.OS === 'ios' ? '90%' : '80%' }]}>
            <Text style={styles.modalTitle}>Age Verification</Text>
            <Text style={styles.ageVerificationText}>
              Your order includes alcoholic beverages. In accordance with the law, we are required to verify that you are at least 18 years of age. Please have a valid ID ready for verification upon collection or delivery.
            </Text>
            
            {Platform.OS === 'android' && (
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
                <Ionicons name="calendar" size={24} color="#D1495B" />
              </TouchableOpacity>
            )}

            {(showDatePicker || Platform.OS === 'ios') && (
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                  textColor="#000000"  // Ensure text is visible
                  themeVariant="light"  // Light theme for better visibility
                />
              </View>
            )}

            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="calendar"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setAgeVerificationModalVisible(false);
                  setShowDatePicker(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.applyButton]} 
                onPress={proceedToCheckout}
              >
                <Text style={styles.modalButtonText}>Verify Age</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#FFF8F0' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#2E2E2E' 
  },
  emptyCartText: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#A1A1A1' 
  },
  cartItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    flexDirection: 'column',
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dishName: { 
    fontSize: 16, 
    color: '#2E2E2E',
    flex: 2,
  },
  dishPrice: { 
    fontSize: 16, 
    color: '#A1A1A1',
    textAlign: 'right',
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#FFBC80',
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  quantityButtonText: { 
    fontSize: 18, 
    color: '#FFF',
    fontWeight: 'bold',
  },
  quantityText: { 
    fontSize: 16, 
    marginHorizontal: 15, 
    color: '#2E2E2E',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: { 
    padding: 10,
    backgroundColor: '#D1495B', 
    borderRadius: 5,
    marginLeft: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  removeButtonText: { 
    color: '#FFF', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 15,
  },
  subtotal: { 
    fontSize: 16, 
    textAlign: 'right', 
    color: '#2E2E2E', 
    marginBottom: 5 
  },
  discountApplied: { 
    fontSize: 16, 
    textAlign: 'right', 
    color: '#D1495B', 
    marginBottom: 5 
  },
  removeDiscountButton: { 
    alignSelf: 'flex-end', 
    marginBottom: 10 
  },
  removeDiscountText: { 
    color: '#FF4444', 
    fontSize: 14 
  },
  addDiscountButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  addDiscountText: { 
    color: '#264653', 
    fontSize: 14, 
    marginLeft: 5 
  },
  totalSum: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#2E2E2E',
    marginTop: 5,
    marginBottom: 20,
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  buttonSpacer: { 
    width: 10 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#2E2E2E' 
  },
  discountInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  availableCodesText: { 
    fontSize: 12, 
    color: '#A1A1A1', 
    marginBottom: 20 
  },
  modalButtonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  modalButton: { 
    padding: 12, 
    borderRadius: 5, 
    width: '48%', 
    alignItems: 'center' 
  },
  cancelButton: { 
    backgroundColor: '#F0F0F0' 
  },
  applyButton: { 
    backgroundColor: '#D1495B' 
  },
  modalButtonText: { 
    color: '#FFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  ageWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2F2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  ageWarningText: {
    color: '#D1495B',
    marginLeft: 10,
    fontSize: 14,
  },
  ageVerificationText: {
    fontSize: 16,
    color: '#2E2E2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  datePickerWrapper: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: Platform.OS === 'ios' ? 10 : 0,
  },
  datePicker: {
    width: '100%',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#FFF',
  },
  dateText: {
    fontSize: 16,
    color: '#2E2E2E',
  },
});

export default CartScreen;