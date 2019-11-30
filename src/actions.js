//actions.js

//LOG_IN
//LOG_OUT
//SHOW_PROFILE
//HIDE_PROFILE
//START_MEDITATION
//PAUSE_MEDITATION
//INTERRUPT_MEDITATION
//COMPLETE_MEDITATION
//SHOW LIBRARY
//HIDE LIBRARY
//SELECT AUTHOR
//SELECT WORK
//SELECT SECTION
//VIEW INFO
//INCREASE TIMER
//DECREASE TIMER
//MOVE TO NEXT MEDITATION
//MOVE TO PREVIOUS MEDITATION 


export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const SHOW_PROFILE = 'SHOW_PROFILE'
export const HIDE_PROFILE = 'HIDE_PROFILE'
export const START_MEDITATION = 'START_MEDITATION'
export const PAUSE_MEDITATION = 'PAUSE_MEDITATION'
export const INTERRUPT_MEDITATION = 'INTERRUPT_MEDITATION'
export const FINISH_MEDITATION = 'FINISH_MEDITATION'

export function login(userData) {
	return {type: LOG_IN, userData}
}

export function logout() {
	return {type: LOG_OUT}
}

export function startMeditation() {
	return {type: START_MEDITATION}
}

export function pauseMeditation() {
	return {type: PAUSE_MEDITATION}
}

export function interruptMeditaiton() {
	return {type: INTERRUPT_MEDITATION}
}

export function finishMeditation() {
	return {type: FINISH_MEDITATION}
}