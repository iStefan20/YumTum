import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, 
  KeyboardAvoidingView, Platform 
} from 'react-native';

const BlankScreen = ({ route, navigation }) => {
  const { cart } = route.params || {};

  useEffect(() => {
    if (!cart || cart.length === 0) {
      Alert.alert('Error', 'No items in the cart. Please add items before placing an order.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [cart, navigation]);

  if (!cart || cart.length === 0) {
    return null; 
  }

  const [name, setName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const totalSum = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('£', ''));
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = () => {
    if (!name || !addressLine1 || !city || !postcode || !phone || !email) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode)) {
      Alert.alert('Error', 'Please enter a valid UK postcode.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 11-digit UK phone number.');
      return;
    }

    const orderDetails = {
      name,
      address: `${addressLine1}, ${addressLine2}, ${city}, ${postcode}`,
      phone,
      email,
      items: cart,
      total: totalSum,
    };

    setOrderDetails(orderDetails);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thank you!</Text>
        <Text style={styles.subtitle}>Your order is on its way!</Text>
        <ScrollView>
          <Text style={styles.sectionTitle}>Order Details:</Text>
          <Text style={styles.detailText}>- Name: {orderDetails.name}</Text>
          <Text style={styles.detailText}>- Address: {orderDetails.address}</Text>
          <Text style={styles.detailText}>- Phone: {orderDetails.phone}</Text>
          <Text style={styles.detailText}>- Email: {orderDetails.email}</Text>
          <Text style={styles.sectionTitle}>Items Ordered:</Text>
          {orderDetails.items.map((item, index) => (
            <Text key={index} style={styles.detailText}>
              - {item.name} (x{item.quantity}) - {item.price}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>Total: £{orderDetails.total.toFixed(2)}</Text>
        </ScrollView>
        <Button title="Back to Home" onPress={() => navigation.navigate('Welcome')} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Place Your Order</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => this.address1Input.focus()} 
        />
        <TextInput
          ref={(input) => (this.address1Input = input)}
          style={styles.input}
          placeholder="Address Line 1 *"
          value={addressLine1}
          onChangeText={setAddressLine1}
          returnKeyType="next"
          onSubmitEditing={() => this.address2Input.focus()} 
        />
        <TextInput
          ref={(input) => (this.address2Input = input)}
          style={styles.input}
          placeholder="Address Line 2"
          value={addressLine2}
          onChangeText={setAddressLine2}
          returnKeyType="next"
          onSubmitEditing={() => this.cityInput.focus()} 
        />
        <TextInput
          ref={(input) => (this.cityInput = input)}
          style={styles.input}
          placeholder="City *"
          value={city}
          onChangeText={setCity}
          returnKeyType="next"
          onSubmitEditing={() => this.postcodeInput.focus()} 
        />
        <TextInput
          ref={(input) => (this.postcodeInput = input)}
          style={styles.input}
          placeholder="Postcode *"
          value={postcode}
          onChangeText={setPostcode}
          returnKeyType="next"
          onSubmitEditing={() => this.phoneInput.focus()} 
        />
        <TextInput
          ref={(input) => (this.phoneInput = input)}
          style={styles.input}
          placeholder="Phone Number *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => this.emailInput.focus()} 
        />
        <TextInput
          ref={(input) => (this.emailInput = input)}
          style={styles.input}
          placeholder="Email Address *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="done"
        />
        <Button title="Place Order" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#5DE2E7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BlankScreen;
