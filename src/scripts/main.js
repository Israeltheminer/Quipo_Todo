const $ = require("jquery")

if(location.pathname=="/"){
   $("#home_page").addClass("blue_link")
} else if(location.pathname=="/active"){
   $("#active_page").addClass("blue_link")
} else if(location.pathname=="/completed"){
   $("#completed_page").addClass("blue_link")
}

$(function(){
   $(".currentPath").val(`${location.pathname}`)
})

$("#addTaskCheckbox").on("click", function(){
   if(this.checked){
      $("#addTaskForm").submit()
   }
})

$(".deleteOneButton").on("click", function(){
   let form = this.parentElement.parentElement
   form.submit()
})

$(".checkbox_input").on("click", function(){
   let form = this.parentElement.parentElement.parentElement
   form.submit()
})

$(".checkbox_input").on("click", function(){
   if(this.checked){
      $(this).parent().next().children("p").addClass("cross_paragraph")
   }else{
      $(this).parent().next().children("p").removeClass("cross_paragraph")
   }
})

$(function(){
   $(".taskStatus").each(function(index, value) {
      if(this.value === "true"){
         value.nextElementSibling.checked = true
         this.parentElement.nextElementSibling.firstElementChild.classList.add("cross_paragraph")
      }
   })
})

$(".checkbox_input").on("click", function(){

})
