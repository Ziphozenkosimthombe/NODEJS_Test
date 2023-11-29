const http = require('http');
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');
const figlet = require('figlet')

const server = http.createServer((req, res) => {
  const page = url.parse(req.url).pathname;
  const params = querystring.parse(url.parse(req.url).query);
  console.log(page);
  let readWrite = (file, contectType) => {
    fs.readFile(file, function(err, data) {
      res.writeHead(200, {'Content-Type': contectType});
      res.write(data);
      res.end();
    });
  }

  let computer = () =>{
    let random = Math.random()
    if (random < .33){
      return 'rock'
    }else if (random < .66){
      return 'paper'
    }else{
      return 'scissors'
    }
  }

  let choice = (userChoice, computerChoice) =>{
    // let computerChoice = computer()
    let result
    if ( (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissors' && computerChoice === 'paper') ){
      return 'you win!!'
    }else if (userChoice === computerChoice){
      return `It's a Tie!! play again`
    }else{
      return 'you lose!! computer wins'
    }
  }
  
  let playGame = () => {
    let userWins = 0;
    let computerWins = 0;
    let obj = []

    for (let i = 0; i <= 3; i++){
      let computerChoice = computer()
      let userChoice = params['student']
      console.log(`user choice: ${userChoice}`)
      console.log(`computor choice: ${computerChoice}`)

      let result = choice(userChoice, computerChoice)
      console.log (result)
      
      obj.push({
        userChoice: userChoice,
        computerChoice: computerChoice,
        result: result
      })

      if (result.includes('win')){
        userWins++
      }else if (result.includes('lose')) {
        computerWins++;
      }
    }
    console.log(`Game over!`);
    console.log(`User wins: ${userWins}`);
    console.log(`Computer wins: ${computerWins}`);
    if (userWins > computerWins) {
      console.log('You are the overall winner!');
    } else if (computerWins > userWins) {
      console.log('Computer is the overall winner!');
    } else {
      console.log('It\'s a tie in the overall game.');
    }
  }
  if (page == '/') {
    readWrite('index.html', 'text/html')
  }
  else if (page == '/api') {
    if ('student' in params){
      if( (params['student']=== 'rock') ||
      (params['student']=== 'paper') ||
      (params['student']=== 'scissors')){
        res.writeHead(200, {'Content-Type': 'application/json'});
        let choices = playGame()
        const objToJson = {
          name: choices
        }
        res.end(JSON.stringify(objToJson))
      }
      else if ((params['student']!== 'rock') ||
      (params['student']!== 'paper') ||
      (params['student']!== 'scissors')){
        res.writeHead(200, {'Content-Type': 'application/json'});
        let choices = playGame()
        const objToJson ={
          name: 'unkown value choice between (rock,paper or scissors)'
        }
        res.end(JSON.stringify(objToJson))
      }
    }
  }//else if
  else if (page == '/css/style.css'){
    fs.readFile('css/style.css', function(err, data) {
      res.write(data);
      res.end();
    });
  }else if (page == '/js/main.js'){
    readWrite('js/main.js', 'text/javascript')
  }else{
    figlet('404!!', function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      res.write(data);
      res.end();
    });
  }
});

server.listen(8000);