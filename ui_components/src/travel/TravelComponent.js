import { MapSquare } from "./MapSquare.js";

class TravelComponent extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      mapVillageData: ['no map data set'],
      playerVillage: 'none',
      userPosition: '0.0',
      userPosition_x: 0,
      userPosition_y: 0
    }
  }

  componentDidMount(){
    this.setTravelJSONData()
  }

  setTravelJSONData(){
    fetch("http://192.168.1.47/shinobi-chronicles2/shinobi-chronicles/api/scoutArea.php", ).
    then((json) => {
      return json.json();
    }).then((data) => {
      /*Set JSON Data*/

      this.setState({mapVillageData: data['map_data']['village_positions']});
      this.setState({playerVillage: data['area_data']['current_user'][0]['village']});
      this.setState({userPosition: data['area_data']['current_user'][0]['location']});
      this.setState({userPosition_x: data['area_data']['current_user'][0]['x_pos']});
      this.setState({userPosition_y: data['area_data']['current_user'][0]['y_pos']});

    }).catch((e)=>{console.log("Travel Component Error: " + e)})
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
    let currentUserPosition = [3,3];

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
      </div>
    )
  }

}

window.TravelComponent = TravelComponent;
