
import React, { useState,useLayoutEffect } from 'react';

import { collection, addDoc, db } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert,KeyboardAvoidingView, Platform,  TouchableWithoutFeedback,Keyboard  } from 'react-native';
import { getStorage,uploadBytesResumable, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Input , Button} from '@rneui/themed';
import  app  from '../config/firebase';

const AddBungalow = () => {
  const navigation = useNavigation();
  const [bungalowName, setBungalowName] = useState('');
  const [gecelikprice, setGecelikPrice] = useState('');
  const [sayi, setSayi] = useState('');
  const [phoneNum, setPhone] = useState('');
  const [imageURL, setImageURL] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [downloadUrlFirebase, setDownloadUrlFirebase] = useState('');
  const storage=getStorage(app);
  const getBlobFromUri = async (uri) => {
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageURL(result.assets[0].uri);
      if (imageURL) {
        setUploading(true); 
        const blob = await getBlobFromUri(imageURL);
        const uniqueId = uuidv4().replace(/-/g, '');
       const storageRef = ref(storage, `/images/${uniqueId}`);
        const upImage = uploadBytesResumable(storageRef, blob);
  

  upImage.on('state_changed', 
    (snapshot) => {
    }, 
    (error) => {
    }, 
    () => {
      
      setUploading(false);
     
      getDownloadURL(upImage.snapshot.ref).then((downloadURL) => {
        console.log('url', downloadURL);
        setDownloadUrlFirebase(downloadURL);
      });
    }
  );
      } else {
        console.log('Resim Seç');
      }
    }
  };

  const addNewBungalow = async (roomData) => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), roomData);
      Alert.alert("Bungalow Oluşturuldu.");
      navigation.replace('route');
      
    } catch (error) {
      console.error('Belge eklenirken hata oluştu:', error);
    }
  };

  const bungalowOp = async () => {
    if (bungalowName && gecelikprice && sayi &&  phoneNum && imageURL) {
      const newRoomData = {
        roomType: bungalowName,
        pricePerNight: gecelikprice,
        capacity: sayi,
        phoneNum,
        
        downloadUrlFirebase,
      };

      addNewBungalow(newRoomData);
    } else {
      Alert.alert('Tüm Alanları Doldurunuz');
    }
  };
  const handlePress = () => {
    Keyboard.dismiss();
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Bungalov Ekle",
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

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
     
 
    <Input
      placeholder="Ev Tipi"
      leftIcon={{ type: 'font-awesome', name: 'home' }}
      containerStyle={styles.inputContainer}
      value={bungalowName}
      onChangeText={text => setBungalowName(text)}
    />
    <Input
      placeholder="Kişi Sayısı"
      keyboardType="numeric"
      leftIcon={{ type: 'font-awesome', name: 'users' }}
      containerStyle={styles.inputContainer}
      value={sayi}
      onChangeText={text => setSayi(text)}
    />
    <Input
      placeholder="Gecelik Ücret"
      keyboardType="numeric"
      leftIcon={{ type: 'font-awesome', name: 'money' }}
      containerStyle={styles.inputContainer}
      value={gecelikprice}
      onChangeText={text => setGecelikPrice(text)}
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
        style={{with:'100%'}}
        titleStyle={{color:'green'}}
      />
      <Button disabled={uploading}
      onPress={bungalowOp} 
      title="Ekle"
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
   
    width:'100%',
    marginTop:'14px',
    backgroundColor:'green'
  },
  buttonText: {
    color: 'white',
  }
});

export default AddBungalow;
