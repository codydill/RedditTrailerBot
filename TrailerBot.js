'use strict';

var snoowrap = require('snoowrap');
var google = require('googleapis')
var config = require('./config.json');

const CONFIG = {
    client_id : config.client_id,
    client_secret : config.client_secret,
    username : config.username,
    password : config.password,
    user_agent : config.user_agent
};

const netflix_sub_name = 'NetflixBestOf';
const netflix_domain_name = 'netflix.com';
const test_sub_name = 'testingground4bots';

var r = new snoowrap(CONFIG);

google.options({ auth: config.youtube_key });
var Youtube = google.youtube('v3');

Youtube.search.list({
    part : 'snippet',
    q : 'rampart trailer'},
    function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result.items[0].snippet.title, result.items[0].id.videoId)}
    }
);


/*
r.getSubreddit(test_sub_name).getNew({limit : 1}).then(all => {
    all.forEach(post => {
        post.expandReplies().then(process(post));
    })
});
*/


function process(post){
    //if (isValidDomain(post) && !hasTrailer(post)){
    if (true) {
        var title = parseTitle(post.title);
        var url = getTrailerURL(title);
        post.reply("[Trailer](" + url +")");
    }
}

function isValidDomain(post) {
    return post.domain === netflix_domain_name;
}

function hasTrailer(post) {
    for (let comment of post.comments){
        if (comment.author.name === CONFIG.username) {
            return true;
        }
    }
    return false;
}

function parseTitle(title) {
    return title;
}

function getTrailerURL(title) {
    return "https://www.youtube.com/watch?v=-ZUwq1qOqpE";
}

function printValidPost(post){
    if (isValidDomain(post) && !hasTrailer(post)) {
        console.log(post.title + " " + post.id);
        for (let comment of post.comments) {
            console.log(comment.author.name);
        }
    }
}
