//url authentication details
var df = "1675110437455"; // --ts variable to send for the api call
var publicKey = "c708d8cd0a981a3da8b01ac85130c955";
var privateKey = "your-private-key";
var checksum = "2c485f75671c667ae8f9400c15bad960"; //md5(df + privateKey + publicKey).toString();

//items of the html pages
var card = document.getElementById('card');
var main = document.getElementById('top-card');
var details = document.getElementById('lead');
var title = document.getElementById('display-4');
var cardHolder = document.getElementById('card-holder'); //comics
var cardHolder2 = document.getElementById('card-holder2'); //series

//details of the clicked one
var item = JSON.parse(localStorage.getItem('clicked'));

//object containing image and extension
var thumbnail = item.thumbnail;
var comicThumbnail = null;

//gets the details
var reloadDetails = function () {
    try {
        card.innerHTML = `<div><h1 id="display-4">${item.name}</h1>
        <p id="lead">${item.description}</p>
        <ul class="details">
            <li>            
            <a href="${item.urls[2].url}" style="text-decoration: none; color:green">
            Comics: ${item.comics.available}
            </a>
            </li>
            
            <li>Series: ${item.series.available} </li>
            <li>Stories: ${item.stories.available} </li>
            <li>Events: ${item.events.available} </li>
        </ul>
        </div>`;
    } catch (e) {
        card.innerHTML = `<div><h1 id="display-4">${item.name}</h1>
        <p id="lead">${item.description}</p>
        <ul class="details">
            <li>            
            Comics: ${item.comics.available}
            </a>
            </li>
            
            <li>Series: ${item.series.available} </li>
            <li>Stories: ${item.stories.available} </li>
            <li>Events: ${item.events.available} </li>
        </ul>
        </div>`;
    }

    main.innerHTML = `<img id="singleThumb" class="thumbnail" src="${thumbnail.path}.${thumbnail.extension}">` + main.innerHTML;
    // title.innerText = item.name;
    // details.innerText = item.description;

    //calls the next sections to load
    loadComic();
    loadSeries();
}

//get the thumbnails from the url api
async function getThumbdetails(url) {
    try {
        // as github pages is forced https and the url is in http
        url = "https:/" + url.slice(6);
        return fetch(`${url}?ts=${df}&apikey=${publicKey}&hash=${checksum}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return data.data.results[0];
            })
            .then(function (results) {
                comicThumbnail = results.thumbnail;
                return results.thumbnail;
            })

    } catch (e) {
        console.log("could not load1");
        cardHolder.innerHTML += "<p> Could not load, check Connection please!! </p>";
        return null;
    }
}

//function to load thumbnails takes input the (items) variable from the api
async function loadComic() {
    try {
        let maxNum = item.comics.available;
        let listComics = item.comics.items.slice(0, 12);; //list of the comics available

        //show 10 comics
        for (let k of listComics) {
            //k.name;

            comicThumbnail = await getThumbdetails(k.resourceURI);
            let srcPath = comicThumbnail.path + '.' + comicThumbnail.extension;

            cardHolder.innerHTML += `<div class="cards grid-item">
                <img class="thumbnail" src="${srcPath}" />
                <div class="title-holder d-flex justify-space-around">
                    <h3 class="hd_hero">${k.name}</h3>
                </div>
            </div>`;


        }
    } catch (e) {
        console.log("could not load2");
        cardHolder.innerHTML += "<p> Could not load2, check Connection please!! </p>";
        return null;
    }
}

//function to load thumbnails takes input the (items) variable from the api
async function loadSeries() {
    try {
        let maxNum = item.series.available;
        let l = 0;
        let listSeries = item.series.items.slice(0, 9); //list of the comics available

        //check if length is zero
        if (listSeries.length == 0) {
            cardHolder2.innerHTML += "<p> Nothing to show here!! </p>";
            return;
        }

        //show 10 comics
        for (let k of listSeries) {

            seriesThumbnail = await getThumbdetails(k.resourceURI);
            let srcPath = seriesThumbnail.path + '.' + comicThumbnail.extension;

            cardHolder2.innerHTML += `<div class="cards grid-item">
                <img class="thumbnail" src="${srcPath}" />
                <div class="title-holder d-flex justify-space-around">
                    <h3 class="hd_hero">${k.name}</h3>
                </div>
            </div>`;

        }
    } catch (e) {
        console.log("could not load2");
        cardHolder2.innerHTML += "<p> Could not load2, check Connection please!! </p>";
        return null;
    }
}


reloadDetails();
