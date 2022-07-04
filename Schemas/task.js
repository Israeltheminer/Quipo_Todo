const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
   task: String,
   completed: {
      type: Boolean,
      default: false
   },
   position: {
      type: Number,
      default: 0
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
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