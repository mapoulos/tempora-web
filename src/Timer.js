
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

export default Timer;