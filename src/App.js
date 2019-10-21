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
const BELL_URL = "https://s3.amazonaws.com/tempora-pray-web-bucket/bells/Ship_Bell_mono.mp3"

class Timer {
	constructor() {
		this.elapsedTime = 0
		this.timerLength = 1*60*1000
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
				timer.elapsedTime = Date.now() - timer.timeStarted + elapsedTime
				if(timer.elapsedTime >= timer.timerLength) {
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


		this.playSounds = this.playSounds.bind(this)

		this.timer = new Timer()
		this.timer.onFinish = () => {
			this.playSounds()
			this.setState({elapsedTime: 0, paused: false, started: false, playImage: playImage})
		}
		this.timer.onUpdate = () => {
			this.setState({elapsedTime: this.timer.elapsedTime})
		}
		this.state = {
			elapsedTime: 0,
			timerLength: 5*60*1000, //5 minutes in ms
			paused: false,
			started: false,
			playImage: playImage,
			currentAuthor: "",
			currentWork: "",
			currentSection: "",
			currentURL: "", 
			showSettings: false,

		}
		this.timer.timerLength = this.state.timerLength

		this.convertMillisecondsToString = this.convertMillisecondsToString.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handlePlayPause = this.handlePlayPause.bind(this)
	}

	playSounds() {
		this.meditationAudio = new Audio(this.state.currentURL)
		this.bellAudio = new Audio(BELL_URL)

		this.bellAudio.onended = () => {
			this.meditationAudio.onended = () => {
				this.bellAudio.onended = () => {}
				this.bellAudio.play()
			}
			this.meditationAudio.play()
		}
		this.bellAudio.play()
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown)
		let axios = require('axios')
		axios.get(API_URL)
		.then((response) => {
			let catalog = response.data
			this.setState({
				catalog: catalog,
				currentAuthor: catalog[0].name,
				currentWork: catalog[0].works[0].name,
				currentSection: catalog[0].works[0].sections[0].number,
				currentURL: catalog[0].works[0].sections[0].url
			})
		})
		.catch((e) => {
			console.log(e)
		})
	}

	handleKeyDown(evt) {
		switch(evt.keyCode) {
			case 38: //up arrow
				this.setState((prevState) => {
					this.timer.timerLength = prevState.timerLength+5*60*1000
					return {timerLength: prevState.timerLength+5*60*1000}
				})
				break;
			case 40: //down arrow
				this.setState((prevState) => {
					this.timer.timerLength = prevState.timerLength-5*60*1000
					return {timerLength: prevState.timerLength-5*60*1000}
				})
				break;
			case 32:
				this.handlePlayPause();
				break;
		}
	}

	handlePlayPause() {
		this.setState((prevState) => {
			if(prevState.started === false) { //need to play
				this.playSounds()
				this.timer.start();
				return {playImage: pauseImage, started: true, paused: false}

			} else if(prevState.paused === false && prevState.started === true){
				this.timer.pause()
				this.bellAudio.pause()
				this.meditationAudio.pause()
				return {playImage: playImage, paused: true}

			} else if(prevState.paused === true && prevState.started === true) {
				this.timer.start()
				this.meditationAudio.play();
				return {playImage: pauseImage, started: true, paused: false}

			}
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
		//todo, save the full work/author/etc. in state
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
						this.handlePlayPause()
						
					}} src={this.state.playImage} /></Button>

					<Button variant="light"><Image onClick={() => {
						if(this.meditationAudio) {
							this.meditationAudio.pause();
							this.meditationAudio.load();
						}
						if(this.bellAudio) {
							this.bellAudio.pause();
							this.bellAudio.load();
						}
						this.timer.stop(); 
						this.setState({playImage: playImage, started: false, paused: false}
							)}
					} 

					src={stopImage}/></Button>
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
					<Form.Control as="select" onChange={(evt) => {
						let value = evt.target.value
						let currentAuthorObject = this.state.catalog
							.find((authorObj) => (authorObj.name === value))
						this.setState({currentAuthor: value, 
							currentWork: currentAuthorObject.works[0].name,
							currentSection: currentAuthorObject.works[0].sections[0].number
						})
					}}>
					{authors}
					</Form.Control>
					</Form.Group>

					<Form.Group as={Col}>
					<Form.Label>Work</Form.Label>
					<Form.Control as="select" onChange={(evt) => {
						let value = evt.target.value
						this.setState({currentWork: value}
						)
					}}>
					{works}
					</Form.Control>
					</Form.Group>

					<Form.Group as={Col}>
					<Form.Label>Section</Form.Label>
					<Form.Control as="select" value={this.state.currentSection} onChange={(evt) => {
						let value = evt.target.value	
						this.setState((prevState) =>{
							let [author, work, section] = [this.state.currentAuthor, this.state.currentWork, value]
							let url= prevState.catalog.find((authorObj) => (authorObj.name === author))
							.works
							.find((workObj) => (workObj.name === work))
							.sections
							.find((sectionObj) => (sectionObj.number === section)).url

							return {currentSection: value,
								currentURL: url}										
							})
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
