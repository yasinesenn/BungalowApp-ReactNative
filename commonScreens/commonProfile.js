
import React, { useLayoutEffect, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../config/firebase';
import { useNavigation } from "@react-navigation/native";
import { View, Text, ActivityIndicator } from 'react-native';
import AdminProfile from "../adminScreens/adminProfile";
import UserProfile from "../userScreens/userProfile";



const CommonProfile = () => {
  const [kulmail, setmail] = useState(null);
  
  const [kulyetki, setkulyetki] = useState(null);

  const auth = getAuth(app);

  const firestore = getFirestore(app);

  const navigation = useNavigation();

  useEffect(
    () => {
    const favmila = onAuthStateChanged(auth, async (user) => {
      if (user) {
      
        const userDocRef = doc(firestore, 'users', user.uid); 
        try {

          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {

            const userData = userDocSnapshot.data();
            
            setkulyetki(userData.role); 

            setmail(userData.userEmail);
          } 
        } catch (error) {
         
        }
      } 
    });

    return () => favmila();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Profil",
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


  
  const rolgoster = () => {
   
    if (kulyetki === 'admin') {
      return (
        <View style={{marginTop:'50%', alignItems:'center'}}>
    
          <AdminProfile/>
          </View>
      
      );
    } else  {
      return (
        <View style={{marginTop:'50%', alignItems:'center'}}>
         
          <UserProfile/>
          </View>
      
      );
    } 
  };

  return (
    <View>
      {rolgoster()}
    </View>
  );
};

export default CommonProfile;
