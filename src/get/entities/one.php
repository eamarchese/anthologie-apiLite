<?php

//select info in database : Model
try{
  $getEntities = $db->prepare("SELECT e.id as id_entity,e.book_id,e.era_id,e.genre_id,e.title,e.date,e.date_range FROM entities e WHERE id = :id");
  $getEntities->bindParam(":id",$_GET['entity']);
  $getEntities->execute();


  $getAuthors = $db->prepare("SELECT a.*,at.name,l.name as lang,l.family FROM entities_author_assoc eaa JOIN authors a ON eaa.authors_id = a.id JOIN author_translations at ON a.id = at.author_id JOIN languages l ON at.language_id = l.id WHERE eaa.entities_id = :id");
  $getAuthors->bindParam(":id",$_GET['id']);
  $getAuthors->execute();

  $getTitleTranslation = $db->prepare("SELECT et.id,et.text_translated,l.name as lang,l.family FROM entities_translations et JOIN languages l ON et.language_id = l.id WHERE et.entity_id = :id");
  $getTitleTranslation->bindParam(":id",$_GET['id']);
  $getTitleTranslation->execute();
}
catch(Exception $e){
  errorJSON('SQL error : ' . $e->getMessage(),500);
}
//treat information : Controler


//put in $data : Vue
$data['entities'] = $getEntities->fetchAll(PDO::FETCH_ASSOC);
$data['entities'][0]['authors'] = $getAuthors->fetchAll(PDO::FETCH_ASSOC);
$data['entities'][0]['titleTranslation'] = $getTitleTranslation->fetchAll(PDO::FETCH_ASSOC);
?>
