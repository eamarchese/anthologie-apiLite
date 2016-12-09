$(document).ready(function(){
  //default mode
  var token = {};
  //feed left column
  $.get("/v1/entities").done(displayEntities);

  //login user
  $("#logMeInP").on("click",logMeIn);




//functions
function logMeIn(){
  //check if $this has a child nav, if yes, remove it, else show it
  if($(this).parent("div").children("nav").length > 0){
    $(this).parent("div").children("nav").remove();
  }
  else{
    $menuLogin = $('<nav/>');
    $menuLogin.append('<input type="text" id="loginInput" value="" placeholder="Login">');
    $menuLogin.append('<input type="password" id="passwordInput" value="" placeholder="password">');
    $menuLogin.append('<input type="button" id="goLogIn" value="Go">');
    $(this).parent("div").append($menuLogin);
    $("#goLogIn").on("click",function(){
      if($("#loginInput").val() != "" && $("#passwordInput").val() != ""){
        $.post("/v1/user/login",{username:$("#loginInput").val(),password:$("#passwordInput").val()})
        .done(function(data){
          if(data.success != "1"){
            alert('something went wrong');
          }
          else{
            $("#logMeIn").children("nav").remove();
            $("#logMeIn").html('<p><i class="fa fa-user" aria-hidden="true"></i> '+data.username+'</p>');
            token = data.token;
          }
        });
      }
    });
  }
}


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
  eventHandler()
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


    $("#entity > section").append($entity);

    //header Alternate Title
    $("#entity > section").append('<article class="shade"><h2>Alternate title(s)</h2></article>');
    $addNewTitle = $('<article><p><i class="fa fa-plus-circle" aria-hidden="true"></i> Add title</p></article>').addClass("newTitle clickMe").data("entity",data.entities[i].id_entity);
    $("#entity > section").append($addNewTitle);

    //display translated titles
    for(j=0;j<data.entities[i].titleTranslation.length;j++){
      $titleTranslation = $("<article/>");
      $titleTranslation.append("<p/>");
      $titleTranslation.children("p").append('<span class="lang">['+data.entities[i].titleTranslation[j].lang+']</span>');
      $titleTranslation.children("p").append('<span class="translation">'+data.entities[i].titleTranslation[j].text_translated+'</span>');
      $("#entity > section").append($titleTranslation);
    }


    //header Authors
    $("#entity > section").append('<article class="shade"><h2>Author(s)</h2></article>');
    $addNewAuthor = $('<article><p><i class="fa fa-plus-circle" aria-hidden="true"></i> Add Author</p></article>').addClass("newAuthor clickMe").data("entity",data.entities[i].id_entity);
    $("#entity > section").append($addNewAuthor);

    //display all authors + add new one
    for(j=0;j<data.entities[i].authors.length;j++){
      $author = $("<article/>");
      $author.addClass("clickMe").addClass("author").data("id",data.entities[i].authors[j].id);
      $author.append('<p class="date"><span class="born">'+data.entities[i].authors[j].born+' (± '+data.entities[i].authors[j].born_range+')</span><span class="died">'+data.entities[i].authors[j].died+' (± '+data.entities[i].authors[j].died_range+')</span></p>');
      for(k=0;k<data.entities[i].authors[j].name.length;k++){
        $author.append('<p><span class="lang">['+data.entities[i].authors[j].name[k].lang+']<span> <span class="translation">'+data.entities[i].authors[j].name[k].name+'</span></p>');
      }
      $("#entity > section").append($author);
    }

    //translations header
    $("#entity > section").append('<article class="shade"><h2>Translation(s)</h2></article>');
    $addNewTranslation = $('<article><p><i class="fa fa-plus-circle" aria-hidden="true"></i> Add translation</p></article>').addClass("clickMe newtranslation").data("entity",data.entities[i].id_entity);
    $("#entity > section").append($addNewTranslation);

    //display all translation + add new one

  }
  eventHandler();
}

//create new entity
function newEntity(){
  $("#entity > section").html("");
  $("#entity > section").append('<article class="shade"><h2>New entity</h2></article>');
  $("#entity > section").append('<article><input class="block full" type="text" value="" autocompletion="off" placeholder="Generic title"><input id="goNewEntity" type="button" class="block full right" value="Add"></article>');
  $("#goNewEntity").on("click",function(){
    $.post("v1/entities/new",token)
    .done(function(data){
      $.get("/v1/entities").done(displayEntities);
      $.get("/v1/entities/"+data.newEntityId).done(displayEntity);
    })
    .fail(function(data){
      alert('something went wrong, are you loged in?');
    });
  });
}

//add new title to an entity
function newEntityTitle(){

}


  function eventHandler(){
    //add new entity
    $("#newEntity").off("click").on("click",newEntity);

    //add new title
    $(".newTitle").off("click").on("click",newEntityTitle);

    //add new author

    //add new translation
  }

});
