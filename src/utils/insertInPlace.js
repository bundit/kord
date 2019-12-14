/**
 * insertInPlace - insert an item in sorted order
 * Compares objects with callback function supplied
 *
 * @param  {array} list
 * @param  {object} item
 * @param  {function} compare
 * @return {array}
 * Returns a reference to the original array, or a new array of undefined/null
 */
export default function insertInPlace(list, newItem, compare) {
  let i = 0;
  let cmp;

  // list is undefined/null
  if (!list) {
    return [newItem];
  }

  // Find sorted position of new item and insert it in place
  while (i < list.length) {
    cmp = compare(newItem, list[i]);

    // Item already exists
    if (cmp === 0) {
      break;

      // else if item fits in this position
    } else if (cmp < 0) {
      list.splice(i, 0, newItem);
      break;

      // Else item goes after this position, continue =>
    } else if (cmp > 0) i += 1;
  }

  // We reached the end of the list, item goes at the end
  // We may also reach this condition if the list is empty
  if (i === list.length) {
    list.push(newItem);
  }

  return list;
}
