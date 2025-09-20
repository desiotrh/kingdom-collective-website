import { useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking } from 'react-native';
import { filterMediators, filterParentingClasses, filterGals, FamilyFilters } from '../../../packages/stand-core/src/family-requirements';
import { loadCaliforniaLosAngelesFamilyResources } from '../../../packages/stand-state-packs/src';

export default function FamilyScreen() {
  const [stateCode, setStateCode] = useState<'CA'>('CA');
  const [county, setCounty] = useState<'Los Angeles'>('Los Angeles');
  const [filters, setFilters] = useState<FamilyFilters>({ courtApprovedOnly: true });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    loadCaliforniaLosAngelesFamilyResources().then((json) => {
      setData(json);
      setLoading(false);
    });
  }, [stateCode, county]);

  const mediators = useMemo(() => data ? filterMediators(data.mediators, filters) : [], [data, filters]);
  const classes = useMemo(() => data ? filterParentingClasses(data.parentingClasses, filters) : [], [data, filters]);
  const gals = useMemo(() => data ? filterGals(data.galDirectory, filters) : [], [data, filters]);

  const toggle = (key: keyof FamilyFilters) => (value: boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading county requirements…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍⚖️ Family Law Requirements</Text>
        <Text style={styles.subtitle}>State: {stateCode} • County: {county}</Text>
        <Text style={styles.verified}>✅ Last updated {data.verification.verifiedAt.split('T')[0]}</Text>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Court-approved only</Text>
          <Switch value={!!filters.courtApprovedOnly} onValueChange={toggle('courtApprovedOnly')} trackColor={{ true: '#FFD700' }} />
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Online available</Text>
          <Switch value={!!filters.onlineAvailable} onValueChange={toggle('onlineAvailable')} trackColor={{ true: '#FFD700' }} />
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Sliding scale (mediators)</Text>
          <Switch value={!!filters.slidingScale} onValueChange={toggle('slidingScale')} trackColor={{ true: '#FFD700' }} />
        </View>
      </View>

      {/* Mediators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mediators</Text>
        <Text style={styles.sectionHint}>Links to official court rosters when available</Text>
        {mediators.map((m: any) => (
          <View key={m.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>📄 {m.name}</Text>
              <Text style={styles.badgeApproved}>{m.courtApproved ? 'Court-approved' : 'Unverified'}</Text>
            </View>
            <Text style={styles.cardMeta}>Type: {m.mediationType} • {m.onlineAvailable ? 'Online' : 'In-person'}</Text>
            <Text style={styles.cardMeta}>{m.slidingScale ? 'Sliding scale available' : 'Standard rates'}</Text>
            {m.website && (
              <TouchableOpacity onPress={() => Linking.openURL(m.website)}>
                <Text style={styles.link}>Open website</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => Linking.openURL(m.verification.sourceUrl)}>
              <Text style={styles.link}>View official roster</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Parenting Classes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parenting / Co-Parenting Classes</Text>
        <Text style={styles.sectionHint}>Remember: Certificates must be filed with the court</Text>
        {classes.map((c: any) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>🎓 {c.name}</Text>
              <Text style={styles.badgeApproved}>{c.courtApproved ? 'Court-approved' : 'Unverified'}</Text>
            </View>
            <Text style={styles.cardMeta}>Formats: {c.formats.join(', ')}</Text>
            {c.registrationUrl && (
              <TouchableOpacity onPress={() => Linking.openURL(c.registrationUrl)}>
                <Text style={styles.link}>Go to registration</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity>
              <Text style={styles.link}>Add certificate deadline to timeline</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* GAL / CASA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GAL / CASA Directory</Text>
        <Text style={styles.sectionHint}>What does a GAL do? Represents the child’s best interests</Text>
        {gals.map((g: any) => (
          <View key={g.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>🛡️ {g.name}</Text>
              <Text style={styles.badgeApproved}>{g.approvalStatus === 'court-approved' ? 'Court-approved' : 'Program-approved'}</Text>
            </View>
            <Text style={styles.cardMeta}>Type: {g.type} • Private pay: {g.privatePayAvailable ? 'Yes' : 'No'}</Text>
            {g.website && (
              <TouchableOpacity onPress={() => Linking.openURL(g.website)}>
                <Text style={styles.link}>Open website</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => Linking.openURL(g.verification.sourceUrl)}>
              <Text style={styles.link}>View official info</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  loadingContainer: { flex: 1, backgroundColor: '#0B1020', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#FFFFFF', opacity: 0.8 },
  header: { padding: 20, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  subtitle: { color: '#FFFFFF', opacity: 0.8, fontSize: 14 },
  verified: { color: '#00FF88', fontSize: 12, marginTop: 6 },
  filters: { margin: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  filterLabel: { color: '#FFFFFF', fontSize: 14 },
  section: { margin: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: '800' },
  sectionHint: { color: '#FFFFFF', opacity: 0.6, fontSize: 12, marginBottom: 8 },
  card: { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#FFFFFF', opacity: 0.8, fontSize: 12, marginTop: 6 },
  badgeApproved: { color: '#00FF88', fontSize: 11 },
  link: { color: '#FFD700', marginTop: 8 },
});


