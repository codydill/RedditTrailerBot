'use strict';

var snoowrap = require('snoowrap');
var google = require('googleapis');
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

google.options({ auth: config.youtube_key });
var Youtube = google.youtube('v3');

r.getSubreddit(netflix_sub_name).getNew({limit : 25}).then(all => {
    all.forEach(post => {
        post.expandReplies().then(process(post));
    })
});

function process(post){
    if (isValidDomain(post) && !hasTrailer(post)) {
        var title = parseTitle(post.title);
        postTrailerURL(title);
    }
}

function postTrailerURL(title) {
    var search = title + " Trailer";
    Youtube.search.list({
            part : 'snippet',
            q : search},
        function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                var url = "https://www.youtube.com/watch?v=" + res.items[0].id.videoId;
                r.getSubmission('65ls2x').reply("[" + search + "](" + url +")");
            }
        }
    );
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

function parseTitle(str) {
    var start = str.indexOf("]") + 1;
    var end = str.indexOf("(", start);
    if (str.charAt(start) === " ") {
        start++;
    }
    if (str.charAt(end - 1) === " ") {
        end--;
    }
    return str.substring(start, end);
}
