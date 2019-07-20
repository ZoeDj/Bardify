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
                console.log(lyricOutput)
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

    
    lyricRequest("ladygaga", "shallow")  //  This callback fires main function lyricRequest() with two arguments
    
    console.log($("#songName").val().trim(), 'test1')
    console.log($("#artistName").val().trim(), 'test2')
    //  User Interface -  event listeners,global execution callbacks
    $("#submit").on("click", function (event) {
        event.preventDefault();

        song = 'Flawless'    // $("#songName").val().trim();
        artist = 'Beyonce'    //  $("#artistName").val().trim();
        likeCount = 1;

        console.log(song, name, 'test3')
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
});