import React, { useState, useEffect } from "react";
import UserBungalow from "../userScreens/userBungalow";
import AdminBungalow from "../adminScreens/adminBungalow";
import AdminBungalowCrud from "../adminScreens/adminBungalowCrud";
import MySignUp from "../commonScreens/mySignUp";
import CommonProfile from "../commonScreens/commonProfile";
import AdminNotification from "../adminScreens/adminNotification";
import AddBungalow from "../adminScreens/addBungalow";
import Liked from "../userScreens/liked";
import Reserved from "../userScreens/reserved";
import MyLogin from "../commonScreens/myLogin";
import EditBungalow from "../adminScreens/editBungalow";

import EditProfile from "../commonScreens/editProfile";
import { getAuth ,onAuthStateChanged} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "./firebase";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Feather,FontAwesome5 } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';


const StackNavigator = () => {

    const auth = getAuth(app);


    const firestore = getFirestore(app);

    const [kullaniciMail, setKullaniciMail] = useState(null);

    const [kullaniciYetki, setKullaniciYetki] = useState(null);
  
    useEffect(() => {
      const promis = onAuthStateChanged(auth, async (user) => {
      
        if (user) {
           
          const dockref = doc(firestore, 'users', user.uid); 


          try {
            const usrsnap = await getDoc(dockref);
            if (usrsnap.exists()) {
              const data = usrsnap.data();
              setKullaniciYetki(data.role); 
              setKullaniciMail(data.userEmail);
             
            }
     
          } catch  {
           
          }
        } 
      });
  
      return () => promis();
    }, []);


    const Stack = createNativeStackNavigator();


    const TopTab = createBottomTabNavigator();


    function UserButtons() {
        
        return (
          
          

<TopTab.Navigator>
  <TopTab.Screen name="UserBungalow" component={UserBungalow} options={{
    tabBarLabel: "Bungalovlar", tabBarIcon: ({ focused }) => focused ? (
      <FontAwesome5 name="globe" size={24} color="black" />
    ) : (
      <Feather name="globe" size={24} color="black" />
    ),
  }} />
  <TopTab.Screen name="Liked" component={Liked} options={{
    tabBarLabel: "Favoriler", tabBarIcon: ({ focused }) => focused ? (
      <Feather name="heart" size={24} color="black" />
    ) : (
      <Feather name="heart" size={24} color="black" />
    ),
  }} />
  <TopTab.Screen name="Reserved" component={Reserved} options={{
    tabBarLabel: "Taleplerim", tabBarIcon: ({ focused }) => focused ? (
      <FontAwesome5 name="bell" size={24} color="black" />
    ) : (
      <FontAwesome5 name="bell" size={24} color="black" />
    ),
  }} />
  <TopTab.Screen name="CommonProfile" component={CommonProfile} options={{
    tabBarLabel: "Profil", tabBarIcon: ({ focused }) => focused ? (
      <FontAwesome5 name="user" size={24} color="black" />
    ) : (
      <FontAwesome5 name="user" size={24} color="black" />
    ),
  }} />
</TopTab.Navigator>
        );
      }
    
    function AdminButtons() {
      
      return (
        
        <TopTab.Navigator
        tabBarOptions={{
          activeTintColor: 'black', // Set the active tab text color
          inactiveTintColor: 'gray', // Set the inactive tab text color
        }}
        tabBarStyle={{ backgroundColor: 'orange' }} // Set the background color for the entire tab bar
        tabBarItemStyle={{ padding: 10 }} // Cust
        >
            <TopTab.Screen name="AdminBungalowCrud" 
            component={AdminBungalowCrud} 
            options={{
    tabBarLabel: "Bungalovlar", headerShown: false,
     tabBarIcon:
     ({ focused }) => focused ? (
      <Feather name="globe" size={24} color="black" />
    ) : (
      <Feather name="globe" size={24} color="black" />
    ),
  }} />
  <TopTab.Screen name="AdminNotification" 
  component={AdminNotification} options={{
    tabBarLabel: "Talepler", headerShown: false, tabBarIcon:
     ({ focused }) => focused ? (
      <FontAwesome5 name="bell" size={24} color="black" /> // Replace with the desired FontAwesome5 icon
    ) : (
      <FontAwesome5 name="bell" size={24} color="black" /> // Replace with the desired FontAwesome5 icon
    ),
  }} />
  <TopTab.Screen name="AdminBungalow" 
  component={AdminBungalow}
   options={{
    tabBarLabel: "Kullanıcılar", headerShown: false,
     tabBarIcon: ({ focused }) => focused ? (
      <Feather name="users" size={24} color="black" /> // Replace with the desired Feather icon
    ) : (
      <Feather name="users" size={24} color="black" /> // Replace with the desired Feather icon
    ),
  }} />

  <TopTab.Screen name="CommonProfile" component={CommonProfile} 
  options={{
    tabBarLabel: "Profil", headerShown: false, tabBarIcon: 
    ({ focused }) => focused ? (
      <FontAwesome5 name="user" size={24} color="black" /> // Replace with the desired FontAwesome5 icon
    ) : (
      <FontAwesome5 name="user" size={24} color="black" /> // Replace with the desired FontAwesome5 icon
    ),
  }} />
  
</TopTab.Navigator>
      );
    }
   
    return (
      <> 
       
      <NavigationContainer>
      
        <Stack.Navigator initialRouteName='myLogin'>
         
        {kullaniciYetki == 'admin' ? (
            <Stack.Screen name="route" component={AdminButtons} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="route" component={UserButtons} options={{ headerShown: false }} />
          )}
          
          <Stack.Screen name="myLogin"
           options={{
            tabBarLabel: "Giriş Yap", headerShown: false
          }}
           component={MyLogin} />


         <Stack.Screen name="mySignUp" 
         options={{
            tabBarLabel: "Kaydol", headerBackTitleVisible: true,
            headerTintColor: 'white'
            ,headerBackTitle:'Geri',headerShown: true
          }} 
          component={MySignUp} />
    
      


          <Stack.Screen name="AddBungalow" 
          options={{
            tabBarLabel: "Bungalov Ekleme", headerBackTitle:"Geri",
            headerTitle:"Bungalov Ekle" ,headerShown: true,
          }} component={AddBungalow} />
          <Stack.Screen name="EditBungalow" options={{

            tabBarLabel: "Bungalow Düzenle", headerBackTitle:"Geri"
            ,headerTitle:"Bungalov Düzenle" ,headerShown: true
          }} component={EditBungalow} />

     
          <Stack.Screen name="AdminBungalow" 
          options={{
            tabBarLabel: "Kullanıcılar"

          }} component={AdminBungalow} />

         <Stack.Screen name="EditProfile" options={{
            tabBarLabel: "Profil",headerBackTitle:"Geri"
            ,headerTitle:"Profil Düzenle" ,headerShown: true
          }} component={EditProfile} />
          <Stack.Screen name="AdminBungalowCrud" options={{
            tabBarLabel: "Admin Bungalov Crud"
          }}
           component={AdminBungalowCrud} />
         
        </Stack.Navigator>
      </NavigationContainer>
      </>
     
    );
  };
  
  export default StackNavigator;
  