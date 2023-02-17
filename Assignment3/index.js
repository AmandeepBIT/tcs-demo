// Get the params from command prompt
var first_value = process.argv[2]; 
var second_value = process.argv[3]; 

if (!first_value || !second_value){
  console.log("Missing params!!!")
  return
}
// Importing the Event emitters for emitting purpose
const EventEmitter = require("events");
let final = 0;
const sum = () => {
  for (let indexFirst = 0; indexFirst <= 1000; indexFirst++) {
    if (indexFirst % first_value == 0) {
      final += indexFirst;
    }
  }
  for (let indexSecond = 0; indexSecond <= 1000; indexSecond++) {
    if (indexSecond % second_value == 0) {
      final += indexSecond;
    }
  }
  console.log("overall final value is ", final)
  const event = new EventEmitter();
  
  event.on("CustomEvent", () => {
    console.log(`Multiplesof ${first_value} & ${second_value}`);
  });
  event.emit("CustomEvent");
};
setTimeout(sum, 2000);
