$(document).ready(function(){
  //feed left column
  $.get("/v1/entities").done(displayEntities);





//functions

//feed left column + actions
function displayEntities(data){
  $("#entities > section").html('');
  for(i=0;i<data.entities.length;i++){
    $entity = $("<article/>");
    $entity.attr("id","entity"+data.entities[i].id_entity).data("id",data.entities[i].id_entity).addClass("entity").addClass("clickMe");
    $entity.append('<p/>');
    $entity.children("p").html(data.entities[i].title);
    $("#entities > section").append($entity);
  }
  $("#findEntityInput").on("input",function(){
    $("#entities > section > article").addClass("hidden");
    $("#entities > section > article > p:contains("+$(this).val()+")").parent("article").removeClass("hidden");
  });
  $(".entity").on("click",loadEntity);
}

//load entity in the second row
function loadEntity(){
  $.get("/v1/entities/"+$(this).data("id")).done(displayEntity);
}

//display Entity in the second column
function displayEntity(data){
  $("#entity > section").html('');
  for(i=0;i<data.entities.length;i++){
    $entity = $("<article/>");
    $entity.attr("id","entity"+data.entities[i].id_entity).data("id",data.entities[i].id_entity).addClass("entity");
    $entity.append('<h1/>');
    $entity.children("h1").html(data.entities[i].title);

    //display translated title
    for(j=0;j<data.entities[i].titleTranslation.length;j++){
      $titleTranslation = $("<p/>");
      $titleTranslation.append('<span class="lang">['+data.entities[i].titleTranslation[j].lang+']</span>');
      $titleTranslation.append('<span class="translation">'+data.entities[i].titleTranslation[j].text_translated+'</span>');
      $entity.append($titleTranslation);
    }
    $("#entity > section").append($entity);

    //display all authors + add new one
    for(j=0;j<data.entities[i].authors.length;j++){
      $author = $("<article/>");
      $author.append('<p class="date"><span class="born">'+data.entities[i].authors[j].born+' (± '+data.entities[i].authors[j].born_range+')</span><span class="died">'+data.entities[i].authors[j].died+' (± '+data.entities[i].authors[j].died_range+')</span></p>');
      for(k=0;k<data.entities[i].authors[j].name.length;k++){
        $author.append('<p><span class="lang">'+data.entities[i].authors[j].name[k].lang+'<span><span class="translation">'+data.entities[i].authors[j].name[k].name+'</span></p>');
      }
      $("#entity > section").append($author);
    }

    //display all translation + add new one

  }
}

});
