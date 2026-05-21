import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { ROUTES } from '../utils';

// Screens
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

export type HomeStackParamList = {
  [ROUTES.PRODUCTS]: undefined;
  [ROUTES.PRODUCT_DETAIL]: { product: any };
};

export type OrdersStackParamList = {
  [ROUTES.ORDERS]: undefined;
  [ROUTES.ORDER_DETAIL]: { order: any };
};

export type MainTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  [ROUTES.CART]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type CartStackParamList = {
  [ROUTES.CART]: undefined;
  [ROUTES.PAYMENT_METHODS]: undefined;
};

export type ProfileStackParamList = {
  [ROUTES.PROFILE]: undefined;
  [ROUTES.PROFILE_EDIT]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStackNavigator = createStackNavigator<HomeStackParamList>();
const OrdersStackNavigator = createStackNavigator<OrdersStackParamList>();
const CartStackNavigator = createStackNavigator<CartStackParamList>();
const ProfileStackNavigator = createStackNavigator<ProfileStackParamList>();

// Home Stack (Products + Product Detail)
const HomeStack: React.FC = () => (
  <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNavigator.Screen name={ROUTES.PRODUCTS} component={ProductsScreen} />
    <HomeStackNavigator.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
  </HomeStackNavigator.Navigator>
);

// Orders Stack (Orders + Order Detail)
const OrdersStack: React.FC = () => (
  <OrdersStackNavigator.Navigator screenOptions={{ headerShown: false }}>
    <OrdersStackNavigator.Screen name={ROUTES.ORDERS} component={OrdersScreen} />
    <OrdersStackNavigator.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
  </OrdersStackNavigator.Navigator>
);

const CartStack: React.FC = () => (
  <CartStackNavigator.Navigator screenOptions={{ headerShown: false }}>
    <CartStackNavigator.Screen name={ROUTES.CART} component={CartScreen} />
    <CartStackNavigator.Screen name={ROUTES.PAYMENT_METHODS} component={PaymentMethodsScreen} />
  </CartStackNavigator.Navigator>
);

const ProfileStack: React.FC = () => (
  <ProfileStackNavigator.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNavigator.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    <ProfileStackNavigator.Screen name={ROUTES.PROFILE_EDIT} component={ProfileEditScreen} />
  </ProfileStackNavigator.Navigator>
);

// Tab Icon Component
interface TabIconProps {
  emoji: string;
  label?: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, focused }) => (
  <Text style={{ fontSize: focused ? 28 : 24, opacity: focused ? 1 : 0.7 }}>
    {emoji}
  </Text>
);

const MainNavigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#FF6B9D',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#636E72',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🍦" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📦" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.CART}
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;