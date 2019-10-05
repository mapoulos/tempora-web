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
import Image from 'react-bootstrap/Image';

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
			catalog: {},
			section: []
		}

		this.convertMillisecondsToString = this.convertMillisecondsToString.bind(this)
	}

	componentDidMount() {
		let axios = require('axios')
		axios.get(API_URL)
			.then((response) => {
				this.setState({
					catalog: response.data,
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


		return(
			<Container lg={12}>
				<Row style={{marginTop: "10%", textAlign: "center"}}>

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
