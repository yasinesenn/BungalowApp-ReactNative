


import {
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  Pressable

} from "react-native";
  import React, { useLayoutEffect, useState, useEffect } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";

  import { collection,  getDocs,updateDoc,addDoc } from "firebase/firestore";
  import * as Notifications from 'expo-notifications';
  import { getAuth } from 'firebase/auth';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import app from '../config/firebase';
  import { Card , Button,Icon} from '@rneui/themed';

  

  const UserBungalow = () => {
    
    const navigation = useNavigation();
    
    const auth = getAuth(app);
    
    
    const [bungalowsState, setbungalows] = useState([]);
    const firestore = getFirestore(app);
    const [userID,setUserID]=useState(['']);
   
    const [favoriBungalow, setFavoriBungalows] = useState([]);
   
    
 
    const favTogg =async  (bungalowId) => {
      
      const favorimi = favoriBungalow.includes(bungalowId);
      
      if (favorimi) {
       const index = favoriBungalow.indexOf(bungalowId);
      if (index !== -1) {


        const yeniBungalow = [...favoriBungalow]; 


        yeniBungalow.splice(index, 1); 
        
        setFavoriBungalows(yeniBungalow); 


        const docRef = doc(firestore, "users", userID);
        
          
          await updateDoc(docRef, {
            likedRooms: yeniBungalow
          });
      }
      } else {
        const yeniBungalows = [...favoriBungalow]; 
          yeniBungalows.push(bungalowId); 
          
          setFavoriBungalows(yeniBungalows); 
          
          const docRef = doc(firestore, "users", userID);
  
          
            await updateDoc(docRef,
             {
              likedRooms: yeniBungalows
            });
      }
      
    };
    useEffect(() => {
      
      const favmi = auth.onAuthStateChanged((user) => {
        if (user) {
          setUserID(user.uid);
         
          
          
          
          const bugalowSync = async () => {
            try {
              const docRef = doc(firestore, "users", user.uid);
              const docSnap = await getDoc(docRef);
              
              setFavoriBungalows(docSnap.
                data()
                .likedRooms);
            
            } catch (error) {
              //Alert.alert("Hata Aldım :))");
            }
          };
          bugalowSync();
        } 
      });
  
  
  
      const getbungalow = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(firestore, 'rooms'));
          const userList = [];
          querySnapshot.
          forEach((doc) => {
            userList.push({ id: doc.id, data: doc.data() });
  
          });
          setbungalows(userList);
  
        } catch (error) {
          console.error('Error fetching users: ', error);
        }
      };
  
  
      getbungalow();
    },
      []);
   
    
  const talepOlustur=async(room)=>{
    console.log(room);
    try{
   const docRef = await addDoc(collection(firestore, "reservation"), {
      userUID: auth.currentUser.uid,
      state:"Beklemede",
      roomID:room.id,
    });
    
  
    navigation.navigate("Reserved");
    }catch(ex){
      console.log(ex);
     // Alert.alert("hata olustu");
    }
   
   
  }
  
   useLayoutEffect(() => {
      navigation.setOptions({
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
       
      });
    }, []);

  
    return (
      <>
        <ScrollView>
  
        
          {bungalowsState.map((room) => (
             <Card containerStyle={{ borderRadius: 10 }}>
             <Card.Image
               source={{ uri: room.data.downloadUrlFirebase }}
               resizeMode="cover"
               style={{ height: 200, borderRadius: 10 }}
             />
             <Pressable
               onPress={() => favTogg(room.id)}
               style={({ pressed }) => [
                 styles.likeButton,
                 { backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent' }, // Add a press effect
               ]}
             >
               <Icon
                 name={favoriBungalow.includes(room.id) ? 'heart' : 'heart-o'}
                 type="font-awesome"
                 size={24}
                 color={favoriBungalow.includes(room.id) ? 'red' : 'black'}
               />
             </Pressable>
             <Card.Title style={{ marginTop: 10, fontSize: 20 }}>{room.data.roomType}</Card.Title>
             <Text style={styles.price}>{room.data.pricePerNight} ₺ / Gecelik</Text>
             <Button
               title="Talep Oluştur"
               buttonStyle={{ backgroundColor: '#4CAF50', borderRadius: 10 }}
               titleStyle={{ color: 'white' }}
               icon={<Icon name="send" color="white" />}
               onPress={() => talepOlustur(room)}
             />
           </Card>
          
          ))}
        </ScrollView>
  
  
      </>
    );
  };
  
  export default UserBungalow;
  
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