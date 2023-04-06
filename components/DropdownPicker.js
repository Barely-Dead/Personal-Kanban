
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Styles from '../Styles';


const DropdownPicker = (props) => {


    const [selectedDisplay, setSelectedDisplay] = useState(props.defaultValue);
    const [displayOptions, setDisplayOptions] = useState(false);
    const [optionsPos, setOptionsPos] = useState(1);

    useEffect(() => {
        if (props.currentValue == 'undefined') {
            setSelectedDisplay(props.defaultValue);
        } else {
            setSelectedDisplay(props.currentValue);
        }
    },[props.currentValue])

    const handleSelect = (value, pos) => {
        //setSelectedValue(toCamelCase(value));
        setSelectedDisplay(value);
        setDisplayOptions(false);
        setOptionsPos(pos);
        props._selectedValue(value);
    }

    return (
        <View style={[{zIndex: 100}]}>
            <TouchableOpacity style={Styles.inputRow}
                onPress={() => setDisplayOptions(true)}>
               
                <Text style={[Styles.h2, {flex: 1, textAlign: 'left'}]}>{selectedDisplay}</Text>

                <Text style={[Styles.h2, {textAlign: 'right', color: props.placeholderColor}]}>{props.children}</Text>

            </TouchableOpacity>
            { displayOptions ?
            <View style={[styles.options, {top: -optionsPos * 32 + 9}]}>
                {Object.entries(props.options).map((key, value) => {
                    return (                        
                        <TouchableOpacity key={key[1].toString()}
                            onPress={() => handleSelect(key[1], value)}
                            style={{backgroundColor: '#E4FF47'}} hitSlop={5}>
                           
                            <Text style={[Styles.h2, {textAlign: 'left'}]}>{key[1]}</Text>
                           

                        </TouchableOpacity>
                    )
                    }
                    )}
            </View> : null }
        </View>
    );
}

export default DropdownPicker;

const styles = StyleSheet.create({
    options: {
        position: 'absolute',
        left: 0,
    }
    
})