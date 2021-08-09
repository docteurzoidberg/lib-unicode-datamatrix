const unicodedatamatrix = require('../');
console.log(unicodedatamatrix('ABC', {small: false, square: true, border: true}));
console.log(unicodedatamatrix('ABC', {small: true, square: true, border: true}));
console.log(unicodedatamatrix('ABC', {small: true, square: true, border: false}));