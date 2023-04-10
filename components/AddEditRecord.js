

import { useState, useEffect, useRef } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropdownPicker from "./DropdownPicker";
import Styles, { backgroundColor, textColor, namePlaceholderColor } from "../Styles";
import { taskStatuses, recurringBool } from '../helpers/globalData';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { interpolate, useSharedValue, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";


const fadedColor = '#aaa';

const AddEditRecord = (props) => {

    const [id, setId] = useState();
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [summary, setSummary] = useState('');
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dateCreated, setDateCreated] = useState('');
    const [dateCompleted, setDateCompleted] = useState('');
    const [recurring, setRecurring] = useState();

    const [showDueDate, setShowDueDate] = useState(false);
    const [showCreatedDate, setShowCreatedDate] = useState(false)
    const [showCompletedDate, setShowCompletedDate] = useState(false);

    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const animatedValue = useSharedValue(0);

    const animatedOpacity = useAnimatedStyle(() => {
        return {
            opacity: withTiming(interpolate(animatedValue.value, [0, 1], [0, 1]), { 
                duration: 500,  
                easing: Easing.inOut(Easing.exp),
                useNativeDriver: true 
            }),
        };
    })
    const animatedPos = useAnimatedStyle(() => {
        return {
            transform: [{translateY: withTiming(interpolate(animatedValue.value, [0, 1], [SCREEN_HEIGHT, 0]), { 
                duration: 500,  
                easing: Easing.inOut(Easing.exp),
                useNativeDriver: true 
            }), }]
        };
    })

    useEffect(() => {
        animatedValue.value = 1;
        
        const selectedItem = {...props.selectedItem};

        if (selectedItem.name == undefined) { //new record

            setId(props.lastId + 1);
            setStatus('To do');
            setDueDate(new Date());
            setDateCreated(new Date());
            setRecurring("No");
        }
        if (selectedItem.name != undefined) { //existing record

            setStatus(selectedItem.status);
            setId(selectedItem.id);
            setName(selectedItem.name)
            setSummary(selectedItem.summary);
            setNotes(selectedItem.notes);
            setDueDate(new Date(selectedItem.dueDate));
            setDateCreated(new Date(selectedItem.dateCreated));
            // console.log("*** Date Created:", selectedItem.dateCreated)
            // console.log("*** Date Completed:", selectedItem.dateCompleted)
            if (selectedItem.dateCompleted == undefined || selectedItem.dateCompleted == null || selectedItem.dateCompleted == '') {
                setDateCompleted('');
            } else {
                setDateCompleted(new Date(selectedItem.dateCompleted));
            }
            if (selectedItem.recurring == undefined || selectedItem.recurring == null || selectedItem.recurring == '' || selectedItem.recurring == 'No') {
                setRecurring('No');
            } else {
                setRecurring('Yes');
            }

        }
    }, [])

    const handleStatus = (value) => {
        setStatus(value);
        if (value == "Complete") {
            setDateCompleted(new Date());
        }
    }
    const handleRecurring = (value) => {
        setRecurring(value);
    }

    const onDueDateSelected = (event, value) => {
        setDueDate(value);
        setShowDueDate(false);
    };
    const onCreatedDateSelected = (event, value) => {
        setDateCreated(value)
        setShowCreatedDate(false);
    }
    const onCompletedDateSelected = (event, value) => {
        setDateCompleted(value)
        setShowCompletedDate(false);
    }

    const placeholderColor = (value) => {
        if (value == '' || value == null || value == undefined) { return '#777' }
        return fadedColor;
    }

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }

    const closeModal = (value) => {
        animatedValue.value = 0;
        setTimeout(() => {

            if (value == 'delete') { // Delete
                let newValues = {
                    id: id,
                    name: name,
                    status: status,
                    summary: summary,
                    notes: notes,
                    dueDate, dueDate,
                    dateCreated: dateCreated,
                    dateCompleted: dateCompleted,
                    recurring: recurring,
                }
                props._deleteRecord(newValues);
                return
            }
            if (value == 'save') { // Save
                let newValues = {
                    id: id,
                    name: name,
                    status: status,
                    summary: summary,
                    notes: notes,
                    dueDate, dueDate,
                    dateCreated: dateCreated,
                    dateCompleted: dateCompleted,
                    recurring: recurring
                }
                //console.log(newValues);
                props._saveRecord({...newValues});
            }
            props._handleModal(); // Save && Cancel
            
        }, 500);
    }

    


    return (
        <Animated.View style={[Styles.container]}>
            <Animated.View style={[{backgroundColor: 'rgba(255,255,255,0.5)', position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}, animatedOpacity]}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled={true}
            >

                <Animated.View style={[Styles.modal, Styles.castShadow, animatedPos]}>

                    {/* name */}
                    <View style={[{ backgroundColor: backgroundColor(status), borderTopLeftRadius: 6, borderTopRightRadius: 24, width: 700 }]}>
                        <View style={[Styles.inputRow, { borderBottomWidth: 0 }]}>
                            <TextInput
                                style={[Styles.h2, Styles.textInput, { flex: 1, color: textColor(status), paddingLeft: 10 }]}
                                placeholderTextColor={namePlaceholderColor(status)}
                                value={name}
                                onChangeText={setName}
                                placeholder='name'
                            />
                            <Text style={[Styles.h2, {paddingRight:10}]}>id: {id}</Text>
                        </View>
                    </View>


                    <View style={[Styles.row, {width: 700}]}>
                        <View style={[{ width: 300, padding: 10 }]}>
                            {/********** status **********/}
                            <DropdownPicker
                                options={taskStatuses}
                                defaultValue={taskStatuses[1]}
                                currentValue={status} 
                                placeholderColor={fadedColor} 
                                _selectedValue={handleStatus} 
                                >
                                status
                            </DropdownPicker>

                            {/********** created **********/}
                            <View style={[Styles.inputRow]}>
                                <Text style={[Styles.h2]}>
                                    {dateCreated != '' && dateCreated != null && dateCreated != undefined ?
                                        new Date(dateCreated).toLocaleDateString('en-us', dateOptions)
                                        : null}
                                </Text>
                                {showCreatedDate && (
                                    <DateTimePicker
                                        testID="dateCreated"
                                        value={dateCreated}
                                        mode='date'
                                        is24Hour={true}
                                        onChange={onCreatedDateSelected}
                                    />
                                )}
                                <TouchableOpacity style="flex 1"
                                    onPress={() => setShowCreatedDate(true)}>
                                    <Text style={[Styles.h2, { color: fadedColor }]}>
                                        created
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/********** due date **********/}
                            <View style={[Styles.inputRow]}>
                                <Text style={[Styles.h2]}>
                                    {dueDate != '' ?
                                        new Date(dueDate).toLocaleDateString('en-us', dateOptions)
                                        : null}
                                </Text>
                                {showDueDate && (
                                    <DateTimePicker
                                        testID="dueDate"
                                        value={dueDate}
                                        mode='date'
                                        is24Hour={true}
                                        onChange={onDueDateSelected}
                                    />
                                )}
                                <TouchableOpacity style="flex 1"
                                    onPress={() => setShowDueDate(true)}>
                                    <Text style={[Styles.h2, { color: fadedColor }]}>
                                        due
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/********** recurring **********/}
                            <DropdownPicker
                                options={recurringBool}
                                defaultValue={recurringBool[1]}
                                currentValue={recurring} 
                                placeholderColor={fadedColor} 
                                _selectedValue={handleRecurring} 
                                >
                                recurring
                            </DropdownPicker>
                          
                            {/********** completed **********/}
                            <View style={[Styles.inputRow]}>
                                <Text style={[Styles.h2]}>
                                    {dateCompleted != '' && dateCompleted != null && dateCompleted != undefined ?
                                        new Date(dateCompleted).toLocaleDateString('en-us', dateOptions)
                                        : null}
                                </Text>
                                {showCompletedDate && (
                                    <DateTimePicker
                                        testID="dateCompleted"
                                        value={dateCompleted}
                                        mode='date'
                                        is24Hour={true}
                                        onChange={onCompletedDateSelected}
                                    />
                                )}
                                <TouchableOpacity style="flex 1"
                                    onPress={() => setShowCompletedDate(true)}>
                                    <Text style={[Styles.h2, { color: fadedColor }]}>
                                        completed
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[{ width: 400, padding: 10 }]}>
                            {/* summary */}
                            <View style={[Styles.inputRow, { height: 75, alignItems: 'flex-start' }]}>
                                <TextInput
                                    multiline
                                    numberOfLines={2}
                                    maxLength={200}
                                    style={[Styles.h3, Styles.textInput, { flex: 1, height: 75 }]}
                                    placeholderTextColor={'#777'}
                                    value={summary}
                                    onChangeText={text => setSummary(text)} 
                                    >
                                </TextInput>
                                <Text style={[Styles.h3, Styles.placeholder, { color: placeholderColor(summary) }]}>summary</Text>
                            </View>

                            {/* notes */}
                            <View style={[Styles.inputRow, { height: 150, alignItems: 'flex-start' }]}>
                                <TextInput
                                    multiline
                                    maxLength={2048}
                                    style={[Styles.h3, Styles.textInput, { flex: 1, height: 150 }]}
                                    placeholderTextColor={'#777'}
                                    value={notes}
                                    onChangeText={text => setNotes(text)}
                                    >
                                </TextInput>
                                <Text style={[Styles.h3, Styles.placeholder, { color: placeholderColor(notes) }]}>notes</Text>
                            </View>
                        </View>



                    </View>

                    {/* Buttons */}

                    <View style={[Styles.row, { justifyContent: 'space-evenly', width: 500, padding: 20}]}>
                        <TouchableOpacity style={[Styles.button, { backgroundColor: '#FF6347' }]}
                            onPress={() => { closeModal('cancel') }} >
                            <Text style={[Styles.h2, { color: '#fafafa' }]}>Cancel</Text>
                        </TouchableOpacity>

                        {props.selectedItem.name != '' && props.selectedItem.name  != null && props.selectedItem.name  != undefined ?
                            <TouchableOpacity style={[Styles.button, { backgroundColor: '#222' }]}
                                onPress={() => { closeModal('delete') }} >
                                <Text style={[Styles.h2, { color: '#fafafa' }]}>Delete</Text>
                            </TouchableOpacity>
                            : null}

                        <TouchableOpacity style={[Styles.button, {
                            backgroundColor: name != '' ? '#47FF92' : '#ccc',
                        }]}
                            disabled={name != ''  ? false : true}
                            onPress={() => { closeModal('save') }} >
                            <Text style={[Styles.h2]}>Save</Text>
                        </TouchableOpacity>
                    </View>



                </Animated.View>
            </KeyboardAvoidingView>
        </Animated.View>
    )
}

export default AddEditRecord
