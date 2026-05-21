import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../app/store';
import { ROUTES } from '../utils';

const paymentOptions = [
  'Cash on delivery',
  'Credit card',
  'Apple Pay',
  'Google Pay',
];

const PaymentMethodsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const paymentMethod = useSelector((state: RootState) => state.cart.paymentMethod);

  const selectPaymentMethod = (method: string) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
    navigation.navigate(ROUTES.CART as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a payment method</Text>
      <Text style={styles.subtitle}>Default is Cash on delivery.</Text>

      {paymentOptions.map((method) => {
        const isSelected = method === paymentMethod;
        return (
          <TouchableOpacity
            key={method}
            style={[styles.option, isSelected ? styles.optionSelected : null]}
            onPress={() => selectPaymentMethod(method)}
          >
            <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>
              {method}
            </Text>
            {isSelected ? <Text style={styles.selectedLabel}>Selected</Text> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF5F7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 24,
  },
  option: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EDEDED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFECEF',
  },
  optionText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#FF6B9D',
  },
  selectedLabel: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '700',
  },
});

export default PaymentMethodsScreen;
