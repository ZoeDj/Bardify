This is a page that mixes modern lyricism with old.  We take input from the user in the form of an artist and song, and run it through an api that generates the lyrics the the given song. After, we run that return through another api that will translate the lyrics to Shakespearean English, and then display them to the user. For added entertainment, and a bit of a hook, we run the translated lyrics through another api that preforms text to speech-- in hopes to give you a funny sounding version of the song you chose. 

Key Functionality


~  Lyric API interlinked with Shakespearan translator API brought to user via text to speech JQuery calls
~  Bulma front end generating sleek user interface
~  Compartmentalized code with specific function calls clearly defined by purpose.  
~  Intermediate techniques used to iterate over user data stored real time in Firebase and managed as an array of objects
~  Mobile first design for user display


Back End Highlights


~  Main function ~ Returns string from API-1 which is passed as a query parameter into API-2.  This function acts as callback for user random and specific query inputs.

~  Event Handlers ~ Audio request event handler.  Search, random, play/pause button click handlers.  

~  Database function ~ logDatabase function maintains an array of user data (name, song, likeCount, timestamp) which is tracked for all global users, and used to create a top-5 list for users.  Persistence of user preference data with anonymity of user maintained.

~ Iterator functions ~ used within trend image tracking to iterate user data and sort results by artist, songs etc.

~ RenderScreen function ~ Dynamically generated user displays throughout the website.  Designed to be mobile first with a clean landing page and stack trending sections, detail screens based upon user selections.


Front End Highlights


 ~  Stylish Landing Page ~ Allows the user to select their favorite artist and song.  BULMA BULMA BULMA!!!

 ~ Transition to Display Pages ~  Dynamically generated pages with smooth transitions to different sections of the website

 ~ Lyric Translation ~ Written lyrics are translated into Shakespearean equivalent text

 ~ Text to Speech ~ Audio translation into Olde English is performed for amusement

 ~  Trending Images ~ Trending images are tracked via user clicks stored in backend database.  Provides the user with information on what like-minded 17th century audiophiles are enjoying.
