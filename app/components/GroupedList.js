import React from 'react';
import {SectionList, Text, StyleSheet, View} from 'react-native';
import defaultStyles from '../config/styles';
import groupItemsByDate from "../utility/groupItemsByDate";


function GroupedList({items, renderCard, style}) {
    const groupedItems = groupItemsByDate(items);

    const renderListItem = ({item, index, section}) => {
        const isLastItem = index === section.data.length - 1;
        return renderCard(item, !isLastItem, {marginBottom: 10});
    };

    return (
        <SectionList
            sections={groupedItems}
            key={(item, index)=>item.id.toString() + index}
            style={[styles.list, style]}
            keyExtractor={(item, index) => item.id.toString() + index}
            renderItem={renderListItem}
            renderSectionHeader={({section: {title}}) => (
                <View style={{backgroundColor: defaultStyles.colors.background}}>
                    <Text style={[defaultStyles.title, styles.sectionHeader]}>{title}</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        marginTopBottom: 10,
    },
    list: {
    },
    sectionHeader: {
        marginTop: 10,
        marginLeft: 10,
        fontWeight: "700",
        color: defaultStyles.colors.button,
    },
});

export default GroupedList;
