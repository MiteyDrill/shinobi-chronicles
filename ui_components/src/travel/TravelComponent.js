import { MapSquare } from "./MapSquare.js";

class TravelComponent extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      mapVillageData: ['no map data set'],
      playerID: 0,
      playerVillage: 'none',
      userPosition: '0.0',
      userPosition_x: 0,
      userPosition_y: 0
    }
  }

  componentDidMount(){
    //get json data
    this.getTravelJSONData();
    // this.updateTravelDB();
  }

  updateTravelDB(direction: String = 'none'){

    let travelDirection = 'none';

    switch (direction) {
      case 'north': {
        travelDirection = 'north';
      }
      break;
      case 'south': {
        travelDirection = 'south';
      }
      break;
      case 'east': {
        travelDirection = 'east';
      }
      break;
      case 'west': {
        travelDirection = 'west';
      }
      break;
      default: {
        travelDirection = 'none';
      }
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { 
        request: 'TravelComponent.js',
        current_player_id: this.state.playerID,
        action: (travelDirection == 'none' ? '' : travelDirection), 
      } )
    };

    fetch(
      "http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/scoutArea.php",
      requestOptions
    ).
    then((json) => {
      return json.json();
    }).then((data) => {
      /**Data Recieved do something */
      this.setState({playerID: data['area_data']['current_user'][1]['user_id']});

      console.log("Post Data: " + ((data['post_data'].length) ? data['post_data'] : 'No Data'));
      console.log("Errors: " + ((data['errors'].length) ? data['errors'] : 'No errors'));

      console.log("POST to API was succesfull");

    }).catch((e)=>{console.log("Travel Component Error: " + e)})     
    
  }

  //syntax is used so this. keywork will work
  moveNorth = () => {
    this.updateTravelDB('north');
  }

  moveEast = () => {
    this.updateTravelDB('east');
  }

  moveSouth = () => {
    this.updateTravelDB('south');
  }

  moveWest = () => {
    this.updateTravelDB('west');
  }

  getTravelJSONData(){

    setInterval( () => {

      let headers = {
        "Content-Type": "application/json",
      }
  
      fetch(
        "http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/scoutArea.php"
      ).
      then((json) => {
        return json.json();
      }).then((data) => {

        /*Set recieved JSON data */

        this.setState({playerID: data['area_data']['current_user'][1]['user_id']}); //recieving this in 2 functions
  
        this.setState({mapVillageData: data['map_data']['village_positions']});
        this.setState({playerVillage: data['area_data']['current_user'][0]['village']});
        this.setState({userPosition: data['area_data']['current_user'][0]['location']});
        this.setState({userPosition_x: data['area_data']['current_user'][0]['x_pos']});
        this.setState({userPosition_y: data['area_data']['current_user'][0]['y_pos']});
  
      }).catch((e)=>{console.log("Travel Component Error: " + e)})

    }, 300);

  }


  /**
  * return true/false if player is at same position
  */
  isPlayerHere(x, y){
    if(this.state.userPosition_x == x && this.state.userPosition_y == y){
      return true;
    } else {
      return false;
    }
  }


  /**
  * returns cooresponding village data in an object
  */
  getTileInfo(map_position: array): array{

    //due to array logic
    var offset = 1;

    /*hardcoded villages according to the positions*/
    var village_names = [
      'stone',
      'cloud',
      'leaf',
      'sand',
      'mist'
    ];

    //if Village Position == current map position (return {village_data})
    for(var i = 0; i < this.state.mapVillageData.length; i++){

      if(this.state.mapVillageData[i][0] == map_position[1]+offset && this.state.mapVillageData[i][1] == map_position[0]+offset){
        return {
          'tile': 'village',
          'village_name': village_names[i]
        }
      }

    }

    return {
      'tile': 'default',
    };
  }


  //returns array of jsx elements
  renderMap(x, y): array{

    //current user pos
    let currentUserPosition = [3,3]; //test pos

    let rows = [];
    //loop creates jsx and pushes them to [rows]
    for(var i = 0; i < x; i++){
      let data = [];
      for(var j = 0; j < y; j++){
        data.push(
          <MapSquare key={j} playerVillage={this.state.playerVillage} isPlayerHere={ this.isPlayerHere(j+1, i+1) } tileData={this.getTileInfo( [i, j] )}/>
        );
      }
      rows.push(<tr key={i}>{data}</tr>);
    }

    //returning map
    return rows;
  }

  render(){

    //MAP SIZE
    var mapSize_x = 12;
    var mapSize_y = 18;

    return (
      <div id='content'>
        <table id='table' className='map'
        style={{padding:0, border: "1px solid #000", borderCollapse:"collapse", borderSpacing:"0", borderRadius:"0"}}>
          <thead>
            <tr>
              <th colSpan='18'>Your Location {this.state.userPosition}</th>
            </tr>
          </thead>
          <tbody>

            {this.renderMap(mapSize_x, mapSize_y)}

          </tbody>
        </table>
        <button onClick={this.moveEast}>
          east
        </button>
        <button onClick={this.moveNorth}>
          north
        </button>
        <button onClick={this.moveSouth}>
          south
        </button>
        <button onClick={this.moveWest}>
          west
        </button>
      </div>
    )
  }

}

window.TravelComponent = TravelComponent;
