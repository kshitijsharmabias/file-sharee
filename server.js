const express= require("express");
const app= express()
const cors = require('cors')
const path = require('path')


const PORT = process.env.PORT||3000;
const connectionDB= require("./config/db")
connectionDB()
//template engine
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'ejs')



//corse
app.use(cors())
//json
app.use(express.json())
//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files', require('./routes/show'))
app.use('/files/download', require('./routes/download'))




app.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}`)
})


