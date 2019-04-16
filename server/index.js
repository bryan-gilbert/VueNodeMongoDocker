const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = require('express')();

// the service as defined in the docker-compose.yml file

const DB_PASSWORD = process.env.MONGO_PWORD
const PORT = process.env.API_PORT
const DOCKER_MONGO_SERVICE_NAME = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT
const dbName = process.env.MONGO_DB_NAME
const cStr = 'mongodb://'+DOCKER_MONGO_SERVICE_NAME+':' + MONGO_PORT + '/' + dbName

// connect to Mongo daemon
mongoose.connect(
  cStr,
  { useNewUrlParser: true }
)
.then(() => console.log('MongoDB Connected on:' + cStr + '\nPassword: ' + DB_PASSWORD))
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