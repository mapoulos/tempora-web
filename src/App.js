import React from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import playImage from './images/icons8-play-50.png'
import pauseImage from './images/icons8-pause-50.png'
import stopImage from './images/icons8-stop-50.png'
import Container from 'react-bootstrap/Container';
import bellSound from './sounds/bell.mp3'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


class Timer {
	constructor() {
		this.elapsedTime = 0
		this.timerLength = 15*60*1000
		this.isRunning = false
		this.timeStarted = 0
		this.onFinish = () => {}
		this.onUpdate = () => {}
		this.intervalId = 0
		this.lastUpdate = 0
	}

	start() {
		if(this.isRunning === false) {
			this.isRunning = true
			//var elapsedTime = this.elapsedTime
			this.lastUpdate = Date.now()


			this.intervalId = window.setInterval((timer) => {
				const currentTime = Date.now()
				timer.elapsedTime += currentTime - timer.lastUpdate
				timer.lastUpdate = currentTime
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

		this.timer = new Timer()
		this.breaks = []
		this.timer.onFinish = () => {
			this.setState({elapsedTime: 0})
			let audio = new Audio(bellSound)
			audio.play()

		}
		this.timer.onUpdate = () => {
			this.setState({elapsedTime: this.timer.elapsedTime})
		}
		this.state = {
			elapsedTime: 0,
			timerLength: 45*60*1000, //15 minutes in ms
			breakCount: 2,
			breakLength: 2*1000, //30s
			paused: false,
			started: false,
			showSettings: false,
			playImage: playImage
		}


		this.convertMillisecondsToString = this.convertMillisecondsToString.bind(this)
		this.populateBreaks = this.populateBreaks.bind(this)

		this.minutesRef = React.createRef()
		this.secondsRef = React.createRef()
		this.breakCountRef = React.createRef()
	}

	populateBreaks() {
		this.breaks = []
		console.log("populating breaks")
		for(let i = 0; i < this.state.breakCount; i++) {
			let breakTimerStart = new Timer()
			let breakTimerEnd = new Timer()
			let interval = this.timer.timerLength / (this.state.breakCount+1)
			console.log(interval)
			breakTimerStart.timerLength = (interval*(i+1)-this.state.breakLength/2)

			breakTimerEnd.timerLength = (interval*(i+1)+this.state.breakLength/2)

			breakTimerStart.onFinish = breakTimerEnd.onFinish = () => {
				let audio = new Audio(bellSound)
				audio.play()
				console.log("on finish in break")
			}
			this.breaks.push(breakTimerStart)
			this.breaks.push(breakTimerEnd)

		}
		console.log(this.breaks)
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

		const handleHide = () => {this.setState({showSettings: false})}
		const handleShow = () => {this.setState({showSettings: true})}
		const handleSave = () => {
			
			let minutes = parseInt(this.minutesRef.current.value, 10)
			let seconds = parseInt(this.secondsRef.current.value, 10)
			console.log("mins:\t" + minutes)
			console.log("secs:\t" + seconds)
			this.timer.timerLength = (minutes*60+seconds)*1000
			this.setState({
				showSettings: false, 
				timerLength: this.timer.timerLength
			})};

			const handleKeyPress = (evt) => {
				if(evt.key === 'Enter') {
					handleSave()
				}
			}

			const handlePlayPauseSwap = () => {
				this.setState((prevState) => {
					//not started
					if(!prevState.started) {
						this.timer.start()
						this.populateBreaks()
						this.breaks.forEach((breakTimer) => {breakTimer.start()})
						return {paused: false, playImage: pauseImage, started: true}

					} else {
						if(prevState.paused) {
							this.timer.start()
							this.breaks.forEach((breakTimer) => {breakTimer.start()})
							return {paused: false, playImage: pauseImage, started: true}
						} else {
							this.timer.pause()
							this.breaks.forEach((breakTimer) => {breakTimer.pause()})
							return {paused: true, playImage: playImage, started: true}
						}
					}
				});

			};

			return(
				<Container lg={12}>
				<Row style={{marginTop: "10%", textAlign: "center"}}>

				<Col lg={{span:1, offset:5, marginLeft: "10%"}}>
				<h1 onClick={() => {this.setState({showSettings: true})}}>{this.convertMillisecondsToString(this.state.timerLength-this.state.elapsedTime)}</h1>

				</Col>
				</Row >



				
				<Row style={{marginTop: "10%", textAlign: "center"}}>
				<Col lg={{span:2, offset: 4}} md={{offset: 4, span:2}}><Button variant="secondary" onClick={handlePlayPauseSwap}><Image src={this.state.playImage} /></Button></Col>
				<Col lg={{span:2}} md={{span:2}} ><Button variant="secondary"><Image onClick={() => {this.timer.stop()}} src={stopImage}/></Button></Col>
				</Row>
				<Row>
				<Col>
				<Modal show={this.state.showSettings} onHide={handleHide}>
				<Modal.Dialog>
				<Modal.Header closeButton>
				Settings
				</Modal.Header>

				<Modal.Body>
				<Form onKeyDown={(evt) => (handleKeyPress(evt))}>
				<Form.Row>
				<Col>
				<Form.Control ref={this.minutesRef} defaultValue={Math.floor(this.state.timerLength / 1000/ 60)}  />
				</Col>
				<Col>
				<Form.Control ref={this.secondsRef} defaultValue={Math.floor(this.state.timerLength / 1000) % 60 } />
				</Col>
				</Form.Row>

				<Form.Row>
				<Form.Control ref={this.breakCountRef} placeholder={this.state.breakCount} />
				</Form.Row>
				</Form>

				</Modal.Body>

				<Modal.Footer>
				<Button variant="secondary" onClick={() => {this.setState({showSettings: false})}}>Close</Button>
				<Button variant="primary" onClick={handleSave}>Save</Button>
				</Modal.Footer>
				</Modal.Dialog>
				</Modal>
				</Col>
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
