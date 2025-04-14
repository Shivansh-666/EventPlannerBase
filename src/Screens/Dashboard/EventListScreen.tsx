// Final EventListScreen.tsx with Styled Show, Delete, and Create Event Modals
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Modal,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {deleteEvent, setFilter, addEvent} from '../../Redux/Slices/EventSlice';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const filters = ['Today', 'This week', 'This month', 'This Year'];
const recurrenceTypes = ['Single', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

const EventListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {events, filter} = useSelector((state: RootState) => state.events);
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [showEventModalVisible, setShowEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    recurrence: 'Single',
  });

  const confirmDelete = (id: string) => {
    setSelectedEventId(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedEventId) {
      dispatch(deleteEvent(selectedEventId));
    }
    setDeleteModalVisible(false);
    setSelectedEventId(null);
  };

  const handleCreateEvent = () => {
    const {name, startDate, recurrence} = newEvent;
    if (!name || !startDate || !recurrence) return;
    dispatch(
      addEvent({
        ...newEvent,
        id: Math.random().toString(),
        createdBy: user?.email ?? '',
      }),
    );
    setNewEvent({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      recurrence: 'Single',
    });
    setCreateModalVisible(false);
  };

  const openEventDetails = (event: any) => {
    setSelectedEvent(event);
    setShowEventModalVisible(true);
  };

  const getNextOccurrences = (start: string, type: string) => {
    const base = moment(start);
    let dates = [];
    for (let i = 1; i <= 5; i++) {
      switch (type) {
        case 'Daily':
          dates.push(base.clone().add(i, 'days').format('DD MMM YYYY'));
          break;
        case 'Weekly':
          dates.push(base.clone().add(i, 'weeks').format('DD MMM YYYY'));
          break;
        case 'Monthly':
          dates.push(base.clone().add(i, 'months').format('DD MMM YYYY'));
          break;
        case 'Yearly':
          dates.push(base.clone().add(i, 'years').format('DD MMM YYYY'));
          break;
        default:
          break;
      }
    }
    return dates;
  };

  const filterEvents = () => {
    const today = moment();
    return events.filter(event => {
      if (event.createdBy !== user?.email) return false;
      const eventDate = moment(event.startDate);
      switch (filter) {
        case 'Today':
          return eventDate.isSame(today, 'day');
        case 'This week':
          return eventDate.isSame(today, 'week');
        case 'This month':
          return eventDate.isSame(today, 'month');
        case 'This Year':
          return eventDate.isSame(today, 'year');
        default:
          return true;
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Create New Event"
        onPress={() => setCreateModalVisible(true)}
      />

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => dispatch(setFilter(f))}
            style={[styles.filterBtn, filter === f && styles.selected]}>
            <Text style={styles.filterText}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filterEvents()}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text>Date: {moment(item.startDate).format('DD MMM YYYY')}</Text>
            <Text>Type: {item.recurrence}</Text>
            <View style={styles.actions}>
              <Button title="Show" onPress={() => openEventDetails(item)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => confirmDelete(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            No Events Found
          </Text>
        }
      />

      {/* Show Event Detail Modal */}
      <Modal visible={showEventModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <ScrollView>
                <Text style={styles.eventTitle}>{selectedEvent.name}</Text>
                <Text>Description: {selectedEvent.description || '-'}</Text>
                <Text>
                  Start Date:{' '}
                  {moment(selectedEvent.startDate).format('DD MMM YYYY')}
                </Text>
                {selectedEvent.endDate ? (
                  <Text>
                    End Date:{' '}
                    {moment(selectedEvent.endDate).format('DD MMM YYYY')}
                  </Text>
                ) : null}
                <Text>Recurrence: {selectedEvent.recurrence}</Text>
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].includes(
                  selectedEvent.recurrence,
                ) && (
                  <>
                    <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                      Next 5 Occurrences:
                    </Text>
                    {getNextOccurrences(
                      selectedEvent.startDate,
                      selectedEvent.recurrence,
                    ).map((date, idx) => (
                      <Text key={idx}>• {date}</Text>
                    ))}
                  </>
                )}
                <View style={styles.modalActions}>
                  <Button
                    title="Close"
                    onPress={() => setShowEventModalVisible(false)}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Event Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 16, marginBottom: 20}}>
              Are you sure, you want to remove this event?
            </Text>
            <View style={styles.modalActions}>
              <Button title="No" onPress={() => setDeleteModalVisible(false)} />
              <Button title="Yes" onPress={handleDeleteConfirmed} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Event Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.eventTitle}>Create New Event</Text>
            <TextInput
              placeholder="Event Name"
              style={styles.input}
              value={newEvent.name}
              onChangeText={text => setNewEvent({...newEvent, name: text})}
            />
            <TextInput
              placeholder="Description (optional)"
              style={styles.input}
              value={newEvent.description}
              onChangeText={text =>
                setNewEvent({...newEvent, description: text})
              }
            />
            <TextInput
              placeholder="Start Date (YYYY-MM-DD)"
              style={styles.input}
              value={newEvent.startDate}
              onChangeText={text => setNewEvent({...newEvent, startDate: text})}
            />
            <TextInput
              placeholder="End Date (optional)"
              style={styles.input}
              value={newEvent.endDate}
              onChangeText={text => setNewEvent({...newEvent, endDate: text})}
            />
            <Text style={{marginTop: 10}}>Recurrence Type</Text>
            <View style={styles.filterRow}>
              {recurrenceTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setNewEvent({...newEvent, recurrence: type})}
                  style={[
                    styles.filterBtn,
                    newEvent.recurrence === type && styles.selected,
                  ]}>
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setCreateModalVisible(false)}
              />
              <Button title="Save" onPress={handleCreateEvent} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9fb',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  filterBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: '#fff',
    marginVertical: 6,
    marginRight: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selected: {
    backgroundColor: '#4b7bec',
    borderColor: '#4b7bec',
  },
  filterText: {
    color: '#333',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#2c3e50',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    backgroundColor: '#fefefe',
    padding: Platform.OS === 'ios' ? 12 : 10,
    marginVertical: 10,
    fontSize: 16,
    elevation: 1,
  },
});

export default EventListScreen;
