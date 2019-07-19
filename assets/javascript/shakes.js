// JQuery: Document Ready //
$(document).ready(function () {

    // Global Variable -  Initial Values //
    var lyricOutput = "";

    function lyricRequest(artist, song){
        //  API Call to Vagalume.com --  returns lyrics string 
        jQuery.getJSON(
            "https://api.vagalume.com.br/search.php"
            + "?art=" + artist
            + "&mus=" + song
            + "&apikey==8dc59cc7fdedc734247c325ec2ac4b7f",

            function (data) {
                console.log(data);

                var test = data.mus[0].text
                var testTrim = test.trim()
                console.log(typeof testTrim, 'should be string');
                $('#trending').append("<div class = 'lyric'>" + testTrim + "</div>");
                lyricOutput = testTrim.replace(/[\r\n]*/g, "")
                console.log(lyricOutput, 'wow w o returns')

                console.log(lyricOutput, 'lyric Output is a string!');
            }).then(function () {
        // API Calls to https://apilist.fun/api/shakespeare-translation-api
        var userQuote =    ""// lyricOutput.substring(0, 50);
        var queryURL = "https://api.funtranslations.com/translate/shakespeare.json?text=" + encodeURIComponent(userQuote)
        console.log(userQuote);
        $.ajax({
            url: queryURL,
            data: {},
            cache: false,
            type: "POST",
            success: function (response) {
                console.log(response, 'shaspeare json')
                console.log(response.contents.translated, 'response from shakespeare API')
            },
            error: function (xhr) {
                console.log(xhr)
                }
        });
    });
    };

  //  Function Calls

  lyricRequest("Beyonce", "Flawless");





    //DATABASE ICEBOX FEATURE  //  Storage of Artist and SongName to Firebase  //
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
    var database = firebase.database();
    var artist = '';
    var song = '';
    var likeCount = 0;

    $("#submit").on("click", function (event) {
        event.preventDefault();
        artist = $("#artistName").val().trim();
        song = $("#songName").val().trim();
        likeCount = '#button#';

        // console.log(song, 'song sent to db');
        // console.log(artist, 'artist sent to db');
        // console.log(likeCount, 'likeCount sent to db');

        var musicCover = {
            artist: artist,
            song: song,
            likeCount: likeCount
        }
        database.ref().push(musicCover);

        refreshPage();
    });

    database.ref().on("child_added", function (childSnapshot) {
        var returnArtist = childSnapshot.val().artist;
        var returnSong = childSnapshot.val().song;

        // console.log(returnArtist, 'artist returned from db');
        // console.log(returnSong, 'song returned from db');
    });

    var refreshPage = function () {
        location.reload()
    }


});















//   // API Calls to https://musicbrainz.org/doc/Cover_Art_Archive/API
//   var queryURL4 = " https://musicbrainz.org/ws/2/artist/3414d446-735a-443c-931f-10634f57e5b9"
//   var queryURL = "http://coverartarchive.org/release/76df3287-6cda-33eb-8e9a-044b5e15ffdd"
//     var queryURL2 = "http://musicbrainz.org/ws/2/artist/?query=artist:usher%20AND%20country:US"
//   $.ajax({
//       url: queryURL4,
//       dataType: "json",
//       data: {},
//       cache: false,
//       type: "GET",
//       contentType: "application/json",
//       success: function (response) {
//           console.log(response, 'response from covers API')

//       },
//       error: function (xhr) {
//           console.log(xhr)
//       }
//   });




  // API Calls to https://musicbrainz.org/doc/Cover_Art_Archive/API
  //  Queen -- http://musicbrainz.org/artist/0383dadf-2a4e-4d10-a46a-e9e041da8eb3
  // Usher --  http://musicbrainz.org/artist/3414d446-735a-443c-931f-10634f57e5b9

//   var queryURL3 = "http://musicbrainz.org/ws/2/artist/?query=artist:usher%20AND%20country:US"
//   $.ajax({
//       url: queryURL3,
//       dataType: "json",
//       data: {},
//       cache: false,
//       type: "GET",
//       contentType: "application/json",
//       success: function (response) {
//           console.log(response, 'response from covers API')


//       },
//       error: function (xhr) {
//           console.log(xhr)
//       }
//   });

  // var length = 30;
    // var myString = lyricOutput;
    // var myTruncatedString = myString.substring(0, length);
    // console.log(myTruncatedString);
