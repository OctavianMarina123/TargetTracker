
function filterItemsByList(items, itemId) {
  return items.filter(item => item.itemId === itemId);
}


export default filterItemsByList;