import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Welcome } from './src/pages/Welcome';

export default function App(){
  return(
    <Welcome />
    
  )
}
const style = StyleSheet.create({ /* Criamos um objeto de estilo e passamos a estilização */
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})