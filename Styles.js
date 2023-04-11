

import { StyleSheet } from "react-native";
import { screen } from "./helpers/globalData";

export const backgroundColor = (status) => {
    switch (status) {
        case 'Backlog':
            return '#5967FF'
            break;
        case 'To do':
            return '#FF6347'
            break;
        case 'In progress':
            return '#E4FF47'
            break;
        case 'Review':
            return '#40E0D0'
            break;
        case 'Complete':
            return '#47FF92'
            break;
        default:
            return 'grey'
            break;
    }
}

export const textColor = (status) => {
    switch (status) {
        case 'Backlog':
            return '#eee'
            break;
        case 'To do':
            return '#eee'
            break;
        case 'In progress':
            return '#777'
            break;
        case 'Review':
            return '#fff'
            break;
        case 'Complete':
            return '#777'
            break;
        default:
            return '#FAFAFA'
            break;
    }
}

export const namePlaceholderColor = (status) => {
    switch (status) {
        case 'Backlog':
            return '#eee'
            break;
        case 'To do':
            return '#eee'
            break;
        case 'In progress':
            return '#555'
            break;
        case 'Review':
            return '#555'
            break;
        case 'Complete':
            return '#555'
            break;
        default:
            return '#eee'
            break;
    }
}


const Styles = StyleSheet.create({
    coreShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.13,
        shadowRadius: 4.65,
        
        elevation: 6,
    },
    castShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.18,
        shadowRadius: 7.49,
        
        elevation: 12,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    inputRow: { 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        borderBottomWidth: 2,
        height: 50,
    },
    column: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        padding: 10,
    },
    divider: {
        width: 3,
        height: '90%',
        borderRadius: 3,
        backgroundColor: '#rgba(0,0,0,0)'
    },
    h1: {
        fontWeight: '700',
        fontSize: 28,
        letterSpacing: -1,
        color: '#555',
    },
    h2: {
        // width: '100%',
        fontWeight: '700',
        fontSize: 28,
        letterSpacing: -1,
        color: '#555',
        textAlign: 'left'
    },
    placeholder: {
        textAlign: 'right',
        color: '#777'
    },
    h3: {
        textAlign: 'left',
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: -1,
        color: '#555',
    },
    debugArea: {
        position: 'absolute',
        bottom: 50,
        width: '80%',
        height: 200,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 24,
    },
    button: {
        paddingRight: 20,
        paddingTop: 10,
    },
    kanbanList: { 
        width: '100%', 
        overflow: 'visible', 
        paddingTop: 10 
    }
    
   
});

export default Styles