import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import * as Updates from 'expo-updates'
import Routes from './src/routes'
import { NavigationContainer } from '@react-navigation/native'
import { Alert } from 'react-native'

const MyDrawer = () => {

  msg = '' // Mensagem de att aqui!!!

  async function getUpdate() {
    await Updates.fetchUpdateAsync()
    await Updates.reloadAsync()
  }
  
  useEffect(() => {
    async function updateApp() {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      // const isAvailable = true // para testes

      if (isAvailable) {
        Alert.alert(
          'Atualização',
          msg,
          [
            {
              text: 'Atualizar',
              onPress: () => getUpdate()
            }
          ],
          { cancelable: false }
        )
      }
    }
    updateApp()
  }, [])

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

export default MyDrawer