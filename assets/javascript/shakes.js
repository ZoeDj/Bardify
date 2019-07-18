
// JQuery: Document Ready //
$(document).ready(function () {

    // API Calls to https://developer.musixmatch.com/documentation/api-methods
    var userQuote = "Usher"
    var apiKey = '542b3f7df8aa942f4d97258ed69c29fd'
    var queryURL = "https://api.funtranslations.com/translate/shakespeare.json?text=" + encodeURIComponent(userQuote)

    $.ajax({
        url: queryURL,
        data: {
            
        },
        cache: false,
        type: "POST",
        success: function (response) {
            console.log(response)
            console.log(response.contents.translated)
        },
        error: function (xhr) {
            console.log(xhr)
        }
    });



    // API Calls to https://apilist.fun/api/shakespeare-translation-api
    var userQuote = "You never miss a good thing till it leaves ya.  Finally I realized that I need ya.  I want ya back.  Baby girl I need ya back."
    +"Gotta have ya back, babe.  Heartbroken when you left my world.  Man I wish I woulda kept my girl .  I love you.  I don't know what I'm gon do without my baby."
    var queryURL = "https://api.funtranslations.com/translate/shakespeare.json?text=" + encodeURIComponent(userQuote)

    $.ajax({
        url: queryURL,
        data: {

        },
        cache: false,
        type: "POST",
        success: function (response) {
            console.log(response)
            console.log(response.contents.translated)
        },
        error: function (xhr) {
            console.log(xhr)
        }
    });


















/// PLAYGROUND MODE -  CODE BELOW IS FOR TEST FUNCTIONALITY  ///

    //     function loadText(){
    //         //Create XHR Obj
    //         var xhr = new XMLHttpRequest();
    //         //Open - type, url/file/src, ASYNC true/false
    //         console.log(xhr);
    //         xhr.open('GET','https://api.funtranslations.com/translate/', true)

    //         // 200 is ok, 403 forbidden, 404 not found
    //         xhr.onload = function(){
    //             if(this.status == 200){
    // console.log(this.responseText)
    //             }
    //         }
    //         xhr.send('testing this string');
    //     }

    // "Notorious BIG": “Though she be but little, she is fierce!”
    // "VarB": “The course of true love never did run smooth” ,
    // "VarC": "Lord, what fools these mortals be!”


    // function getShakes() {
    //     fetch('https://api.funtranslations.com/translate/')
    //         .then(function (response) {
    //             console.log(response.json)
    //             return response.json
    //         })
    // }

    // getShakes();

    // function getMusix() {
    //     fetch('https://api.musixmatch.com/ws/1.1/')
    //         .then(function (response) {
    //             console.log(response.json)
    //             return response.json;
    //         })
    //         .then(function(data){
    //             console.log(data)
    //         })
    // }
    // getMusix();



    // // Create a request variable and assign a new XMLHttpRequest object to it.
    // var request = new XMLHttpRequest()
    // // Open a new connection, using the GET request on the URL endpoint
    // request.open('GET', 'https://api.funtranslations.com/translate/', true)
    // request.onload = function () {
    //     // Begin accessing JSON data here
    // }
    // // Send request
    // request.send()

});