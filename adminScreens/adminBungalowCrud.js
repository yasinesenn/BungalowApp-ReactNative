

import {
    ScrollView,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity
  } from "react-native";
  import React, { useLayoutEffect, useState, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { Ionicons } from "@expo/vector-icons";
 
  import { collection, getDocs,updateDoc,deleteDoc} from "firebase/firestore";
  import { getAuth,  } from 'firebase/auth';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  
  import { Card, Text, Button} from '@rneui/themed';
  import app from '../config/firebase';
  
  

  
  const AdminBungalowCrud = () => {
    const auth = getAuth(app);
  
  
    const firestore = getFirestore(app);
    const navigation = useNavigation();
    const [bungaloow, setBungaloow] = useState([]);
   
    const [bungalovfav, setBungalows] = useState([]);
    const [userUID,setUserID]=useState(['']);
    
    const editBungalow = (roomId) => {
      navigation.navigate('EditBungalow', roomId);
    };
    const removeBungalov = (id) => {
    console.log(id);
      Alert.alert(
          'Onay',
          'Devam etmek istediğinize emin misiniz ?',
          [
            {
              style: 'cancel',
              text: 'Hayır',
            },
            {
              text: 'Evet',
              onPress:  async () => {
                  await deleteDoc(doc(firestore, "rooms", id));
                  Alert.alert("Silindi.");
                  navigation.replace('route');
              
              },
            },
          ],
          { cancelable: false }
        );
    };
    const bungalowOp = () => {
        navigation.navigate('AddBungalow');
      };
   
  
    useEffect(() => {
      const getbungalowss = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'rooms'));
          const userList = [];
          querySnapshot.forEach((doc) => {
            userList.push({ id: doc.id, data: doc.data() });
  
          });
          setBungaloow(userList);
  
        } catch (error) {
          console.error('Error fetching users: ', error);
        }
      };
  
      const favmi =
       auth.onAuthStateChanged((user) => {
        if (user) {
          setUserID(user.uid);
         
          
          
          
          const getfavbungalow = async () => {
            try {
              const docRef = doc(firestore, "users", user.uid);
              
              const docSnap = await getDoc(docRef);
              
              setBungalows(docSnap.data().likedRooms);
            
            } catch (ex) {
              console.error('Hata', ex);
            }
          };
          getfavbungalow();
        } 
      });
  
  
  
      
  
      getbungalowss();
    },
      []);
    useLayoutEffect(() => {
      navigation.setOptions(
        {
          headerShown: true,
          title: "Bungalovlar",
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
            <TouchableOpacity onPress={bungalowOp} style={{ marginRight: 12 }}>
            <Ionicons name="add" size={24} color="green" />
          </TouchableOpacity>
        ),
      });
    }, []);

    return (
      <>
        <ScrollView>

          {bungaloow.map((room) => (
             <Card key={room.id} containerStyle={styles.cardContainer}>
             {room.data.downloadUrlFirebase && (
               <Image source={{ uri: room.data.downloadUrlFirebase }} style={styles.cardImage} resizeMode="stretch" />
             )}
             <Text h4 style={styles.cardText}>
               {room.data.roomType}
             </Text>
             <Text style={styles.cardText}>{room.data.pricePerNight} ₺ / Gecelik</Text>
             <Button
               title="Bungalov Güncelle"
               type="outline"
               onPress={() => editBungalow(room.id)}
               buttonStyle={styles.button}
               titleStyle={styles.buttonText}
             />
             <Button
               title="Bungalov Sil"
               type="solid"
               onPress={() => removeBungalov(room.id)}
               buttonStyle={styles.button}
               titleStyle={styles.buttonText}
             />
            
           </Card>

           
          ))}
        </ScrollView>
  
  
      </>
    );
  };
  const styles = StyleSheet.create({
    cardContainer: {
      width: '80%',
      alignSelf: 'center',
    },
    cardImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    cardText: {
      textAlign: 'center',
      marginVertical: 10,
    },
    button: {
      marginVertical: 5,
      backgroundColor:'green'
    },
    buttonText: {
      color: 'white',
    },
  });
  
  export default AdminBungalowCrud;
  
 