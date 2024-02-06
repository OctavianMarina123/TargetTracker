import moment from 'moment';

function getGroupTitle(date) {
    if (!date || !moment(date, moment.ISO_8601, true).isValid()) {
        return 'Unknown Date'; // sau orice altă etichetă pe care o preferați
    }
    const today = moment();
    const yesterday = moment().subtract(1, 'days');
    const tomorrow = moment().add(1, 'days');
    const inThreeDays = moment().add(3, 'days');
    const inThirtyDays = moment().add(30, 'days');
    const threeDaysAgo = moment().subtract(3, 'days');
    const thirtyDaysAgo = moment().subtract(30, 'days');
    const dateMoment = moment(date);

    const isToday = dateMoment.isSame(today, 'day');
    const isYesterday = dateMoment.isSame(yesterday, 'day');
    const isTomorrow = dateMoment.isSame(tomorrow, 'day');
    const isWithinNext3Days = dateMoment.isAfter(today) && dateMoment.isBefore(inThreeDays, 'day');
    const isWithinNext30Days = dateMoment.isAfter(inThreeDays) && dateMoment.isBefore(inThirtyDays, 'day');
    const isWithinLast3Days = dateMoment.isAfter(threeDaysAgo) && dateMoment.isBefore(today, 'day');
    const isWithinLast30Days = dateMoment.isAfter(thirtyDaysAgo) && dateMoment.isBefore(threeDaysAgo, 'day');

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    if (isTomorrow) return 'Tomorrow';
    if (isWithinNext3Days) return 'Next 3 Days';
    if (isWithinNext30Days) return 'Next 30 Days';
    if (isWithinLast3Days) return 'Previous 3 Days';
    if (isWithinLast30Days) return 'Previous 30 Days';
    return dateMoment.format('MMMM YYYY');
}

function groupItemsByDate(items) {
    if (items && items.length > 0) {
        const pinnedItems = items.filter(item => item.isFavorite);
        const otherItems = items.filter(item => !item.isFavorite);

        const groups = otherItems.reduce((acc, item) => {
            const date = item.date || 'Unknown';
            const groupTitle = getGroupTitle(date);

            if (!acc[groupTitle]) {
                acc[groupTitle] = [];
            }
            acc[groupTitle].push(item);
            return acc;
        }, {});

        let sortedGroups = [];

        if (pinnedItems.length > 0) {
            sortedGroups.push({title: 'Pinned', data: pinnedItems});
        }

        if (groups['Today']) {
            sortedGroups.push({title: 'Today', data: groups['Today']});
            delete groups['Today'];
        }

        const futureGroups = ['Tomorrow', 'Next 3 Days', 'Next 30 Days'];
        futureGroups.forEach(section => {
            if (groups[section]) {
                sortedGroups.push({title: section, data: groups[section]});
                delete groups[section];
            }
        });

        const futureMonths = Object.keys(groups).filter(date => moment(date, 'MMMM YYYY').isAfter(moment())).sort((a, b) => {
            const dateA = moment(a, 'MMMM YYYY');
            const dateB = moment(b, 'MMMM YYYY');
            return dateA - dateB;
        });
        futureMonths.forEach(section => {
            sortedGroups.push({title: section, data: groups[section]});
            delete groups[section];
        });

        const pastGroups = ['Yesterday', 'Previous 3 Days', 'Previous 30 Days'];
        pastGroups.forEach(section => {
            if (groups[section]) {
                sortedGroups.unshift({title: section, data: groups[section]});
                delete groups[section];
            }
        });

        const pastMonths = Object.keys(groups).filter(date => moment(date, 'MMMM YYYY').isBefore(moment())).sort((a, b) => {
            const dateA = moment(a, 'MMMM YYYY');
            const dateB = moment(b, 'MMMM YYYY');
            return dateB - dateA;
        });
        pastMonths.forEach(section => {
            sortedGroups.unshift({title: section, data: groups[section]});
        });

        return sortedGroups;
    } else {
        return [];
    }
}

export default groupItemsByDate;
