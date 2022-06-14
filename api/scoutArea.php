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

/*query vars*/
$min = 0;
$users_per_page = 10;

$errors = [];
$user_list = array();
$personal_user = array();

$query = $system->query("SELECT `user_id`, `user_name`, `rank`, `village`, `exp`, `location`, `battle_id`, `stealth` FROM `users`
WHERE `last_active` > UNIX_TIMESTAMP() - 120 ORDER BY `exp` DESC LIMIT $min, $users_per_page");

//get user list & add it to $user_list array
if($system->db_last_num_rows == 0 || count($user_list)) {
    $errors[] = 'No users found in db call';
} else {
  while($row = $system->db_fetch($query)){

    //Add to JSON if $user in search list is attackable
    $row['attack_link'] = $system->links['battle']; /*&attack={$user['user_id']*/
    $row['action'] = 0;

    /*Displayed JSON User List*/
    $user_list[] = $row;
  }
}

//get user data
$personal_user[] = array(
  'name' => $player->user_name,
  'user_id' => $player->user_id,
);

//get extra user data
$u_query = $system->query("SELECT `village`, `stealth`, `location`, `rank` FROM `users` WHERE `user_id` = {$player->user_id}");
if($system->db_last_num_rows == 0){
  $errors[] = "Could not get current user variables";
} else {
  while($row = $system->db_fetch($u_query)){
    //first array
    $personal_user[0]['village'] = $row['village'];
    $personal_user[0]['stealth'] = $row['stealth'];
    $personal_user[0]['location'] = $row['location'];
  $personal_user[0]['rank'] = $row['rank'];
  }
}


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
