```javascript
let z = new DataValidation(10, 2);
let i = 10;
const adder = setInterval(() => {
   //const value = Math.random() >= 0.95 ? (i+=0.001)+2 : i+=0.001;
   const value = Math.random() >= 0.95 ? i=0 : i+=0.001;
   console.log(i, value, z.checkValue(value));
   z.addValue(i)
}, 1000);


```
