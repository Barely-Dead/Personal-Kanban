import { useRef, useState, useEffect, useCallback } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native'

const Draggable = (props) => {

    const [initialPos, setInitialPos] = useState({})
    const [item, setItem] = useState({});
    const [preStatus, setPreStatus] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [drag, setDrag] = useState(false);

    useEffect(() => {
        if (preStatus != '') {
            props._preChangeStatus(item.id, item.status, preStatus);
        }
    },[preStatus])

    useEffect(() => {
        if (newStatus != '') {
            props._changeStatus(item.id, item.status, newStatus);
            setPreStatus('');
            setNewStatus('');
        }
    }, [newStatus])

    const pan = useRef(new Animated.ValueXY()).current;


    useEffect(() => {
        setItem(props.selectedItem)
        //id.current = props.selectedItem.id; 
    }, [props.selectedItem])

    const handlePanResponderMove = useCallback((evt, gestureState) => {
        if (evt.nativeEvent.pageX > props.colWidth * 0 && evt.nativeEvent.pageX < props.colWidth * 1) { setPreStatus('backlog') }
        if (evt.nativeEvent.pageX > props.colWidth * 1 && evt.nativeEvent.pageX < props.colWidth * 2) { setPreStatus('To do') }
        if (evt.nativeEvent.pageX > props.colWidth * 2 && evt.nativeEvent.pageX < props.colWidth * 3) { setPreStatus('inProgress') }
        if (evt.nativeEvent.pageX > props.colWidth * 3 && evt.nativeEvent.pageX < props.colWidth * 4) { setPreStatus('review') }
        if (evt.nativeEvent.pageX > props.colWidth * 4 && evt.nativeEvent.pageX < props.colWidth * 5) { setPreStatus('complete') }

        return Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
        ], { useNativeDriver: false })(evt, gestureState);
    }, [])

    const handlePanResponderRelease = useCallback((evt, gestureState) => {
        setDrag(false);
        let colNum = -1;
        let colName = ''
        if (evt.nativeEvent.pageX > props.colWidth * 0 && evt.nativeEvent.pageX < props.colWidth * 1) { setNewStatus('backlog'), colNum = 0, colName = 'backlog' }
        if (evt.nativeEvent.pageX > props.colWidth * 1 && evt.nativeEvent.pageX < props.colWidth * 2) { setNewStatus('To do'), colNum = 1, colName = 'To do'}
        if (evt.nativeEvent.pageX > props.colWidth * 2 && evt.nativeEvent.pageX < props.colWidth * 3) { setNewStatus('inProgress'), colNum = 2, colName = 'inProgress' }
        if (evt.nativeEvent.pageX > props.colWidth * 3 && evt.nativeEvent.pageX < props.colWidth * 4) { setNewStatus('review'),colNum = 3, colName = 'review' }
        if (evt.nativeEvent.pageX > props.colWidth * 4 && evt.nativeEvent.pageX < props.colWidth * 5) { setNewStatus('complete'), colNum = 4, colName = 'complete' }
        //pan.extractOffset(); // stay at new position
        pan.flattenOffset(); // Flatten the offset so it resets the default positioning
        //pan.setOffset({ x: 0, y: 0 })
        //pan.flattenOffset();
        console.log(colNum, colName);
        //animateBack(gestureState, colNum, colName);
    })

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {

                setDrag(true);
            },

            onPanResponderMove: handlePanResponderMove,
            onPanResponderRelease: handlePanResponderRelease
        }),
    ).current;


    const animateBack = (gestureState, colNum, colName) => {

        let x = props.colWidth * colNum;
        let y = props.displayTasks[colName].length * (props.colWidth / 2)

        //console.log(x, y);

        return Animated.timing(pan, {
            toValue: { x: x, y: y },
            duration: 350,
            useNativeDriver: true, // set this to true if possible
        }).start(() => {
            pan.flattenOffset();
        });
    };

    const borderColor = () => {
        switch (props?.item?.status) {
            case 'Backlog':
                return { borderColor: '#B0C4DE' } //
                break;
            case 'To do':
                return { borderColor: '#FF6347' }
                break;
            case 'In progress':
                return { borderColor: '#BA55D3' }
                break;
            case 'Review':
                return { borderColor: '#40E0D0' }
                break;
            case 'Complete':
                return { borderColor: '#7FFF00' }
                break;
            default:
                return { borderColor: 'grey' }
                break;
        }
    }

    const calculateStartingPos = () => {
        if (props.selectedItemIndex == -1) {
            return null
        }

        let top = 0;
        let left = 0;
        switch (props.selectedItem.status) {
            case "backlog": left = 0; break;
            case "To do": left = props.fullColWidth; break;
            case "inProgress": left = props.fullColWidth * 2; break;
            case "review": left = props.fullColWidth * 3; break;
            case "complete": left = props.fullColWidth * 4; break;
            default: left = 0; break;
        }
        left = left - 2;

        top = props.selectedItemIndex * (props.colWidth / 2);
        top = top + 39;

        return { top: top, left: left }
    }

    const styles2 = StyleSheet.create({
        box2: {
            width: props.colWidth != undefined ? props.colWidth - 10 : 100,
            height: props.colWidth != undefined ? (props.colWidth - 10) / 2 : 100
        }
    })

    const handleInitialLayout = (e) => {
        setInitialPos({ x: e.nativeEvent.layout.x, y: e.nativeEvent.layout.y })
    }

    return (
        <Animated.View
            onLayout={(e) => handleInitialLayout(e)}
            style={[{
                padding: 10,
                position: 'absolute',
                //top: pan.x,
                //left: pan.y,
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
            //calculateStartingPos()
            ]}
            {...panResponder.panHandlers}>
            <View style={[styles.boxUnder]}>

                <View style={[styles.box, styles2.box2, styles.castShadow, borderColor()]} >
                    <Text style={styles.h3} numberOfLines={2}>{item.name}</Text>
                </View>

            </View>
        </Animated.View >
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    box: {
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderLeftWidth: 5,
    },
    boxUnder: {
        borderRadius: 5,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(0,0,0,0)'
    },
    coreShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4.65,

        elevation: 6,
    },
    castShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16.00,

        elevation: 24,
    },
    h3: {
        width: '100%',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0,
        color: '#333',

    }
});

export default Draggable