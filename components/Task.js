import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Styles from '../Styles';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Easing } from "react-native-reanimated";

const Task = (props) => {

    const timing = 350;
    const animatedValue = useSharedValue(0);

    useEffect(() => {
        if (props.selectedItem.id == props.item.id) {
            
        } else {
            if (animatedValue.value == 1) {
                animatedValue.value = 0;
            }
        }
        
    }, [props.selectedItem])

    const backgroundColor = () => {
        switch (props.item.status) {
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

    const textColor = () => {
        switch (props.item.status) {
            case 'Backlog':
                return '#FAFAFA'
                break;
            case 'To do':
                return '#FAFAFA'
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
                return '#FAFAFA'
                break;
        }
    }

    const handleSelect = () => {
        animatedValue.value = 1;
        props._selectedItem(props.item, props.flatListIndex);
    }

    const dateString = { month: 'short', day: 'numeric', year: '2-digit' };

    const B = (props) => (
        <Text style={{ fontWeight: '700', color: '#555' }}>{props.children}</Text>
    )

    const returnDate = (date) => {
        if (date != null && date != undefined && date != "") {
            return (new Date(date).toLocaleDateString('en-us', dateString))
        }
        return ''
    }

    const returnTimeTaken = () => {
        const start = new Date(props.item.dateCreated);
        let finish = new Date(props.item.dateCompleted);
        if (props.item.dateCompleted == '' || props.item.dateCompleted == null || props.item.dateCompleted == undefined) {
            finish = new Date();
        }

        const diffInMs = finish - start;

        const diffinDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

        if (props.item.dateCreated == '' || props.item.dateCreated == null || props.item.dateCreated == undefined) {
            return " "
        }
        return diffinDays + "d " + diffInHours + "h " + diffInMinutes + "m "// + diffInSeconds + "s"
    }



    const animatedStyle = useAnimatedStyle(() => {
        return {
            shadowOpacity: withTiming(interpolate(animatedValue.value, [0, 1], [0.13, 0.2]), { 
                duration: timing,  
                easing: Easing.out(Easing.exp),
                useNativeDriver: true 
            }),
            shadowRadius: withTiming(interpolate(animatedValue.value, [0, 1], [4.65, 8.65]), { 
                duration: timing,  
                easing: Easing.out(Easing.exp),
                useNativeDriver: true 
            }),
            transform: [{ scale: withTiming(interpolate(animatedValue.value, [0, 1], [1, 1.1]), { 
                duration: timing,  
                easing: Easing.out(Easing.exp),
                useNativeDriver: true 
            }) }],
        }
    })

    return (
        props.item.name != 'placeholder' ?

            <Animated.View style={[styles.box, styles.radius, Styles.coreShadow, animatedStyle]} >

                {/* Title */}
                <View style={[{ backgroundColor: backgroundColor(), height: 30, justifyContent: 'center', borderTopLeftRadius: 3, borderTopRightRadius: 12 }]}>

                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={{ paddingLeft: 5, paddingRight: 10, alignItems: 'center', }}
                        style={{}}
                    >
                        <Text style={[Styles.h3, { color: textColor(), }]} numberOfLines={1}>{props.children}</Text>
                    </ScrollView>

                </View>

                {/* Summary */}
                <TouchableOpacity
                    onPress={() => handleSelect()}
                    style={[{ backgroundColor: '#fff', justifyContent: 'flex-start', padding: 5, overflow: 'hidden', borderBottomLeftRadius: 12, borderBottomRightRadius: 3 } ]}>

                    
                        <View style={[Styles.row, { justifyContent: 'space-between' }]}
                            >
                            {props.item?.status == 'Complete' ?
                                <>
                                    {props.item.recurring == 'Yes' ? <Feather name="repeat" size={16} color="#555" /> : <Text></Text>}
                                    <Text><B>{returnDate(props.item?.dateCompleted)}</B> <Feather name="flag" size={16} color="black" /></Text>
                                </>
                                :
                                <>
                                    {props.item.recurring == 'Yes' ? <Feather name="repeat" size={16} color="#555" /> : <Text></Text>}
                                    <Text><B>{returnDate(props.item?.dueDate)}</B> <Feather name="calendar" size={16} color="black" /></Text>
                                </>
                            }
                        </View>


                        <Text
                            numberOfLines={2}>
                            {props.item?.summary}
                        </Text>

                        <Text
                            numberOfLines={4}>
                            {props.item?.notes}
                        </Text>
                    

                </TouchableOpacity>

                

            </Animated.View>


            :
            <View style={[styles.container, { opacity: props.item.visible }]}>
                <View style={[styles.placeholder, { height: props.colWidth / 2 }]}><Text></Text></View>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
    },
    box: {
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        marginTop: 5,
        marginBottom: 5
    },
    radius: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 3,
        borderBottomLeftRadius: 12,
    },
    selected: {
        position: 'absolute',
        top: 0,
        left: -5,
        right: 0,
        bottom: 0,
        //borderRadius: 5,
        //borderWidth: 2,
        //borderStyle: 'dashed',
        //borderColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    button: {
        flex: 1,
        height: '100%',
        //backgroundColor: 'rgba(255,255,255,0.75)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholder: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(0,0,0,0.2)',
    },

});

export default Task