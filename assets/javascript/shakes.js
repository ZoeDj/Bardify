
// JQuery: Document Ready //
$(document).ready(function () {

    // Arrays & Objects  //
    var addButtonHtml = '';
    var addResultHtml = '';
    var gif = '';
    var animalRequested = '';
   

    // Original animal array
    var gifArray = ['dog', 'cat', 'rabbit', 'hamster','skunk','goldfish','bird','emu','turtle','ferret']
    console.log(gifArray);

    // Function to create new buttons and result div ids based upon UI request
    var gifButtonCreator = function (Array) {
        $("#gif-buttons").empty();
        var i = 0;
        do {
            addButtonHtml = $("<button>")
            addButtonHtml.addClass('gif-btn')
            addButtonHtml.attr('data-name', Array[i])
            addButtonHtml.text(Array[i])
            $('#gif-buttons').append(addButtonHtml);
            i += 1;
        } while (i < Array.length);
    }
   

/// Global Execution Context: Call-Back Queue  -- on.click, cbs etc.  ///
    
    // Event Handler for New Buttons  // includes cb to regenerate button array i.e.gifButtonCreator()
    $("#add-gif").on("click", function (event) {
        event.preventDefault();
        gif = $("#gif-input").val().trim();
        gifArray.push(gif);
        gifButtonCreator(gifArray);
    });
       
    //Event Handler for when user clicks on gif-buttons
    $(document).on("click",".gif-btn", function (){
        $('#gif-results').empty();
        animalRequested = this.getAttribute('data-name')
        displayGif(animalRequested);

        console.log('Value of this is:', this)
        console.log('Animal Requested is: ', $(this).attr('data-name'))
    });

    //Callback function which runs API call and returns gif images of user selected topic
    var displayGif = function (userinput) {
       
    // AJAX Call with dynamically adjusted URL
    var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=zcP1F5F0fNZJpqmOw2vCH5FltJcFpTGv&q=' + userinput + '&limit=10&offset=0&rating=PG-13&lang=en';
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response)
      
      for (let i = 0; i < response.data.length; i++) {
        var animationUrl = response.data[i].images.downsized.url;
        console.log(animationUrl)
        var staticUrl = response.data[i].images.original_still.url;
        var rating = response.data[i].rating.toUpperCase();
        $('#gif-results').append(
        '<div>Rating: '+rating+'</div> <img id = "'+i+'" class="dynamicGIF" src="'+animationUrl+'" alt="#" data-still = "'+staticUrl+'" data-animate = "'+animationUrl+'">'
        );
       
        // Rating Key Check:  console.log(response.data[i].rating, 'is the rating');  
        
      }    
    });
    }
    // Call gifButtonCreator
    gifButtonCreator(gifArray)

    //  Reanimation Handler
    $(document).on("click",'.dynamicGIF', function (){
        var state = $(this).attr("data-state");  
        
        var imageNumSelected = $(this).attr('id').parseInt;  // a number that maps to the id='i' of the image selected
        
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
          } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
          }
        
    });

});