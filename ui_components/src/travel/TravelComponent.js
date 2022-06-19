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
    }
  }

  componentDidMount() {
    //Init API Call
    this.getTravelJSONData();
  }

  /**
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
      "http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/travel_page/travel.php",
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

  //syntax is used so this.updateTravelDB keywork will work
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

  getTravelJSONData() {
    setInterval(() => {

      let headers = {
        "Content-Type": "application/json",
      }

      fetch(
        "http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/travel_page/travel.php"
      ).
        then((json) => {
          return json.json();
        }).then((data) => {

          /*Set recieved JSON data */

          console.log(data);

          this.setState({ playerID: data['response']['current_player_id'] }); 

          this.setState({ playerVillage: data['area_data']['current_user'][0]['village'] });
          this.setState({ userPosition: data['area_data']['current_user'][0]['location'] });
          this.setState({ userPosition_x: data['area_data']['current_user'][0]['x_pos'] });
          this.setState({ userPosition_y: data['area_data']['current_user'][0]['y_pos'] });

        }).catch((e) => { console.log("Travel Component Init API Call Error: " + e) })

    }, 600);

  }


  /**
  * return true/false if player is at [x, y] position: Meant for MapSquare component
  */
  isPlayerHere(x, y) {
    if (this.state.userPosition_x == x && this.state.userPosition_y == y) {
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
  getTileInfo(map_position){

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
    for (var i = 0; i < this.state.mapVillageData.length; i++) {

      if (this.state.mapVillageData[i][0] == map_position[1] + offset && this.state.mapVillageData[i][1] == map_position[0] + offset) {
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


  /**
   * Renders the Map on screen
   * 
   * @return returns array of MapSquareComponents
   */
  renderMap(x, y) {

    //todo: can probably delete this
    //current user pos
    let currentUserPosition = [3, 3]; //test pos 

    let rows = [];
    //loop creates jsx and pushes them to [rows]
    for (var i = 0; i < x; i++) {
      let data = [];
      for (var j = 0; j < y; j++) {
        data.push(
          <MapSquare key={j} playerVillage={this.state.playerVillage} isPlayerHere={this.isPlayerHere(j + 1, i + 1)} tileData={this.getTileInfo([i, j])} />
        );
      }
      rows.push(<tr key={'${i}.${j}'}>{data}</tr>);
    }

    //returning map
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

            {this.renderMap(mapSize_x, mapSize_y)}

          </tbody>
        </table>
        <a style={travelButtonStyle} class='east travelButton' onClick={this.moveEast}>
          <div class='rightArrow'></div>
        </a>
        <a style={travelButtonStyle} class='north travelButton' onClick={this.moveNorth}>
          <div class='upArrow'></div>
        </a>
        <a style={travelButtonStyle} class='south travelButton' onClick={this.moveSouth}>
          <div class='downArrow'></div>
        </a>
        <a style={travelButtonStyle} class='west travelButton' onClick={this.moveWest}>
          <div class='leftArrow'></div>
        </a>

      </div>

      
    )
  }

}

window.TravelComponent = TravelComponent;
