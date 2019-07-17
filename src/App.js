import React from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';



class Timer {
	constructor() {
		this.elapsedTime = 0
		this.timerLength = 15*60*1000
		this.isRunning = false
		this.timeStarted = 0
		this.onFinish = () => {}
		this.intervalId = 0
	}

	startTimer() {
		this.isRunning = true
		var elapsedTime = this.elapsedTime
		this.timeStarted = Date.now()
		this.intervalId = window.setInterval((timer) => {
				timer.elapsedTime = Date.now() - timer.elapsedTime
				if(elapsedTime >= timer.timerLength()) {
					timer.stopTimer()
					timer.onFinish()
				}
			}, 1000, this)
	}


	pauseTimer() {
		this.isRunning = false
		window.clearInterval(this.intervalId)
	}

	stopTimer() {
		this.elapsedTime = 0
		window.clearInterval(this.intervalId)
	}



}

class TimerUI extends React.Component {
	constructor(props) {
		super(props)

		this.timer = new Timer()
		this.state = {
			elapsedTime: 0,
			timerLength: 15*60*1000, //15 minutes in ms
			paused: false,
			started: false
		}

		this.convertMillisecondsToString = this.convertMillisecondsToString.bind(this)
	}

	convertMillisecondsToString(ms) {
		//get minutes
		let mins = Math.floor(ms / 60 / 1000);
		let secs = Math.floor(ms / 1000);
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
				<Row style={{marginTop: "10%"}}>
				<Col>
					
				<Card className="text-center">
				<Card.Title>{this.convertMillisecondsToString(this.state.elapsedTime)}</Card.Title>
				</Card>
				</Col>
				</Row>

				
				<Row>
				<Col><Button /></Col><Col><Button /> </Col>
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
