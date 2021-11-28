const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const cors = require('cors');


const {MONGOURI} = require('./keys')
mongoose.connect(MONGOURI)

mongoose.connection.on('connected',()=> {
    console.log("Connected to MongoDB Cluster")
})
mongoose.connection.on('error',(err)=> {
    console.log("Error connecting to MongoDB",err)
})
app.use(cors())
require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


app.listen(PORT , ()=>{
    console.log('Server is running on port: ',PORT);
})