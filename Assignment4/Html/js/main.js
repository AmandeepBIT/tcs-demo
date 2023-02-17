
var { exec } = require('child_process');
const npmStart = document.getElementById('npm-start');
console.log('888888888888')

npmStart.addEventListener('click', (e) => {
  console.log('888888888888')

  exec('npm start', function (err, stdout, stderr) {
    if (err) console.error(stderr);
    console.log(stdout);
  })
});



