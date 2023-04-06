import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import KanbanScreen from '../screens/KanbanScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tabs = () => {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={KanbanScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default Tabs