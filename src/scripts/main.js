$(".taskForm").on("click", function(){
   if($('.taskCheckbox', this).is(':checked')){
      this.submit()
   }
})