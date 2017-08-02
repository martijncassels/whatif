var mongoose = require('mongoose')
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var passportLocalMongoose = require('passport-local-mongoose');

//var profileSchema = mongoose.Schema({
var Profile = new Schema({
			//_id: String,
		    //username: { type:String,minlength:5},
		    username: String,
		    firstname: String,
		    lastname: String,
		    password: String,
		    active: {type: Boolean, default: false},
		    deleted: {type: Boolean, default: false},
		    creationdate: {type: Date, default: Date.now},
		    lastlogin: {type: Date, default: Date.now},
		    avatar: {
		    	head: String,
		    	body: String
		    },
		    skills: [{
		    	name: {type:String}, value: {type:Number, default: 0}

		    	// 1: {type:Number, default: 0},
		    	// 2: {type:Number, default: 0},
		    	// 3: {type:Number, default: 0},
		    	// 4: {type:Number, default: 0},
		    	// 5: {type:Number, default: 0}
		    }],
		    memberof: [{type: Schema.Types.ObjectId, ref: 'profiles'}],
		});

Profile.plugin(passportLocalMongoose);

//module.exports = mongoose.model('profiles', profileSchema);
module.exports = mongoose.model('profiles', Profile);