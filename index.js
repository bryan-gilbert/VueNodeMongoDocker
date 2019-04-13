const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = require('express')();

const PORT = 3004
// the service as defined in the docker-compose.yml file
const DOCKER_MONGO_SERVICE_NAME = 'simple-app-mongo'
const MONGO_PORT = 27017
const dbName = 'simpleApp'
const cStr = 'mongodb://'+DOCKER_MONGO_SERVICE_NAME+':' + MONGO_PORT + '/' + dbName

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
  res.send("it's working :)")
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