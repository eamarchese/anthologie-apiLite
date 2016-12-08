<?php

//select info in database : Model
try{
  $getEntities = $db->prepare("SELECT * FROM entities WHERE id = :id");
  $getEntities->bindParam(":id",$_GET['entity']);
  $getEntities->execute();
}
catch(Exception $e){
  errorJSON('SQL error : ' . $e->getMessage(),500);
}
//treat information : Controler


//put in $data : Vue
$data['entities'] = $getEntities->fetchAll(PDO::FETCH_ASSOC);
?>