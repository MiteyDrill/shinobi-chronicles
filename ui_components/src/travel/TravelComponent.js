import { MapSquare } from "./MapSquare.js";

class TravelComponent extends React.Component {

  /**
  * if ([x, y] == [x, y]) : bool
  */
  isVillage(current_map_pos, user_pos): bool{

    for(var i = 0; i < current_map_pos.length; i++){
      if(current_map_pos[i][0] == user_pos[0] && current_map_pos[i][1] == user_pos[1]){
        return true;
      }
    }
    return false;
  }


  //returns array of jsx elements
  renderMap(x, y): array{

    //important structure positions
    let villagePositions = [[2,4], [1,16], [5,8], [7, 2], [9,15]];
    let currentUserPosition = [3,3];

    let rows = [];
    //loop creates jsx and pushes them to [rows]
    for(var i = 0; i < x; i++){
      let data = [];
      for(var j = 0; j < y; j++){
        data.push(
          <MapSquare key={j} isVillage={this.isVillage( villagePositions , [i, j] )}/>
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
              <th colSpan='18'>Your Location 18.3</th>
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
