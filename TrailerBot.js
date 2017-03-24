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
r.getSubreddit(netflix_sub_name).getNew().map(post => post.title).then(console.log);
