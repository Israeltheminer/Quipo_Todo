const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
   category: {
      type: String,
      lowercase: true,
      minLength: 1
   },
   task: String
});

taskSchema.post("save", function(doc, next){
   console.log("Info Saved Successfully")
   next()
});
taskSchema.post("updateOne", function(doc, next){
   console.log(`Task updated`)
   next()
});
taskSchema.post("deleteOne", function(doc, next){
   console.log(`Task deleted`)
   next()
});

module.exports = mongoose.model("task", taskSchema);