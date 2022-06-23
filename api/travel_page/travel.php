<?php

/* 
File: 		travel.php
Coder:		Cextra
Created:	6/13/2022
Revised:	6/18/2022 by Cextra
Purpose:	Class to handle API/JSON response for the Travel Component on Travel Page
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




class TravelComponentAPI extends TravelPageAPIHandler
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



$TravelComponentAPI = new TravelComponentAPI($player, $system);


/*CHECK FOR REQUEST METHOD*/
if (isset($_SERVER['REQUEST_METHOD'])) {

  //GET || POST
  $method = htmlspecialchars($_SERVER['REQUEST_METHOD']);
  $TravelComponentAPI->setMethodUsed($method);

  /* Receive the RAW POST data. */
  $content = trim(file_get_contents("php://input")); /*TODO: Might need to clean this recieved data - htmlspecialchars don't work here*/
  $decoded = json_decode($content, true);

  $TravelComponentAPI->addData($decoded, 'decoded_header_content');

  //POST REQUEST HANDLED HERE
  if (isset($decoded['request']) && isset($decoded['action'])) {

    /*TODO: Might need to clean this recieved data */
    //TODO: IMPORTANT| method of restricting too many DB calls per second
    $requested_user_travel_direction = $decoded['action'];

    //new user location
    $newLocation = $TravelComponentAPI->handleUserLocationUpdate($player->location, $requested_user_travel_direction, $player->village);

    $TravelComponentAPI->addData($newLocation, 'updated_location');

    //db update TODO: Prepared Statement

    $current_time = time();
    $u_query = $system->query("UPDATE `users` SET `location` = {$newLocation} WHERE `user_id` = {$player->user_id}");
    $u_query = $system->query("UPDATE `users` SET `last_active` = {$current_time} WHERE `user_id` = {$player->user_id}");
  } else {
    $TravelComponentAPI->addError("POST Headers/Data were not set");
  }

  //GET REQUEST -> General React Component information
  $TravelComponentAPI->addData($player->village, 'village');
  $TravelComponentAPI->addData($player->location, 'position');
  $TravelComponentAPI->addData($player->x, 'pos_x');
  $TravelComponentAPI->addData($player->y, 'pos_y');

  $TravelComponentAPI->addData($system->getVillageLocations(), "village_locations");


} else {
  $TravelComponentAPI->addError('No Request Method was called, exit');
  exit();
}



// $ScoutComponentAPI->addData($arr, 'extra_bits');

$TravelComponentAPI->addData($player->user_id, 'current_player_id');

$TravelComponentAPI->JSON_RESPONSE();

exit();
