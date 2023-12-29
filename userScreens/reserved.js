

import {ScrollView,StyleSheet,Text,} from "react-native";
  import { collection, query, where, getDocs,  } from "firebase/firestore";
  import React, { useLayoutEffect, useState, useEffect } from "react";
  import { getAuth } from 'firebase/auth';
  
  import { useNavigation } from "@react-navigation/native";
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import { Card } from '@rneui/themed';
  import app from '../config/firebase';
  
  

  const Reserved = () => {
    const auth = getAuth(app);
  
  
    const firestore = getFirestore(app);
    const [favbungalows, setBungalows] = useState([]);
    const navigation = useNavigation();
    const [bugalows, serbugalows] = useState([]);

  
  
    const [userID, setUserID] = useState(['']);

 
  
  
  
    useEffect(() => {
      const getBungalows =
       async () => {
  
        try {
          const reserveBungalow = collection(firestore, 
            'reservation');
          const userReserve = query(reserveBungalow,
             where('userUID', '==', userID));
      
          const userReserSnap = await getDocs(userReserve);
          const bungalowss = [];
          const rezerveBungalov = [];
          for (const temp of userReserSnap.docs)
           {
            const reservationData =
             temp.data();
            rezerveBungalov.push(
              reservationData);
           
            const roomRef = doc(firestore, 'rooms',
             reservationData.roomID);
            const docSnap =
             await getDoc(roomRef); 
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              bungalowss.push({ id: docSnap.id, data , 
                reservation: reservationData }); 
            } 
          }
          
          serbugalows(bungalowss); 
        } catch (error) {
          console.error('Ev Yok Gardaş');
        }
      };
      getBungalows();
      const favmila = auth.onAuthStateChanged((faruser) => {
        if (faruser) {
          setUserID(faruser.uid);
  
          const bungalowSync = async () => {
            try {
              const docRef = doc(firestore, 
                "users", faruser.uid);
              const docSnap = 
              await getDoc(docRef);
  
              setBungalows(docSnap.data().likedRooms);
            } catch (error) {
              console.error('Ev Yok Gardaş 2');
            }
          };
          bungalowSync();
        } 
      });
  
  
  
  
  
  
    },
      [bugalows]);
   
  
  
      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true,
          title: "Taleplerim",
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
      <>
        <ScrollView>
  
          {bugalows.map((bungalow) => (
             <Card key={bungalow.id} containerStyle={{ borderRadius: 10 }}>
             <Card.Image
               source={{ uri: bungalow.data.downloadUrlFirebase }}
               resizeMode="cover"
               style={{ height: 200, borderRadius: 10 }}
             />
             <Card.Title style={{ marginTop: 10, fontSize: 20 }}>{bungalow.data.roomType}</Card.Title>
             <Text style={styles.price}>{bungalow.data.pricePerNight} ₺ / Gecelik</Text>
             
           </Card>
          ))}
        </ScrollView>
  
  
      </>
    );
  };
  
  export default Reserved;
  
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
    },
    buttonText: {
      color: 'blue',
    },
  });