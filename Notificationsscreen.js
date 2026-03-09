import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Switch,
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
  green: '#10B981',
};

const CATEGORY_CONFIG = {
  class:    { label: 'Class',    icon: 'school-outline',  color: '#2563EB' },
  activity: { label: 'Activity', icon: 'flash-outline',   color: '#7C3AED' },
  gym:      { label: 'Gym',      icon: 'barbell-outline', color: '#059669' },
  trip:     { label: 'Trip',     icon: 'navigate-outline',color: '#EA580C' },
};

const REMIND_OPTIONS = [5, 10, 15, 20];

export default function NotificationsScreen() {
  const [masterEnabled, setMasterEnabled] = useState(true);

  const [entries, setEntries] = useState([
    { id: '1', name: 'COMS 3090',   location: 'Coover Hall',   category: 'class',    days: ['Mon','Wed','Fri'], time: '9:00 AM',  enabled: true,  remindBefore: 10 },
    { id: '2', name: 'MATH 2070',   location: 'Carver Hall',   category: 'class',    days: ['Tue','Thu'],       time: '11:00 AM', enabled: true,  remindBefore: 15 },
    { id: '3', name: 'Rec Center',  location: 'State Gym',     category: 'gym',      days: ['Mon','Wed'],       time: '5:00 PM',  enabled: false, remindBefore: 10 },
    { id: '4', name: 'Downtown Trip',location: 'Main St',      category: 'trip',     days: ['Fri'],             time: '7:00 PM',  enabled: true,  remindBefore: 20 },
  ]);

  const toggle = (id) =>
    setEntries(es => es.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));

  const setReminder = (id, mins) =>
    setEntries(es => es.map(e => e.id === id ? { ...e, remindBefore: mins } : e));

  const enabledCount = entries.filter(e => e.enabled).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.appName}>CatchIt</Text>
          <Text style={s.screenTitle}>Notifications</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* Master toggle card */}
        <View style={s.masterCard}>
          <View style={s.masterLeft}>
            <View style={[s.masterIcon, { backgroundColor: masterEnabled ? C.accentLight : C.pill }]}>
              <Ionicons name="notifications" size={22} color={masterEnabled ? C.accent : C.muted} />
            </View>
            <View>
              <Text style={s.masterTitle}>All Notifications</Text>
              <Text style={s.masterSub}>
                {masterEnabled ? `${enabledCount} active reminder${enabledCount !== 1 ? 's' : ''}` : 'All notifications paused'}
              </Text>
            </View>
          </View>
          <Switch
            value={masterEnabled}
            onValueChange={setMasterEnabled}
            trackColor={{ false: C.border, true: C.accent }}
            thumbColor={C.white}
          />
        </View>

        {/* How it works pill */}
        <View style={s.infoBanner}>
          <Ionicons name="information-circle-outline" size={15} color={C.accent} />
          <Text style={s.infoText}>CatchIt alerts you before each event so you catch the right bus on time.</Text>
        </View>

        {/* Per-entry toggles */}
        <Text style={s.sectionLabel}>Your Schedule</Text>

        {entries.map(entry => {
          const cfg = CATEGORY_CONFIG[entry.category];
          const isOn = masterEnabled && entry.enabled;

          return (
            <View key={entry.id} style={[s.card, !isOn && s.cardDim]}>
              {/* Top row */}
              <View style={s.cardTop}>
                <View style={s.cardLeft}>
                  <View style={[s.iconBox, { backgroundColor: isOn ? cfg.color + '18' : C.pill }]}>
                    <Ionicons name={cfg.icon} size={18} color={isOn ? cfg.color : C.muted} />
                  </View>
                  <View>
                    <Text style={[s.cardName, !isOn && { color: C.muted }]}>{entry.name}</Text>
                    <View style={s.cardMeta}>
                      <Ionicons name="location-outline" size={11} color={C.muted} />
                      <Text style={s.cardMetaText}>{entry.location}</Text>
                      <Text style={s.dot}>·</Text>
                      <Text style={s.cardMetaText}>{entry.time}</Text>
                    </View>
                  </View>
                </View>
                <Switch
                  value={entry.enabled}
                  onValueChange={() => toggle(entry.id)}
                  disabled={!masterEnabled}
                  trackColor={{ false: C.border, true: cfg.color }}
                  thumbColor={C.white}
                />
              </View>

              {/* Remind before selector */}
              {entry.enabled && masterEnabled && (
                <View style={s.remindRow}>
                  <Text style={s.remindLabel}>Remind me</Text>
                  <View style={s.remindOptions}>
                    {REMIND_OPTIONS.map(mins => (
                      <TouchableOpacity
                        key={mins}
                        style={[s.remindChip, entry.remindBefore === mins && { backgroundColor: cfg.color, borderColor: cfg.color }]}
                        onPress={() => setReminder(entry.id, mins)}
                      >
                        <Text style={[s.remindChipText, entry.remindBefore === mins && { color: C.white }]}>
                          {mins}m
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <Text style={s.remindSuffix}>before</Text>
                  </View>
                </View>
              )}

              {/* Days row */}
              <View style={s.daysRow}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <View key={d} style={[
                    s.dayChip,
                    entry.days.includes(d) && isOn && { backgroundColor: cfg.color },
                    entry.days.includes(d) && !isOn && { backgroundColor: C.border },
                  ]}>
                    <Text style={[s.dayChipText, entry.days.includes(d) && { color: C.white }]}>{d[0]}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 20 },

  masterCard: {
    backgroundColor: C.white, borderRadius: 18, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  masterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  masterIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  masterTitle: { fontSize: 16, fontWeight: '700', color: C.black, marginBottom: 2 },
  masterSub: { fontSize: 12, color: C.subtext },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    backgroundColor: C.accentLight, borderRadius: 12, padding: 12, marginBottom: 20,
  },
  infoText: { flex: 1, fontSize: 12, color: C.accent, lineHeight: 18 },

  sectionLabel: { fontSize: 12, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },

  card: {
    backgroundColor: C.white, borderRadius: 16, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardDim: { opacity: 0.5 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardMetaText: { fontSize: 11, color: C.muted },
  dot: { color: C.muted, fontSize: 11 },

  remindRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  remindLabel: { fontSize: 12, color: C.subtext, fontWeight: '500' },
  remindOptions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  remindChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1.5, borderColor: C.border },
  remindChipText: { fontSize: 12, fontWeight: '700', color: C.muted },
  remindSuffix: { fontSize: 12, color: C.subtext },

  daysRow: { flexDirection: 'row', gap: 4 },
  dayChip: { width: 26, height: 26, borderRadius: 8, backgroundColor: C.pill, alignItems: 'center', justifyContent: 'center' },
  dayChipText: { fontSize: 10, fontWeight: '700', color: C.muted },
});