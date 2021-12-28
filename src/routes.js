import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Home from './screens/Home'
import Reads from './screens/Reads'
import Infos from './screens/Infos'

const Drawer = createDrawerNavigator()

const Routes = () => {
  return (
    <Drawer.Navigator
        screenOptions={{
            headerShown: false, 
            drawerContentStyle: { backgroundColor: '#44475a'},
            drawerActiveTintColor: '#f8f8f2',
            drawerInactiveTintColor: '#f8f8f2',
          }
        }
    >
        <Drawer.Screen name='Home' component={Home} options={{ title: 'Home' }} />
        <Drawer.Screen name='Reads' component={Reads} options={{ title: 'Lidos' }} />
        <Drawer.Screen name='Infos' component={Infos} options={{ title: 'Informações' }} />
    </Drawer.Navigator>
  );
}

export default Routes