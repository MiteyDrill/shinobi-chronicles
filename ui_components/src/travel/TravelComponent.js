import { MapSquare } from "./MapSquare.js";

class TravelComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mapVillageData: ['no map data set'],
      playerID: 0,
      playerVillage: 'none',
      userPosition: '0.0',
      userPosition_x: 0,
      userPosition_y: 0,
      village_position_data: ['no data'],
    }
  }

  componentDidMount() {
    //Init API Call
    this.getTravelJSONData();
  }

  /**
   * Function makes sends FETCH request to TravelComponent API and then UPDATES STATE
   * 
   * @param string direction 
   */
  updateTravelDB(direction = 'none') {

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
      body: JSON.stringify({
        request: 'TravelComponent.js',
        action: (travelDirection == 'none' ? '' : travelDirection),
      })
    };

    fetch(
      "http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/travel_page/travel.php", //**TODO: Change this link */
      requestOptions
    ).
      then((json) => {
        return json.json();
      }).then((data) => {

        /**Data Recieved do something */
        this.setState({ playerID: data['response']['current_player_id'] });

        console.log("Travel Component Errors: " + ((data['errors'].length) ? data['errors'] : 'No errors'));

      }).catch((e) => { console.log("Travel Component API CALL Error: " + e) })

  }


  //Button Functions
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


  //initial fetch request on component startup 
  getTravelJSONData() {
    setInterval(() => {

      let headers = {
        "Content-Type": "application/json",
      }

      fetch(
        "http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/travel_page/travel.php" /**TODO: Change this Link */
      ).
        then((json) => {
          return json.json();
        }).then((data) => {

          /*Set recieved JSON data */


          //current player variables
          this.setState({ playerID: data['response']['current_player_id'] })
          this.setState({ playerVillage: data['response']['village'] });
          this.setState({ userPosition: data['response']['position'] });
          this.setState({ userPosition_x: data['response']['pos_x'] });
          this.setState({ userPosition_y: data['response']['pos_y'] });
          this.setState({ village_position_data: data['response']['village_locations']});

        }).catch((e) => { console.log("Travel Component Init API Call Error: " + e) })

    }, 600);

  }


  /**
  * return true/false if player is at [x, y] position: Meant for MapSquare component
  */
  isPlayerHere(x, y, player_position_x, player_position_y) {
    if (player_position_x == x && player_position_y == y) {
      return true;
    } else {
      return false;
    }
  }


  /**
  * Return Object with Tile Information, meant for MapSquare component.
  * 
  * @param Array map_position
  * 
  * @return Object: Example = {'tile': 'default'}
  */
  getTileInfo(map_position, village_position_data: array) {

    //due to array logic
    var offset = 1;

    /*TODO: hardcoded village data should be updated dynamically*/
    var village_names = [
      'Stone',
      'Cloud',
      'Leaf',
      'Sand',
      'Mist'
    ];

    let village_positions = [];

    for(const village in village_position_data){
      village_positions.push(village);
    }

    map_position[0]++;
    map_position[1]++;

    map_position.reverse();

    let tile_position = map_position.join(".");

    //if Village Position == current map position (return {village_data})
    for (var i = 0; i < village_positions.length; i++) {

      if (village_positions[i] === tile_position) {
        return {
          'tile': 'village',
          'village_name': village_names[i]
        }
      }

    }

    //default tile state || todo: change this to a class perhaps?
    return {
      'tile': 'default',
    };
  }


  /**
   * Renders the Map on screen
   * 
   * @return returns array of MapSquareComponents
   */
  renderMap(x, y, player_village_position, player_position_x, player_position_y, player_village_name) {

    //populates map
    let rows = [];

    for (var i = 0; i < x; i++) {
      let data = [];
      for (var j = 0; j < y; j++) {
        data.push(
          < MapSquare
            key={`${i}.${j}`}
            playerVillage={player_village_name}
            isPlayerHere={this.isPlayerHere(j + 1, i + 1, player_position_x, player_position_y)}
            tileData={ this.getTileInfo([i, j], player_village_position) }
            
          />
        );
      }
      //i don't even know
      rows.push(<tr key={`${i}.${i}.${j}`}>{data}</tr>);
    }

    return rows;
  }

  render() {

    const mapStyle = {
      margin: '50px auto',
      border: "1px solid #000",
      borderCollapse: "collapse",
      borderSpacing: "0",
      borderRadius: "0"
    }

    const travelButtonStyle = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'rgba(0,0,0,0)',
      background: 'rgba(0, 0, 0, 0.1)'
    }

    //MAP SIZE
    var mapSize_x = 12;
    var mapSize_y = 18;

    return (
      <div id='content'>
        <table style={mapStyle} id='table' className='map'>
          <thead>
            <tr>
              <th colSpan='18'>Your Location {this.state.userPosition}</th>
            </tr>
          </thead>
          <tbody>

            {
              this.renderMap(
                mapSize_x, mapSize_y,
                this.state.village_position_data,
                this.state.userPosition_x,
                this.state.userPosition_y,
                this.state.playerVillage
              )
            }

          </tbody>
        </table>
        <a style={travelButtonStyle} className='east travelButton' onClick={this.moveEast}>
          <div className='rightArrow'></div>
        </a>
        <a style={travelButtonStyle} className='north travelButton' onClick={this.moveNorth}>
          <div className='upArrow'></div>
        </a>
        <a style={travelButtonStyle} className='south travelButton' onClick={this.moveSouth}>
          <div className='downArrow'></div>
        </a>
        <a style={travelButtonStyle} className='west travelButton' onClick={this.moveWest}>
          <div className='leftArrow'></div>
        </a>

      </div>


    )
  }

}

window.TravelComponent = TravelComponent;
