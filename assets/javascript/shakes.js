// JQuery: Document Ready //
$(document).ready(function () {



    //Database Set Up - ICEBOX FEATURE  //  Storage of Artist and SongName to Firebase  //
    var firebaseConfig = {
        apiKey: "AIzaSyCsMczUUrLbOzNHExrxUMXaJARFdkLldSk",
        authDomain: "shakes-e2b51.firebaseapp.com",
        databaseURL: "https://shakes-e2b51.firebaseio.com",
        projectId: "shakes-e2b51",
        storageBucket: "",
        messagingSenderId: "793021669681",
        appId: "1:793021669681:web:873f46e902cad6fc"
        };
    firebase.initializeApp(firebaseConfig);

    // Initial Values //
        var lyricOutput = "";
        var database = firebase.database();
        // var trendingDatabase = firebase.database("/trending")
        var artist = '';
        var song = '';
        var likeCount = 0;

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
                lyricOutput = testTrim.replace(/[\r\n]*/g, "")  // removes returns and output breaks
            }).then(function () {
                // Second API Call to translate music lyric into Shakespearean English -- Will not execute until first API completes
                var userQuote = lyricOutput.substring(0, 1000);
                var queryURL = "https://api.funtranslations.com/translate/shakespeare.json?text=" + encodeURIComponent(userQuote) + "&api_key=bCjn5kpx1Lialiqvaw_g7QeF"
                $.ajax({
                    url: queryURL,
                    data: {},
                    cache: false,
                    type: "POST",
                    success: function (response) {
                        console.log(response, 'shakespeare translation object')  // logs API JSON object from API call#2
                        translated = response.contents.translated
                        console.log(translated)    // logs translation to console //
                        $('#trending').append("<div class = 'lyric'>" + translated + "</div>");
                    },
                    error: function (xhr) {
                        console.log(xhr)
                    }
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
        // Interaction with Database
        var musicObject = {
            artist: artist,
            song: song,
            likeCount: likeCount,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
        // Code for the push to firebase database
        database.ref().push(
            musicObject
        );
        location.reload()
    });


    // Database Interface - Returns new logged instance and future likeCount increment
    database.ref().on("child_added", function (childSnapshot) {
        var returnArtist = childSnapshot.val().artist;
        var returnSong = childSnapshot.val().song;

        // console.log(returnArtist, 'artist returned from db');
        // console.log(returnSong, 'song returned from db');
    });

//  ICEBOX LIKECOUNTER - using firebase transaction function  (https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction)
    $("#random").on("click", function (event) {
        event.preventDefault();
    // Increment likeCount ref by 1.
    var likeCountRef = firebase.database().ref('likeCounter');
    likeCountRef.transaction(function(currentRank) {
      // If likeCounthas never been set, currentRank will be `null`.
      return currentRank + 1;
      console.log(currentRank);
    });
        });

});



// // JavaScript  --   function   speak(String text, [String voice], [Object parameters])
// <script src="https://code.responsivevoice.org/responsivevoice.js?key=YOUR_UNIQUE_KEY"></script>
// 1
// <script src="https://code.responsivevoice.org/responsivevoice.js?key=YOUR_UNIQUE_KEY"></script>

// LikeCounter in RT database --  

// function toggleStar(postRef, uid) {
//     postRef.transaction(function(post) {
//       if (post) {
//         if (post.stars && post.stars[uid]) {
//           post.starCount--;
//           post.stars[uid] = null;
//         } else {
//           post.starCount++;
//           if (!post.stars) {
//             post.stars = {};
//           }
//           post.stars[uid] = true;
//         }
//       }
//       return post;
//     });
