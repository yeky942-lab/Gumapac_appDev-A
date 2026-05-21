import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavigationProp = any;
import { ROUTES } from '../utils';
// Type definitions inline to avoid import issues

const CATEGORIES = ['All', 'Ice Cream', 'Sundaes', 'Milkshakes', 'Parfaits'];

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { products, isLoading } = useSelector((state: any) => state.products || { products: [], isLoading: false });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
  }, [dispatch]);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((p: Product) => p.category === selectedCategory);

  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.categoryTextActive,
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = (props: { item: Product }) => {
    const { item } = props;
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
      >
        <Image
          source={{ uri: item.image || 'https://i.imgur.com/kPv3FkR.png' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>
              ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sweet Scoops</Text>
        <Text style={styles.headerSubtitle}>Delicious ice cream delivered!</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(renderCategoryChip)}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.productRow}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>Please try again later or check your connection.</Text>
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
    backgroundColor: '#FF6B9D',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFE4EC',
    marginTop: 5,
  },
  categoryContainer: {
    maxHeight: 60,
    marginVertical: 15,
  },
  categoryContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFE0E9',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  categoryText: {
    color: '#636E72',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  productList: {
    padding: 15,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFE4EC',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  addButton: {
    width: 35,
    height: 35,
    backgroundColor: '#FF6B9D',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    maxWidth: 250,
  },
});

export default ProductsScreen;
