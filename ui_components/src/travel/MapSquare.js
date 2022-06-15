class MapSquare extends React.Component {

  constructor(props){
    super(props);
  }

  //return style
  getStyle(tile_data){
    if(tile_data['tile'] == 'default'  && this.props.isPlayerHere){
      return {
        backgroundColor: 'black'
      };
    } else if(tile_data['tile'] == 'village' && this.props.isPlayerHere){
      return {
        backgroundImage: 'url(./images/village_icons/'+tile_data['village_name']+'.png',
        backgroundColor: '#000'
      }
    } else if (tile_data['tile'] == 'village' && this.props.playerVillage.toLowerCase() == tile_data['village_name']) {
      return {
        backgroundImage: 'url(./images/village_icons/'+tile_data['village_name']+'.png',
        backgroundColor: 'yellow'
      }
    } else if (tile_data['tile'] == 'village') {
      return {
        backgroundImage: 'url(./images/village_icons/'+tile_data['village_name']+'.png',
        backgroundColor: '#999'
      }
    }

    //default tile
    return {};
  }

  render(){

    return (
      <td style={this.getStyle(this.props.tileData)}></td>
    )
  }

}

export {MapSquare}
