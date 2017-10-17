var Messages = require('../models/messages.js');
var mongoose = require('mongoose');

/*
 * Serve JSON to our AngularJS client
 */

// get all messages
exports.getall = function(req, res) {
        //console.log(req.params.page);
        //console.log(req.params.limit);
        var promise = Messages.paginate({isparent:true},{page:Number(req.params.page)+1,limit:Number(req.params.limit)}) //only parent messages, no comments

        promise.then(function(messages) {
          //console.log(messages);
			    res.json(messages);
        })
        .catch(function(err){
          res.send(err);
        })
    }

// get a single message
exports.single = function(req, res) {
    if(req.params.entity=='message') {
        // now increments hits everytime, need to figure this out!
        var promise = Messages.findByIdAndUpdate({'_id': req.params.id},{$inc: {'hits':1}}).exec() //only parent messages, no comments
    }
    if(req.params.entity=='comment') {
        //Messages.findByIdAndUpdate({'_id': req.params.id},{$inc: {'hits':1}});
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
    // var promise = Messages.find({$or:[
    //     {body:new RegExp(req.body.value.$modelValue, "i")},
    //     {title:new RegExp(req.body.value.$modelValue, "i")}
    //     ]}).limit(10).sort({hits:-1}).exec();
    var promise = Messages.paginate(
      {$or:[
        {body:new RegExp(req.body.value.$modelValue, "i")},
        {title:new RegExp(req.body.value.$modelValue, "i")}
      ]
      //,sort:{'hits':-1}
      }
      ,{page:Number(req.params.page)+1,limit:Number(req.params.limit)}
    )

    promise.then(function(messages) {
        console.log(messages.docs.length);
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
    	title: 		req.body.title.$modelValue,
    	body: 		req.body.body.$modelValue,
    	author: 	req.body.author.$modelValue,
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
	console.log(req.body);
	promise.then(function(message){

    	message.title			= 		req.body.title.$modelValue;
		message.body			= 		req.body.body.$modelValue;
		message.author			= 		req.body.author.$modelValue;
		message.creationdate	= 		message.creationdate;
		message.lastupdate		= 		new Date();
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
        		parent:     req.params.id,
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
    promise.then(function(comment){

        comment.childs.id(req.params.id).title           =       req.body.title.$modelValue;
        comment.childs.id(req.params.id).body            =       req.body.body.$modelValue;
        comment.childs.id(req.params.id).author          =       req.body.author.$modelValue;
        comment.childs.id(req.params.id).creationdate    =       comment.childs.id(req.params.id).creationdate;
        comment.childs.id(req.params.id).lastupdate      =       new Date();
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

exports.frontpage = function(req, res) {

        var promise = Messages.find({isfrontpage:true}).limit(3).sort({datecreated:-1}).exec() //only parent messages, no comments

        promise.then(function(messages) {
            res.json(messages);
        })
        .catch(function(err){
            res.send(err);
        })
    }
