import React from "react";
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from "./navigation/Tabs";
import DrawerNav from "./navigation/Drawer";


export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="auto"/>
            <DrawerNav />
        </NavigationContainer>
    )
}







