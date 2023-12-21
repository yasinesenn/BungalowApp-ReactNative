
import React, { useLayoutEffect, useState, useEffect } from "react";
import { ScrollView ,Alert} from 'react-native';
import { getFirestore, doc,getDocs,collection,updateDoc} from 'firebase/firestore';
import app from '../config/firebase';
import { useNavigation } from "@react-navigation/native";
import { Button,Icon,ListItem} from '@rneui/themed';

const AdminNotification = () => {
    const [reservations, setReservations] = useState([]);
    const [updateKey, setUpdateKey] = useState(0);
    const navigation = useNavigation();
    const firestore = getFirestore(app);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const getKullanici = async () => {
            try {
                joinData();
              
            } catch (ex) {
                console.error('Error : ', ex);
            }
        };

        
        getKullanici();
    }, [updateKey]);
    const toggleOverlay = () => {
        setIsVisible(!isVisible);
      };
      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true,
          title: "Talepler",
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

  
    const editUser = (reserv) => {

       
   Alert.alert(
    'Eylemi Onayla',
    'Bu işlemi gerçekleştirmek istediğinize emin misiniz?',
    [
      {
        text: 'Hayır',
        style: 'cancel',
      },
      {
        text: 'Evet',
        onPress:  async () => {
          let state="Beklemede";
          if(reserv.data.state=="Beklemede"){
              state="Onaylandı";
          }
            try {
                const userRole = doc(firestore, "reservation",reserv.id);
        
    
                await updateDoc(userRole, {
                  state: state
                });
                Alert.alert("Tamamlandı");
             
              setUpdateKey(updateKey + 1);
              
            } catch (ex) {

              console.error('hata:', ex);
            }
        
        },
      },
    ],
    { cancelable: false }
  );

    
     
    
    
      };
    const joinData = async () => {
        try {
          // Rezervasyonları getir
          
          const querySnapshot = await getDocs(collection(firestore, 'reservation'));
          const reservationsList = [];
          querySnapshot.forEach((doc) => {
              reservationsList.push({ id: doc.id, data: doc.data() });
          });
         


          const querySnapshotUser = await getDocs(collection(firestore, 'users'));
          const userList = [];
          querySnapshotUser.forEach((doc) => {
            userList.push({ id: doc.id, data: doc.data() });
          });
     

          const querySnapshotHome = await getDocs(collection(firestore, 'rooms'));
          const homeList = [];
          querySnapshotHome.forEach((doc) => {
            homeList.push({ id: doc.id, data: doc.data() });
          });
         


        
           const combinedData = [];
      
          for (const reservationId in reservationsList) {
              const reservation = reservationsList[reservationId];
             
            const roomId = reservation.data.roomID;
      
            if (homeList && homeList.find(e=>e.id==roomId)) {
              const room = homeList.find(e=>e.id==roomId);
      
              combinedData.push( {
                ...reservation,
                room: {...room.data},
                user:{}
              });
      
    
              const userId = reservation.data.userUID;
              if (userList && userList.find(e=>e.id==userId)) {
              
                if( combinedData.find(e=>e.id==reservation.id)){
                   
                    combinedData.find(e=>e.id==reservation.id).user = {...userList.find(e=>e.id==userId).data};
                }
              }
            }
          }
          setReservations(combinedData);
       
        } catch (error) {
          console.error('Sorgu hatası:', error.message);
        }
      };

    return (
        <ScrollView>
            {reservations.map((reservation) => (

               
              

                <ListItem.Swipeable key={reservation.id}
                    leftContent={(reset) => {
                        reset();
                        return (
                            <Button
                                title={reservation.data.state == "Beklemede" ? "Onayla "  : "Onay kaldır "}
                                onPress={() => editUser(reservation)}
                                icon={{ name: 'edit', color: 'white' }}
                                buttonStyle={{ minHeight: '100%' }}
                            />
                        )
                    }}
                   
                >
                    <Icon />
                    <ListItem.Content style={{ fontSize: 18, height: 70 }}>
                        <ListItem.Title>{reservation.room.roomType}  ({ reservation.user.userEmail })-({reservation.data.state})</ListItem.Title>
                    </ListItem.Content>
                   
                </ListItem.Swipeable>
                
               




            ))}
        </ScrollView>
    )
}
export default AdminNotification;