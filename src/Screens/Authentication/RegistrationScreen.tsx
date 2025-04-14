import React, {useState} from 'react';
import {
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import InputField from '../../Components/InputField';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../Redux/Slices/userSlice';
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from '../../Utils/Validations';
import {Icon} from 'react-native-paper';
import {Images} from '../../Assets';

const RegistrationScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.user.users);

  const onSubmit = () => {
    const newErrors = {
      name: name ? '' : 'Name is required',
      email: validateEmail(email) ? '' : 'Invalid email',
      phone: validatePhone(phone) ? '' : 'Invalid phone number',
      password: validatePassword(password) ? '' : 'Weak password',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (hasErrors) return;

    const userExists = users.some(
      user =>
        user.email.toLowerCase() === email.toLowerCase() ||
        user.phone === phone,
    );

    if (userExists) {
      Alert.alert(
        'Duplicate Entry',
        'User with this email or phone number already exists.',
      );
      return;
    }

    dispatch(registerUser({name, email, phone, password}));
    // Navigate to Event List Screen here

    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <ScrollView style={{padding: 20}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{flexDirection: 'row'}}>
        <Image style={styles.imageStyle} source={Images.ArrowLeft} />
        <Text>Go Back</Text>
      </TouchableOpacity>

      <InputField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        error={errors.name}
      />
      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
      />
      <InputField
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="numeric"
        error={errors.phone}
      />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        error={errors.password}
      />
      <Button title="Register" onPress={onSubmit} />
    </ScrollView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 20,
  },
});
