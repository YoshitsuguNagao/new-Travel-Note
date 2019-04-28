function dateFormatChanger(date) {
  const array = date.split('-');
  return `${array[2]  }/${  array[1]  }/${  array[0]}`;
}


module.exports = dateFormatChanger;
