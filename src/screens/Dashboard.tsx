import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { API_BASE_URL } from '../app/api/config';
import { ROUTES } from '../utils';
import { LOGOUT } from '../app/reducers/authReducer';
import NestedCard from '../components/NestedCard';
// import CustomButton from '../components/CustomButton';
import { RootState } from '../app/store';

interface StatItem {
  id: string;
  label: string;
  value: number | string;
  subtitle: string;
}

const Dashboard: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    console.log('[ACTION] Logout button pressed');
    dispatch({ type: LOGOUT });
    navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] });
  };

  //  <CustomButton/>

  const [displayStats, setDisplayStats] = useState<StatItem[]>([
    { id: 'bookings', label: 'TOTAL BOOKINGS', value: 0, subtitle: 'Lifetime appointments' },
    { id: 'pets', label: 'MY PETS', value: 0, subtitle: 'Furry companions' },
    { id: 'next', label: 'NEXT APPOINTMENT', value: 'None', subtitle: 'No upcoming appointments' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const handleBooking = () => {
    console.log('Book Appointment pressed');
    // TODO: navigate to create booking screen once it exists
  };

  useEffect(() => {
    async function loadDashboard() {
      if (!isAuthenticated || !token) {
        setError('Please login to view dashboard data.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        // Adjust according to your backend shape:
        if (Array.isArray(data.stats)) {
          setDisplayStats(data.stats);
        } else if (data.data?.stats) {
          setDisplayStats(data.data.stats);
        } else {
          // fallback data still preserved.
          setError('Received unexpected dashboard format, using cached stats.');
        }
      } catch (ex) {
        console.warn('Dashboard fetch error:', ex);
        const err = ex as Error;
        setError(err.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [isAuthenticated, token]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6992CC" />
          <Text style={styles.subtitle}>Loading data...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && isAuthenticated && (
        <Text style={styles.welcomeTitle}>Good Day {user?.fullName || user?.email || 'Friend'}</Text>
      )}

      {!isAuthenticated && (
        <View style={styles.errorState}>
          <Text style={styles.errorText}>You need to be logged in to view the dashboard.</Text>
        </View>
      )}

      <Text style={styles.welcomeSubtitle}>Here&apos;s what&apos;s happening with your pets today.</Text>

      <View style={styles.statsGrid}>
        {displayStats.map(item => (
          <View key={item.id} style={[styles.statCard, item.id === 'next' && styles.nextAppointmentCard]}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statSubtitle}>{item.subtitle}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleCard}>
        <Text style={styles.scheduleEmpty}>No upcoming appointments</Text>
        <TouchableOpacity style={styles.scheduleButton} onPress={handleBooking}>
          <Text style={styles.scheduleButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <NestedCard title="Quick Options">
        <NestedCard.Section label="Appointments">
          <Text style={styles.nestedCardText}>Manage your pet appointments</Text>
          <TouchableOpacity style={styles.nestedButton} onPress={handleBooking}>
            <Text style={styles.nestedButtonText}>View Appointments</Text>
          </TouchableOpacity>
        </NestedCard.Section>

        <NestedCard.Section label="Pets">
          <Text style={styles.nestedCardText}>See all your registered pets</Text>
          <TouchableOpacity style={styles.nestedButton}>
            <Text style={styles.nestedButtonText}>View My Pets</Text>
          </TouchableOpacity>
        </NestedCard.Section>
      </NestedCard>

      <View style={styles.petArea}>
        <View style={styles.petHeader}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Add New Pet</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.petEmptyCard}>
          <Text style={styles.petEmptyText}>No pets yet</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Refer a Friend</Text>
        <Text style={styles.footerSub}>Earn 60 points for every friend you refer to us.</Text>
        <TouchableOpacity style={styles.copyLinkButton}>
          <Text style={styles.copyLinkText}>Copy Link</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F4',
  },
  contentContainer: {
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#6992CC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#212121',
  },
  welcomeSubtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#6B7A99',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  nextAppointmentCard: {
    backgroundColor: '#7FA7DE',
    borderColor: '#7FA7DE',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#476A99',
  },
  statValue: {
    fontSize: 34,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#1B3A6A',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6B7A99',
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    flexShrink: 1,
    minWidth: 0,
  },
  viewAll: {
    color: '#7FA7DE',
    fontWeight: '700',
    marginTop: 4,
  },
  scheduleCard: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  scheduleEmpty: {
    fontSize: 18,
    color: '#9DA8B5',
    marginBottom: 12,
  },
  scheduleButton: {
    backgroundColor: '#6992CC',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  petArea: {
    marginBottom: 20,
  },
  petHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  petEmptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingVertical: 30,
    alignItems: 'center',
  },
  petEmptyText: {
    color: '#8F99A8',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#E7EAF0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBDFE8',
    padding: 16,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight:'bold',
    marginBottom: 6,
  },
  footerSub: {
    color: '#66768F',
    marginBottom: 10,
  },
  copyLinkButton: {
    backgroundColor: '#fff',
    borderColor: '#6992CC',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  loadingState: {
    marginVertical: 16,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#6B7A99',
    fontSize: 14,
  },
  errorState: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#ffe8e8',
    borderColor: '#ff6c6c',
    borderWidth: 1,
    borderRadius: 10,
  },
  errorText: {
    color: '#9D2B2B',
    fontSize: 14,
  },
  copyLinkText: {
    color: '#6992CC',
    fontWeight: '700',
  },
  nestedCardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  nestedButton: {
    backgroundColor: '#6992CC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nestedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Dashboard;