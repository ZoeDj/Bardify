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
    var resultSorting = {};
    var trendingArray = [];
    /// *** MAIN FUNCTION ***/// called by submit btn eventlistener, and contains a promise to address asyncronous return of API#1
    function lyricRequest(artist, song) {
        //  First API Call to retrieve music lyrics based artist and song parameters
        jQuery.getJSON(
            "https://api.vagalume.com.br/search.php"
            + "?art=" + artist
            + "&mus=" + song
            + "&apikey==8dc59cc7fdedc734247c325ec2ac4b7f",
            function (data) {
                //  JSON object from API call#1
                console.log(data, 'lyric object');  // logs API JSON object from API call#1
                var test = data.mus[0].text;
                var testTrim = test.trim();
                lyricOutput = testTrim.replace(/[\r\n]*/g, "")  // removes returns and output breaks
                console.log(lyricOutput)
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
                        console.log(response, 'shakespeare translation object')  // logs API JSON object from API call#2
                        translated = response.contents.translated
                        console.log(translated)    // logs translation to console //
                        renderScreen2();
                    },
                    error: function (xhr) {
                        // console.log(xhr)
                    }
                });
            });
    };
    //  User Interface -  event listeners,global execution callbacks
    $(".submit").on("click", function (event) {
        event.preventDefault();
        song = $("#songName").val().trim();
        artist = $("#artistName").val().trim();
        likeCount = 1;
        if( $(".input").val() == ""){
            $(".modal").addClass("is-active");
            $(".modal-content").append("<p>Please enter an Artist and Song</p>");
         }
         else{
        //Interaction with Remote Servers & HTML - callback to fire lyricRequest() main function
        console.log(artist, song, 'are key UI parameters for cb function ***')
        lyricRequest(artist, song)  //  This callback fires main function lyricRequest() with two arguments
        logDatabase()  // Interaction with Database
        // location.reload()
         }
    });
    $(document).on("click", ".delete", function(){
        $(".modal").remove();
    })
    $(".random").on("click", function (event) {
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
        if ($(".clear")) { $(".clear").detach(); }
        if ($(".search")) { $(".search").detach(); }
    });
    //Audio playback buttons
    $(document).on("click", ".play", function () {
        responsiveVoice.speak($(".translated-text").text(), "US English Male");
    });
    $(document).on("click", ".pause", function () {
        responsiveVoice.pause();
    });
    $(document).on("click", ".resume", function () {
        responsiveVoice.resume();
    });

    // Database Function  to track trending artists 
    function logDatabase() {
        //  Pull database reference containing all user likes globally (across multiple server/browser interactions)
        var lastEntry = database.ref().orderByChild("dateAdded").limitToLast(1).once('value', function (snap) {
            trendingArray = snap.val()[Object.keys(snap.val())[0]];
            // console.log(trendingArray, 'after db pull');
            var musicObject = {
                artist: artist,
                song: song,
                likeCount: likeCount,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }
            trendingArray.push(musicObject);    //  update array of objects to include current user choice
            database.ref().push(trendingArray);  //  push updated array to realtime DB
            // Iterator (put inside function logDatabase, once lastEntry.val() is pulled)  == could use .reduce() or count the array
            for (var i = 0; i < trendingArray.length; i++) {
                var numHits = trendingArray.reduce((n, CREATOR) => {
                    return n + (CREATOR.artist == trendingArray[i].artist);
                }, 0);
                console.log(trendingArray[i].artist, ': ', numHits, ' hits');
                resultSorting[trendingArray[i].artist] = numHits; //create new object keys  ===>  obj["key3"] = "value3";
            }
            var results = [];
            for (var key in resultSorting) {
                results.push({ name: key, likes: resultSorting[key] });
            };
            // console.log(results, '=== UNSORTED TREND ===');
            // Sort array of trending results
            results.sort(function (a, b) {
                return b.likes - a.likes;
            })
            console.log(results, "=== SORTED TREND ===");
            /// Top 5 trending artist's object.values()
            trendArr2 = Object.values(results);
            console.log(trendArr2[0].name, trendArr2[1].name, trendArr2[2].name, trendArr2[3].name, trendArr2[4].name, 'are the top 5 most clicked names')
            updateTrendPics();
        });
    };
    // Function to render screen 2
    function renderScreen2() {
        $("#one").hide();
        $("#pTrend").before("<div class='lyric-div'><p class ='translated-text'>" + translated + "</p></div>");
        var newDiv  = $("<div class='translated-buttons'></div>")
        $("#pTrend").before(newDiv)
        //Adding playback button
        $(newDiv).append("<button class='button is-rounded has-text-centered play' type='play'>Play</button>");
        $(newDiv).append("<button class='button is-rounded has-text-centered pause' type='pause'>Pause</button>");
        $(newDiv).append("<button class='button is-rounded has-text-centered resume' type='resume'>Resume</button>");
        //
        $(newDiv).append("<button class='button is-rounded has-text-centered search display' type='submit'>Search</button>");
        
        $(".search").on("click", function (event) {
            event.preventDefault();
            $("#artistName").val("");
            $("#songName").val("");
            $(".translated-text").hide();
            $(".translated-text").remove();
            $(".search").detach();
            $(".translated-buttons").hide()
            $("#one").show();
        });
    }
    /// Function to update trending image based upon user clicks
    function updateTrendPics() {
        console.log(trendArr2[0].name, 'should be beyonce')
        if (trendArr2[0].name === 'beyonce') {
            $("#trending-image0").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/beyonce.jpeg");
            });
        }
        else if (trendArr2[0].name === 'lady gaga') {
            $("#trending-image0").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/ladygaga.jpeg");
            });
        }
        else if (trendArr2[0].name === 'imagine dragons') {
            $("#trending-image0").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/id.jpeg");
            });
        }
        else if (trendArr2[0].name === 'ariana grande') {
            $("#trending-image0").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/arianag.jpg");
            });
        }
        else if (trendArr2[0].name === '21 pilots') {
            $("#trending-image0").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/21p.jpeg");
            });
        }
        else if (trendArr2[0].name === 'U2') {
            $("#trending-image0").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/u2.jpeg");
            });
        }
        console.log(trendArr2[1].name, 'should be lady gaga')
        if (trendArr2[1].name === 'beyonce') {
            $("#trending-image1").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/beyonce.jpeg");
            });
        }
        else if (trendArr2[1].name === 'lady gaga') {
            $("#trending-image1").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/ladygaga.jpg");
            });
        }
        else if (trendArr2[1].name === 'imagine dragons') {
            $("#trending-image1").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/id.jpeg");
            });
        }
        else if (trendArr2[1].name === 'ariana grande') {
            $("#trending-image1").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/arianag.jpg");
            });
        }
        else if (trendArr2[1].name === '21 pilots') {
            $("#trending-image1").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/21p.jpeg");
            });
        }
        else if (trendArr2[1].name === 'U2') {
            $("#trending-image1").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/u2.jpeg");
            });
        }
        console.log(trendArr2[2].name, 'should be 21 pilots')
        if (trendArr2[2].name === 'beyonce') {
            $("#trending-image2").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/beyonce.jpeg");
            });
        }
        else if (trendArr2[2].name === 'lady gaga') {
            $("#trending-image2").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/ladygaga.jpg");
            });
        }
        else if (trendArr2[2].name === 'imagine dragons') {
            $("#trending-image2").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/id.jpeg");
            });
        }
        else if (trendArr2[2].name === 'ariana grande') {
            $("#trending-image2").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/arianag.jpg");
            });
        }
        else if (trendArr2[2].name === '21 pilots') {
            $("#trending-image2").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/21p.jpeg");
            });
        }
        else if (trendArr2[2].name === 'U2') {
            $("#trending-image2").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/u2.jpeg");
            });
        }
        console.log(trendArr2[3].name, 'should be U2')
        if (trendArr2[3].name === 'beyonce') {
            $("#trending-image3").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/beyonce.jpeg");
            });
        }
        else if (trendArr2[3].name === 'lady gaga') {
            $("#trending-image3").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/ladygaga.jpg");
            });
        }
        else if (trendArr2[3].name === 'imagine dragons') {
            $("#trending-image3").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/id.jpeg");
            });
        }
        else if (trendArr2[3].name === 'ariana grande') {
            $("#trending-image3").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/arianag.jpg");
            });
        }
        else if (trendArr2[3].name === '21 pilots') {
            $("#trending-image3").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/21p.jpeg");
            });
        }
        else if (trendArr2[3].name === 'U2') {
            $("#trending-image3").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/u2.jpeg");
            });
        }
        console.log(trendArr2[4].name, 'should be beyonce')
        if (trendArr2[4].name === 'beyonce') {
            $("#trending-image4").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/beyonce.jpeg");
            });
        }
        else if (trendArr2[4].name === 'lady gaga') {
            $("#trending-image4").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/ladygaga.jpeg");
            });
        }
        else if (trendArr2[4].name === 'imagine dragons') {
            $("#trending-image4").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/id.jpeg");
            });
        }
        else if (trendArr2[4].name === 'ariana grande') {
            $("#trending-image4").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/arianag.jpg");
            });
        }
        else if (trendArr2[4].name === '21 pilots') {
            $("#trending-image4").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/21p.jpeg");
            });
        }
        else if (trendArr2[4].name === 'U2') {
            $("#trending-image4").fadeOut(function () {
                $(this).load(function () { $(this).fadeIn("slow"); });
                $(this).attr("src", "./assets/images/u2.jpeg");
            });
        }
    }
});