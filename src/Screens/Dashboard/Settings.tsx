import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {clearCurrentUser, setRememberMe} from '../../Redux/Slices/userSlice';

import {useNavigation} from '@react-navigation/native';

export default function Settings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    dispatch(setRememberMe(false));
    dispatch(clearCurrentUser());
    navigation.navigate('Root');
  };

  const confirmLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: handleLogout},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <Button title="Logout" onPress={confirmLogout} color="#e74c3c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
