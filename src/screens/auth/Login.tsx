import { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';
import IMG from '../../utils/images';
import { LOGIN_REQUEST } from '../../app/reducers/authReducer';
import { _signInWithGoogle } from '../../utils/firebase';
import type { RootState } from '../../app/store';
import type { AuthStackParamList } from '../../navigations/AuthNav';

const Login = () => {
  const [emailAdd, setEmailAdd] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();
  
  // Get loading, error, and auth state from Redux
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Log when Login screen loads
  console.log('[SCREEN] Login screen loaded');

  // Show error alert when error changes
  useEffect(() => {
    if (error) {
      console.log(`[ERROR] Login failed: ${error}`);
      Alert.alert('Login Failed', error);
    }
  }, [error]);

  // Navigate to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[SUCCESS] User authenticated successfully, redirecting');
      // RootNav will handle switching to MainNav with Dashboard
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = () => {
    // Log button press with final values
    console.log('[ACTION] Login button pressed');
    console.log(`[DATA] Email: ${emailAdd}, Password entered: ${password ? 'Yes' : 'No'}`);

    if (emailAdd === '' || password === '') {
      console.log('[VALIDATION] Empty fields detected');
      Alert.alert(
        'Invalid Credentials',
        'Please enter valid email address and password',
      );
      return;
    }

    console.log('[VALIDATION] All fields filled, dispatching LOGIN_REQUEST');
    
    // Dispatch login action
    dispatch({ 
      type: LOGIN_REQUEST, 
      payload: { email: emailAdd, password } 
    });
  };

  const handleRegisterPress = () => {
    console.log('[ACTION] Register link pressed');
    navigation.navigate(ROUTES.REGISTER);
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
        <Text style={styles.title}>Sweet Scoops</Text>
        <Text style={styles.subtitle}>Welcome back! Login to order your favorite ice cream</Text>

        <CustomTextInput
          label={'Email Address'}
          placeholder={'Enter Email Address'}
          value={emailAdd}
          onChangeText={setEmailAdd}
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

        <CustomButton
          label={isLoading ? "LOGGING IN..." : "Sign In"}
          containerStyle={[styles.button, isLoading && { backgroundColor: 'gray' }]}
          textStyle={styles.buttonText}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color="white" />}
        </CustomButton>

        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    justifyContent: 'center' as const,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B9D',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center' as const,
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFE0E9',
  },
  inputText: {
    color: '#2D3436',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6B9D',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    fontSize: 16,
  },
  footerLinks: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 25,
  },
  footerText: {
    color: '#636E72',
    marginRight: 5,
    fontSize: 14,
  },
  linkText: {
    color: '#FF6B9D',
    fontWeight: 'bold',
    textDecorationLine: 'underline' as const,
    fontSize: 14,
  },
});

export default Login;