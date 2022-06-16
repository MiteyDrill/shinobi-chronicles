<?php

/* 
File: 		scoutArea.php
Coder:		Cextra
Created:	6/13/2022
Revised:	6/16/2022 by Levi Meahan
Purpose:	API/JSON response page for the Travel Page
*/

# Begin standard auth
require "../classes/_autoload.php";
$system = new System();

try {
  //Get current player from Session
  $player = Auth::getUserFromSession($system);
} catch (Exception $e) {
  /*No Player logged in*/
  API::exitWithError($e->getMessage());
  exit(); //exit
}
# End standard auth

/*GENERAL VARIABLES*/
$min = 0; //minimum amount 
$users_per_page = 10; //max users per query response

$errors = []; //general error containers
$user_list = array(); //container for holding active users information
$personal_user = array(); //container for holding the current players information

$post_data = []; //json response data for **POST** requests

/*CHECK FOR ANY POST GET REQUESTS*/
if (isset($_SERVER['REQUEST_METHOD'])) {

  //GET || POST
  $method = htmlspecialchars($_SERVER['REQUEST_METHOD']);

  /* Receive the RAW POST data. */
  $content = trim(file_get_contents("php://input")); /*TODO: Might need to clean this recieved data - htmlspecialchars don't work here*/
  $decoded = json_decode($content, true);

  /**
   * Conditional checks if required Post data is set
   * Populates $post_data[] with data required for json response
   * Updates User Location in the DB with the acquired POST data
   */
  if (isset($decoded['request']) && isset($decoded['current_player_id']) && isset($decoded['action'])) {
    /**html_special_chars doesn't let this work for some reason*/

    //for testing
    $post_data[] = $decoded['request'];
    $post_data[] = $decoded['current_player_id'];
    $post_data[] = $decoded['action'];

    $requested_user_travel_direction = $decoded['action'];
    $requested_user_id = $decoded['current_player_id'];

    /**Updates Current User Location in the Database */
    /**TODO: Update this to use Prepared Statements */
    if ($requested_user_id == $player->user_id) {

      //db query
      $request_query = $system->query("SELECT `location` FROM `users` WHERE `user_id` = {$requested_user_id}");

      if ($system->db_last_num_rows == 0) {
        $errors[] = "Could not get any database info from requested user ID";
      } else {
        try {
          while ($row = $system->db_fetch($request_query)) {
            //calculates new user location
            $newLocation = handleUserLocationUpdate($row['location'], $requested_user_travel_direction);
            //updates user location
            /**TODO: not sure this DB Update should be set here...*/
            $u_query = $system->query("UPDATE `users` SET `location` = {$newLocation} WHERE `user_id` = {$player->user_id}");
          }
        } catch (Exception $e) {
          $errors[] = "There was a Database Error" . $e;
        }
      }
    } else {
      $errors[] = "UserID Requesting Movement is not equal to the current session User";
    }
  }
} else {
  $method = 'no method set';
  $post_data = 'no post data';
}


/*Get Current Player Data*/ 
/**TODO: For some reason Auth::getUserFromSession() doesn't return full user data*/
$u_query = $system->query("SELECT `village`, `stealth`, `location`, `rank` FROM `users` WHERE `user_id` = {$player->user_id}");
if ($system->db_last_num_rows == 0) {
  $errors[] = "Could not get current user variables";
} else {
  try {
    while ($row = $system->db_fetch($u_query)) {

      //todo: fix the [0] part of this
      $personal_user[0]['village'] = $row['village'];
      $personal_user[0]['stealth'] = $row['stealth'];
      $personal_user[0]['location'] = $row['location'];
      $personal_user[0]['rank'] = $row['rank'];

      //Change RANK from INT to STRING
      switch ($personal_user[0]['rank']) {
        case '1': {
            $personal_user[0]['rank'] = 'Academy-Sai';
          }
          break;
        case '2': {
            $personal_user[0]['rank'] = 'Genin';
          }
          break;
        case '3': {
            $personal_user[0]['rank'] = 'Chuunin';
          }
          break;
        default: {
            $personal_user['rank'][0] = 'Unranked';
          }
      }

      $temp_location = explode(".", $personal_user[0]['location']);
      $temp_x_pos = $temp_location[0];
      $temp_y_pos = $temp_location[1];
      /*TODO: Change this JSON output from a STRING to INT*/
      $personal_user[0]['x_pos'] = $temp_x_pos;
      $personal_user[0]['y_pos'] = $temp_y_pos;
    }
  } catch (Exception $e){
    $errors[] = "Error getting Current Player Data: " . $e;
  }
}

$query = $system->query("SELECT `user_id`, `user_name`, `rank`, `village`, `exp`, `location`, `battle_id`, `stealth` FROM `users`
WHERE `last_active` > UNIX_TIMESTAMP() - 120 ORDER BY `exp` DESC LIMIT $min, $users_per_page");

//Get Active User List & add it to $user_list[]
if ($system->db_last_num_rows == 0 || count($user_list)) {
  $errors[] = 'No users found in db call';
} else { try {
  while ($row = $system->db_fetch($query)) {

    //Adding extra bits
    $row['attack_link'] = $system->links['battle']; /*&attack={$user['user_id']*/
    $row['user_profile_link'] = $system->links['members']; /*&user={$user['user_name']*/
    $row['image_link'] = "./images/village_icons/" . strtolower($row['village']) . ".png";
    $row['action'] = 0;

    //converting rank
    switch ($row['rank']) {
      case '1': {
          $row['rank'] = 'Academy-Sai';
        }
        break;
      case '2': {
          $row['rank'] = 'Genin';
        }
        break;
      case '3': {
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
    if ($row['stealth'] < 0) {
      $row['stealth'] = 0;
    }

    /*TODO: SCOUT RANGE unavaiable atm due to AUTH::getUserFromSession() not returning personal_user data atm*/

    /*Add User Data to JSON array list*/
    $user_list[] = $row;
  } } catch (Exception $e){
    $errors[] = 'Error getting current active users: ' . $e;
  }
}

//Grab Current Player data
$personal_user[] = array(
  'name' => $player->user_name,
  'user_id' => $player->user_id,
);


/*SET MAP DATA*/
$village_positions = [];

$unfiltered_village_data =  $system->getVillageLocations();
foreach ($unfiltered_village_data as $key => $value) {
  $village_positions[] = (explode(".", $key));
}

/*todo - rn temp solution: turn string map positions to readable INT positions*/
$i = 0; //counter
for ($i = 0; $i < count($village_positions); $i++) {
  $village_positions[$i][0] = intval($village_positions[$i][0]);
  $village_positions[$i][1] = intval($village_positions[$i][1]);
}

/**************FUNCTIONS */

/**
 * Recieves current player position and returns new player position
 * 
 * Function takes in 2 parameters [The current player position] and [the direction player should go]
 * the current position of type string "4.12" -> is turned into an array [4, 12] then
 * a switch condition uses ($direction) to add or minus from the current player position. The result is
 * returned as a String
 * 
 * @param String $originalPosition example "12.4"
 * @param String $direction example "north"
 * @return String $newPost example "12.5
 */
function handleUserLocationUpdate(string $originalPosition, string $direction): String
{

  $currentUserPosition = explode('.', $originalPosition);
  /**[y0, x1] */

  try {
    switch ($direction) {
      case 'north':
        if ($currentUserPosition[1] < 2) {
          throw new Exception("You can't go more north!");
        }
        $currentUserPosition[1]--;
        break;
      case 'east':
        if ($currentUserPosition[0] > 17) {
          throw new Exception("You can't go more east!");
        }
        $currentUserPosition[0]++;
        break;
      case 'south':
        if ($currentUserPosition[1] > 11) {
          throw new Exception("You can't go more south!");
        }
        $currentUserPosition[1]++;
        break;
      case 'west':
        if ($currentUserPosition[0] < 2) {
          throw new Exception("You can't go more west!");
        }
        $currentUserPosition[0]--;
        break;
    }
  } catch (Exception $e) {
    $errors['move_error'] = $e;
  }

  $newPos = $currentUserPosition[0] . '.' . $currentUserPosition[1];

  return $newPos;
}

/**************FUNCTIONS */


/*Not Sure if the Access-Control headers actually do anything?*/
header('Access-Control-Allow-Origin: https://shinobichronicles.com/');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$area_data = array(

  'method' => $method,
  'post_data' => $post_data,

  'area_data' => array(
    'users' => $user_list,
    'current_user' => $personal_user
  ),

  'map_data' => array(
    'village_positions' =>  $village_positions,
    'unfiltered_village_Data' => $unfiltered_village_data
  ),

  'errors' => $errors

);

echo json_encode($area_data);

exit();
