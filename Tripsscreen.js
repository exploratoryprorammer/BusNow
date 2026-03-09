import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#FAFAFA',
  white: '#FFFFFF',
  black: '#0A0A0A',
  accent: '#2563EB',
  accentLight: '#EFF6FF',
  border: '#E5E7EB',
  muted: '#9CA3AF',
  text: '#111827',
  subtext: '#6B7280',
  pill: '#F3F4F6',
  orange: '#EA580C',
  orangeLight: '#FFF7ED',
  green: '#10B981',
  greenLight: '#ECFDF5',
};

const QUICK_SPOTS = [
  { label: 'Coover Hall',     icon: 'school-outline',      sub: 'Engineering' },
  { label: 'Parks Library',   icon: 'library-outline',     sub: 'Central Campus' },
  { label: 'State Gym',       icon: 'barbell-outline',     sub: 'Recreation' },
  { label: 'Welch Ave',       icon: 'storefront-outline',  sub: 'Campustown' },
  { label: 'ISU Memorial Union', icon: 'cafe-outline',     sub: 'Union Drive' },
  { label: 'Hy-Vee',         icon: 'cart-outline',        sub: 'South Duff' },
];

const MOCK_RESULT = {
  route: '#1 Red',
  routeColor: '#DC2626',
  stopName: 'Osborn Dr / Lot 1',
  stopId: '2341',
  departAt: '2:47 PM',
  arriveAt: '3:08 PM',
  walkMins: 5,
  rideMins: 21,
  notifyAt: '2:32 PM',
};

export default function TripScreen() {
  const [destination, setDestination] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notified, setNotified] = useState(false);

  const selectQuick = (spot) => {
    setDestination(spot.label);
    setResult(null);
    setNotified(false);
  };

  const planTrip = () => {
    if (!destination.trim() || !arrivalTime.trim()) return;
    setLoading(true);
    setResult(null);
    setNotified(false);
    // Simulate API call — replace with real GTFS + Google Maps logic
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setLoading(false);
    }, 1200);
  };

  const setNotification = () => setNotified(true);

  const clear = () => {
    setDestination('');
    setArrivalTime('');
    setResult(null);
    setNotified(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.appName}>CatchIt</Text>
          <Text style={s.screenTitle}>Plan a Trip</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Input card */}
        <View style={s.inputCard}>
          {/* Destination */}
          <View style={s.fieldWrap}>
            <View style={s.fieldIcon}>
              <Ionicons name="location" size={16} color={C.orange} />
            </View>
            <View style={s.fieldInner}>
              <Text style={s.fieldLabel}>Where to?</Text>
              <TextInput
                style={s.fieldInput}
                placeholder="Enter destination"
                placeholderTextColor={C.muted}
                value={destination}
                onChangeText={v => { setDestination(v); setResult(null); setNotified(false); }}
              />
            </View>
            {destination.length > 0 && (
              <TouchableOpacity onPress={clear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={18} color={C.muted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={s.divider} />

          {/* Arrival time */}
          <View style={s.fieldWrap}>
            <View style={s.fieldIcon}>
              <Ionicons name="time" size={16} color={C.accent} />
            </View>
            <View style={s.fieldInner}>
              <Text style={s.fieldLabel}>I need to arrive by</Text>
              <TextInput
                style={s.fieldInput}
                placeholder="e.g. 3:00 PM"
                placeholderTextColor={C.muted}
                value={arrivalTime}
                onChangeText={v => { setArrivalTime(v); setResult(null); setNotified(false); }}
              />
            </View>
          </View>
        </View>

        {/* Plan button */}
        <TouchableOpacity
          style={[s.planBtn, (!destination.trim() || !arrivalTime.trim()) && s.planBtnDisabled]}
          onPress={planTrip}
          disabled={!destination.trim() || !arrivalTime.trim() || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <Text style={s.planBtnText}>Finding your bus…</Text>
          ) : (
            <>
              <Ionicons name="bus" size={18} color={C.white} />
              <Text style={s.planBtnText}>Find My Bus</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Quick spots */}
        {!result && (
          <>
            <Text style={s.sectionLabel}>Quick Spots</Text>
            <View style={s.quickGrid}>
              {QUICK_SPOTS.map(spot => (
                <TouchableOpacity
                  key={spot.label}
                  style={[s.quickCard, destination === spot.label && s.quickCardActive]}
                  onPress={() => selectQuick(spot)}
                  activeOpacity={0.7}
                >
                  <View style={[s.quickIcon, destination === spot.label && { backgroundColor: C.accentLight }]}>
                    <Ionicons name={spot.icon} size={18} color={destination === spot.label ? C.accent : C.subtext} />
                  </View>
                  <Text style={[s.quickLabel, destination === spot.label && { color: C.accent }]} numberOfLines={2}>{spot.label}</Text>
                  <Text style={s.quickSub}>{spot.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Result card */}
        {result && (
          <View style={s.resultCard}>
            {/* Route header */}
            <View style={s.resultHeader}>
              <View style={[s.routeBadge, { backgroundColor: result.routeColor }]}>
                <Text style={s.routeBadgeText}>{result.route}</Text>
              </View>
              <View style={s.resultHeaderRight}>
                <Text style={s.resultDest} numberOfLines={1}>{destination}</Text>
                <Text style={s.resultArrives}>Arrive by {arrivalTime}</Text>
              </View>
            </View>

            {/* Timeline */}
            <View style={s.timeline}>
              {/* Walk */}
              <View style={s.timelineRow}>
                <View style={s.timelineDotWrap}>
                  <View style={[s.timelineDot, { backgroundColor: C.subtext }]} />
                  <View style={s.timelineLine} />
                </View>
                <View style={s.timelineContent}>
                  <Text style={s.timelineLabel}>Walk to stop</Text>
                  <Text style={s.timelineStop}>{result.stopName}</Text>
                </View>
                <View style={s.timelineRight}>
                  <Text style={s.timelineMins}>{result.walkMins} min</Text>
                </View>
              </View>

              {/* Board */}
              <View style={s.timelineRow}>
                <View style={s.timelineDotWrap}>
                  <View style={[s.timelineDot, { backgroundColor: result.routeColor }]} />
                  <View style={s.timelineLine} />
                </View>
                <View style={s.timelineContent}>
                  <Text style={s.timelineLabel}>Board bus</Text>
                  <Text style={s.timelineStop}>Stop #{result.stopId}</Text>
                </View>
                <View style={s.timelineRight}>
                  <Text style={[s.timelineTime, { color: result.routeColor }]}>{result.departAt}</Text>
                </View>
              </View>

              {/* Arrive */}
              <View style={[s.timelineRow, { marginBottom: 0 }]}>
                <View style={s.timelineDotWrap}>
                  <View style={[s.timelineDot, { backgroundColor: C.green, width: 12, height: 12, borderRadius: 6 }]} />
                </View>
                <View style={s.timelineContent}>
                  <Text style={s.timelineLabel}>Arrive</Text>
                  <Text style={s.timelineStop}>{destination}</Text>
                </View>
                <View style={s.timelineRight}>
                  <Text style={[s.timelineTime, { color: C.green }]}>{result.arriveAt}</Text>
                </View>
              </View>
            </View>

            {/* Summary chips */}
            <View style={s.summaryRow}>
              <View style={s.summaryChip}>
                <Ionicons name="walk-outline" size={13} color={C.subtext} />
                <Text style={s.summaryText}>{result.walkMins} min walk</Text>
              </View>
              <View style={s.summaryChip}>
                <Ionicons name="bus-outline" size={13} color={C.subtext} />
                <Text style={s.summaryText}>{result.rideMins} min ride</Text>
              </View>
            </View>

            {/* Notify CTA */}
            {notified ? (
              <View style={s.notifiedBanner}>
                <Ionicons name="checkmark-circle" size={18} color={C.green} />
                <Text style={s.notifiedText}>
                  You'll be notified at {result.notifyAt} — 15 min before departure
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={s.notifyBtn} onPress={setNotification} activeOpacity={0.85}>
                <Ionicons name="notifications" size={16} color={C.white} />
                <Text style={s.notifyBtnText}>Notify me at {result.notifyAt}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  appName: { fontSize: 12, fontWeight: '600', color: C.accent, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  screenTitle: { fontSize: 26, fontWeight: '700', color: C.black, letterSpacing: -0.5 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },

  // Input card
  inputCard: {
    backgroundColor: C.white, borderRadius: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  fieldWrap: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  fieldIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.pill, alignItems: 'center', justifyContent: 'center' },
  fieldInner: { flex: 1 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
  fieldInput: { fontSize: 15, color: C.text, padding: 0 },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },

  // Plan button
  planBtn: {
    backgroundColor: C.accent, borderRadius: 14, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24,
  },
  planBtnDisabled: { backgroundColor: C.border },
  planBtnText: { fontSize: 15, fontWeight: '700', color: C.white },

  // Quick spots
  sectionLabel: { fontSize: 12, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    width: '47%', backgroundColor: C.white, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  quickCardActive: { borderWidth: 1.5, borderColor: C.accent },
  quickIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.pill, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2 },
  quickSub: { fontSize: 11, color: C.muted },

  // Result card
  resultCard: {
    backgroundColor: C.white, borderRadius: 18, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  routeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  routeBadgeText: { fontSize: 14, fontWeight: '800', color: C.white },
  resultHeaderRight: { flex: 1 },
  resultDest: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  resultArrives: { fontSize: 12, color: C.muted },

  // Timeline
  timeline: { marginBottom: 16 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  timelineDotWrap: { width: 24, alignItems: 'center', paddingTop: 4 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.muted },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: C.border, marginTop: 4, minHeight: 24 },
  timelineContent: { flex: 1, paddingLeft: 8, paddingBottom: 16 },
  timelineLabel: { fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  timelineStop: { fontSize: 14, fontWeight: '600', color: C.text },
  timelineRight: { paddingTop: 3 },
  timelineMins: { fontSize: 12, color: C.subtext, fontWeight: '600' },
  timelineTime: { fontSize: 14, fontWeight: '700' },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.pill, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  summaryText: { fontSize: 12, color: C.subtext, fontWeight: '500' },

  notifyBtn: {
    backgroundColor: C.accent, borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  notifyBtnText: { fontSize: 14, fontWeight: '700', color: C.white },

  notifiedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.greenLight, borderRadius: 12, padding: 14,
  },
  notifiedText: { flex: 1, fontSize: 13, color: C.green, fontWeight: '500', lineHeight: 18 },
});