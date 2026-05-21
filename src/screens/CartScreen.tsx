import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../app/store';
import { ROUTES } from '../utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { items = [], paymentMethod = 'Cash on delivery' } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { createOrderLoading, createOrderSuccess, createOrderError } = useSelector(
    (state: RootState) => state.orders
  );

  const total = items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { ...item, quantity: newQuantity },
      });
    }
  };

  useEffect(() => {
    if (createOrderSuccess) {
      Alert.alert(
        'Order Placed',
        'Your order has been placed successfully.',
        [
          { text: 'View Orders', onPress: () => navigation.navigate(ROUTES.ORDERS) },
          { text: 'Continue Shopping', style: 'cancel' },
        ]
      );
      dispatch({ type: 'CLEAR_CREATE_ORDER_STATUS' });
    }
  }, [createOrderSuccess, dispatch, navigation]);

  const handleRemoveItem = (item: CartItem) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: item,
    });
  };

  const handlePaymentPress = () => {
    navigation.navigate(ROUTES.PAYMENT_METHODS as never);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add some items first!');
      return;
    }

    const orderPayload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
      })),
      shippingAddress: user?.address || '123 Ice Cream Ave',
      paymentMethod: paymentMethod || 'Cash on delivery',
      total,
    };

    dispatch({
      type: 'CREATE_ORDER_REQUEST',
      payload: orderPayload,
    });
  };

  const renderCartItem = (props: { item: CartItem }) => {
    const { item } = props;
    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.image || 'https://i.imgur.com/kPv3FkR.png' }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
          </Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => handleQuantityChange(item, -1)}
            >
              <Text style={styles.quantityBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => handleQuantityChange(item, 1)}
            >
              <Text style={styles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemoveItem(item)}
        >
          <Text style={styles.removeBtnText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🍦</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some delicious ice cream!</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate(ROUTES.PRODUCTS as never)}
        >
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.paymentRow}>
          <View>
            <Text style={styles.paymentLabel}>Payment method</Text>
            <Text style={styles.paymentValue}>{paymentMethod || 'Cash on delivery'}</Text>
          </View>
          <TouchableOpacity style={styles.paymentButton} onPress={handlePaymentPress}>
            <Text style={styles.paymentButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${isNaN(total) ? '0.00' : total.toFixed(2)}</Text>
        </View>
        {createOrderError ? <Text style={styles.orderError}>{createOrderError}</Text> : null}
        <TouchableOpacity
          style={[styles.checkoutButton, createOrderLoading || items.length === 0 ? styles.checkoutButtonDisabled : null]}
          onPress={handleCheckout}
          disabled={createOrderLoading || items.length === 0}
        >
          <Text style={styles.checkoutText}>
            {createOrderLoading ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4ECDC4',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemCount: {
    fontSize: 14,
    color: '#E0F7F5',
    marginTop: 5,
  },
  list: {
    padding: 15,
    paddingBottom: 150,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#FFE4EC',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '600',
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#E0F7F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginHorizontal: 15,
  },
  removeBtn: {
    justifyContent: 'center',
    padding: 10,
  },
  removeBtnText: {
    fontSize: 24,
    color: '#FF7675',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 4,
  },
  paymentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF6B9D',
    borderRadius: 14,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    color: '#636E72',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  checkoutButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#9DE0D2',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderError: {
    color: '#FF4D4F',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    padding: 30,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
