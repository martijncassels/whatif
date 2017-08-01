var Profiles = require('../models/profiles.js');
var mongoose = require('mongoose');

/*
 * Serve JSON to our AngularJS client
 */

exports.getall = function(req, res) {

        var promise = Profiles.find().exec() 

        promise.then(function(profiles) {
            res.json(profiles);
        })
        .catch(function(err){
            res.send(err);
        })
    }

// get a single profiles
exports.single = function(req, res) {

        var promise = Profiles.findById(req.params.id).exec() //only parent messages, no comments

        promise.then(function(profile) {
            res.json(profile);
            //console.log(profile);
        })
        .catch(function(err){
            res.send(err);
        })
    }

// create profiles and send back all profiles after creation
exports.postprofile = function(req, res) {

    //create a profiles, information comes from AJAX request from Angular
    Profiles.create({
        username:      req.body.username.$modelValue,
        firstname:       req.body.firstname.$modelValue,
        lastname:     req.body.lastname.$modelValue
        // isparent:   true,
        // isfactory:  false,
        // iscomment:  false
    }, function(err, profiles) {
        if (err)
            res.send(err);

        // get and return all the messages after you create another
        Profiles.find({},function(err, profiles) {
            if (err)
                res.send(err)
            res.json(profiles);
        });
    });
}

// update a message
exports.updateprofile = function(req, res) {

    var promise = Profiles.findById(req.params.id).exec()
    //console.log(req.body);
    promise.then(function(profile){

        profile.username           =       req.body.username.$modelValue;
        profile.firstname            =       req.body.firstname.$modelValue;
        profile.lastname          =       req.body.lastname.$modelValue;
        // profile.creationdate    =       req.body.creationdate.$modelValue;
        //profile.lastupdate      =       req.body.lastupdate.$modelValue;
        profile.skills[0].value        =       req.body.skill1.$modelValue;
        profile.skills[1].value        =       req.body.skill2.$modelValue;
        profile.skills[2].value        =       req.body.skill3.$modelValue;
        profile.skills[3].value        =       req.body.skill4.$modelValue;
        profile.skills[4].value        =       req.body.skill5.$modelValue;
        // profile.parent          =       req.body.parent.$modelValue;
        // profile.childs          =       req.body.childs.$modelValue;
        // profile.tags            =       req.body.tags.$modelValue;
        // profile.isfactory       =       req.body.isfactory.$modelValue;
        // profile.iscomment       =       req.body.iscomment.$modelValue;
        // profile.hits            =       req.body.hits.$modelValue;

        return profile.save();
    })
    .then(function(profile){
        res.json(profile);
    })
    .catch(function(err){
        res.send(err)
    });

}

// delete a message
exports.deleteprofile = function(req, res) {
    Profiles.remove({
        _id : req.params.id
    }, function(err, profiles) {
        if (err)
            res.send(err);

        // get and return all the profiles after you create another
        Profiles.find({},function(err, profiles) {
            if (err)
                res.send(err)
            res.json(profiles);
        });
    });
}

exports.members = function(req, res) {

        var promise = Profiles.find({$or:[
        {username:new RegExp(req.params.val, "i")},
        {firstname:new RegExp(req.params.val, "i")},
        {lastnamename:new RegExp(req.params.val, "i")}
        ]}).select('username').exec() 

        promise.then(function(profiles) {
            res.json(profiles);
        })
        .catch(function(err){
            res.send(err);
        })
    }