const container = document.querySelector("#container");
const category = document.querySelector("#category");
const group = document.querySelector("#group");
const randCategory = document.querySelector("#randCategory");
const randGroup = document.querySelector("#randGroup");
const groupSelect = document.querySelector("#groupSelect");
const button = document.querySelector("#search");
const randButton = document.querySelector("#randomGen");
const randAmount = document.querySelector("#quantity");
const clearButton = document.querySelector("#clear");
const searching = document.querySelector("#searching");
const favoritesList = document.querySelector("#savedFaves")
const copyButton = document.querySelector("#copy");
let searchResults = [];
let isGenRandom = false;


let smileyGroups = ["body",
    "cat_face",
    "clothing",
    "creature_face",
    "emotion",
    "face_negative",
    "face_neutral",
    "face_positive",
    "face_role",
    "face_sick",
    "family",
    "monkey_face",
    "person",
    "person_activity",
    "person_gesture",
    "person_role"];

let natureGroups = ["animal_amphibian",
    "animal_bird",
    "animal_bug",
    "animal_mammal",
    "animal_marine",
    "animal_reptile",
    "plant_flower",
    "plant_other"];

let foodGroups = ["dishware",
    "drink",
    "food_asian",
    "food_fruit",
    "food_prepared",
    "food_vegetable"];

//request data
function getData(url) {
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

//load data onto the page
function dataLoaded(e) {
    let xhr = e.target;

    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);
    let results = Object.values(obj);

    let string = "";

    if (!isGenRandom) {
        //normal generation
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            let emojiCode = "";

            //some emojis have 2+ html codes
            for (let j = 0; j < result.htmlCode.length; j++) {
                emojiCode += result.htmlCode[j];
            }

            let line = `<div title='${result.name}' class='result'>${emojiCode}</div>`;
            string += line;
        }


        container.innerHTML = string;
    }
    else {
        //if generating random emojis
        let emojiCode = "";

        //some emojis have 2+ html codes
        for (let i = 0; i < obj.htmlCode.length; i++) {
            emojiCode += obj.htmlCode[i];
        }

        let line = `<div title='${obj.name}' class='result'>${emojiCode}</div>`;
        string += line;

        container.innerHTML += string;
    }
    searching.style.display = 'none';
    searchResults = document.querySelectorAll(".result");
    updateResultClicks();
}

//displays error message if an error occurs
function dataError(e) {
    console.log("An error occured");
}

//loads emojis based on category & group selectors
function getEmojis(emojiURL, catElement = category, groupElement = group) {
    let endpoint = "";

    //check which selector to use
    if (catElement.value == "all") { }
    else if (groupElement.value == "none") {
        endpoint += "/category_" + catElement.value;
    }
    else {
        endpoint += "/group_" + groupElement.value;
    }

    emojiURL += endpoint;

    //console.log(emojiURL);

    getData(emojiURL);
}

//insert list elements into group selector
function fillGroupSelect(list, outerElement, select) {
    select.innerHTML = '<option value="none" selected>all</option>';

    let options = ""

    //convert each list item to a select option
    for (let i = 0; i < list.length; i++) {

        let line = `<option value="${list[i]}">${list[i]}</option>`;
        line = line.replaceAll('_', ' ');
        options += line;
    }

    select.innerHTML += options;
    outerElement.style.display = "block";
}

//show groups if the selected category has any
function updateGroups() {

    //reset group html
    group.innerHTML = '<option value="none" selected></option>';
    randGroup.innerHTML = '<option value="none" selected></option>';

    //check for categories with groups
    if (category.value == "smileys_and_people") {
        fillGroupSelect(smileyGroups, groupSelect, group);
    }
    else if (category.value == "animals_and_nature") {
        fillGroupSelect(natureGroups, groupSelect, group);
    }
    else if (category.value == "food_and_drink") {
        fillGroupSelect(foodGroups, groupSelect, group);
    }
    else {
        groupSelect.style.display = "none";
    }

    //check for categories with groups
    if (randCategory.value == "smileys_and_people") {
        fillGroupSelect(smileyGroups, randGroupSelect, randGroup);
    }
    else if (randCategory.value == "animals_and_nature") {
        fillGroupSelect(natureGroups, randGroupSelect, randGroup);
    }
    else if (randCategory.value == "food_and_drink") {
        fillGroupSelect(foodGroups, randGroupSelect, randGroup);
    }
    else {
        randGroupSelect.style.display = "none";
    }
}

//random generation
let randGen = () => {
    searching.style.display = 'block';
    if (!isGenRandom) {
        container.innerHTML = "";
        isGenRandom = true;
    }
    getEmojis("https://emojihub.herokuapp.com/api/random", randCategory, randGroup);
}

//classic generation
let classicGen = () => {
    searching.style.display = 'block';
    isGenRandom = false;
    getEmojis("https://emojihub.herokuapp.com/api/all");
}

//empty container
let clear = () => { container.innerHTML = ""; }

button.onclick = classicGen;
category.onchange = updateGroups;
randCategory.onchange = updateGroups;
randButton.onclick = randGen;
clearButton.onclick = clear;

//favorites system

copyButton.onclick = copyFaves;

//updated whenever new emojis are loaded
function updateResultClicks() {
    for (const element of searchResults) {
        element.onclick = favoriteResult;
    }
}

//add clicked emoji to text box
function favoriteResult(e) {
    favoritesList.value += e.target.innerHTML;
    //record automated change to local storage
    localStorage.setItem(favesKey, favoritesList.value);
}

//copy favorites to clipboard
function copyFaves() {
    favoritesList.select()
    favoritesList.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(favoritesList.value);
}

//set favesKey
const favesKey = "alr8255-faves"

//get any locally stored information
const storedFaves = localStorage.getItem(favesKey);

//check if stored info, if so display it
if (storedFaves) {
    favoritesList.value = storedFaves
}
else {
    favoritesList.value = "";
}

//record any manual changes to element
favoritesList.onchange = e => { localStorage.setItem(favesKey, e.target.value); };