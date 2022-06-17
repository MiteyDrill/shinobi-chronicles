class ScoutArea extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userList: [],
      currentUserData: [],
      currentUser_village: 'no village set',
      currentUser_location: '0.0',
      currentUser_rank: 'no rank set',
    }
  }

  setUserListDataInterval(){
    /*Not sure if this is a good way to impliment this*/
    let headers = new Headers();

    //interval call (milliseconds)
    const callTime = 600;

    /*Not sure if these headers actually do anything?*/
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin','http://192.168.1.122');

    setInterval(
      () => {
        fetch("http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/scoutArea.php", {
          method: 'GET',
          headers: headers,
        })
        .then( (data) => {
            return data.json();
        }).then((json) => {

            this.setState({userList: json['area_data']['users']})
            this.setState({currentUserData: json['area_data']['current_user']})
            this.setState({currentUser_village: json['area_data']['current_user'][0]['village']});
            this.setState({currentUser_location: json['area_data']['current_user'][0]['location']});
            this.setState({currentUser_rank: json['area_data']['current_user'][0]['rank']});
          
            console.log("Scout Component Errors: " + ((json['errors'].length) ? json['errors'] : 'No errors'));


        }).catch((e) => {
            console.log("API Error: " + e);
        })
      }, callTime);
  }

  componentDidMount(){
    this.setUserListDataInterval();
  }

  //return village color styling
  getVillageColor(village, current_user_village) {
    if(village == current_user_village){
      return {fontWeight: 'bold', color: '#00C000'};
    } else {
      return {fontWeight: 'bold', color: '#C00000'};
    }
  }

  displayUserAction(village, location, rank, userId , battleId){
    if(battleId != '0'){
      return 'In Battle!';
    } else if (this.state.currentUser_village != village && this.state.currentUser_location == location && this.state.currentUser_rank == rank){
      return (
        <a href={'&attack=' + userId}>
          Attack
        </a>
      )
    } else {
      return '';
    }
  }

  render() {

    return (
      <table id="scoutTable" className='table'>
        <tbody>

          <tr>
            <th colSpan="5">Scout Area (Scout Range: 1 Squares)</th>
          </tr>

          <tr>
            <th>Username</th>
            <th>Rank</th>
            <th>Village</th>
            <th>Location</th>
            <th></th>
          </tr>

          {/*Create This Dynamically*/}
          {
          this.state.userList.map( (item) =>
            <tr style={{textAlign: 'center'}} className='table_multicolumns' id={item['user_name']} key={item['user_name']}>

              <td>
                <a href={item['user_profile_link'] + '&user=' + item['user_name']}>
                  {item['user_name']}
                </a>
              </td>
              <td>{item['rank']}</td>
              <td>
              {/*TODO: confusing to read should fix*/}
                <img src={item['image_link']} style={{maxHeight:"18px", maxWidth:"18px"}}/>
                <span style={this.getVillageColor(item['village'], this.state.currentUser_village)}>
                  {" " + item['village']}
                </span>
              </td>
              <td>{item['location']}</td>

              <td>
                {this.displayUserAction(item['village'], item['location'], item['rank'], item['user_id'], item['battle_id'])}
              </td>

            </tr>

          )
          }
        </tbody>
      </table>
    )
  }
}

window.ScoutArea = ScoutArea;
