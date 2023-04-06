

import { Dimensions } from "react-native";

export const screen = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,

}

export const taskStatuses = {
    0: 'Backlog',
    1: 'To do',
    2: 'In progress',
    3: 'Review', 
    4: 'Complete'
};

export const recurringBool = {
    0: 'Yes',
    1: 'No'
}

