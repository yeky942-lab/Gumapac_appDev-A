import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../utils';
import { RootState } from '../app/store';

interface OrderItem {
  name: string;
  price?: number;
  quantity?: number;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  address?: string;
  items: OrderItem[];
}

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { orders = [], isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch({ type: 'FETCH_ORDERS_REQUEST' });
  }, [dispatch]);

  const getStatusColor = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return '#00B894';
      case 'pending':
      case 'processing':
        return '#FDCB6E';
      case 'cancelled':
        return '#FF7675';
      default:
        return '#636E72';
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderOrderItem = (props: { item: Order }) => {
    const { item } = props;
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { order: item })}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id || '---'}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsText}>
            {item.items?.length || 0} item(s) • {item.items?.map(i => i.name).slice(0, 2).join(', ')}
            {(item.items?.length || 0) > 2 ? '...' : ''}
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${item.total?.toFixed(2) || '0.00'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  const displayOrders: Order[] = orders as Order[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>Track your sweet orders</Text>
      </View>

      <FlatList
        data={displayOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFE66D',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  list: {
    padding: 15,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  orderDate: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#FFE0E9',
    paddingTop: 15,
    marginBottom: 15,
  },
  itemsText: {
    fontSize: 14,
    color: '#636E72',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFE0E9',
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#636E72',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;
