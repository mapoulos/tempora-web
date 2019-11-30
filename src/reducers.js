
import playImage from './images/icons8-play-50.png'
import pauseImage from './images/icons8-pause-50.png'
import {LOG_IN, LOG_OUT} from './actions'

const initialState = {
	loggedIn: false,
	timerLength:  10*60*1000, //1- m
	elapsedTime: 0,
	paused: false,
	started: false,
	currentAuthor: {},
	currentWork: {},
	currentSection: {},

	user: {
		email: "",
		accessToken: {},
		idToken: {},
		name: ""
	},

	ui: {
		currentButtonImage: playImage	
	}
	
}

function temporaApp(state = initialState, action) {

	switch(action.type) {
		case LOG_IN:
			return Object.assign({}, state, {
				user: {
					email: action.idToken.email,
					accessToken: action.accessToken,
					idToken: action.idToken,
					name: action.idToken.name
				},
				loggedIn: true
			})
			break;
		case LOG_OUT:
			return Object.assing({}, state, {
				loggedIn: false,
				user: {
					email: "",
					accessToken: {},
					idToken: {},
					name: ""
				}
			})
			break;
		default:
			return state
	}
	return state
}

export default temporaApp