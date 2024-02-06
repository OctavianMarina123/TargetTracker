
import moment from 'moment';
import groupItemsByDate from "../groupItemsByDate";

describe('groupItemsByDate', () => {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
    const inThreeDays = moment().add(3, 'days').format('YYYY-MM-DD');
    const inThirtyDays = moment().add(30, 'days').format('YYYY-MM-DD');
    const threeDaysAgo = moment().subtract(3, 'days').format('YYYY-MM-DD');
    const thirtyDaysAgo = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const nextMonth = moment().add(1, 'month').format('MMMM YYYY');

    const items = [
        { id: 1, date: today },
        { id: 2, date: yesterday },
        { id: 3, date: tomorrow },
        { id: 4, date: inThreeDays },
        { id: 5, date: inThirtyDays },
        { id: 6, date: threeDaysAgo },
        { id: 7, date: thirtyDaysAgo },
        { id: 8, date: nextMonth },
        { id: 9, date: 'Unknown' }
    ];

    it('should group items correctly', () => {
        const grouped = groupItemsByDate(items);
        const groupTitles = grouped.map(group => group.title);

        expect(groupTitles).toEqual(['Tomorrow', 'Next 3 Days', 'Next 30 Days', 'Today', 'Yesterday', 'Previous 3 Days', 'Previous 30 Days', nextMonth, 'Unknown']);
        expect(grouped.find(group => group.title === 'Tomorrow').data).toEqual([{ id: 3, date: tomorrow }]);
        expect(grouped.find(group => group.title === 'Next 3 Days').data).toEqual([{ id: 4, date: inThreeDays }]);
        expect(grouped.find(group => group.title === 'Next 30 Days').data).toEqual([{ id: 5, date: inThirtyDays }]);
        expect(grouped.find(group => group.title === 'Today').data).toEqual([{ id: 1, date: today }]);
        expect(grouped.find(group => group.title === 'Yesterday').data).toEqual([{ id: 2, date: yesterday }]);
        expect(grouped.find(group => group.title === 'Previous 3 Days').data).toEqual([{ id: 6, date: threeDaysAgo }]);
        expect(grouped.find(group => group.title === 'Previous 30 Days').data).toEqual([{ id: 7, date: thirtyDaysAgo }]);
        expect(grouped.find(group => group.title === nextMonth).data).toEqual([{ id: 8, date: nextMonth }]);
        expect(grouped.find(group => group.title === 'Unknown').data).toEqual([{ id: 9, date: 'Unknown' }]);
    });
});
