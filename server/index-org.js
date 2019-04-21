const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = require('express')();

const PORT = process.env.API_PORT
const MONGO_PORT = process.env.MONGO_PORT
const DB_PASSWORD = process.env.MONGO_PWORD
const DOCKER_MONGO_SERVICE_NAME = process.env.MONGO_HOST
const dbName = process.env.MONGO_DB_NAME
const cStr = 'mongodb://'+DOCKER_MONGO_SERVICE_NAME+':' + MONGO_PORT + '/' + dbName


let msg = []
msg.push('Sample node.js/express API service with Mongo backend.')
msg.push('This will run inside a docker contain and listen on port ' + PORT)
msg.push('From outside the container you will need to use the port defined by the docker-compose.yml file.')
msg.push('The complete mongo connection string is ' + cStr)
msg.push('')
msg.push('Environment variable from .env', process.env.SAMPLE_1)
msg.push('Environment variable from .env_site', process.env.SAMPLE_2)
msg.push('process.env.MONGO_PWORD', process.env.MONGO_PWORD)


console.log(msg.join('\n'))

// connect to Mongo daemon
mongoose.connect(
  cStr,
  { useNewUrlParser: true }
)
.then(() => console.log('MongoDB Connected on:' + cStr))
.catch(err => console.log(err));


// DB schema
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

Item = mongoose.model('item', ItemSchema);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>{
  console.log("Got foo a / request")
  res.send("it's working :)\n")
})

//Post route
app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });
  newItem.save().then(item => res.redirect('/'));
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});