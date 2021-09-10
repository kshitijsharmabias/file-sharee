const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const File = require('../models/files')
const { v4: uuid4 } = require('uuid')
const ap= require('body-parser')
//diskstorage

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limit: {
        fileSize: 4000000 * 100
    }
}).single('myfile')

router.post('/', async(req, res) => {

 
    //store file
    upload(req, res, async (err) => {
        //console.log(req.file)
        //validate request
        if (!req.file) {
            return res.json({ error: "all fields are required" })
        }
        if (err) {
            return res.status(500).send({ error: err.message })
        }

        //store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size

        })
        //response link
        const response = await file.save()
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
    }) 

})

router.post('/send',async(req,res)=>{

   console.log(req.body)
    //validate request
    const {uuid, emailTo, emailFrom}= req.body
    if(!uuid ||!emailTo ||!emailFrom){
        return res.status(422).send({error:"all fields are required.."})
    }
    //get data from database

    const file = await File.findOne({uuid})

    file.sender=emailFrom
    file.receiver= emailTo

    //if (file.sender){
      //  return res.status(422).send({error:"email already sent"})
    //}
    const response = await file.save()
    


    //send email

    const sendMail= require('../services/emailServices')
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:"file Sharee.. file sharing link",
        text:`${emailFrom} shared a file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+'KB',
            expires:'24 hours'
        })
    })
    return res.send({success:"true"})
})





module.exports = router
