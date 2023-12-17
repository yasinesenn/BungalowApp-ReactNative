


import React, { useLayoutEffect, useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import {  Button,Icon,ListItem} from '@rneui/themed';
import { collection,  getDocs } from "firebase/firestore";
import { getFirestore, doc, deleteDoc,updateDoc} from 'firebase/firestore';
import { Alert,ScrollView} from 'react-native';
import app from '../config/firebase';

const AdminBungalow = () => {
  
  
  const firestore = getFirestore(app);
  const [users, setUsers] = useState([]);
  const [isUpdated,setUpdated]=useState(0);
  const editUser = (user) => {
    
    Alert.alert(
      'Onay',
      'Devam etmek istediğinize emin misiniz ?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress:  async () => {
            let selectedRole="user";

            if(user.data.role=="user"){

              selectedRole="admin";
            }
              try {
                  const userRole = doc(firestore, "users",user.id);
          
                
                  await updateDoc(userRole, {
                    role: selectedRole
                  });

                  Alert.alert("Yetki değiştirildi.");
                  setUpdated(isUpdated+1);
                 
                
              } catch (error) {
                console.error('Rol güncelleme hatası:', error);
              }
          
          },
        },
      ],
      { cancelable: false }
    );


  };

  const removeUser = (id) => {
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
              await deleteDoc(doc(firestore, "users", id));
             
              Alert.alert("silindi.");
             
              navigation
              .replace('route','AdminBungalow');
          
          },
        },
      ],
      { cancelable: false }
    );
    
  };

 

 
  const navigation = useNavigation();
  useEffect(() => {
    const getKullanici = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const userList = [];
        querySnapshot.
        forEach((doc) => {
          
          userList.push({ id: doc.id, data: doc.data() });
        });
        setUsers(userList);
      } catch (ex) {
       
        console.log(ex)
       
      }
    };
   

    getKullanici();
  }, [isUpdated]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Kullanıcılar",
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
      {users.map((user) => (
        
    
    <ListItem.Swipeable key={user.id}
  leftContent={(reset) => {
    reset();
    return (
    <Button
      title={user.data.role=="admin" ?  "Yekti kaldır":"Yetkilendir"}
      onPress={() => editUser(user)}
      icon={{ name: 'edit', color: 'white' }}
      buttonStyle={{ minHeight: '100%' ,backgroundColor:'green'}}
    />
  )}}
  rightContent={(reset) => {
    reset();
   return  (
    <Button
      title="Delete"
      onPress={() => removeUser(user.id)}
      icon={{ name: 'delete', color: 'white' }}
      buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
    />
  )}}
>
  <Icon  />
  <ListItem.Content style={{ fontSize: 18, height: 70 }}>
    <ListItem.Title>{user.data.userEmail}  ({user.data.role})</ListItem.Title>
  </ListItem.Content>
  <ListItem.Chevron />
</ListItem.Swipeable>

       
      
    ))}
    </ScrollView>
  );
};

export default AdminBungalow;
