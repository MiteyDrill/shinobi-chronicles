class MapSquare extends React.Component {

  constructor(props){
    super(props);
  }

  getStyle(isVillage){

    var isVillage_Style = {
      backgroundImage: "url(./images/village_icons/stone.png"
    }

    var default_style = {
    }

    return (isVillage) ? isVillage_Style : default_style;
  }

  render(){

    var isVillage = this.props.isVillage;
    var villageImageLink = "stone.png";

    return (
      <td style={this.getStyle(isVillage)} ></td>
    )
  }

}

export {MapSquare}
