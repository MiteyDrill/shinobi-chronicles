class MapSquare extends React.Component {
  constructor(props) {
    super(props);
  } //return style


  getStyle(tile_data, playerIsHere, player_village_name) {
    const village_name = tile_data['village_name'];
    /**TODO: Refactoring needed */

    if (tile_data['tile'] == 'default' && playerIsHere) {
      return {
        backgroundColor: 'black'
        /**PLAYER ICON LINK SHOULD GO HERE */

      };
    } else if (tile_data['tile'] == 'village' && playerIsHere) {
      return {
        backgroundImage: 'url(./images/village_icons/' + tile_data['village_name'] + '.png',
        backgroundColor: '#000'
        /**PLAYER ICON LINK SHOULD GO HERE */

      };
    } else if (tile_data['tile'] == 'village' && tile_data['village_name'] == player_village_name) {
      return {
        backgroundImage: 'url(./images/village_icons/' + tile_data['village_name'] + '.png',
        backgroundColor: 'yellow'
      };
    } else if (tile_data['tile'] == 'village') {
      return {
        backgroundImage: 'url(./images/village_icons/' + tile_data['village_name'] + '.png',
        backgroundColor: '#999'
      };
    } //default tile


    return {};
  }

  render() {
    return /*#__PURE__*/React.createElement("td", {
      style: this.getStyle(this.props.tileData, this.props.isPlayerHere, this.props.playerVillage)
    });
  }

}

export { MapSquare };