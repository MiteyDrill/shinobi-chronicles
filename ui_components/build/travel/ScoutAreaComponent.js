class ScoutAreaComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      currentUserData: [],
      currentUser_village: 'no village set',
      currentUser_location: '0.0',
      currentUser_rank: 'no rank set'
    };
  }

  setUserListDataInterval() {
    /*Not sure if this is a good way to impliment this*/
    let headers = new Headers(); //interval call (milliseconds)

    const callTime = 600;
    /*Not sure if these headers actually do anything?*/

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', 'http://192.168.1.122');
    {
      /**TODO: Change this Link */
    }
    setInterval(() => {
      fetch("http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/api/travel_page/scout.php", {
        /**TODO: Change this link */
        method: 'GET',
        headers: headers
      }).then(data => {
        return data.json();
      }).then(json => {
        // console.log(json);
        this.setState({
          userList: json['response']['active_user_list']
        });
        this.setState({
          currentUserData: json['response']['current_user_data']
        });
        this.setState({
          currentUser_village: json['response']['current_user_data']['village']
        });
        this.setState({
          currentUser_location: json['response']['current_user_data']['location']
        });
        this.setState({
          currentUser_rank: json['response']['current_user_data']['rank']
        });
        console.log("Scout Component Errors: " + (json['errors'].length ? json['errors'] : 'No errors'));
      }).catch(e => {
        console.log("API Error: " + e);
      });
    }, callTime);
  }

  componentDidMount() {
    this.setUserListDataInterval();
  } //return village color styling


  getVillageColor(village, current_user_village) {
    if (village == current_user_village) {
      return {
        fontWeight: 'bold',
        color: '#00C000'
      };
    } else {
      return {
        fontWeight: 'bold',
        color: '#C00000'
      };
    }
  }

  onClickAttackLinkHandler = () => {
    window.open("http://192.168.1.122/shinobi-chronicles2/shinobi-chronicles/?id=11&attack=" + this.state.currentUserData['user_id'], "_self");
  };

  displayUserAction(village, location, rank, userId, battleId) {
    if (battleId != '0') {
      return 'In Battle!';
    } else if (this.state.currentUser_village != village && this.state.currentUser_location == location && this.state.currentUser_rank == rank) {
      return /*#__PURE__*/React.createElement("a", {
        style: {
          cursor: 'pointer'
        },
        onClick: this.onClickAttackLinkHandler
      }, " ", "Attack");
    } else {
      return '';
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("table", {
      id: "scoutTable",
      className: "table"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      colSpan: "5"
    }, "Scout Area (Scout Range: 1 Squares)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Username"), /*#__PURE__*/React.createElement("th", null, "Rank"), /*#__PURE__*/React.createElement("th", null, "Village"), /*#__PURE__*/React.createElement("th", null, "Location"), /*#__PURE__*/React.createElement("th", null)), this.state.userList.map(item => /*#__PURE__*/React.createElement("tr", {
      style: {
        textAlign: 'center'
      },
      className: "table_multicolumns",
      id: item['user_name'],
      key: item['user_name']
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: item['user_profile_link'] + '&user=' + item['user_name']
    }, item['user_name'])), /*#__PURE__*/React.createElement("td", null, item['rank']), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
      src: item['image_link'],
      style: {
        maxHeight: "18px",
        maxWidth: "18px"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: this.getVillageColor(item['village'], this.state.currentUser_village)
    }, " " + item['village'])), /*#__PURE__*/React.createElement("td", null, item['location']), /*#__PURE__*/React.createElement("td", null, this.displayUserAction(item['village'], item['location'], item['rank'], item['user_id'], item['battle_id']))))));
  }

}

window.ScoutAreaComponent = ScoutAreaComponent;