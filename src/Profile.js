import React from 'react';

//import Card from 'react-bootstrap/Card';
import Card from 'react-bootstrap/Card';


class Profile extends React.Component {
	

	render() {

		if(props.show){
		return (
			<Card>
				<Card.Body>
				<Card.Title>Profile</Card.Title>
				Username: this.props.username} <br/>
				Name: {this.props.name} <br/>
				<Card.Link href="#signout" onClick={this.props.handleSignOut()}>Sign Out</Card.Link>
				</Card.Body>
			</Card>
			);
		} else {
			return (<div></div>);
		}
	}
}

export default App;
