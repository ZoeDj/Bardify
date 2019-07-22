// JQuery: Document Ready //
$(document).ready(function () {

    //  Database Configuration //
    var firebaseConfig = {
        apiKey: "AIzaSyCsMczUUrLbOzNHExrxUMXaJARFdkLldSk",
        authDomain: "shakes-e2b51.firebaseapp.com",
        databaseURL: "https://shakes-e2b51.firebaseio.com",
        projectId: "shakes-e2b51",
        storageBucket: "shakes-e2b51.appspot.com",
        messagingSenderId: "793021669681",
        appId: "1:793021669681:web:873f46e902cad6fc"
      };
    firebase.initializeApp(firebaseConfig);

    // Initial Values //
    var lyricOutput = "";
    var database = firebase.database();
    var artist = '';
    var song = '';
    var likeCount = 0;
    var resultSorting = [];


    /// *** MAIN FUNCTION ***/// called by submit btn eventlistener, and contains a promise to address asyncronous return of API#1
    function lyricRequest(artist, song) {
        //  First API Call to retrieve music lyrics based artist and song parameters
        jQuery.getJSON(
            "https://api.vagalume.com.br/search.php"
            + "?art=" + artist
            + "&mus=" + song
            + "&apikey==8dc59cc7fdedc734247c325ec2ac4b7f",
            function (data) {
                console.log(data, 'lyric object');  // logs API JSON object from API call#1
                var test = data.mus[0].text;
                var testTrim = test.trim();
                lyricOutput = testTrim   //.replace(/[\r\n]*/g, "")  // removes returns and output breaks
            }).then(function shakeTrans() {
                // Second API Call to translate music lyric into Shakespearean English -- Will not execute until first API completes
                var userQuote = lyricOutput.substring(0, 1000);
                var queryURL = "https://api.funtranslations.com/translate/shakespeare.json?text=" + encodeURIComponent(userQuote) + "&api_key=bCjn5kpx1Lialiqvaw_g7QeF"
                $.ajax({
                    url: queryURL,
                    data: {},
                    cache: false,
                    type: "POST",
                    success: function (response) {
                       // console.log(response, 'shakespeare translation object')  // logs API JSON object from API call#2
                        translated = response.contents.translated
                       // console.log(translated)    // logs translation to console //
                        $('#trending').append("<div class = 'lyric'>" + translated + "</div>");
                    },
                    error: function (xhr) {
                        console.log(xhr)
                    }     // 
                });
            });
    };

    //  User Interface -  event listeners,global execution callbacks
    $("#submit").on("click", function (event) {
        event.preventDefault();
        song = $("#songName").val().trim();
        artist = $("#artistName").val().trim();
        likeCount = 1;
        //Interaction with Remote Servers & HTML - callback to fire lyricRequest() main function
        console.log(artist, song, 'are key UI parameters for cb function ***')
        lyricRequest(artist, song)  //  This callback fires main function lyricRequest() with two arguments
        logDatabase()  // Interaction with Database
        // location.reload()
    });

    $("#random").on("click", function (event) {
        event.preventDefault();
        var randomArray = [
            { artist: "Ariana Grande", song: "7 rings" },
            { artist: "Beyonce", song: "Flawless" },
            { artist: "Imagine Dragons", song: "Thunder" },
            { artist: "U2", song: "One" },
            { artist: "Lady Gaga", song: "Shallow" },
            { artist: "21 Pilots", song: "Stressed Out" },
            { artist: "Clash", song: "Should I stay or should I go" },
        ]
        var randomNum = Math.floor(Math.random() * randomArray.length);
        var randomArtist = randomArray[randomNum].artist;
        var randomSong = randomArray[randomNum].song;
        console.log(randomArtist, randomSong, 'are random UI parameters for cb function ***')
        lyricRequest(randomArtist, randomSong)  //  This callback fires main function lyricRequest() with two arguments
    });

    // Database Function  -  Tracks trending artists by creating an object with global user selections and iterating over the array to count repeat occurrences e.g. Ariana Grande 16, Imagine Dragons 12
    function logDatabase() {
        //  Pull database reference containing all user likes globally (across multiple server/browser interactions)
        var lastEntry = database.ref().orderByChild("dateAdded").limitToLast(1).once('value', function (snap) {
            trendingArray = snap.val()[Object.keys(snap.val())[0]];
            console.log(trendingArray, 'after db pull');

        var musicObject = {
            artist: artist,
            song: song,
            likeCount: likeCount,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
        trendingArray.push(musicObject);    //  update array of objects to include current user choice
        database.ref().push(trendingArray);  //  push updated array to realtime DB
        
        
            // Update database tracking array with current user choice 
            // var musicObject = {
            //     artist: artist,
            //     song: song,
            //     likeCount: likeCount,
            //     timestamp: firebase.database.ServerValue.TIMESTAMP
            // }
            // trendingArray.push(musicObject);
            // database.ref().push(trendingArray);
            // Iterator (put inside function logDatabase, once lastEntry.val() is pulled)  == could use .reduce() or count the array
            for (var i = 0; i < trendingArray.length; i++) {
                console.log(trendingArray, "Trending Artist Array")
                // var artistsI = trendingArray[i].artist
                var numHits = trendingArray.reduce((n, CREATOR) => {
                    return n + (CREATOR.artist == trendingArray[i].artist);
                }, 0);
                console.log(trendingArray[i].artist, ': ', numHits, ' hits');
               
                resultSorting.push({ name: trendingArray[i].artist, likes: numHits})
                console.log(resultSorting, 'result Sorting Array***')

                $("#trending-image1").attr("src","./assets/beyonce.jpeg");
                $("#trending-image2").attr("src","./assets/ladygaga.jpeg");
                $("#trending-image3").attr("src","./assets/id.jpeg");
                $("#trending-image4").attr("src","./assets/arianag.jpeg");
                $("#trending-image5").attr("src","./assets/lilnnas.jpeg");

            }
        });
    }


    // var trendingObj = {
    //     "Breaking Benjamin": 5,
    //     "Pink": 9,
    //     "Metallica": 7
    //   }
      
    //   // Convert obj key/value pairs to unsorted array
    //   var results = [];
    //   for (var key in trendingObj) {
    //     results.push({ name: key, likes: trendingObj[key] });
    //   }
      
    //   console.log("--- UNSORTED ---");
    //   console.log(results);
      
    //   // Sort array
    //   results.sort(function (a, b) {
    //     return b.likes - a.likes;
    //   })
      
    //   console.log("--- SORTED ---");
    //   console.log(results);
});










/////  ICE BOX FUNCTIONS ///

// // Database Functions & Listeners
// function logDatabase() {
//     //    var rootRef = firebase.database().ref()
//     //    var refOne = firebase.database("shakes/"+dbArrayRef)
//     //     console.log(database.snapshot.val(), 'snap val');
//     //     console.log(database.child.val(), 'child val');
//     //     console.log(database.snapshot.ref(), 'snap ref');
//     //     console.log(database.child.ref(), 'child ref');
//     var lastEntry = database.ref().orderByChild("dateAdded").limitToLast(1).once('value').then(function () {
//         console.log(lastEntry, 'last Entry ***')
//     });
//     var musicObject = {
//         artist: artist,
//         song: song,
//         likeCount: likeCount,
//         timestamp: firebase.database.ServerValue.TIMESTAMP
//     }
//     trendingArray.push(musicObject);  // Updates trending array with user request artist&song
//     database.ref().push(trendingArray);  // Updates database with the new array
//     // database.ref().push(musicObject);  // Code for the push to firebase database
//     //  after each user submits artist choice, store the trending array to the database; then, with each UI app instance set the initial value equal to the database stored value.
//     // lastly iterate over the array and count each repeat occurrences to create a trending variable for each artist //


// // Iterator (put inside function logDatabase, once lastEntry.val() is pulled)  == could use .reduce() or count the array
// for (var i=0; 0<trendingArray.length;i++){
//     console.log(trendingArray, "Trending Artist Array")
//     var artistsI = trendingArray.artist[i]
//     var numHits = trendingArray.reduce(function (n, artist) {
//         return n + (trendingArray.artist == trendingArray.artist[i]);
//     }, 0);
//     console.log(artistI, ': ',numHits, ' hits');
// }
// }

// function count() {
//     array_elements = ["a", "b", "c", "d", "e", "a", "b", "c", "f", "g", "h", "h", "h", "e", "a"];

//     trendingArray.sort();

//     var current = null;
//     var count = 0;
//     for (var i = 0; i < trendingArray.length; i++) {
//         if (trendingArray[i] != current) {
//             if (count > 0) {
//                 console.log(current + ' comes --> ' + count + ' times<br>');
//             }
//             current = array_elements[i];
//             count = 1;
//         } else {
//             cnt++;
//         }
//     }
//     if (count > 0) {
//         document.write(current + ' comes --> ' + cnt + ' times');
//     }

// }

// var counts = {};
// trendingArray.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
// console.log(counts, 'Counts *******');