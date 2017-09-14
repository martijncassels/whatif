/* Fake test data script for MongoBooster
faker.locale = "nl"

const STEPCOUNT = 1; //total 100 * 100 = 10000

function isRandomBlank(blankWeight) {
    return Math.random() * 100 <= blankWeight;
};

for (let i = 0; i < 10; i++) {
    db.getCollection("messages").insertMany(
        _.times(STEPCOUNT, () => {
            return {
                "author": faker.name.findName(),
                "body": faker.lorem.paragraph(),
                "childs": [],
                "creationdate": faker.date.recent(),
                "iscomment": false,
                "isfrontpage": false,
                "isfactory": isRandomBlank(75) ? false : faker.random.boolean(),
                "isparent": true,
                "lastupdate": faker.date.recent(),
                "members": [],
                //"parent": isRandomBlank(100) ? null : faker.random.word(),
                "tags": isRandomBlank(0) ? null : faker.random.arrayElement(),
                "title": faker.random.words(),
                "__v": faker.random.number()
            }
        })
    )
    console.log(`${(i + 1) * STEPCOUNT} docs inserted`);
}
*/

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
		    parent: {type: Schema.Types.ObjectId, default: null},//[{type: Schema.Types.ObjectId, ref: 'Message'}],
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
		    isfrontpage: {type : Boolean, default: false},
		    hits: Number
		});

module.exports = mongoose.model('messages', messageSchema);