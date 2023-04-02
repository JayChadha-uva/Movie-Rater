import { Component } from "react";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    fetch("/users").then((res) =>
      res.json().then((users) => {
        this.setState({ users: users });
      })
    );
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.users.map((user) => (
            <li>
              name: {user.customer_name}, customer_street:{" "}
              {user.customer_street}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Users;
