import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, Modal, View, StyleSheet, PanResponder, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import Task from '../components/Task';
import Draggable from '../components/Draggable';
import Draggable2 from '../components/Draggable2';
import Animated, { Layout } from 'react-native-reanimated';
import { database } from '../helpers/TempDatabase';
import { getData, getDataObject, storeData, storeDataObject, placeholders } from '../helpers/databaseASYNC';
import { screen } from '../helpers/globalData';
import AddEditRecord from '../components/AddEditRecord';
import Styles, { backgroundColor } from '../Styles';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';


const KanbanScreen = (props) => {

    const [reRender, setReRender] = useState(0);
    const [debugLog, setDebugLog] = useState('');

    const handleDebug = (value) => {
        setDebugLog(debugLog + '\n' + value);
    }

    const windowWidth = Dimensions.get("window").width;
    const colWidth = (windowWidth / 5) - (3 * 4);
    const fullColWidth = (windowWidth / 5);

    const [activeList, setActiveList] = useState(-1);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [draggablePos, setDraggablePos] = useState({ x: 0, y: 0 })

    const [modalAddVisible, setModalAddVisible] = useState(false);

    useEffect(() => {
        //console.log(selectedItem);
        if (selectedItem != {}) {
            //console.log(selectedItem.y)
            setDraggablePos({ x: selectedItem.x, y: selectedItem.y })
        }
    }, [selectedItem])

    const [lastId, setLastId] = useState(-1);
    const [allTasks, setAllTasks] = useState([]); // loaded from database
    const [displayTasks, setDisplayTasks] = useState({ //what is displayed
        backlog: [],
        toDo: [],
        inProgress: [],
        review: [],
        complete: []
    })

    // Load Tasks from Database
    useEffect(() => {
        //storeDataObject('tasks', database); //reset data
        getDataObject('tasks').then((data => {
            //console.log(data);
            if (data == null || data == undefined) {
                storeDataObject('tasks', []);
                setAllTasks([]);
            } else {
                try {
                    //console.log()
                    setLastId(Math.max(...data.map(o => o.id)));
                } catch {
                    setLastId(-1)
                }

                //setAllTasks([...data, ...placeholders]);
                setAllTasks([...data]);
                data.map((item, index) => {
                    //console.log(item.id, item.name)
                })
            }
        }))

    }, [])

    // Sort Tasks to status's
    useEffect(() => {
        //console.log("ALL TASKS:",allTasks);
        if (allTasks.length == 0) {

            const displayTasks = {
                backlog: [placeholders[0]],
                toDo: [placeholders[1]],
                inProgress: [placeholders[2]],
                review: [placeholders[3]],
                complete: [placeholders[4]]
            };
            setDisplayTasks(displayTasks);

        } else {

            const displayTasks = {
                backlog: [],
                toDo: [],
                inProgress: [],
                review: [],
                complete: []
            };

            // filter all tasks into status's
            let backlog = allTasks.filter((item) => item.status.includes("Backlog"));
            let toDo = allTasks.filter((item) => item.status.includes("To do"));
            let inProgress = allTasks.filter((item) => item.status.includes("In progress"));
            let review = allTasks.filter((item) => item.status.includes("Review"));
            let complete = allTasks.filter((item) => item.status.includes("Complete"));

            // sort 
            backlog = backlog.sort(function (a, b) { return b.dueDate > a.dueDate ? -1 : 1 });
            toDo = toDo.sort(function (a, b) { return b.dueDate > a.dueDate ? -1 : 1 });
            inProgress = inProgress.sort(function (a, b) { return b.dueDate > a.dueDate ? -1 : 1 });
            review = review.sort(function (a, b) { return b.dueDate > a.dueDate ? -1 : 1 });
            complete = complete.sort(function (a, b) { return b.dateCompleted > a.dateCompleted ? 1 : -1 });

            // create completed sections
            let sections = [];
            let date;
            for (item of complete.reverse()) {
                date = new Date(item.dateCompleted);
                let day = date.getDay();
                if (day > 4) { date.setDate(date.getDate() - (day - 4)) }
                if (day < 4) { date.setDate(date.getDate() + (4 - day)) }
                break
            };

            let today = new Date();
            date.setHours(23, 59, 47); 
            while (date < today) {
                ///console.log(date)
                const dateSection = {
                    name: 'dateSection',
                    status: 'Complete',
                    dateCompleted: new Date(date).toJSON()
                }
                complete.push({...dateSection});
                date.setDate(date.getDate() + 7);
            }
            //console.log("sections:", sections);


            displayTasks.backlog = backlog;
            displayTasks.backlog.push(placeholders[0]); // keep placeholders out of allTasks as we don't need to save them to the Database
            displayTasks.toDo = toDo;
            displayTasks.toDo.push(placeholders[1]);
            displayTasks.inProgress = inProgress;
            displayTasks.inProgress.push(placeholders[2]);
            displayTasks.review = review;
            displayTasks.review.push(placeholders[3]);
            displayTasks.complete = complete;
            displayTasks.complete.push(sections);
            complete = complete.sort(function (a, b) { return b.dateCompleted > a.dateCompleted ? 1 : -1 });
            console.log("***");
            complete.map((item, index) => {
                console.log(item.name, item.dateCompleted);
            });
            setDisplayTasks(displayTasks);
        }

    }, [allTasks])


    const _handleSelectedItem = (item, index) => {
        //console.log(item);
        setSelectedItem(item);
        setSelectedItemIndex(index);
        toggleModal();
    }

    const hidePlaceHolders = () => {
        displayTasks.backlog[displayTasks.backlog.length - 1].visible = false;
        displayTasks.toDo[displayTasks.toDo.length - 1].visible = false;
        displayTasks.inProgress[displayTasks.inProgress.length - 1].visible = false;
        displayTasks.review[displayTasks.review.length - 1].visible = false;
        displayTasks.complete[displayTasks.complete.length - 1].visible = false;
    }

    const _preChangeStatus = (id, currentStatus, newStatus) => {
        hidePlaceHolders();
        if (currentStatus != newStatus) {
            displayTasks[newStatus][displayTasks[newStatus].length - 1].visible = true;
        }
        setReRender(reRender + 1);
    }

    const _changeStatus = (id, oldStatus, newStatus) => {
        hidePlaceHolders();
        if (oldStatus == newStatus) {
            return;
        }

        let obj = { ...displayTasks }; // get display tasks
        let indexToSplice = -1;
        obj[oldStatus].map((item, i) => {
            if (item.id == id) { // find tasks comparing id
                item.status = newStatus; // change status
                indexToSplice = i; // get index for splicing 
            }
        })
        if (indexToSplice != -1) {
            obj[oldStatus].splice(indexToSplice, 1); // remove from old status array
            obj[newStatus].splice(obj[newStatus].length - 1, 0, { ...selectedItem }); //add to new status array minus last entry which is a place holder
        }
        //console.log(obj);
        setDisplayTasks({ ...obj });
        setSelectedItem({});



        // let allTasksTemp = [...allTasks];
        // allTasksTemp.map((item) => {
        //     if (item.id == id && item.status != newStatus) {

        //         item.status = newStatus;
        //         if (newStatus == "complete") {
        //             item.dateCompleted = new Date().toLocaleDateString();
        //         } else {
        //             item.dateCompleted = '';
        //         }
        //     }
        // })
        // setAllTasks(allTasksTemp);
        //storage.set('tasks', JSON.stringify(allTasksTemp));
    }

    const toggleModal = () => {
        if (modalAddVisible) {
            setSelectedItem({});
        }
        setModalAddVisible(!modalAddVisible); // toggle modal
    }

    const saveRecord = (data) => {
        let recurring = {}; //recurring placeholder

        let newRecord = true;
        let allTasksArray = [...allTasks];
        allTasksArray = allTasksArray.map((item, index) => {
            if (item.id == data.id) { // check if edited task
                newRecord = false;
                return data
            }
            return item
        })

        if (newRecord) { // add new task
            allTasksArray.push(data);
        }
        // if (data.recurring == "Yes" && data.status == "Complete") { //add recurring task
        //     recurring = {...data};
        //     recurring.id = allTasks.length; // change id
        //     recurring.status = 'To do'; // reset status
        //     allTasksArray.push(recurring); 
        // }
        try {
            setAllTasks(allTasksArray); // set to state
            setLastId(data.id); // change last id
            storeDataObject('tasks', allTasksArray);
        } catch (e) {
            console.error(e);
        }

    }

    const deleteRecord = (data) => {
        setSelectedItem({}) // remove selected item

        let remainingTasks = allTasks.filter(function (item) {
            return item.id !== data.id
        });

        //console.log(remainingTasks);
        setAllTasks(remainingTasks);
        storeDataObject('tasks', remainingTasks) // save to database
        toggleModal(); // close modal after delete

        try { setLastId(Math.max(...remainingTasks.map(o => o.id))); }
        catch { setLastId(-1) }
    }

    const renderItem = ({ item, index }) => (
        <Task key={item?.id?.toString()} flatListIndex={index} colWidth={colWidth} item={item} _selectedItem={_handleSelectedItem} selectedItem={selectedItem} _edit={toggleModal} style={{ overflow: 'visible' }}>{item.name}</Task>
    )

    return (

        <View style={[Styles.container, Styles.row]}>

            <Modal
                visible={modalAddVisible}
                transparent={true}
                animationType={'none'}
            >

                <AddEditRecord lastId={lastId} selectedItem={selectedItem} _handleModal={toggleModal} _saveRecord={saveRecord} _deleteRecord={deleteRecord} />


            </Modal>

            <View style={[Styles.column, { width: colWidth, zIndex: 2 }]} >
                <Text style={[Styles.h2, { width: '100%' }]}>Backlog</Text>
                <FlatList
                    style={[Styles.kanbanList]}
                    contentContainerStyle={{}}
                    horizontal={false}
                    bounces={true}
                    data={displayTasks.backlog}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onTouchStart={() => setActiveList(0)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={Styles.divider}></View>
            <View style={[Styles.column, { width: colWidth, zIndex: 2 }]} >
                <Text style={[Styles.h2, { width: '100%' }]}>To do</Text>
                <FlatList
                    style={[Styles.kanbanList]}
                    contentContainerStyle={{}}
                    horizontal={false}
                    bounces={true}
                    data={displayTasks.toDo}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onTouchStart={() => setActiveList(1)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={Styles.divider} />
            <View style={[Styles.column, { width: colWidth, zIndex: 2 }]} >
                <Text style={[Styles.h2, { width: '100%' }]}>In progress</Text>
                <FlatList
                    style={[Styles.kanbanList]}
                    contentContainerStyle={{}}
                    horizontal={false}
                    bounces={true}
                    data={displayTasks.inProgress}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onTouchStart={() => setActiveList(2)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={Styles.divider} />
            <View style={[Styles.column, { width: colWidth, zIndex: 2 }]} >
                <Text style={[Styles.h2, { width: '100%' }]}>Review</Text>
                <FlatList
                    style={[Styles.kanbanList]}
                    contentContainerStyle={{}}
                    horizontal={false}
                    bounces={true}
                    data={displayTasks.review}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onTouchStart={() => setActiveList(3)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={Styles.divider} />
            <View style={[Styles.column, { width: colWidth, zIndex: 2 }]} >
                <Text style={[Styles.h2, { width: '100%' }]}>Complete</Text>
                <FlatList
                    style={[Styles.kanbanList]}
                    contentContainerStyle={{}}
                    horizontal={false}
                    bounces={true}
                    data={displayTasks.complete}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onTouchStart={() => setActiveList(4)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={[Styles.column, { flex: 0, width: 90 }]}>
                <Text style={[Styles.h2, { width: '100%' }]}>Menu</Text>
                <View style={Styles.kanbanList}>

                    <TouchableOpacity style={[Styles.coreShadow, {
                        margin: 5, width: 60, height: 60, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
                        borderTopLeftRadius: 3, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 3
                    }]}
                        onPress={() => props.navigation.toggleDrawer()}>

                        <Feather name="menu" size={32} color={backgroundColor('Review')} />

                    </TouchableOpacity>

                    <TouchableOpacity style={[Styles.coreShadow, {
                        margin: 5, width: 60, height: 60, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
                        borderTopLeftRadius: 3, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 3
                    }]}
                        onPress={() => toggleModal()}>

                        <Feather name="plus" size={32} color={backgroundColor('To do')} />

                    </TouchableOpacity>
                </View>

            </View>

        </View>

    )
}

export default KanbanScreen