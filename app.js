require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const port = process.env.PORT || 7070
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
      let allTasks = await TASK.find().sort('position -createdAt')
      let taskNumber = await TASK.estimatedDocumentCount();
      res.render("home", {
         allTasks,
         taskNumber,
         displayMode: "light"
      })
   }
})

app.get('/active', (req, res) => {
   findTask()
   async function findTask(){
      let allTasks = await TASK.find({completed: false}).sort('position -createdAt')
      let taskNumber = await TASK.countDocuments({completed: false})
      res.render("home", {
         allTasks,
         taskNumber,
         displayMode: "light"
      })
   }
})

app.get('/completed', (req, res) => {
   findTask()
   async function findTask(){
      let allTasks = await TASK.find({completed: true}).sort('position -createdAt')
      let taskNumber = await TASK.countDocuments({completed: true})
      res.render("home", {
         allTasks,
         taskNumber,
         displayMode: "light"
      })
   }
})



app.post("/", (req, res) => {
   let path = req.body.path
   let newTask = req.body.newTask
   let stringedPreference = req.body.userPreference
   if(stringedPreference === ''){
      addTask()
   } else{
      let arrangementPreference = JSON.parse(stringedPreference)
      addTask(arrangementPreference)
   }
   async function addTask(option){
      try {
         // Wriiten this way to avoid posting from completed
         if(option==null){
            if(path === "/"){
               await TASK.create({ task: newTask })
            } else if(path === "/active"){
               await TASK.create({ task: newTask })
            }
         } else{
            if(path === "/"){
               await TASK.create({ task: newTask })
               await TASK.bulkWrite(option)
            } else if(path === "/active"){
               await TASK.create({ task: newTask })
               await TASK.bulkWrite(option)
            }
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
   let stringedPreference = req.body.userPreference
   if(stringedPreference === ''){
      updateTask()
   } else{
      let arrangementPreference = JSON.parse(stringedPreference)
      updateTask(arrangementPreference)
   }
   async function updateTask(option){
      try {
         if(option==null){
            if(taskStatus=="true"){
               await TASK.updateOne({ _id: taskId }, {$set: {completed: false}})
            }else{
               await TASK.updateOne({ _id: taskId }, {$set: {completed: true}})
            }
         } else{
            if(taskStatus=="true"){
               await TASK.updateOne({ _id: taskId }, {$set: {completed: false}})
               await TASK.bulkWrite(option)
            }else{
               await TASK.updateOne({ _id: taskId }, {$set: {completed: true}})
               await TASK.bulkWrite(option)
            }
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
   let stringedPreference = req.body.userPreference
   if(stringedPreference === ''){
      deleteTask()
   } else{
      let arrangementPreference = JSON.parse(stringedPreference)
      deleteTask(arrangementPreference)
   }
   deleteTask()
   async function deleteTask(option){
      try {
         if(option==null){
            await TASK.deleteOne({ _id: taskId })
         } else{
            await TASK.deleteOne({ _id: taskId })
            await TASK.bulkWrite(option)
         }
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
