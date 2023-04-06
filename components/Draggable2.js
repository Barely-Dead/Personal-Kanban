import { useRef, useState, useEffect, useCallback } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, View } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Draggable2 = (props) => {

    const [initialPos, setInitialPos] = useState({})
    const [item, setItem] = useState({});
    const [preStatus, setPreStatus] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [drag, setDrag] = useState(false);

    useEffect(() => {
        if (preStatus != '') {
            props._preChangeStatus(item.id, item.status, preStatus);
        }
    }, [preStatus])

    useEffect(() => {
        if (newStatus != '') {
            props._changeStatus(item.id, item.status, newStatus);
            setPreStatus('');
            setNewStatus('');
        }
    }, [newStatus])

    useEffect(() => {
        setItem(props.selectedItem)
        //id.current = props.selectedItem.id; 
    }, [props.selectedItem])




    const _animatedValue = new Animated.ValueXY();
    let _value = { x: 0, y: 0 }

    _animatedValue.addListener((value) => _value = value);
    const _panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onMoveShouldSetResponderCapture: (evt, gestureState) => true, //Tell iOS that we are allowing the movement
        //onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
        onPanResponderGrant: (evt, gestureState) => {
            _animatedValue.setOffset({ x: _value.x, y: _value.y });
            _animatedValue.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: useCallback((evt, gestureState) => { return Animated.event([
            null, { dx: _animatedValue.x, dy: _animatedValue.y }
        ], { useNativeDriver: false })},[]),

        onPanResponderRelease: (evt, gestureState) => {
            _animatedValue.flattenOffset(); // Flatten the offset so it resets the default positioning
            anim();
        }
    });

    const anim = () => {
        Animated.timing(_animatedValue, {
            toValue: { x: Math.floor(Math.random() * (width / 2)), y: Math.floor(Math.random() * (height / 2)) },
            duration: 350,
            useNativeDriver: true, // set this to true if possible
        }).start(() => {
            _animatedValue.flattenOffset();
        });
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
            style={[styles.box,
            { transform: _animatedValue.getTranslateTransform(), height: props.colWidth / 2 },
            calculateStartingPos()
            ]} {..._panResponder.panHandlers}
        />
    )

}

export default Draggable2

const styles = StyleSheet.create({
    box: {
        position: 'absolute',
        width: 200,
        height: 200,
        backgroundColor: 'lightblue',
        top: 0,
        left: 0
    }
})