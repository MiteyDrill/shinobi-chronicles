<?php
# Begin standard auth
require "../classes/_autoload.php";

$system = new System();

try {
    $player = Auth::getUserFromSession($system); /*Should Trim This for this api call, probably*/
} catch(Exception $e) {
  /*Player wasn't logged in*/
    API::exitWithError($e->getMessage());
    exit();
}
# End standard auth

/*VARS*/
$min = 0;
$users_per_page = 10;

$errors = [];
$user_list = array();
$personal_user = array();

//get extra current_user data || TODO: For some reason Auth::getUserFromSession() doesn't return full user data
$u_query = $system->query("SELECT `village`, `stealth`, `location`, `rank` FROM `users` WHERE `user_id` = {$player->user_id}");
if($system->db_last_num_rows == 0){
  $errors[] = "Could not get current user variables";
} else {
  while($row = $system->db_fetch($u_query)){

    $personal_user[0]['village'] = $row['village'];
    $personal_user[0]['stealth'] = $row['stealth'];
    $personal_user[0]['location'] = $row['location'];
    $personal_user[0]['rank'] = $row['rank'];

    //converting rank
    switch($personal_user[0]['rank']){
      case '1':{
        $personal_user[0]['rank'] = 'Academy-Sai';
      }
      break;
      case '2':{
        $personal_user[0]['rank'] = 'Genin';
      }
      break;
      case '3':{
        $personal_user[0]['rank']= 'Chuunin';
      }
      break;
      default: {
        $personal_user['rank'][0] = 'Unranked';
      }
    }

    $temp_location = explode(".", $personal_user[0]['location']);
    $temp_x_pos = $temp_location[0];
    $temp_y_pos = $temp_location[1];
    /*TODO: Change JSON output from String to INT*/
    $personal_user[0]['x_pos'] = $temp_x_pos;
    $personal_user[0]['y_pos'] = $temp_y_pos;

  }
}

$query = $system->query("SELECT `user_id`, `user_name`, `rank`, `village`, `exp`, `location`, `battle_id`, `stealth` FROM `users`
WHERE `last_active` > UNIX_TIMESTAMP() - 120 ORDER BY `exp` DESC LIMIT $min, $users_per_page");

//get user list & add it to $user_list array
if($system->db_last_num_rows == 0 || count($user_list)) {
    $errors[] = 'No users found in db call';
} else {
  while($row = $system->db_fetch($query)){

    //Adding extra bits
    $row['attack_link'] = $system->links['battle']; /*&attack={$user['user_id']*/
    $row['user_profile_link'] = $system->links['members']; /*&user={$user['user_name']*/
    $row['image_link'] = "./images/village_icons/" . strtolower($row['village']) . ".png";
    $row['action'] = 0;

    //converting rank
    switch($row['rank']){
      case '1':{
        $row['rank'] = 'Academy-Sai';
      }
      break;
      case '2':{
        $row['rank'] = 'Genin';
      }
      break;
      case '3':{
        $row['rank'] = 'Chuunin';
      }
      break;
      default: {
        $row['rank'] = 'Unranked';
      }
    }

    /*Filter grabbed userdata and compare it against current user data*/
    /*check user stealth TODO: test if this works*/
    $row['stealth'] = $personal_user[0]['stealth'] - $row['stealth'];
    if($row['stealth'] < 0) {
        $row['stealth'] = 0;
    }

    /*TODO: SCOUT RANGE unavaiable atm due to AUTH::getUserFromSession() not returning personal_user data atm*/

    /*Add User Data to JSON array list*/
    $user_list[] = $row;
  }
}

//get user data
$personal_user[] = array(
  'name' => $player->user_name,
  'user_id' => $player->user_id,
);


/*Array List of Users and their Locations*/
header('Content-Type: application/json');

$area_data = array(
  'area_data' => array(
    'users' => $user_list,
    'current_user' => $personal_user
  ),

  'errors' => $errors
);

echo json_encode($area_data);

?>
