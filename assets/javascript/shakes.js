
// JQuery: Document Ready //
$(document).ready(function () {

 
    // API Calls to https://apilist.fun/api/shakespeare-translation-api
    var userQuote = "You never miss a good thing till it leaves ya.  Finally I realized that I need ya.  I want ya back.  Baby girl I need ya back."
    +"Gotta have ya back, babe.  Heartbroken when you left my world.  Man I wish I woulda kept my girl .  I love you.  I don't know what I'm gon do without my baby."
    var queryURL = "https://api.funtranslations.com/translate/shakespeare.json?text=" + encodeURIComponent(userQuote)

    $.ajax({
        url: queryURL,
        data: {},
        cache: false,
        type: "POST",
        success: function (response) {
            console.log(response, 'response from shakespeare API')
            console.log(response.contents.translated)
        },
        error: function (xhr) {
            console.log(xhr)
        }
    });

//  Storage of Artist and SongName to Firebase
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

  $("#submit").on("click", function(event) {
    event.preventDefault();
     artist = $("#artistName").val().trim();
    song = $("#songName").val().trim();
    likeCount = '#button#';

    console.log(song, 'song sent to db');
    console.log(artist,'artist sent to db');
    console.log(likeCount, 'likeCount sent to db');

    var musicCover = {
        artist:artist,
        song:song,
        likeCount: likeCount
    }
    database.ref().push(musicCover);

    refreshPage();
});

database.ref().on("child_added", function(childSnapshot) {
    var returnArtist = childSnapshot.val().artist;
    var returnSong = childSnapshot.val().song;

    console.log(returnArtist, 'artist returned from db');
    console.log(returnSong, 'song returned from db');
});  

var refreshPage = function(){
    location.reload()
}

});