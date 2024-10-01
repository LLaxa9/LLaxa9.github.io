
let ribbonsAnon = function ribbons() {
    //determine how many 70 px ribbons fit in the viewport, 
    //min (width of the viewport, ) 
    let vw = 
        Math.min(//cap nr of ribbons to 15-1
            Math.floor(//integer number of 70px ribbons that fit in the viewport
                Math.max(//max viewport value
                    document.documentElement.clientWidth || 0, window.innerWidth || 0)
                /70),
            14
        );


    let divRibbons = document.getElementById("ribbons");
    //clear any previous image content
    divRibbons.innerHTML = "";
    // frameLeft=document.createElement("div"); 
    // frameLeft.id="frame_left"   
    // divRibbons.append(frameLeft);
    //generate max (15-1) image html elements to populate ribbons 
    let imgI=document.createElement("img");
    for (let i=0; i<=vw ; i++){
        let imgI = document.createElement("img");
        imgI.src="/sprite/h" +i+".JPG";
        //fancy-border-radius
        //https://9elements.github.io/fancy-border-radius/ 
        //random Border points
        let topBp= Math.floor(Math.random() * 100) + 1;
        let rightBp= Math.floor(Math.random() * 100) + 1;
        let bottomBp= Math.floor(Math.random() * 100) + 1;
        let leftBp= Math.floor(Math.random() * 100) + 1;

        //CSS border-radius= "
        // topBp% 100-topBp% 
        // bottomBp% 100-bottomBp% / 
        // leftBp% 
        //rightBp% 100-rightBp% 
        // 100-leftBp%  "
        imgI.style.borderWidth="2px";
        imgI.style.borderStyle= "outset";
        imgI.style.borderRadius= ""+topBp+"%"+(100-topBp)+"%"+
            +bottomBp+"%"+(100-bottomBp)+"%/"+
            +leftBp+"%"+ 
            +rightBp+"%"+(100-rightBp)+"%"+
            +(100-leftBp)+"%";
        divRibbons.append(imgI);
    }
};

// window.onload = (ribbonsAnon);
window.onresize = (ribbonsAnon);



filterSelection("all")
function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("column");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
    }
}

function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);     
        }
    }
    element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
function classActive(){
    var btnContainer = document.getElementById("myBtnContainer");
    var btns = btnContainer.getElementsByClassName("btn");
    btns[2].click();
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function(){
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
}
// window.onload = (classActive);

function navbuttons(){
    var navbuttons = document.getElementsByClassName("navbutton");
    for (let i=0; i < navbuttons.length; i++){
        navbuttons[i].style.backgroundImage = "url(\"/sprite/n"+i+".JPG\")";
    }
}

window.onload =function (){
    ribbonsAnon();
    classActive();
    navbuttons();
}


//Europeana API
const searchEuropeanaRecords = async () => {
    const apiKey = "suckshusen";
    const searchQuery = document.getElementById("searchQuery").value;

    // this is the API URL for searching Europeana records
    const url = new URL("https://api.europeana.eu/record/search.json");
    url.search = new URLSearchParams({
        // this is your API key
        wskey: apiKey,
        // this is what you are looking for
        query: searchQuery,
        // let's make sure we always get previews
        thumbnail: "true",
        // this is the maximum number of results
        rows: 5,
        // randomise the results!
        sort: "random",
        // we don't want much information here, so let's keep it minimal
        profile: "minimal"
    }).toString();

    const response = await fetch(url);
    const json = await response.json();
    return json;
};

const showResults = (searchResults) => {
    const resultsCountElement = document.getElementById("resultsCount");
    resultsCountElement.textContent = searchResults.totalResults;

    const previewsContainer = document.getElementById("previewsContainer");
    previewsContainer.innerHTML = "";
    for (const item of searchResults.items || []) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card", "m-3");
        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", item.edmPreview);
        imgElement.setAttribute("alt", item.title?.[0]);
        imgElement.classList.add("card-img-top");
        cardElement.appendChild(imgElement);
        const cardBodyElement = document.createElement("div");
        cardBodyElement.classList.add("card-body");
        const cardTitleElement = document.createElement("strong");
        cardTitleElement.classList.add("card-title");
        cardTitleElement.textContent = item.title?.[0];
        cardBodyElement.appendChild(cardTitleElement);
        cardElement.appendChild(cardBodyElement);
        previewsContainer.appendChild(cardElement);
        }

const resultsContainer = document.getElementById("resultsContainer");
resultsContainer.classList.remove("invisible");
};

const handleSubmitSearch = async (event) => {
event.preventDefault();
const searchResults = await searchEuropeanaRecords();
showResults(searchResults);
};

document.getElementById("search")
document.addEventListener("submit", handleSubmitSearch);