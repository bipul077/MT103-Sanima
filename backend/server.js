const express = require('express')
require('./models');
var cors = require('cors');
const axios = require('axios');
const https = require("https");
const MTRouter = require('./routes/route');


const app = express()
const port = process.env.PORT


app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'Auth-Token', 'Content-Length', 'X-Requested-With', 'Auth', 'X-TFA','Role']
}));
app.use(express.json());//middleware for using req.body

// axios.defaults.httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

app.use('/api',MTRouter);

app.use("/Files", express.static("./Files"));

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('*',(req,res)=>{
  res.status(404).send('404 Page Not Found')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})