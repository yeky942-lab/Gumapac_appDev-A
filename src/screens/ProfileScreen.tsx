import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { LOGOUT } from '../app/reducers/authReducer';
import { RootState } from '../app/store';
import { ROUTES } from '../utils';

interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => dispatch({ type: LOGOUT }) },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { icon: '✏️', label: 'Edit Profile', action: () => navigation.navigate(ROUTES.PROFILE_EDIT) },
    { icon: '📦', label: 'My Orders', action: () => navigation.navigate(ROUTES.ORDERS) },
    { icon: '📍', label: 'Addresses', action: () => Alert.alert('Coming Soon', 'Address management will be added in the next release.') },
    { icon: '💳', label: 'Payment Methods', action: () => Alert.alert('Coming Soon', 'Payment method support is under development.') },
    { icon: '🎁', label: 'Rewards', action: () => Alert.alert('Coming Soon', 'Rewards are not available yet.') },
    { icon: '⚙️', label: 'Settings', action: () => Alert.alert('Coming Soon', 'Settings will be available soon.') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🍦</Text>
          </View>
          <Text style={styles.userName}>{user?.name || user?.fullName || 'Sweet Lover'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@sweetscoops.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+1 234 567 890'}</Text>
          <Text style={styles.userAddress}>{user?.address || 'No delivery address set.'}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Sweet Scoops v1.0.0</Text>
      </ScrollView>
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
    backgroundColor: '#8B4513',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#FFE4EC',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  avatarText: {
    fontSize: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 3,
  },
  userAddress: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0E9',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  menuArrow: {
    fontSize: 20,
    color: '#FF6B9D',
  },
  logoutButton: {
    backgroundColor: '#FF7675',
    margin: 20,
    marginTop: 30,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#636E72',
    fontSize: 12,
    marginBottom: 30,
  },
});

export default ProfileScreen;