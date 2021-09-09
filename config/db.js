const mongoose= require('mongoose')
require('dotenv').config()

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser:true, 
        useUnifiedTopology:true,

    }).then(()=>{
        console.log("connected")
    }).catch(err=>console.log(err))
    mongoose.connection.on('connected',()=>{
        console.log("connected")
    })
    mongoose.connection.on('error',(error)=>{
        console.log("error",error)
    })
}

module.exports=connectDB