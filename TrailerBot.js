'use strict';

var snoowrap = require('snoowrap');
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

var r = new snoowrap(CONFIG);
var listing = r.getSubreddit(netflix_sub_name).getNew({limit : 10}).then(all => {
    all.forEach(post => {
        if (isValidDomain(post)) {
            post.expandReplies().then(printValidPost);
        }
    })
});

function parseTitle(title) {

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

function printValidPost(post){
    if (isValidDomain(post) && !hasTrailer(post)) {
        console.log(post.title + " " + post.id);
        for (let comment of post.comments) {
            console.log(comment.author.name);
        }
    }
}
