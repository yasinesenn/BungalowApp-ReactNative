
import LoginScreen from "react-native-login-screen";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import React, { useLayoutEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { db, doc, setDoc } from '../config/firebase';

const auth = getAuth();

const MySignUp = () => {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [favourite, setFavourite] = useState([]);

    const kaydolbtn = () => {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async(userCredential) => {
            
            Alert.alert("Hesap oluştu.")
            const user = userCredential.user;

            const userUID = user.uid;

            const userEmail = user.email;

            const userDocRef = doc(db, 'users', userUID);
            setFavourite([]);
              try {
                await setDoc(userDocRef, { 
                  userUID: userUID,

                  userEmail: userEmail,

                  role: "user",

                  likedRooms:favourite
                });
              
              } catch (e) {
                Alert.alert("Hesap oluşmadı");
              }
            
            console.log(user);
            navigation.navigate('myLogin');
            
          })
          .catch(error => {
           
            Alert.alert("hata", error.message); 
          });
      };
      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true,
          title: "Kaydol",
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



    return (

        <KeyboardAvoidingView  >
            <ScrollView >
              
                <LoginScreen
                    logoImageSource={require('../assets/loginBackground.jpg')}
                    onLoginPress={kaydolbtn}
                    onSignupPress={kaydolbtn}
                    onEmailChange={setEmail}
                    loginButtonText={'Create an account'}
                    disableSignup
                    disableSocialButtons
                    onPasswordChange={setPassword}
                />

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default MySignUp;

