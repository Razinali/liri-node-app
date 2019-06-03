// Welcome to LIRI Bot 

// *** Please install all the required package before starting ***
// *** Follow the README.md for instructions ***

// Global variable declarations

// Allow using keys withouth directly exposing them
require("dotenv").config();

// import API keys
var keys = require("./keys.js");

// File System package
var fs = require('fs');

// Moment package for times
var moment = require('moment');

// Spotify node API package
var Spotify = require('node-spotify-api');
// Set the API keys and Secret message to enable functionality
var spotify = new Spotify(keys.spotify);

// Grab the axios package...
var axios = require("axios");

// For styling
const chalk = require('chalk');
const log = console.log;


// Store all of the arguments in an array
var nodeArgs = process.argv;

// Takes user commands and input
var userInput = nodeArgs[2];
var userQuery = nodeArgs.slice(3).join(" ");

// Line styling
var programOption = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says \n"];
var startString = chalk.blue.bgWhite.bold("\n ********** Extraodinary LIRI found the following for you ********** \n");
var endString = chalk.blue.bgWhite.bold("\n ********** End of search ********** \n");
var errorString = chalk.blue.bgRed.bold("\n ********** Error ********** \n");
var space = "\n*";

//Execute function
userOption(userInput, userQuery);

// Function that writes all the data from output to the logfile
function writeToLog(data) {
    fs.appendFile("log.txt", moment().format("YYYY-MM-DD HH:mm") + '\r\n\r\n', function (error) {
        if (error) {
            return console.log(error);
        }
    });

    fs.appendFile("log.txt", (data), function (error) {
        if (error) {
            return console.log(error);
        }
    });
};

//FUNCTIONS
function userOption(userInput, userQuery) {
    switch (userInput) {
        case 'concert-this':
            showConcertInfo(userQuery);
            break;
        case 'spotify-this-song':
            showSongInfo(userQuery);
            break;
        case 'movie-this':
            showMovieInfo(userQuery);
            break;
        case 'do-what-it-says':
            showSomeInfo();
            break;
        default:
            // console.log(errorString);
            console.table(programOption);
            break;
    }
};

/* ---------------------------------SHOW CONCERT INFO---------------------------------*/
//Funtion for show Concert Info: concert-this

function showConcertInfo(userQuery) {
    // Set the default input to Justin Bieber if the user did not input a band or artist
    if (userQuery === "") {
        userQuery = "Maroon 5";//default concert Justin Bieber.
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + keys.bandCamp.id;
    //console.log(queryUrl);
    // axios AJAx request
    axios.get(queryUrl).then(function (response) {
        var events = response.data;
        if (events.length > 0) {
            // console.log(events);
            // If the request is successful
            writeToLog(startString);
            console.log(startString);

            for (var i = 0; i < events.length; i++) {

                var jsonData = events[i];
                //console.log(i);
                output =
                    space + "Event Venue: " + jsonData.venue.name +
                    space + "Event Location: " + jsonData.venue.city +
                    space + "Event Date: " + moment(jsonData.datetime).format("MM/DD/YYYY HH:mm");

                console.log(output);
                writeToLog(output);
            }
            console.log(endString);
            writeToLog(endString);
        } else {
            console.log('No concerts found.');
            writeToLog('No concerts found.');
        }
    });
};// End concert-this

/* ---------------------------------SPOTIFY---------------------------------*/
//Funtion for Show Song Info: spotify-this-song
function showSongInfo(userQuery) {
    if (userQuery === "") {
        userQuery = "The Sign"; //default Song by Ace of Base.
    }
    spotify.search(
        {
            type: "track",
            query: userQuery,
            limit: 20
        },
        function (error, data) {
            // Attempt to catch and display errors
            if (error) {
                console.log("Error occurred: " + error);
                return;
            }
            else {
                var songs = data.tracks.items;

                console.log(startString);
                writeToLog(startString);

                for (var i = 0; i < songs.length; i++) {

                    output =
                        "\n*  Song Name: " + "'" + songs[i].name.toUpperCase() + "'" +
                        "\n*  Album Name: " + songs[i].album.name +
                        "\n*  Artist Name: " + songs[i].artists[0].name +
                        "\n*  URL: " + songs[i].album.external_urls.spotify;

                    console.log(output);
                    writeToLog(output);
                }
                console.log(endString);
                writeToLog(endString);
            }
        });
};// End Spotify-this-song

/* ---------------------------------OMDB---------------------------------*/
//Funtion for Show Movie Info: movie-this
function showMovieInfo(userQuery) {
    if (userQuery === "") {
        userQuery = "Mr. Nobody"

        writeToLog(startString);
        console.log(startString);

    }
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    writeToLog("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");

    var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&apikey=" + keys.omdb.id;

    axios.get(queryUrl).then(function (response) {
        var movie = response.data;
        // If the request is successful
        if (movie) {
            console.log(startString);
            writeToLog(startString);

            output =
                "\n* Title: " + movie.Title +
                "\n* Release Year: " + movie.Year +
                "\n* Country: " + movie.Country +
                "\n* Language: " + movie.Language +
                "\n* plot: " + movie.Plot +
                "\n* Actors: " + movie.Actors +
                "\n* IMDB Rating: " + movie.Ratings[0].Value +
                "\n* Rotten Tomatoes: " + movie.Ratings[1].Value,

            console.log(output);
            writeToLog(output);

            console.log(endString);
            writeToLog(endString);
        } else {
            console.log('Error occurred.');
            writeToLog('Error occurred.');
        }
    }).catch(function (error) {
        console.log(error);
      });
};// End movie-this

/* ---------------------------------DO WHAT IT SAYS---------------------------------*/
//Funtion for show Some Info:: Do What It Says
function showSomeInfo() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArray = data.split(",");
        //console.log(dataArray);

        userOption(dataArray[0], dataArray[1]);
    });
};//End of Do what it says