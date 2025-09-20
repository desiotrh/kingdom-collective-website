import { useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking } from 'react-native';
import { filterLawyers, computeBadges, LawyerFilters } from '../../../packages/stand-core/src/lawyer-directory';
import { loadIowaPolkLawyers, loadOklahomaOklahomaLawyers } from '../../../packages/stand-state-packs/src';

type StateOption = 'IA' | 'OK';

export default function LawyersScreen() {
  const [stateCode, setStateCode] = useState<StateOption>('IA');
  const [county, setCounty] = useState<'Polk' | 'Oklahoma'>('Polk');
  const [filters, setFilters] = useState<LawyerFilters>({});
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    const loader = stateCode === 'IA' ? loadIowaPolkLawyers : loadOklahomaOklahomaLawyers;
    loader().then((json) => {
      setData(json);
      setLoading(false);
    });
  }, [stateCode, county]);

  const lawyers = useMemo(() => data ? filterLawyers(data.lawyers, filters) : [], [data, filters]);

  const toggleArray = (key: keyof LawyerFilters, value: any) => () => {
    setFilters(prev => {
      const arr = new Set([...(prev[key] as any[] || [])]);
      if (arr.has(value)) { arr.delete(value); } else { arr.add(value); }
      return { ...prev, [key]: Array.from(arr) };
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lawyer directory…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👩‍⚖️ Lawyer Directory</Text>
        <Text style={styles.subtitle}>Pilot states: Iowa (Polk), Oklahoma (Oklahoma)</Text>
        <Text style={styles.verified}>✅ Verified {data.verifiedAt.split('T')[0]}</Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          Directory provides public legal information only. Kingdom Stand is not a referral service or law firm. 
          Users are responsible for verifying attorney suitability.
        </Text>
      </View>

      <View style={styles.filtersBox}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('pricing', 'affordable')}>
            <Text style={styles.filterChipText}>Affordable</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('pricing', 'sliding-scale')}>
            <Text style={styles.filterChipText}>Sliding Scale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('pricing', 'flat-fee')}>
            <Text style={styles.filterChipText}>Flat Fee</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('pricing', 'limited-scope')}>
            <Text style={styles.filterChipText}>Limited Scope</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('pricing', 'pro-bono')}>
            <Text style={styles.filterChipText}>Pro Bono</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('specialization', 'family')}>
            <Text style={styles.filterChipText}>Family</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('specialization', 'small-claims')}>
            <Text style={styles.filterChipText}>Small Claims</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('specialization', 'housing')}>
            <Text style={styles.filterChipText}>Housing</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('availability', 'online-consult')}>
            <Text style={styles.filterChipText}>Online Consults</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={toggleArray('availability', 'evening-weekend')}>
            <Text style={styles.filterChipText}>Evening/Weekend</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        {lawyers.map((l: any) => {
          const badges = computeBadges(l);
          return (
            <View key={l.id} style={styles.card}>
              <Text style={styles.cardTitle}>{l.fullName}</Text>
              <Text style={styles.cardSub}>Bar #{l.barNumber} • Status: {l.licenseStatus} • Verified {l.lastVerified.split('T')[0]}</Text>
              <Text style={styles.cardMeta}>Practice: {l.practiceAreas.join(', ')}</Text>
              <Text style={styles.cardMeta}>Fee Model: {l.feeModel.join(', ')} {l.programs.length ? `• Programs: ${l.programs.join(', ')}` : ''}</Text>
              <Text style={styles.cardMeta}>Languages: {l.languages.join(', ')}</Text>
              {(l.contact.website || l.contact.phone) && (
                <View style={styles.linksRow}>
                  {l.contact.website && (
                    <TouchableOpacity onPress={() => Linking.openURL(l.contact.website)}>
                      <Text style={styles.link}>Website</Text>
                    </TouchableOpacity>
                  )}
                  {l.contact.phone && <Text style={styles.link}>{l.contact.phone}</Text>}
                </View>
              )}
              {l.ratings && (
                <View style={styles.linksRow}>
                  {l.ratings.google && (<TouchableOpacity onPress={() => Linking.openURL(l.ratings.google)}><Text style={styles.link}>Google</Text></TouchableOpacity>)}
                  {l.ratings.avvo && (<TouchableOpacity onPress={() => Linking.openURL(l.ratings.avvo)}><Text style={styles.link}>Avvo</Text></TouchableOpacity>)}
                  {l.ratings.yelp && (<TouchableOpacity onPress={() => Linking.openURL(l.ratings.yelp)}><Text style={styles.link}>Yelp</Text></TouchableOpacity>)}
                </View>
              )}
              <View style={styles.badgesRow}>
                {badges.map(b => (
                  <Text key={b.type} style={styles.badge}>{b.label}</Text>
                ))}
              </View>
            </View>
          );
        })}
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
  disclaimer: { margin: 16, backgroundColor: 'rgba(255,100,100,0.1)', borderColor: 'rgba(255,100,100,0.3)', borderWidth: 1, borderRadius: 12, padding: 12 },
  disclaimerTitle: { color: '#FF6464', fontWeight: '800', marginBottom: 6 },
  disclaimerText: { color: '#FFFFFF', opacity: 0.9, fontSize: 12, lineHeight: 18 },
  filtersBox: { margin: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12 },
  filtersTitle: { color: '#FFD700', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterChip: { backgroundColor: 'rgba(255,215,0,0.15)', borderColor: '#FFD700', borderWidth: 1, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  filterChipText: { color: '#FFD700', fontSize: 12 },
  section: { margin: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  card: { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#FFFFFF', opacity: 0.8, fontSize: 12, marginTop: 4 },
  cardMeta: { color: '#FFFFFF', opacity: 0.8, fontSize: 12, marginTop: 6 },
  linksRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  link: { color: '#FFD700' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  badge: { backgroundColor: 'rgba(0,255,136,0.15)', color: '#00FF88', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, fontSize: 11 }
});


