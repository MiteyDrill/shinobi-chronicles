<?php

/* 
File: 		scout.php
Coder:		Cextra
Created:	6/13/2022
Revised:	6/18/2022 by Cextra
Purpose:	Class to handle JSON response for the ScoutComponent on the Travel Page
*/

include_once('.\TravelPageClasses\TravelPageAPIHandler.php');

# Begin standard auth
require "../../classes/_autoload.php";
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

$player->loadData(User::UPDATE_NOTHING);


class ScoutComponentAPI extends TravelPageAPIHandler
{

  private User $user;
  private System $system;

  public function __construct(User $player, System $system)
  {
    $this->user = $player;
    $this->system = $system;
  }

  /************** FUNCTIONS **************/

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
   * @param String $user_village example "sand": Used for checks
   * @return String $newPost example "12.5"(updated)
   */
  public function handleUserLocationUpdate(string $originalPosition, string $direction, string $user_village): String
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
      $errors['move_error'] = $e; //oh this will never reach...
    }

    $newPos = $currentUserPosition[0] . '.' . $currentUserPosition[1]; //Combining result array -> String

    //todo: hardcoded village/positions - would prob be better to not have this hard coded 
    $village_positions = array('5.3', '17.2', '9.6', '3.8', '16.10');
    $village_names = array('Stone', 'Cloud', 'Leaf', 'Sand', 'Mist');

    //check if user is about to enter a village tile
    for ($i = 0; $i < count($village_positions); $i++) {
      if ($newPos === $village_positions[$i]) {
        if ($user_village != $village_names[$i]) {
          return $originalPosition;
        }
      }
    }

    return $newPos; //new position
  }
}


//initial vars
$personal_user = array();
$user_list = array();

$ScoutComponentAPI = new ScoutComponentAPI($player, $system);

/*Get Current Player Data*/ 
/**TODO: For some reason Auth::getUserFromSession() doesn't return full user data*/
$u_query = $system->query("SELECT `village`, `stealth`, `location`, `rank` FROM `users` WHERE `user_id` = {$player->user_id}");
if ($system->db_last_num_rows == 0) {
   $ScoutComponentAPI->addError("Could not get current user variables");
} else {
  try {
    while ($row = $system->db_fetch($u_query)) {

      $personal_user['village'] = $row['village'];
      $personal_user['stealth'] = (int)$row['stealth'];
      $personal_user['location'] = $row['location'];
      $personal_user['rank'] = $row['rank'];

      //Change RANK from INT to STRING
      switch ($personal_user['rank']) {
        case '1': {
            $personal_user['rank'] = 'Academy-Sai';
          }
          break;
        case '2': {
            $personal_user['rank'] = 'Genin';
          }
          break;
        case '3': {
            $personal_user['rank'] = 'Chuunin';
          }
          break;
        default: {
            $personal_user['rank'] = 'Unranked';
          }
      }

      $temp_location = explode(".", $personal_user['location']);
      $temp_x_pos = (int)$temp_location[0];
      $temp_y_pos = (int)$temp_location[1];
      /*TODO: Change this JSON output from a STRING to INT*/
      $personal_user['x_pos'] = $temp_x_pos;
      $personal_user['y_pos'] = $temp_y_pos;
    }
  } catch (Exception $e){
    $ScoutComponentAPI->addError("Error getting Current Player Data: " . $e);
  }
}

$query = $system->query("SELECT `user_id`, `user_name`, `rank`, `village`, `exp`, `location`, `battle_id`, `stealth` FROM `users`
WHERE `last_active` > UNIX_TIMESTAMP() - 120 ORDER BY `exp` DESC LIMIT 0, 10");

//Get Active User List & add it to $user_list[]
if ($system->db_last_num_rows == 0) {
  $ScoutComponentAPI->addError('No active users returned from DB');
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
    $row['stealth'] = $personal_user['stealth'] - $row['stealth'];
    if ($row['stealth'] < 0) {
      $row['stealth'] = 0;
    }

    /*TODO: SCOUT RANGE unavaiable atm due to AUTH::getUserFromSession() not returning personal_user data atm*/

    /*Add User Data to JSON array list*/
    $user_list[] = $row;
  } } catch (Exception $e){
    $ScoutComponentAPI->addError('Error getting current active users: ' . $e);
  }
}

//Grab Current Player data
$personal_user['username'] = $player->user_name;
$personal_user['user_id'] = $player->user_id;

$ScoutComponentAPI->addData($player->user_id, 'current_player_id');
$ScoutComponentAPI->addData($personal_user, 'current_user_data');
$ScoutComponentAPI->addData($user_list, 'active_user_list');


$ScoutComponentAPI->JSON_RESPONSE();

exit();
