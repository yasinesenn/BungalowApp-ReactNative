import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen  from "react-native-login-screen";

import { Alert,ScrollView,KeyboardAvoidingView} from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth,deleteUser,signInWithEmailAndPassword} from "firebase/auth";
import  app  from '../config/firebase';

const auth = getAuth();
const firestore = getFirestore(app);

const MyLogin = () => {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const longinBtn = () => {
        signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const docRef = doc(firestore, "users", userCredential.user.uid);
              const docSnap = await getDoc(docRef);
    
              if (docSnap.exists()) {
                
            
                navigation.navigate('route');
              } else {
                
                deleteUser(userCredential.user).then(() => {
                
                }).catch((error) => {
                  Alert.alert(error);
    
                });
              }
    
            
          })
          .catch(error => {
            
            Alert.alert("Hata",
             error.message);
          });
      };
    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true,
          title: "Giriş Yap",
          headerTitleStyle: {
            color: "green",
            fontWeight: "bold",
            fontSize: 25,
          },
          headerStyle: {
        
            backgroundColor: "#f1f2ed",
            height: 120,
          },
         
        });
      }, []);

    const navigation = useNavigation();

    const signclick = () => {
        navigation.navigate('mySignUp'); 
    };
  

    return (

        <KeyboardAvoidingView
           
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        >
            <ScrollView >
                <LoginScreen
                    logoImageSource={require('../assets/loginBackground.jpg')}
                    onLoginPress={longinBtn}
                    onSignupPress={signclick}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    disableSocialButtons
                />
            </ScrollView>
            <StatusBar style="auto" />

        </KeyboardAvoidingView>

    );
}

export default MyLogin;
