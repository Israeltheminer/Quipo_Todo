require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const port = 7070 || process.env.PORT
const path = require('path');
const mongoose = require("mongoose")
const TASK = require("./Schemas/task")
const _ = require("lodash")
const expressLayouts = require("express-ejs-layouts")


connect()
async function connect() {
   try {
      await mongoose.connect(process.env.TASK_DATABASE_URI)
      console.log("Connection Successful")
   } catch (error) {
      console.log("Connection Unsuccessful")
      console.log(error)
   }
}


const app = express()
const DIST = path.join(__dirname , "dist")


// Set View engine
app.use(expressLayouts)
app.set('layout', './layouts/general')
app.set('view engine', 'ejs');

app.use(cors())
app.use('/dist', express.static(DIST))
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => {
   findTask()
   async function findTask(){
      let allTasks = await TASK.find()
      let taskNumber = await TASK.estimatedDocumentCount();
      res.render("home", {
         allTasks,
         taskNumber
      })
   }
})

app.get('/active', (req, res) => {
   findTask()
   async function findTask(){
      let allTasks = await TASK.find({completed: false})
      let taskNumber = await TASK.countDocuments({completed: false})
      res.render("home", {
         allTasks,
         taskNumber
      })
   }
})

app.get('/completed', (req, res) => {
   findTask()
   async function findTask(){
      let allTasks = await TASK.find({completed: true})
      let taskNumber = await TASK.countDocuments({completed: true})
      res.render("home", {
         allTasks,
         taskNumber
      })
   }
})



app.post("/", (req, res) => {
   let path = req.body.path
   let newTask = req.body.newTask

   addTask()
   async function addTask(){
      try {
         if(path === "/"){
            await TASK.create({ task: newTask })
         } else if(path === "/active"){
            await TASK.create({ task: newTask })
         }
         res.redirect(path)
      } catch (error) {
         console.log(error)
      }
   }
})


app.post("/updateOne", (req, res)=> {
   let path = req.body.path
   let taskId = req.body.taskId
   let taskStatus = req.body.taskStatus
   updateTask()
   async function updateTask(){
      try {
         if(taskStatus=="true"){
            await TASK.updateOne({ _id: taskId }, {$set: {completed: false}})
         }else{
            await TASK.updateOne({ _id: taskId }, {$set: {completed: true}})
         }
         res.redirect(path)
      } catch (error) {
         console.log(error)
      }
   }
})


app.post("/deleteOne", (req, res)=> {
   let path = req.body.path
   let taskId = req.body.taskId
   deleteTask()
   async function deleteTask(){
      try {
         await TASK.deleteOne({ _id: taskId })
         res.redirect(path)
      } catch (error) {
         console.log(error)
      }
   }
})


app.post("/clearAll", (req, res)=> {
   let path = req.body.path
   deleteTask()
   async function deleteTask(){
      try {
         await TASK.deleteMany({ completed: true })
         res.redirect(path)
      } catch (error) {
         console.log(error)
      }
   }
})

app.listen(port, () => console.log(`Server listening on port ${port}`) );
