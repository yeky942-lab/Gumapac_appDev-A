import { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';
import IMG from '../../utils/images';
import { REGISTER_REQUEST } from '../../app/reducers/authReducer';
import { RootState } from '../../app/store';
import type { AuthStackParamList } from '../../navigations/AuthNav';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [emailAdd, setEmailAdd] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();
  const { isLoading, error, registerSuccess } = useSelector((state: RootState) => state.auth);

  // Log when Register screen loads
  console.log('[SCREEN] Register screen loaded');

  // Handle registration success
  useEffect(() => {
    if (registerSuccess) {
      console.log('[SUCCESS] Registration successful, redirecting to login');
      Alert.alert('Success', 'Registration successful! Please check your email to verify your account, then login.');
      navigation.navigate(ROUTES.LOGIN);
    }
  }, [registerSuccess, navigation]);

  // Handle registration error
  useEffect(() => {
    if (error) {
      console.log(`[ERROR] Registration failed: ${error}`);
      Alert.alert('Registration Failed', error);
    }
  }, [error]);

  const handleRegister = () => {
    // Log button press with final values
    console.log('[ACTION] Register button pressed');
    console.log(`[DATA] Email: ${emailAdd}, Name: ${name}`);

    // Validate inputs
    if (name === '' || emailAdd === '' || phone === '' || password === '' || confirmPassword === '') {
      console.log('[VALIDATION] Empty fields detected');
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('[VALIDATION] Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('[VALIDATION] Password too short');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    console.log('[VALIDATION] All fields valid, dispatching REGISTER_REQUEST');
    
    // Dispatch Redux action with fullName, phone, and address
    dispatch({ 
      type: REGISTER_REQUEST, 
      payload: { 
        email: emailAdd, 
        password, 
        fullName: name,
        phone,
        address
      } 
    });
  };

  const handleLoginPress = () => {
    console.log('[ACTION] Login link pressed');
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <ImageBackground
      source={IMG.CONE_BG}
      style={styles.background}
      resizeMode="cover"
      onError={() => setImageError(true)}
    >
      {imageError && <View style={styles.gradientFallback} />}
      <View style={[styles.overlay, imageError && styles.blueOverlay]} />
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Join Sweet Scoops for delicious treats!</Text>

        <CustomTextInput
          label={'Full Name'}
          placeholder={'Enter Your Name'}
          value={name}
          onChangeText={setName}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <CustomTextInput
          label={'Email Address'}
          placeholder={'Enter Email Address'}
          value={emailAdd}
          onChangeText={setEmailAdd}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <CustomTextInput
          label={'Phone Number'}
          placeholder={'Enter Phone Number'}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <CustomTextInput
          label={'Address'}
          placeholder={'Enter Your Address (Optional)'}
          value={address}
          onChangeText={setAddress}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <CustomTextInput
          label={'Password'}
          placeholder={'Enter Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <CustomTextInput
          label={'Confirm Password'}
          placeholder={'Confirm Password'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />

        <CustomButton
          label={isLoading ? "REGISTERING..." : "Sign Up"}
          containerStyle={[styles.button, isLoading && { backgroundColor: 'gray' }]}
          textStyle={styles.buttonText}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color="white" />}
        </CustomButton>

        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0096C8', // Fallback blue
  },
  gradientFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0096C8',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,150,200,0.3)',
  },
  blueOverlay: {
    backgroundColor: 'rgba(0,120,180,0.5)', // Darker blue when no image
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ECDC4',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0F7F5',
  },
  inputText: {
    color: '#2D3436',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: '#636E72',
    marginRight: 5,
    fontSize: 14,
  },
  linkText: {
    color: '#4ECDC4',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default Register;