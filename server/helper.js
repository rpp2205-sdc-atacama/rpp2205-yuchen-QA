module.exports = {
  expand: (rowCount, columnCount, startAt=1) => {
    var index = startAt;
    return Array(rowCount)
      .fill(0)
      .map(
        (v)=>
          `(${Array(columnCount).fill(0).map(
            (q) => `$${index++}`).join(',')})`
      )
      .join(',');
  }
}