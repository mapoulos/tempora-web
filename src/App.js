import React from 'react';
import './App.css';
import './bootstrap.min.css';
import playImage from './images/icons8-play-50.png'
import pauseImage from './images/icons8-pause-50.png'
import stopImage from './images/icons8-stop-50.png'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';

const API_URL = "https://mp22l1ux2d.execute-api.us-east-1.amazonaws.com/default/tempora-pray-getcatalog"

class Timer {
	constructor() {
		this.elapsedTime = 0
		this.timerLength = 15*60*1000
		this.isRunning = false
		this.timeStarted = 0
		this.onFinish = () => {}
		this.onUpdate = () => {}
		this.intervalId = 0
	}

	start() {
		if(this.isRunning === false) {
		this.isRunning = true
		var elapsedTime = this.elapsedTime
		this.timeStarted = Date.now()
		this.intervalId = window.setInterval((timer) => {
				timer.elapsedTime = Date.now() - timer.timeStarted
				if(elapsedTime >= timer.timerLength) {
					timer.stop()

					timer.onFinish()
					
				} else {
					timer.onUpdate()
				}

			}, 1000, this)
		}
	}


	pause() {
		this.isRunning = false
		window.clearInterval(this.intervalId)
	}

	stop() {
		this.isRunning = false
		this.elapsedTime = 0
		this.onUpdate()
		window.clearInterval(this.intervalId)
	}



}

class TimerUI extends React.Component {
	constructor(props) {
		super(props)

		this.timer = new Timer()
		this.timer.onFinish = () => {
			this.setState({elapsedTime: 0})
		}
		this.timer.onUpdate = () => {
			this.setState({elapsedTime: this.timer.elapsedTime})
		}
		this.state = {
			elapsedTime: 0,
			timerLength: 15*60*1000, //15 minutes in ms
			paused: false,
			started: false,
			playImage: playImage,
			currentAuthor: "",
			currentWork: "",
			currentSection: "", 
			showSettings: false,

		}

		this.convertMillisecondsToString = this.convertMillisecondsToString.bind(this)
	}

	componentDidMount() {
		let axios = require('axios')
		axios.get(API_URL)
			.then((response) => {
				let catalog = response.data
				this.setState({
					catalog: catalog,
					currentAuthor: catalog[0].name,
					currentWork: catalog[0].works[0].name,
					currentSection: catalog[0].works[0].sections[0].number
				})
			})
			.catch((e) => {
				console.log(e)
			})
	}

	convertMillisecondsToString(ms) {
		//get minutes
		let mins = Math.floor(ms / 60 / 1000);
		let secs = Math.floor(ms/1000) % 60;
		var minStr = "" + mins;
		var secStr = "" + secs;
		if(mins < 10) {
			minStr = "0" + minStr
		}
		if(secs < 10) {
			secStr = "0" + secs;
		}
		return minStr + ":" + secStr;
	}

	render() {
		let authors, works, sections = []

		if(this.state.catalog) {
		authors = this.state.catalog.map((authorObj) => (
			<option key={authorObj.name}>{authorObj.name}</option>
		))
		//object representation of the current author
		let currentAuthorObject = this.state.catalog
			.find((authorObj) => (authorObj.name === this.state.currentAuthor))
		
		//object representation of the current work
		let currentWorkObject = currentAuthorObject.works
			.find((workObj) => (workObj.name === this.state.currentWork))

		//get the works of the current author
		works = currentAuthorObject
				.works
				.map((workObj) => (
					<option key={currentAuthorObject.name+"-"+workObj.name}>{workObj.name}</option>
				))

		//get the sections of the currently selected work
		sections = currentWorkObject.sections.map((sectionObj) => (
				<option key={sectionObj.number}>{sectionObj.number}</option>
			))
		}

		


		return(
			<Container style={{marginTop: "10%"}} lg={12}>
				<Row style={{textAlign: "center"}}>
					<Col>
						<Button size="lg" onClick={(evt) => {this.setState({showSettings: true})}} variant="light">{this.state.currentAuthor}, <em>{this.state.currentWork}</em>, {this.state.currentSection}</Button>
					</Col>
					
				</Row>
				<Row style={{marginTop: "4%", textAlign: "center"}}>

				<Col lg={{span:1, offset:5, marginLeft: "10%"}}>
					<h1>{this.convertMillisecondsToString(this.state.timerLength-this.state.elapsedTime)}</h1>
			
				</Col>
				</Row>

				
				<Row style={{justifyContent: "center", marginTop: "3%"}}>
				<Button style={{marginRight: "1%"}} variant="light"><Image onClick={() => {
						//handle this logic better for pausing, etc.
						this.timer.start();
						this.setState((prevState) => (
							{playImage: pauseImage}))
					}
				} src={this.state.playImage} /></Button>
				<Button variant="light"><Image onClick={() => {this.timer.stop(); this.setState({playImage: playImage})}} src={stopImage}/></Button>
				</Row>
				<Modal onHide={(evt) => {this.setState({showSettings: false})}}show={this.state.showSettings}>
					<Modal.Header closeButton>
						<Modal.Title>Settings</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Row style={{}}>
						<Col lg={8}>
							<Form>
								<Form.Row>
								<Form.Group as={Col}>
								<Form.Label>Author</Form.Label>
								<Form.Control as="select" onChange={(evt) => 
									{this.setState({currentAuthor: evt.target.value})
								}}>
									{authors}
								</Form.Control>
								</Form.Group>

								<Form.Group as={Col}>
								<Form.Label>Work</Form.Label>
								<Form.Control as="select" onChange={(evt) => 
									{this.setState({currentWork: evt.target.value})
								}}>
									{works}
								</Form.Control>
								</Form.Group>

								<Form.Group as={Col}>
								<Form.Label>Section</Form.Label>
								<Form.Control as="select" onChange={(evt) => 
									{this.setState({currentSection: evt.target.value})
								}}>
									{sections}
								</Form.Control>
								</Form.Group>
								</Form.Row>

							</Form>
						</Col>
						</Row>
					</Modal.Body>
				</Modal>
			</Container>

			);
	}
	
}


class App extends React.Component {
	

	render() {
		return (
			<TimerUI />
		);
	}
}

export default App;
