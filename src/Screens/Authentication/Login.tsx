import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Button,
  Alert,
  TouchableOpacity,
  Text,
  Switch,
} from 'react-native';
import InputField from '../../Components/InputField';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../Redux/store';
import {validateEmail, validatePassword} from '../../Utils/Validations';
import {setCurrentUser, setRememberMe} from '../../Redux/Slices/userSlice';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRemember] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const users = useSelector((state: RootState) => state.user.users);
  const dispatch = useDispatch();

  const onLogin = () => {
    const newErrors = {
      email: validateEmail(email) ? '' : 'Invalid email',
      password: validatePassword(password) ? '' : 'Invalid password format',
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (!hasErrors) {
      const matchedUser = users.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (matchedUser) {
        dispatch(setCurrentUser(matchedUser));
        dispatch(setRememberMe(rememberMe));
        navigation.navigate('TabNavigator');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    }
  };

  const OnRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <ScrollView style={{padding: 20}}>
      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
      />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        error={errors.password}
      />
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
        <Switch value={rememberMe} onValueChange={setRemember} />
        <Text style={{marginLeft: 8}}>Remember Me</Text>
      </View>
      <Button title="Login" onPress={onLogin} />
      <TouchableOpacity onPress={OnRegisterPress}>
        <Text style={{marginTop: 16, color: 'blue', textAlign: 'center'}}>
          Register user
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;
