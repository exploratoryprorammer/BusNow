import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar, Modal, Switch,
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
  red: '#EF4444',
  green: '#10B981',
  pill: '#F3F4F6',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_CONFIG = {
  class:    { label: 'Class',    icon: 'school-outline',    color: '#2563EB' },
  activity: { label: 'Activity', icon: 'flash-outline',     color: '#7C3AED' },
  gym:      { label: 'Gym',      icon: 'barbell-outline',   color: '#059669' },
};

const EMPTY_ENTRY = { name: '', location: '', days: [], startTime: '', endTime: '', category: 'class' };

export default function ScheduleScreen() {
  const [entries, setEntries] = useState([
    { id: '1', name: 'COMS 3090', location: 'Coover Hall', days: ['Mon', 'Wed', 'Fri'], startTime: '9:00 AM', endTime: '9:50 AM', category: 'class' },
    { id: '2', name: 'MATH 2070', location: 'Carver Hall', days: ['Tue', 'Thu'], startTime: '11:00 AM', endTime: '12:15 PM', category: 'class' },
    { id: '3', name: 'Rec Center', location: 'State Gym', days: ['Mon', 'Wed'], startTime: '5:00 PM', endTime: '6:30 PM', category: 'gym' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_ENTRY });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('class');

  const filtered = entries.filter(e => e.category === activeTab);

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }));
  };

  const openAdd = (category = activeTab) => {
    setForm({ ...EMPTY_ENTRY, category });
    setEditingId(null);
    setModalVisible(true);
  };

  const openEdit = (entry) => {
    setForm({ ...entry });
    setEditingId(entry.id);
    setModalVisible(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setEntries(es => es.map(e => e.id === editingId ? { ...form, id: editingId } : e));
    } else {
      setEntries(es => [...es, { ...form, id: Date.now().toString() }]);
    }
    setModalVisible(false);
  };

  const remove = (id) => setEntries(es => es.filter(e => e.id !== id));

  const cfg = CATEGORY_CONFIG[activeTab];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.appName}>CatchIt</Text>
          <Text style={s.screenTitle}>My Schedule</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => openAdd()}>
          <Ionicons name="add" size={22} color={C.white} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={s.tabRow}>
        {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
          <TouchableOpacity
            key={key}
            style={[s.tab, activeTab === key && { backgroundColor: val.color }]}
            onPress={() => setActiveTab(key)}
          >
            <Ionicons name={val.icon} size={14} color={activeTab === key ? C.white : C.muted} />
            <Text style={[s.tabText, activeTab === key && { color: C.white }]}>{val.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name={cfg.icon} size={40} color={C.border} />
            <Text style={s.emptyTitle}>No {cfg.label.toLowerCase()}s yet</Text>
            <Text style={s.emptyText}>Tap + to add your first {cfg.label.toLowerCase()}</Text>
          </View>
        ) : (
          filtered.map(entry => (
            <TouchableOpacity key={entry.id} style={s.card} onPress={() => openEdit(entry)} activeOpacity={0.7}>
              <View style={[s.cardAccent, { backgroundColor: CATEGORY_CONFIG[entry.category].color }]} />
              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <Text style={s.cardName}>{entry.name}</Text>
                  <TouchableOpacity onPress={() => remove(entry.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="trash-outline" size={16} color={C.muted} />
                  </TouchableOpacity>
                </View>
                <View style={s.cardMeta}>
                  <Ionicons name="location-outline" size={13} color={C.muted} />
                  <Text style={s.cardMetaText}>{entry.location}</Text>
                </View>
                <View style={s.cardBottom}>
                  <View style={s.timeChip}>
                    <Ionicons name="time-outline" size={12} color={C.accent} />
                    <Text style={s.timeText}>{entry.startTime} – {entry.endTime}</Text>
                  </View>
                  <View style={s.daysRow}>
                    {DAYS.map(d => (
                      <View key={d} style={[s.dayDot, entry.days.includes(d) && { backgroundColor: CATEGORY_CONFIG[entry.category].color }]}>
                        <Text style={[s.dayDotText, entry.days.includes(d) && { color: C.white }]}>{d[0]}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={s.modal} edges={['top', 'bottom']}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={s.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>{editingId ? 'Edit' : 'Add'} {CATEGORY_CONFIG[form.category].label}</Text>
            <TouchableOpacity onPress={save}>
              <Text style={[s.modalSave, !form.name.trim() && { opacity: 0.3 }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Category picker */}
            <Text style={s.fieldLabel}>Category</Text>
            <View style={s.catRow}>
              {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                <TouchableOpacity
                  key={key}
                  style={[s.catChip, form.category === key && { backgroundColor: val.color, borderColor: val.color }]}
                  onPress={() => setForm(f => ({ ...f, category: key }))}
                >
                  <Ionicons name={val.icon} size={14} color={form.category === key ? C.white : C.muted} />
                  <Text style={[s.catChipText, form.category === key && { color: C.white }]}>{val.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Name</Text>
            <TextInput
              style={s.input}
              placeholder={form.category === 'class' ? 'e.g. COMS 3090' : form.category === 'gym' ? 'e.g. Weightlifting' : 'e.g. Club Soccer'}
              placeholderTextColor={C.muted}
              value={form.name}
              onChangeText={v => setForm(f => ({ ...f, name: v }))}
            />

            <Text style={s.fieldLabel}>Location</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. Coover Hall"
              placeholderTextColor={C.muted}
              value={form.location}
              onChangeText={v => setForm(f => ({ ...f, location: v }))}
            />

            <Text style={s.fieldLabel}>Days</Text>
            <View style={s.daysSelect}>
              {DAYS.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[s.dayBtn, form.days.includes(d) && { backgroundColor: CATEGORY_CONFIG[form.category].color, borderColor: CATEGORY_CONFIG[form.category].color }]}
                  onPress={() => toggleDay(d)}
                >
                  <Text style={[s.dayBtnText, form.days.includes(d) && { color: C.white }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>Start Time</Text>
                <TextInput
                  style={s.input}
                  placeholder="9:00 AM"
                  placeholderTextColor={C.muted}
                  value={form.startTime}
                  onChangeText={v => setForm(f => ({ ...f, startTime: v }))}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>End Time</Text>
                <TextInput
                  style={s.input}
                  placeholder="9:50 AM"
                  placeholderTextColor={C.muted}
                  value={form.endTime}
                  onChangeText={v => setForm(f => ({ ...f, endTime: v }))}
                />
              </View>
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  appName: { fontSize: 12, fontWeight: '600', color: C.accent, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  screenTitle: { fontSize: 26, fontWeight: '700', color: C.black, letterSpacing: -0.5 },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },

  tabRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, backgroundColor: C.pill },
  tabText: { fontSize: 13, fontWeight: '600', color: C.muted },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, gap: 10 },

  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: C.subtext },
  emptyText: { fontSize: 13, color: C.muted },

  card: { backgroundColor: C.white, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: C.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  cardMetaText: { fontSize: 12, color: C.muted },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.accentLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  timeText: { fontSize: 11, fontWeight: '600', color: C.accent },
  daysRow: { flexDirection: 'row', gap: 3 },
  dayDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.pill, alignItems: 'center', justifyContent: 'center' },
  dayDotText: { fontSize: 9, fontWeight: '700', color: C.muted },

  // Modal
  modal: { flex: 1, backgroundColor: C.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  modalCancel: { fontSize: 15, color: C.subtext },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.black },
  modalSave: { fontSize: 15, fontWeight: '700', color: C.accent },
  modalScroll: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  fieldLabel: { fontSize: 12, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },
  timeRow: { flexDirection: 'row' },

  catRow: { flexDirection: 'row', gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white },
  catChipText: { fontSize: 13, fontWeight: '600', color: C.muted },

  daysSelect: { flexDirection: 'row', gap: 6 },
  dayBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: C.border },
  dayBtnText: { fontSize: 12, fontWeight: '700', color: C.muted },
});