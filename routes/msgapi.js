var Messages = require('../models/messages.js');
var mongoose = require('mongoose');

/*
 * Serve JSON to our AngularJS client
 */

// get all messages
exports.getall = function(req, res) {

        var promise = Messages.find({isparent:true}).exec() //only parent messages, no comments

        promise.then(function(messages) {
			res.json(messages);
        })
        .catch(function(err){
            res.send(err);
        })
    }

// get a single message
exports.single = function(req, res) {
    //console.log(req.params.entity);
    if(req.params.entity=='message') {
        var promise = Messages.findById(req.params.id).exec() //only parent messages, no comments
    }
    if(req.params.entity=='comment') {
        var promise = Messages.findOne({'childs._id':req.params.id}).exec() //only parent messages, no comments
    }
        promise.then(function(message) {
			(req.params.entity=='message') ? res.json(message) : res.json(message.childs.id(req.params.id));
            //console.log(message);
        })
        .catch(function(err){
            res.send(err);
        })
}

exports.search = function(req, res) {
    //console.log(req.body.searchvalue);
    var promise = Messages.find({$or:[
        {body:new RegExp(req.body.searchvalue, "i")},
        {title:new RegExp(req.body.searchvalue, "i")}
        ]}).limit(10).sort({hits:-1}).exec();
    
    promise.then(function(messages) {
        //console.log(messages.length);
        res.json(messages);
    })
    .catch(function(err){
          res.send(err);
    });
}

// create messages and send back all messages after creation
exports.postmessage = function(req, res) {

    //create a messages, information comes from AJAX request from Angular
    Messages.create({
    	title: 		req.body.title,
    	body: 		req.body.body,
    	author: 	req.body.author,
    	isparent: 	true,
    	isfactory: 	false,
    	iscomment: 	false
    }, function(err, messages) {
        if (err)
            res.send(err);

        // get and return all the messages after you create another
        Messages.find({isparent:true},function(err, messages) {
            if (err)
                res.send(err)
            res.json(messages);
        });
    });
}

// update a message
exports.updatemessage = function(req, res) {

    var promise = Messages.findById(req.params.id).exec()
	//console.log(req.body);
	promise.then(function(message){

    	message.title			= 		req.body.title;
		message.body			= 		req.body.body;
		message.author			= 		req.body.author;
		// message.creationdate	= 		req.body.creationdate;
		message.lastupdate		= 		req.body.lastupdate;
		// message.isparent		= 		req.body.isparent;
		// message.parent			= 		req.body.parent;
		// message.childs			= 		req.body.childs;
		// message.tags			= 		req.body.tags;
		// message.isfactory		= 		req.body.isfactory;
		// message.iscomment		= 		req.body.iscomment;
		// message.hits			= 		req.body.hits;

    	return message.save();
    })
    .then(function(message){
    	console.log('updated!');
		res.json(message);

    })
    .catch(function(err){
        res.send(err)
    });

}

// delete a message
exports.deletemessage = function(req, res) {
    Messages.remove({
        _id : req.params.id
    }, function(err, messages) {
        if (err)
            res.send(err);

        // get and return all the messages after you create another
        Messages.find({isparent:true},function(err, messages) {
            if (err)
                res.send(err)
            res.json(messages);
        });
    });
}

// add a comment
exports.postcomment = function(req, res) {
        var promise = Messages.findOneAndUpdate({'_id':req.params.id},
        	{$push: {"childs": {
        		title: 		req.body.title,
        		body: 		req.body.body,
        		author: 	req.body.author,
        		isparent: 	false,
        		//parent: 	toObject(req.params.id),
        		iscomment: 	true,
      			isfactory: 	false,
        	}}},
        	{safe: true, upsert: true, new: true}
        ).exec()

        promise.then(function(comments) {
            // return all messages or just one?
        	Messages.find({isparent:true},function(err, messages) {
        		if (err) res.send(err)
				res.json(messages);
			});
        })
        .catch(function(err){
            res.send(err);
        })
    }

// delete a comment
exports.deletecomment = function(req, res) {

    var promise = Messages.findOne({'childs._id':req.params.id}).exec()
	
	promise.then(function(comment){
    	comment.childs.id(req.params.id).remove();
    	return comment.save();
    })
    .then(function(comment){
    	Messages.find({isparent:true},function(err, messages) {
    		if (err)
            	res.send(err)
			res.json(messages);
        });
    })
    .catch(function(err){
        res.send(err)
    });
}

// add a comment
exports.postcommentsingle = function(req, res) {
        var promise = Messages.findOneAndUpdate({'_id':req.params.id},
            {$push: {"childs": {
                title:      req.body.title,
                body:       req.body.body,
                author:     req.body.author,
                isparent:   false,
                //parent:   toObject(req.params.id),
                iscomment:  true,
                isfactory:  false,
            }}},
            {safe: true, upsert: true, new: true}
        ).exec()

        promise.then(function(comments) {
            // return all messages or just one?
            Messages.findById({'_id':req.params.id},function(err, message) {
                if (err) res.send(err)
                res.json(message);
            });
        })
        .catch(function(err){
            res.send(err);
        })
    }

// delete a comment
exports.deletecommentsingle = function(req, res) {

    var promise = Messages.findOne({'childs._id':req.params.id}).exec()
    
    promise.then(function(comment){
        comment.childs.id(req.params.id).remove();
        return comment.save();
    })
    .then(function(comment){
        console.log(comment);
        Messages.findById({'_id':comment._id},function(err, message) {
            if (err)
                res.send(err)
            res.json(message);
        });
    })
    .catch(function(err){
        res.send(err)
    });
}

// update a message
exports.updatecomment = function(req, res) {

    var promise = Messages.findOne({'childs._id':req.params.id}).exec()
    //console.log(req.body);
    promise.then(function(comment){

        comment.childs.id(req.params.id).title           =       req.body.title;
        comment.childs.id(req.params.id).body            =       req.body.body;
        comment.childs.id(req.params.id).author          =       req.body.author;
        // comment.childs.id(req.params.id).creationdate    =       req.body.creationdate;
        // comment.childs.id(req.params.id).lastupdate      =       req.body.lastupdate;
        // comment.childs.id(req.params.id).isparent        =       req.body.isparent;
        // comment.childs.id(req.params.id).parent          =       req.body.parent;
        // comment.childs.id(req.params.id).childs          =       req.body.childs;
        // comment.childs.id(req.params.id).tags            =       req.body.tags;
        // comment.childs.id(req.params.id).isfactory       =       req.body.isfactory;
        // comment.childs.id(req.params.id).iscomment       =       req.body.iscomment;
        // comment.childs.id(req.params.id).hits            =       req.body.hits;

        return comment.save();
    })
    .then(function(comment){
            res.json(comment.childs.id(req.params.id));
    })
    .catch(function(err){
        res.send(err)
    });

}