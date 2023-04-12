import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native'; // Than can also be used to toggle the drawer

import KanbanScreen from '../screens/KanbanScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Styles, backgroundColor } from '../Styles.js'

const Drawer = createDrawerNavigator();

function DrawerNav() {

    const defaultOptions = ({navigation}) => ({
        //Show sandwith-menu icon at the right
        drawerStyle: {

        },
        drawerPosition: 'right',
        headerLeft: () => (
            null
        ),
        headerRight: () => (
            // <TouchableOpacity onPress={() => navigation.openDrawer()}
            //     style={{marginRight: 45}}>
            //     <Feather
            //         name="menu"
            //         size={32}
            //         color={backgroundColor('To do')}
            //     />
            // </TouchableOpacity>
            null
        ),
        headerTitleStyle: {
            fontWeight: '700',
            fontSize: 28,
            letterSpacing: -1,
            color: '#555',
        },

    })


    return (
        <Drawer.Navigator 
            screenOptions={defaultOptions}
        >
            <Drawer.Screen name="Kanban" component={KanbanScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
}

export default DrawerNav