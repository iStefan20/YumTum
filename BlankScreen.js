import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import Colour from './Colour';

const BlankScreen = ({ route, navigation }) => {
  const { cart } = route.params || {};
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    phone: '',
    email: ''
  });
  const [activeField, setActiveField] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const inputRefs = {
    name: useRef(),
    addressLine1: useRef(),
    addressLine2: useRef(),
    city: useRef(),
    postcode: useRef(),
    phone: useRef(),
    email: useRef()
  };

  useEffect(() => {
    if (!cart || cart.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Please add items to your cart before placing an order.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [cart, navigation]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const focusNextField = (nextField) => {
    inputRefs[nextField].current?.focus();
  };

  const validateForm = () => {
    const { name, addressLine1, city, postcode, phone, email } = formData;
    
    if (!name || !addressLine1 || !city || !postcode || !phone || !email) {
      Alert.alert('Missing Information', 'Please fill out all required fields.');
      return false;
    }

    if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i.test(postcode)) {
      Alert.alert('Invalid Postcode', 'Please enter a valid UK postcode.');
      inputRefs.postcode.current?.focus();
      return false;
    }

    if (!/^\d{11}$/.test(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 11-digit UK phone number.');
      inputRefs.phone.current?.focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      inputRefs.email.current?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const fullAddress = `${formData.addressLine1}${
      formData.addressLine2 ? ', ' + formData.addressLine2 : ''
    }, ${formData.city}, ${formData.postcode}`;

    const totalSum = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('£', ''));
      return sum + price * item.quantity;
    }, 0);

    setOrderDetails({
      ...formData,
      address: fullAddress,
      items: cart,
      total: totalSum
    });
    setOrderPlaced(true);
  };

  if (!cart || cart.length === 0) return null;

  if (orderPlaced) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>Your food is on its way</Text>
          
          <ScrollView style={styles.detailsContainer}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Delivery Details</Text>
              <Text style={styles.detailText}>{orderDetails.name}</Text>
              <Text style={styles.detailText}>{orderDetails.address}</Text>
              <Text style={styles.detailText}>{orderDetails.phone}</Text>
              <Text style={styles.detailText}>{orderDetails.email}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Your Order</Text>
              {orderDetails.items.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Text style={styles.itemName}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              ))}
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: £{orderDetails.total.toFixed(2)}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Delivery Information</Text>
        
        {Object.entries({
          name: 'Full Name *',
          addressLine1: 'Address Line 1 *',
          addressLine2: 'Address Line 2',
          city: 'City *',
          postcode: 'Postcode *',
          phone: 'Phone Number *',
          email: 'Email Address *'
        }).map(([field, placeholder], index) => (
          <View 
            key={field}
            style={[
              styles.inputContainer,
              activeField === field && styles.activeInputContainer
            ]}
          >
            <TextInput
              ref={inputRefs[field]}
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#999"
              value={formData[field]}
              onChangeText={(text) => handleChange(field, text)}
              onFocus={() => handleFocus(field)}
              onBlur={handleBlur}
              returnKeyType={index === 6 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index < 6) {
                  focusNextField(Object.keys(formData)[index + 1]);
                }
              }}
              multiline={field.includes('addressLine')}
              textAlignVertical={field.includes('addressLine') ? 'top' : 'center'}
              keyboardType={
                field === 'phone' ? 'phone-pad' :
                field === 'email' ? 'email-address' :
                'default'
              }
            />
          </View>
        ))}

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colour.background,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: Colour.primary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeInputContainer: {
    borderWidth: 1.5,
    borderColor: Colour.primary,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 50,
  },
  submitButton: {
    backgroundColor: Colour.primary,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colour.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 18,
    color: Colour.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colour.accent,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: Colour.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    color: Colour.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    color: Colour.text,
    fontWeight: '600',
  },
  totalContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colour.primary,
  },
  homeButton: {
    backgroundColor: Colour.accent,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BlankScreen;