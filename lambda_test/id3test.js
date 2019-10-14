const NodeID3 = require('node-id3')
const fs = require('fs')
const util = require('util')
files = fs.readdirSync("audio")

files.forEach((file) => {

	console.log(file)
	//read
	let tags = NodeID3.read("audio/" + file)
	console.log(util.inspect(tags, {depth: null}))
	

	//write
	// let tags = {
	// 	artist: "Evagrius Ponticus",
	// 	album: "On Prayer",
	// }
	// let id3FrameBuffer = NodeID3.create(tags)
	// NodeID3.write(tags, "audio/" + file, (err,buffer) => {
	// 	if(err) console.log(err)
	// })
	
})