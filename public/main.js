$(".taskForm").on("click", function(){
   if($('.taskCheckbox', this).is(':checked')){
      this.submit()
   }
})

// $(document).ready(function(){
//    $("#addTaskForm").attr("action", `${location.pathname}`) 
//    console.log(location.pathname)
// })