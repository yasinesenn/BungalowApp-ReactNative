

import React, { useState,useEffect } from 'react';
import {  StyleSheet, Alert ,KeyboardAvoidingView, Platform,  TouchableWithoutFeedback,Keyboard } from 'react-native';

import app ,{ db } from '../config/firebase';
import { getStorage,uploadBytesResumable, getDownloadURL, ref,  } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';
import { Input , Button} from '@rneui/themed';

import { doc, getDoc,updateDoc} from "firebase/firestore";
const EditBungalow = ({route}) => {
  const navigation = useNavigation();
  const [phoneNum, setPhone] = useState('');
  const [sayi, setsayi] = useState('');
  
  const [gecelik, setgecelik] = useState('');
  const [uploading, setUploading] = useState(false);
  const [firebaseUrl, setfirebaseUrl] = useState('');
  const [bungalowname, setname] = useState('');
  const [imageURL, setImageURL] = useState(null);
  
  const storage=getStorage(app);
  const id  = route.params;
  const [bungalow, setbungalow] = useState([]);
  
  useEffect(() => {
  const getbungalow = async () => {
    try {
      
     
      const docRef = doc(db, "rooms", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setbungalow(docSnap.data());
        
      
        setname(docSnap.data().roomType);
        setgecelik(docSnap.data().pricePerNight);
        setImageURL(docSnap.data().downloadUrlFirebase);
        setsayi(docSnap.data().capacity);
        setPhone(docSnap.data().phoneNum);
      
       
        setfirebaseUrl(docSnap.data().downloadUrlFirebase);
      } 
      
    } catch (error) {
    
    }
    
  };

 
  getbungalow();
  
  
},
  []);
  const bloburl = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("hata"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    return blob;
  };
  const resimsec = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      
      setImageURL(result.assets[0].uri);
      if (imageURL) {
        setUploading(true); 
        const blob = await bloburl(imageURL);
        const uniqueId = uuidv4().replace(/-/g, '');
       const storageRef = ref(storage, `/images/${uniqueId}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
  
 
  uploadTask.on('state_changed', 
    (snapshot) => {}, 
    (error) => {
      setUploading(false);
    
     
    }, 
    () => {//başarılı oldugunda gir
     
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
     
        console.log('url', downloadURL);
        setUploading(false);
        setfirebaseUrl(downloadURL);
      });
    }
  );
      } else {
        console.log('resim seç');
      }
    }
  };

  const editbungalow = async (roomData) => {
    try {
      const userRole = doc(db, "rooms",id);

    
      await updateDoc(userRole, roomData);
      Alert.alert("This record updated.");
      navigation.replace('route','AdminBungalowCrud');
    
  } catch (error) {
    console.error('Rol güncelleme hatası:', error);
  }
  };

  const handleCreateRoom = async () => {
console.log(bungalowname);
console.log(gecelik);
console.log(sayi);
console.log(phoneNum);
    if (bungalowname && gecelik && sayi &&  phoneNum ) {
      const newRoomData = {
        roomType: bungalowname,
        pricePerNight: gecelik,
        capacity: sayi,
        phoneNum,
        
        downloadUrlFirebase: firebaseUrl,
      };

      editbungalow(newRoomData);
    } else {
      Alert.alert('Tümünü dold');
    }
  };
  const handlePress = () => {
    // Bu fonksiyon herhangi bir yere tıklandığında klavyeyi kapatır.
    Keyboard.dismiss();
  };


  return (

    <TouchableWithoutFeedback onPress={handlePress}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
     
    {/* Modern Görünümlü Input Örnekleri */}
    <Input
      placeholder="Ev Tipi"
      leftIcon={{ type: 'font-awesome', name: 'user' }}
      containerStyle={styles.inputContainer}
      value={bungalowname}
      onChangeText={text => setname(text)}
    />
    <Input
      placeholder="Kişi Sayısı"
      keyboardType="numeric"
      leftIcon={{ type: 'font-awesome', name: 'envelope' }}
      containerStyle={styles.inputContainer}
      value={sayi}
      onChangeText={text => setsayi(text)}
    />
    <Input
      placeholder="Gecelik Ücret"
      keyboardType="numeric"
      leftIcon={{ type: 'font-awesome', name: 'lock' }}
      containerStyle={styles.inputContainer}
      value={gecelik}
      onChangeText={text => setgecelik(text)}
    />
    <Input
      placeholder="Telefon"
      keyboardType="phone-pad"
      leftIcon={{ type: 'font-awesome', name: 'phone' }}
      value={phoneNum}
      onChangeText={setPhone}
      containerStyle={styles.inputContainer}
    />
     <Button
        title="Resim Seç"
        type="outline"
        onPress={resimsec}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      <Button disabled={uploading}
      onPress={handleCreateRoom} 
      title="Guncelle"
       buttonStyle={styles.button} 
      titleStyle={styles.buttonText}/>
      
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
   
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%',
  },
  button: {
    marginVertical: 20,
    width:'100%'
  },
  buttonText: {
    color: 'blue',
  }
});


export default EditBungalow;
