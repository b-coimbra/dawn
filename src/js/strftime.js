/* 
+----------+
| STRFTIME |
+----------+
Author: https://github.com/0-l
Description: silly strftime function implementation in js without the percentage notation.
             based off https://strftime.org

USAGE: strftime('H:M p - A') => 21:32 AM - Thursday
       strftime('m/b/Y')     => 1/Jan/2018
       strftime('do B Y')    => 18th January 2018
*/
const strftime = (format = 'c') => {
  Number.prototype.pad = function(n = 2) {
    return (Array(n).join('0') + this).substr(-n);
  };

  Number.prototype.ord = function() {
    return { 1: 'st', 2: 'nd', 3: 'rd' }[((num = this.toString()).length) > 1 ? parseInt(num.split('')[1]) : num] || 'th';
  };

  let date    = new Date(),
      month   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      result  = [],
      formats = {
        a: days[date.getDay()].substr(0, 3),
        A: days[date.getDay()],
        w: date.getDay(),
        q: date.getDay().pad(),
        d: date.getDate().pad(),
        e: date.getDate(),
        b: month[date.getMonth()].substr(0, 3),
        B: month[date.getMonth()],
        m: date.getMonth() + 1,
        y: date.getFullYear().pad(),
        Y: date.getFullYear(),
        H: date.getHours(),
        h: date.getHours().pad(),
        p: date.getHours() >= 12 ? 'PM' : 'AM',
        o: date.getDate().ord(),
        M: date.getMinutes(),
        i: date.getMinutes().pad(),
        S: date.getSeconds(),
        s: date.getSeconds().pad(),
        f: date.getMilliseconds(),
        c: date.toDateString() + ' - ' + date.toTimeString(),
        x: date.toLocaleDateString(),
        X: date.toLocaleTimeString()
      };

  format.split(/(\w|.)/m).forEach((type) => {
    if (type)
      result.push(formats[type[0]] || type);
  });

  return result.join('');
};
