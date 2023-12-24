

import React, { useState ,useLayoutEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import { Input, Text, Button} from '@rneui/themed';
import app from '../config/firebase';
import { useNavigation } from "@react-navigation/native";
const EditProfile = () => {

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const auth = getAuth(app);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Şifre Değiştir",
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
 
  const handlePasswordChange = () => {
    const user = auth.currentUser;

       
        if (newPassword === confirmNewPassword && newPassword.length >= 6) {
          updatePassword(user,newPassword)
            .then(() => {
              
              Alert.alert('Başarılı', 'Şifre başarıyla güncellendi');
              setNewPassword('');
              setConfirmNewPassword('');
              navigation.navigate("CommonProfile");
            })
            .catch((ex) => {
              Alert.alert('Hata' );
              console.error(ex)
            });
        } else {
          Alert.alert('Hata', 'Parolalar eşleşmiyor yada kurallara uymuyor.');
        }
      
    
  };

  return (
   
    <View style={styles.container}>
  <Text style={{ fontSize: 20, fontWeight: 'bold',textAlign:'left', marginBottom: 10, color: 'green' }}>Yeni Şifre:</Text>
  <Input
    onChangeText={(text) => setNewPassword(text)}
    value={newPassword}
    placeholder="Yeni Şifre"
    containerStyle={{ marginBottom: 20 }}
    underlineColorAndroid="transparent"
    secureTextEntry
    inputStyle={{ ...styles.input, color: 'green' }}
  />
  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'green' }}>Yeni Şifre Tekrar:</Text>
  <Input
    secureTextEntry
    value={confirmNewPassword}
    underlineColorAndroid="transparent"
    placeholder="Yeni Şifre Tekrar"
    inputStyle={{ ...styles.input, color: 'green' }}
    containerStyle={{ marginBottom: 20 }}
    onChangeText={(text) => setConfirmNewPassword(text)}
  />
  <Button
    title="Şifre Değiştir"
    onPress={handlePasswordChange}
    titleStyle={{ fontWeight: 'bold', color: 'white' }}
    buttonStyle={{ ...styles.button, backgroundColor: 'red', borderRadius: 10 }}
  />
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#3081D0',
    padding: 15,
    margin: 10,
    width: 200,
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default EditProfile;
