import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Colour from './Colour';

const WelcomeScreen = ({ navigation }) => {
  const [postcode, setPostcode] = useState('');
  const [selectedOption, setSelectedOption] = useState('delivery');
  const [error, setError] = useState('');

  const validatePostcode = (postcode) => {
    // Basic UK postcode validation regex
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  };

  const handlePostcodeChange = (text) => {
    setPostcode(text);
    if (error) setError('');
  };

  const handleContinue = () => {
    const trimmedPostcode = postcode.trim();
    
    if (!trimmedPostcode) {
      setError('Please enter a postcode');
      return;
    }
    
    if (!validatePostcode(trimmedPostcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }
    
    navigation.navigate('CountryList', { 
      orderType: selectedOption,
      postcode: trimmedPostcode.toUpperCase()
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Welcome to YumTum</Text>
          
          {/* Description */}
          <Text style={styles.description}>
            From east to west, we serve the best. No ticket, no flight just flavors done right!
          </Text>

          {/* Postcode Section */}
          <View style={styles.postcodeSection}>
            <Text style={styles.sectionTitle}>Enter your postcode</Text>
            <Text style={styles.sectionSubtitle}>
              For example, AL10 9AB
            </Text>

            <TextInput
              style={[
                styles.postcodeInput,
                error ? styles.inputError : null
              ]}
              placeholder="Enter your postcode"
              value={postcode}
              onChangeText={handlePostcodeChange}
              autoCapitalize="characters"
              placeholderTextColor="#999"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Order Type Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOption === 'delivery' && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedOption('delivery')}
            >
              <Text style={[
                styles.optionText,
                selectedOption === 'delivery' && styles.optionTextSelected
              ]}>
                DELIVERY
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOption === 'collection' && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedOption('collection')}
            >
              <Text style={[
                styles.optionText,
                selectedOption === 'collection' && styles.optionTextSelected
              ]}>
                COLLECT
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !postcode.trim() && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!postcode.trim()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colour.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
    color: Colour.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: Colour.text,
    lineHeight: 22,
  },
  postcodeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: Colour.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  postcodeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: Colour.error,
  },
  errorText: {
    color: Colour.error,
    marginTop: 5,
    fontSize: 14,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionButtonSelected: {
    backgroundColor: Colour.primary,
    borderColor: Colour.primary,
  },
  optionText: {
    fontWeight: '600',
    color: Colour.text,
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: Colour.accent,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default WelcomeScreen;