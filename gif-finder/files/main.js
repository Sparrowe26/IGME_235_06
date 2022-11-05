// 1
window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //Public API key
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    //build url string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //parse the user entered search string
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //trim the search term
    term = term.trim();

    //encode spaces/special characters
    term = encodeURIComponent(term);

    //if no search term, bail out of the function
    if (term.length < 1){return;}

    //append search term to the url
    url += "&q=" + term;

    //apply search limit
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    //update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    //see what url looks like
    console.log(url);

    //request data
    getData(url);
}

function getData(url){
    //create new xhr object
    let xhr = new XMLHttpRequest();

    //when data successfully loads
    xhr.onload = dataLoaded;

    //when an error occurs
    xhr.onerror = dataError;

    //open connection & send request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e){
    //when data loads, get ref back to the xhr object
    let xhr = e.target;

    //display JSON file
    console.log(xhr.responseText);

    //turn data into parsable JS object
    let obj = JSON.parse(xhr.responseText);

    //if no valid results
    if (!obj.data || obj.data.length ==0){
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'<b>";
        return; //bail out
    }

    //build string for valid results
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    //loop through results array
    for (let i=0; i < results.length; i++){
        let result = results[i];

        //get url to gif
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) {smallURL = "images/no-image-found.png";}

        //get url to giphy page
        let url = result.url;

        //build a div to hold each result
        let line = `<div class='result'><img src='${smallURL}' title='${result.id}'/>`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a><p id="rating">Rating = ${result.rating}</p></span></div>`

        //add the div to the big string and loop
        bigString += line;
    }

    //all done building HTML => show it to the user
    document.querySelector("#content").innerHTML = bigString;

    //update status
    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e){
    //display error message
    console.log("An error occured");
}
