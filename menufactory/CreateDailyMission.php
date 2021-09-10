<?php

//$this->prop
class CreateDailyMission{

  //default values set (might cause problems)
  private $title = "Mission Title";
  private $missionStartTime = 0; //LongInt
  private $ai_killed = 0; //smallInt

  public $onMissionAlready = false; //public might cause issue

  private $href; //the mission link can be changed in the construct;  String

  public function __construct($title, $onMissionAlready, $missionStartTime, $ai_killed){
    $this->title = $title;
    $this->missionStartTime = $missionStartTime;
    $this->ai_killed = $ai_killed;

    $this->onMissionAlready = $onMissionAlready;
  }

  //*Display HTML*//
  public function comebacklater(){

    //Display final HTML
    echo <<< EOT

    <div style="text-align: center;" id="submenu">
      <p>Come back in another 24 hours for another daily task</p>
    </div>

    EOT;
  }

  //*Display HTML*//
  public function still_tasks_left(){

    //Display final HTML
    echo <<< EOT

    <div style="text-align: center;" id="submenu">
      <p>You're still not done with your Daily Task!</p>
    </div>

    EOT;
  }

  //*Display HTML*//
  public function start_task(){

    //Display final HTML
    echo <<< EOT

    <div style="text-align: center;" id="submenu">
      <a href="//sets sql variables or something idk">
        <h3>$this->title</h3>
      </a>
    </div>

    EOT;
  }
}



?>
