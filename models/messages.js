var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

var profiles = mongoose.model('profiles').schema

var childSchema = mongoose.Schema({
		    title: {type : String, default: ''},
		    body: {type : String, default: ''},
		    author: {type : String, default: ''},
		    creationdate: {type: Date, default: Date.now},
		    lastupdate: {type: Date, default: Date.now},
		    isparent: {type : Boolean, default: true},
		    //parent: [{type: Schema.Types.ObjectId}],//[{type: Schema.Types.ObjectId, ref: 'Message'}],
		    tags: [String],
		    isfactory: {type : Boolean, default: false},
		    iscomment: {type : Boolean, default: false},
		    hits: Number
		});

var messageSchema = mongoose.Schema({
		    title: {type : String, default: ''},
		    body: {type : String, default: ''},
		    author: {type : String, default: ''},
		    creationdate: {type: Date, default: Date.now},
		    lastupdate: {type: Date, default: Date.now},
		    isparent: {type : Boolean, default: true},
		    //parent: [{type: Schema.Types.ObjectId}],//[{type: Schema.Types.ObjectId, ref: 'Message'}],
		    childs: [childSchema],
		    // members: [
		    // 	{username: {type : String}},
		    // 	{_id: {type: Schema.Types.ObjectId, ref: 'Profiles'}}
		    // ],
		    members: [{type: Schema.Types.ObjectId, ref: 'profiles'}],
		    tags: [String],
		    isfactory: {type : Boolean, default: false},
		    iscomment: {type : Boolean, default: false},
		    hits: Number
		});

module.exports = mongoose.model('messages', messageSchema);