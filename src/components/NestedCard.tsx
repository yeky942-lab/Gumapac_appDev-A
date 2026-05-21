import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface NestedCardProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const NestedCard: React.FC<NestedCardProps> & { Section: React.FC<SectionProps> } = ({ title, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

interface SectionProps {
  label?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

NestedCard.Section = ({ label, children, style }: SectionProps) => {
  return (
    <View style={[styles.section, style]}>
      {label ? <Text style={styles.sectionTitle}>{label}</Text> : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  cardContent: {
    flexDirection: 'column',
    gap: 8,
  },
  section: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  sectionContent: {
    width: '100%',
  },
});

export default NestedCard;
