

import { useNavigation } from "@react-navigation/native";
import { Card ,Icon} from '@rneui/themed';
import {ScrollView, StyleSheet,Text, Pressable} from "react-native";

import { updateDoc } from "firebase/firestore";
import React, { useLayoutEffect, useState, useEffect } from "react";
import app from '../config/firebase';
import { getAuth, } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


const Liked = () => {
    
    const [userID, setUserID] = useState(['']);
    
    const navigation = useNavigation();
    const firestore = getFirestore(app);
    const [favBungalows, setFawBungalows] = useState([]);
    const [bungalows, setBungalows] = useState([]);
    const auth = getAuth(app);



    const favTogg = async (bungalowID) => {

        const index = favBungalows.indexOf(bungalowID); 
        
        const favMi = favBungalows.includes(bungalowID);
        if (favMi) {

            if (index !== -1) {
                const yeniBungalows 
                = [...favBungalows]; 
                yeniBungalows.splice(index,
                     1); 

                setFawBungalows(yeniBungalows); 


                const docRef = doc(firestore,
                     "users", userID);

            
                await updateDoc(docRef, {
                    likedRooms: yeniBungalows
                });
            }
        } else {


            const newFavBungalow =
             [...favBungalows]; 


            newFavBungalow.push(bungalowID);

            setFawBungalows(newFavBungalow); 
            const docRef = doc(firestore, 
                "users", userID);

         
            await updateDoc(docRef, {
                likedRooms: newFavBungalow
            });
        }

    };

    useEffect(() => {
        const getBungalow = async () => {

            try {
                const userList = [];
                for (const roomId of favBungalows) {
                    const roomDocRef = doc(firestore, 'rooms', roomId);


                    const roomDocSnap = await getDoc(roomDocRef);
                    
                    if (roomDocSnap.exists()) {
                        userList.push({ id: roomDocSnap.id, data: roomDocSnap.data() });
                    }
                }
                setBungalows(userList);
            } catch {
            }
        };
        getBungalow();
        const favmila = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserID(user.uid);

                const bungalowssync =
                 async () => {
                    try {
                        const docRef = doc(firestore, "users", user.uid);
                        const docSnap = await getDoc(docRef);

                        setFawBungalows(docSnap.data().likedRooms);
                    } catch  {
                      
                    }
                };
               
                bungalowssync();
            }
        });






    },
        [favBungalows]);
        useLayoutEffect(() => {
            navigation.setOptions({
              headerShown: true,
              title: "Favorilerim",
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
     
            <ScrollView>
                {bungalows.map((room) => (
                     <Card key={room.id} containerStyle={{ borderRadius: 10 }}>
                     <Card.Image
                       source={{ uri: room.data.downloadUrlFirebase }}
                       resizeMode="cover"
                       style={{ height: 200, borderRadius: 10 }}
                     /><Pressable
                     onPress={() => favTogg(room.id)}
                     style={({ pressed }) => [
                         styles.likeButton,
                         { backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent' }, 
                     ]}
                 >
                     <Icon
                         name={favBungalows.includes(room.id) ? 'heart' : 'heart-o'} 
                         type="font-awesome" 
                         size={24}
                         color={favBungalows.includes(room.id) ? 'red' : 'black'}
                     />
                 </Pressable>
                     <Card.Title style={{ marginTop: 10, fontSize: 20 }}>{room.data.roomType}</Card.Title>
                     <Text style={styles.price}>{room.data.pricePerNight} ₺ / Gecelik</Text>
                     
                   </Card>
                    
                ))}
            </ScrollView>


    
    );
};

export default Liked;

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