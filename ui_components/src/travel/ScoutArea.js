class ScoutArea extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userList: [],
      currentUserData: [],
      currentUser_village: 'none',
      currentUser_location: '0.0',
      currentUser_rank: 'no_rank'
    }
  }

  setUserListDataInterval(){
    /*Not sure if this is a good way to impliment this*/
    /*Slow network will add a large stack of back calls to display*/
    /*From what I can see on the Network panel on the chrome dev tools*/
    setInterval(
      () => {
        fetch("http://localhost/shinobi-chronicles2/shinobi-chronicles/api/scoutArea.php")
        .then( (data) => {
            return data.json();
        }).then((json) => {

            this.setState({userList: json['area_data']['users']})
            this.setState({currentUserData: json['area_data']['current_user']})
            this.setState({currentUser_village: json['area_data']['current_user'][0]['village']});
            this.setState({currentUser_location: json['area_data']['current_user'][0]['location']});
            this.setState({currentUser_rank: json['area_data']['current_user'][0]['rank']});


        }).catch((e) => {
            console.log("Error: " + e);
        })
      }, 600);
  }

  componentDidMount(){
    this.setUserListDataInterval();
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
          this.state.userList.map(item =>
            <tr id={item['user_name']} key={item['user_name']}>
              <td>{item['user_name']}</td>
              <td>{item['rank']}</td>
              <td>{item['village']}</td>
              <td>{item['location']}</td>

              <td>
                <a href={item['attack_link'] + '&attack=' + item['user_id']}>
                  {(this.state.currentUser_village != item['village'] && this.state.currentUser_location == item['location'] && this.state.currentUser_rank == item['rank']) ? "Attack" : ""}
                </a>
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
