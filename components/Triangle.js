import createClass from 'create-react-class';
import { StyleSheet, View } from 'react-native';

var Triangle = createClass({
    render: function () {
        return (
            <View style={[this.props.style]}>
                <View style={[styles.triangle, {borderLeftColor: this.props.color}]} />
            </View>
        )
    }
})

export default Triangle

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 30,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 30,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
    }
})