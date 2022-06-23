require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const port = 7070 || process.env.PORT
const path = require('path');
const mongoose = require("mongoose")
const GENERAL = require("./Schemas/general")
const _ = require("lodash")

connect()
async function connect() {
   try {
      await mongoose.connect(process.env.GENERAL_DATABASE_URI)
      console.log("Connection Successful")
   } catch (error) {
      console.log("Connection Unsuccessful")
      console.log(error)
   }
}

const app = express()
const PUBLIC = path.join(__dirname , "./public")

app.use(cors())
app.use('/public', express.static(PUBLIC))
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');

// Home Get route
app.get('/', (req, res) => {
   getTask()
   async function getTask(){
      try {
         let generalTaskInfo = await GENERAL.find({category: { $regex: "general", $options: 'i' }})
         res.render("list", {
            listTitle: "Today",
            allTasks: generalTaskInfo
         })
      } catch (error) {
         console.log(error)
      }
   }
})


// Home post route (For adding new tasks)
app.post("/", (req, res) => {
   let item = req.body.newTask
   let taskList = req.body.list
   console.log(item)
   postTask()
   async function postTask(){
      try {
         if(taskList=="Today"){
            await GENERAL.create({ category: "general", task: item })
         } else{
            await GENERAL.create({ category: taskList, task: item })
         }
         if(taskList=="Today"){
            res.redirect("/")
         } else{   
            res.redirect(`/${taskList}`)
         }
      } catch (error) {
         console.log(error)
      }
   }
})

// Home post route (For deleting old tasks)
app.post("/delete", (req, res)=> {
   let taskID = req.body.taskID
   let taskList = req.body.list
   deleteTask()
   async function deleteTask(){
      try {
         await GENERAL.deleteOne({ _id: taskID })
         if(taskList=== "Today"){
            res.redirect("/")
         } else{   
            res.redirect(`/${taskList}`)
         }
      } catch (error) {
         console.log(error)
      }
   }
})

// Other get Route (Fetches the info from the mongo database)
app.get("/:category", (req, res) => {
   getTask()
   async function getTask(){
      try {
         let allTasks = await GENERAL.find({category: { $regex: `${req.params.category}`, $options: 'i' } })
         let listTitle = _.capitalize(req.params.category)
         res.render("list", {
            listTitle,
            allTasks
         })
      } catch (error) {
         console.log(error)
      }
   }
})


app.listen(port, () => console.log(`Server listening on port ${port}`) );
