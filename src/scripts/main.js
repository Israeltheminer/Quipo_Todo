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

$(function(){
   var savedDisplay = localStorage.getItem("display")
   if(savedDisplay=="dark_background"){
      $("body").addClass("dark_background")
      $("body").removeClass("light_background")
   } else{
      $("body").addClass("light_background")
      $("body").removeClass("dark_background")
   }
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

$("#changeDisplay").on("click", function(){
   $("body").toggleClass("light_background dark_background")
   if($("body").hasClass("dark_background")){
      $("#displayIcon").attr("src", "./dist/assets/images/icon-sun.svg")
      $(".currentMode").each(function(index, value) {
         value.value = "dark"
      })
      localStorage.setItem("display", "dark_background")
   } else{
      $("#displayIcon").attr("src", "./dist/assets/images/icon-moon.svg")
      $(".currentMode").each(function(index, value) {
         value.value = "light"
      })
      localStorage.setItem("display", "light_background")
   }
})

const draggables = document.querySelectorAll(".draggable")
const draggablesContainer = document.querySelector(".all_task")

draggables.forEach(item=> {
   item.addEventListener("dragstart", ()=> {
      item.classList.add("dragging")
   })
   item.addEventListener("dragend", ()=> {
      item.classList.remove("dragging")
      
      let arrangementPreference = []
      let taskNumber = $(".taskItem").length
      for(let i = 0; i < taskNumber; i++){
         let taskDetails = {
            updateOne:{
               "filter": {
                  "_id": $(`.taskItem:nth-child(${i+1})`).find(".taskID").val()
               },
               "update" : {
                  $set: {
                     position: (i+1)
                  }
               }     
            }
         }
         arrangementPreference.push(taskDetails)
      }
      let stringedPreference = JSON.stringify(arrangementPreference)
      $(".taskItem").find(".userPreference").val(stringedPreference)
      $(".add_task").find(".userPreference").val(stringedPreference)
   })
})

draggablesContainer.addEventListener("dragover", (event)=> {
   event.preventDefault()
   const afterElement = getDragAfterElement(draggablesContainer, event.clientY)
   const draggable = document.querySelector(".dragging")
   if(afterElement==null){
      draggablesContainer.appendChild(draggable)
   } else{
      draggablesContainer.insertBefore(draggable, afterElement)
   }
})

function getDragAfterElement(container, y){
   const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
   return draggableElements.reduce((closest, child)=> {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if(offset < 0 && offset > closest.offset){
         return {offset: offset, element: child}
      } else{
         return closest
      }
   },
   {
      offset: Number.NEGATIVE_INFINITY
   }).element
}
