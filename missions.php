<?php
/*
File: 		missions.php
Coder:		Levi Meahan
Created:	05/04/2014
Revised:	05/04/2014 by Levi Meahan
Purpose:	Functions for missions
Algorithm:	See master_plan.html
*/

function missions() {
	require("variables.php");
	global $system;

	global $player;

	global $self_link;
	global $RANK_NAMES;

	if($player->mission_id) {
		if($_GET['cancel_mission']) {
			$player->mission_id = 0;
			$system->message("You have abandoned your mission. <a href='$self_link'>Continue</a>");
			$system->printMessage();
			return true;
		}
		// Call mission (Pass team if player has one, class will determine if current mission is team or not)
		if($player->team) {
			$mission = new Mission($player->mission_id, $player, $player->team);
		}
		else {
			$mission = new Mission($player->mission_id, $player);
		}

		// Check status/stage
		$mission_status = 1;


		if($_GET['retreat']) {
			$battle_id = 0;
			$mission->nextStage($player->mission_stage['stage_id'] = 4);
		}

		if($mission_status < 2 ) {
			if($player->mission_stage['action_type'] == 'travel' or $player->mission_stage['action_type'] == 'search') {
				if($player->location == $player->mission_stage['action_data']) {
					// Team or solo
					if($mission->mission_type == 3) {
						$mission_status = $mission->nextTeamStage($player->mission_stage['stage_id'] + 1);
					}
					else {
						$mission_status = $mission->nextStage($player->mission_stage['stage_id'] + 1);
					}
				}
			}
			else if($player->mission_stage['action_type'] == 'combat') {

				// monster id
				$opponent = new AI($player->mission_stage['action_data']);
				if($opponent) {
					// Initialize start of battle stuff
					if(!isset($_SESSION['ai_id'])) {
						global $id;
						$_SESSION['player_jutsu_used'] = array();
						$_SESSION['battle_page'] = $id;
						$_SESSION['ai_id'] = $opponent->id;
						$player->last_ai = time();
						$player->battle_id = -1;
					}

					require("battleCore.php");
					$winner = battleAI($player, $opponent);

					if(!$winner) {
						return true;
					}
					else if($mission->mission_type == 5) {		//Survival Mission Combat

						if($winner == 1) { //Player victory
							$money_gain = $mission->money;
							$level_difference = $player->level - $opponent->level;
							if($level_difference > 9) {
								$level_difference = 9;
							}
							$money_gain = round($money_gain * (1 - $level_difference * 0.05));
							if($money_gain < 5) {
								$money_gain = 5;
							}

							if($_SESSION['ai_defeated'] > 1 && $_SESSION['ai_defeated'] % 5 == 0){
								$player->mission_stage['stage_id'] += 1;
							}
							else if($player->mission_stage['stage_id'] > 2){
								$player->mission_stage['stage_id'] -= 1;
							}
							$mission_status = $mission->nextStage($player->mission_stage['stage_id']);
							$_SESSION['ai_defeated']++;
							$_SESSION['mission_money'] += $money_gain;
						}
						else if($winner == 2 || $winner == -1) { //Player Defeat
							echo "<table class='table'><tr><th>Battle Results</th></tr>
							<tr><td>You have been defeated.
							</td></tr></table>";
							$player->battle_id = 0;
							$_SESSION['mission_money'] /= 2;
							$mission->nextStage($player->mission_stage['stage_id'] = 4);
						}
						else {
							$player->mission_id = 0;
							$player->mission_stage = '';

							$system->printMessage();
							return false;
						}
						unset($_SESSION['ai_id']);
						unset($_SESSION['ai_health']);
						unset($_SESSION['player_jutsu_used']);
						unset($_SESSION['battle_page']);

					}
					else if($winner == 1) {		// Player win
						$player->battle_id = 0;

						// Team or solo
						if($mission->mission_type == 3) {
							$mission_status = $mission->nextTeamStage($player->mission_stage['stage_id'] + 1);
						}
						else {
							$mission_status = $mission->nextStage($player->mission_stage['stage_id'] + 1);
						}
					}
					else if($winner == 2) {		// AI win
						echo "<table class='table'><tr><th>Battle Results</th></tr>
						<tr><td>You have been defeated. You have failed your mission.
						</td></tr></table>";

						$player->mission_id = 0;
						$player->mission_stage = '';

						$player->ai_losses++;
						$player->battle_id = 0;
					}
					else if($winner == -1) {
						echo "<table class='table'><tr><th>Battle Results</th></tr>
						<tr><td>The battle ended in a draw. You have failed your mission.
						</td></tr></table>";

						$player->mission_id = 0;
						$player->mission_stage = '';
						$player->battle_id = 0;
					}

					unset($_SESSION['ai_id']);
					unset($_SESSION['ai_health']);
					unset($_SESSION['player_jutsu_used']);
					unset($_SESSION['battle_page']);
				}
				else {
					$player->mission_id = 0;
					$player->mission_stage = '';

					$system->printMessage();
					return false;
				}

			}
		}

		// Complete mission
		if($mission_status == 2) {
			// Special mission
			if($mission->mission_type == 4) {
				$player->mission_id = 0;
				$player->mission_stage = '';

				// Jonin exam
				if($mission->mission_id == 10) {
					$_SESSION['exam_stage'] = 2;
					$self_link = $link . '?id=1';

					require_once("levelUp.php");
					rankUp();
					return true;
				}
			}
			// Team mission
			else if($mission->mission_type == 3) {
				$player->money += $mission->money;
				$player->mission_id = 0;
				$player->mission_stage = '';

				$team_points = 2;
				// Process team rewards if this is the first completing player, then unset the mission ID
				if($player->team['mission_id']) {
					$system->query("UPDATE `teams` SET
						`points`=`points` + $team_points, `monthly_points`=`monthly_points` + $team_points,`mission_id`=0
						WHERE `team_id`={$player->team['id']}");
				}

				echo "<table class='table'><tr><th>Current Mission</th></tr>
				<tr><td style='text-align:center;'><span style='font-weight:bold;'>$mission->name Complete</span><br />
				Your team has completed the mission.<br />
				You have been paid &yen;$mission->money.<br />
				Your team has received $team_points points.<br />
				<a href='$self_link'>Continue</a>
				</td></tr></table>";
			}
			// Clan mission
			else if($mission->mission_type == 2) {
				$player->money += $mission->money;
				$player->mission_id = 0;
				$player->mission_stage = '';
				$player->last_ai = time();

				$point_gain = 1;
				$system->query("UPDATE `clans` SET `points`=`points`+$point_gain WHERE `clan_id`={$player->clan['id']} LIMIT 1");

				echo "<table class='table'><tr><th>Current Mission</th></tr>
				<tr><td style='text-align:center;'><span style='font-weight:bold;'>$mission->name Complete</span><br />
				You have completed your mission for clan {$player->clan['name']}.<br />
				You have been paid &yen;$mission->money.<br />
				You have earned $point_gain reputation for your clan.<br />
				<a href='$self_link'>Continue</a>
				</td></tr></table>";
			}
			// Village/Survival mission
			else {

				if($mission->mission_type == 5){
					$mission->money = $_SESSION['mission_money'];
					unset($_SESSION['mission_money']);
				}

				$player->money += $mission->money;
				$player->mission_id = 0;
				$player->mission_stage = '';
				$player->last_ai = time();

				echo "<table class='table'><tr><th>Current Mission</th></tr>
				<tr><td style='text-align:center;'><span style='font-weight:bold;'>$mission->name Complete</span><br />
				You have completed your mission.<br />";
				if($mission->mission_type == 5) {
					echo sprintf("For your effort in defeating %d enemies, you have received &yen;%d.<br />",
					 $_SESSION['ai_defeated'], $mission->money);
					unset($_SESSION['ai_defeated']);
				}
				else{
					echo "You have been paid &yen;$mission->money.<br />";
				}
				echo "<a href='$self_link'>Continue</a>
					</td></tr></table>";
			}
			$player->updateData();
		}
		// Display mission details
		else if($player->mission_id){
			echo "<table class='table'><tr><th>Current Mission (<a href='$self_link&cancel_mission=1'>Abandon Mission</a>)</th></tr>
			<tr><td style='text-align:center;'><span style='font-weight:bold;'>" .
				($mission->mission_type == 3 ? '[' . $player->team['name'] . '] ' : '') . "$mission->name</span><br />" .
				$player->mission_stage['description'];

			// Display counts of team/solo mission
			if($mission->mission_type == 3 && $mission->team['mission_stage']['count_needed']) {
				echo ' (' . $mission->team['mission_stage']['count'] . '/' . $mission->team['mission_stage']['count_needed'] . ' complete)';
			}
			else if($player->mission_stage['count_needed']) {
				echo ' (' . $player->mission_stage['count'] . '/' . $player->mission_stage['count_needed'] . ' complete)';
			}

			// Display to battle link
			if($player->mission_stage['action_type'] == 'combat') {
				echo "<br /><a href='$self_link'>Enter Combat</a>";
				if($mission->mission_type == 5 && $player->mission_stage['action_type'] == 'combat') {
					echo "| <a href='$self_link&retreat=1'>Retreat</a>";
				}
			}

			echo "<br />
			</td></tr></table>";
		}
		return true;
	}

	/*Cextra - Daily Mission*/
	//uses class from (createSubmenu) dailyMission.php | to set up UserInterface and Perform Check Logic
	require_once("menufactory/CreateDailyMission.php");

	/*
	daily_mission: True/False; Is Character on a Daily Mission?
	daily_mission_time: LongInt; Holds DateTime to compare past mission start times
	daily_mission_ai: SmallInt; Holds remaining AI needed to finish mission

	User.db -> ai_wins: Int; Compares mission requirements
	*/
	//Fake Variables
	$daily_mission_started = true;
	$daily_mission_done = true; //set when user finishes AI
	$daily_mission_start_time = 1631248611; //time(); //current time strval($daily_mission_time): String
	$daily_mission_ai = 0;
	echo $daily_mission_start_time;
	echo "<br>".time();

	//Create and Displays Submenu for Daily Missions
	//CreateMissionSubmenu(MenuTitle: String, onMissionAlready: bool, StartTime: LongInt, aiKilled: int);
	$DailyMission = new CreateDailyMission("Start Daily Mission", $daily_mission_started, $daily_mission_start_time, $daily_mission_ai);

	if($DailyMission->onMissionAlready){
		if($daily_mission_done){
			//reward user
			//set daily_mission = false, set daily_mission_done = true;
		} else {
			$DailyMission->still_tasks_left(); //displays HTML
			//$DailyMission->checkifdone($daily_mission_ai) - if true set mission to done/refresh myb?
		}

	} else {//not on mission and less than 24 hours since last one
		if((time() - $daily_mission_start_time) > 86400)/*86400 = 24 hours in seconds*/{
			//set $daily_mission_done = false;
			$DailyMission->start_task(); //displays HTML
			//set SQL variables here OR set them via <a> link
		} else {
			$DailyMission->comebacklater();
		}
	}

	/*Cextra - Daily Mission*/


	$max_mission_rank = 1;
	if($player->rank == 3) {
		$max_mission_rank = 3;
	}
	else if($player->rank == 4) {
		$max_mission_rank = 4;
	}
	//Addition by Kengetsu - Get access to missions if rank is higher than public max.
	else if($player->rank > $SC_MAX_RANK) {
		$max_mission_rank = $SC_MAX_RANK;
	}
	//End
	$mission_rank_names = array(1 => 'D-Rank', 2 => 'C-Rank', 3 => 'B-Rank', 4 => 'A-Rank', 5 => 'S-Rank');

	$result = $system->query("SELECT `mission_id`, `name`, `rank` FROM `missions` WHERE `mission_type`=1 OR `mission_type`=5 AND `rank` <= $max_mission_rank");
	if($system->db_num_rows == 0) {
		$system->message("No missions available!");
		$system->printMessage();
		return false;
	}

	$missions = array();
	while($row = $system->db_fetch($result)) {
		$missions[$row['mission_id']] = $row;
	}


	// Sub-menu
	echo "<div class='submenu'>
	<ul class='submenu'>";
	$width = 100 / $max_mission_rank;
	$width = round($width - 0.6, 2);
	for($i = 1; $i <= $max_mission_rank; $i++) {
		echo "<li style='width:$width%;'><a href='{$self_link}&view_rank=$i'>" . $mission_rank_names[$i] . "</a></li> ";
	}
	echo "</ul>
	</div>
	<div class='submenuMargin'></div>";

	// Start mission
	if($_GET['start_mission']) {
		$mission_id = $_GET['start_mission'];
		try {
			if(!isset($missions[$mission_id])) {
				throw new Exception("Invalid mission!");
			}
			if($player->mission_id) {
				throw new Exception("You are already on a mission!");
			}

			$fight_timer = 20;
			if($player->last_ai > time() - $fight_timer) {
				throw new Exception("Please wait " . ($player->last_ai - (time() - $fight_timer)) . " more seconds!");
			}

			$mission = new Mission($mission_id, $player);

			$player->mission_id = $mission_id;
			missions();
			return true;

		} catch (Exception $e) {
			$system->message($e->getMessage());
		}

	}


	// Display missions
	$system->printMessage();
	$view = $max_mission_rank;
	if($_GET['view_rank']) {
		$view = (int)$_GET['view_rank'];
		if($view < 1 or $view > $max_mission_rank) {
			$view = $max_mission_rank;
		}
	}
	echo "<table class='table'><tr><th>" . $mission_rank_names[$view] . " Missions</th></tr>
	<tr><td style='text-align:center;'>You can go on village missions here. As a " . $RANK_NAMES[$player->rank] . " you
	can take on up to " . $mission_rank_names[$max_mission_rank] . " missions.</td></tr>
	<tr><td style='text-align:center;'>";
	foreach($missions as $id => $mission) {
		if($mission['rank'] != $view) {
			continue;
		}
		echo "<a href='$self_link&start_mission=$id'><p class='button' style='margin:5px;'>" . $mission['name'] . "</p></a><br />";
	}
	echo "</td></tr></table>";


	//uses asbtract class from (createSubmenu) dailyMission.php | to set up UserInterface and perform logic
	require_once("menufactory/dailyMission.php");

	/*Cextra Daily Mission*/
	createSubmenu::submenu();
	/*Cextra Daily Mission*/
	return true;
}
