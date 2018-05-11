const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', (request, response) => {
  try {
    result = '"Welcome to Treasury server! The server sits at the very heart of treasury. It is the classic way to store data in one central location! While this might not be a great for transparency. It works really well for storage" - Uneeb';
    response.send(result);
  } catch(error) {
    response.send({error: 'unknown'});
  }
})

/*
app.post('/create', (request, response) => {
  // username = request.body.username;
  try {
    result = '';
    response.send(result);
  } catch(error) {
    response.send({error: 'unknown'});
  }
});

app.get('/user/:username', (request, response) => {
  username = request.params.username;
  try {
    getUser(username, function(result) {
      response.send(result);
    });
  } catch(error) {
    response.send({error: 'unknown'});
  }
});

app.post('/send/:to_user', (request, response) => {
  to_user = request.params.to_user;
  from_user = request.body.from_user;
  console.log(request.body);
  try {
    sendTokens(from_user, to_user, function(error, result) {
      if (error) {
        response.send({error: 'unsuccessful'});
      } else {
        response.send(result);
      }
    });
  } catch (error) {
    response.send({error: 'unknown'});
  }
});
*/

app.listen(port, (err) => {
  if (err) {
    console.log('something is messed up');
    return;
  }

  console.log(`server is listening on ${port}`)
})
