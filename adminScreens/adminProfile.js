import React ,{ useLayoutEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Alert,View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getAuth,signOut } from 'firebase/auth';

import app from '../config/firebase';
const AdminProfile = () => {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const changepass = () => {
    navigation.navigate('EditProfile');
  };
  
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
      headerRight: () => (
        <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Çıkış yap</Text>
      </TouchableOpacity>
      ),
    });
  }, []);

  const logout = () => {
    signOut(auth)
    .then(() => {
     
      navigation.navigate("myLogin");
    }).catch((error) => {

      Alert.alert("Hata oldu");
    });
  };
  return (
   
       
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.button} onPress={changepass}>
        <Text style={styles.buttonText}>Sifre değiştir</Text>
      </TouchableOpacity>
     
      
    </View>
     
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 18,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'green',
    alignItems: 'center',
    width: 100,
  },
  container: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AdminProfile;
