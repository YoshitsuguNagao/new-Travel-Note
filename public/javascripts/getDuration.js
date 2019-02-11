function getDuration(dateFrom, dateTo) {
  const dateUnixFrom = new Date(dateFrom);
  const dateUnixTo = new Date(dateTo);
  return ((dateUnixTo - dateUnixFrom) / (24 * 60 * 60 * 1000));
}

module.exports = getDuration;
