import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';



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

		//state:
		//-timer length
		//-elapsed time
		//-number of breaks
		//-timeToNextBreak
		//
	}
	
}


class App extends React.Component {
	

	render() {
		return (
			<Container>
			</Container>
		);
	}
}

export default App;
