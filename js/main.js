//Global Variables
const videoQuota = 50;
const searchQuota = 20;
const maxVideos = 15;
const greyColor = "#DAE4E5";
const redColor = "#FF0000";

const chartArea = document.getElementById("myChart").getContext("2d");
chartTrigger = 0;

/*
Tag: PREP
Description: Asynchronously loads the gapi libraries requested
Parameters: "client" - value to load the gapi.client library
            "start" - name of function to call
Return: void
Ex) gapi.load(libraries, callbackOrConfig)
*/
gapi.load('client', start);

/*
Tag: PREP
Description: 1) Initializes the Javascript client with API key and API discovery documents
                (also OAuth client ID, scope)
             2) Go to home page
Parameters: void
Return: void
*/
function start() {
    gapi.client.init({
        // Set API key
        'apiKey': 'AIzaSyDsX6BeWpKFCNbIhvIh-yICEN14TJSSANo',
        // Your API key will be automatically added to the Discovery Document URLs
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    })

    //Initially starts at "home-page"
    toggleDiv("home-page");
}

/*
Tag: EL
Description: [Event Listener for id:"search-form"]
             1) Remove all previous search results at id:"search-page"
             2) Calls "searchYoutube" function
Parameters: void
Return: void
*/
document.getElementById("search-form").addEventListener('submit', e => {
    e.preventDefault();

    //Loop to remove all previous search results at id:"search-page"
    let page = document.getElementById("search-page");
    while(page.firstChild) {
        page.removeChild(page.firstChild);
    }

    //"if" input is valid start searching
    if(input.value) searchYoutube(input.value);
    //"else" if input is empty go to home page
    else toggleDiv("home-page");
});

/*
Tag: WORK
Description: 1) Go to "search-page"
             2) API request that retrieves list of channels as "paramSearch" keyword
Parameters: "paramSearch" - the string of word(s) that will be searched in the Youtube API
Return: 
*/
function searchYoutube(paramSearch)
{
    toggleDiv("search-page");
    let idArray = [];
    let channelArray = [];

    /*
    * Youtube API request that returns a collection of search results that match the query parameters
    * "part" - comma separated list of properties to return 
    * "type" - want to specify that we only want CHANNELS not videos or playlists
    * "q" - specifies terms to search for
    * maxResults - specifies the maximum number of items to be returned
    *              (acceptable values are 0 <= x <= 50)
    *              (default = 5)
    */
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        type: 'channel',
        q: input.value,
        maxResults: searchQuota
    })
    
    request.execute(response => {
        if(response.result == undefined)
            alert("QUOTA LIMIT REACHED BLAME YOUTUBE");
        else
        {
            let playlistItems = response.result.items;
            if(playlistItems) {
                playlistItems.forEach(item => {
                    const id = `${item.snippet.channelId}`;
                    const name = `${item.snippet.title}`;
                    const picture = `${item.snippet.thumbnails.high.url}`;
                    
                    //Create "Channel" object and store inside "channelArray"
                    let channel = new Channel(id, name, picture);
                    channelArray.push(channel);

                    //Store "id" in a separate array because the format is different
                    idArray.push(id);
                })
            }
            requestChannels(idArray, channelArray);
        }
    })
    //.catch(err => alert('Website Reached Youtube API Quota Limit!'));
}

/*
Tag: WORK
Description: API request for "statistics" that retrieves channel 
             subscriber count, video count, and view count data
Parameters: "idArray" - array of ids in proper order
            "channelArray" - array of "Channel" objects
Return: void
*/
function requestChannels(idArray, channelArray)
{
    //Calling Youtube API request
    //Proper format for "id" is a string separated with commas
    var request = gapi.client.youtube.channels.list({
            part: 'statistics, contentDetails, snippet',
            id: idArray.join(","),
        });
        request.execute(response => {
            if(response.result == undefined) alert("QUOTA LIMIT REACHED BLAME YOUTUBE");

            let playlistItems = response.result.items;

            //Loop and set information for each channel object
            if(playlistItems) {
                playlistItems.forEach(item => {
                    const subs = addCommas(`${item.statistics.subscriberCount}`);
                    const videos = `${item.statistics.videoCount}`;
                    const views = addCommas(`${item.statistics.viewCount}`);
                    const playlist = `${item.contentDetails.relatedPlaylists.uploads}`;
                    const description = `${addBreak(item.snippet.description)}`;

                    //Find the index of this "item" in "idArray"
                    //Set the values for the object at the index
                    let index = findItem(`${item.id}`, idArray);
                    channelArray[index].setSubscription(subs);
                    channelArray[index].setVideos(videos);
                    channelArray[index].setViews(views);
                    channelArray[index].setPlaylist(playlist);
                    channelArray[index].setDescription(description);
            })

            //Create new "div" elements for each channel object
            //Append "divs" to "search-page"
            let appendDiv = new Array();
            let trigger = 0;
            let newline = "\r\n";

            for(let i = 0; i < idArray.length; i++)
            {
                //1) Create new "div" element (and assign id value)
                appendDiv[i] = document.createElement('div');
                appendDiv[i].id = 'sub-div';

                const tempTitle = channelArray[i].getName();
                const tempSub = channelArray[i].getSubscription() + newline + "Subscribers";
                const tempVid = addCommas(channelArray[i].getVideos()) + newline + "Uploads";
                const tempView = channelArray[i].getViews() + newline + "Total Views";
                const tempPic = channelArray[i].getPicture();

                //2) Create and append "img" element
                let img = document.createElement('img');
                img.src = tempPic.toString();
                img.width = 100;
                img.height = 100;
                appendDiv[i].append(img);

                //3) Create and append FOUR "h4" elements
                let app1 = document.createElement('h4');
                let app2 = document.createElement('h4');
                let app3 = document.createElement('h4');
                let app4 = document.createElement('h4');

                app1.textContent = tempSub;
                app2.textContent = tempVid;
                app3.textContent = tempView;
                app4.textContent = tempTitle;

                ////////////////////////////
                //Assign id for CSS styling
                app1.id = 'hide-level-two';
                app2.id = 'hide-level-one';
                app3.id = 'hide-level-one';
                ///////////////////////////

                appendDiv[i].append(app1);
                appendDiv[i].append(app2);
                appendDiv[i].append(app3);
                appendDiv[i].append(app4);

                //Need to instantiate this value outside of "addEventListener" for some reason
                const channelObject = channelArray[i];
                
                //3) Append event listeners to the "divs" so they change the page when selected
                appendDiv[i].addEventListener('click', function(event) {
                    goToChannel(channelObject);
                });

                //This is for the 1st div append because it is empty
                if(trigger == 0)
                {
                    document.getElementById("search-page").appendChild(appendDiv[i]);
                    trigger++;
                }
                //Rest use this to append/link the divs on after another
                else
                {
                    document.getElementById("search-page").appendChild(appendDiv[i - 1].appendChild(appendDiv[i]));
                }
            }
        }   
    })
}

/*
Tag: WORK
Description: 
Parameters: "tracker" - channel i
Return: 
*/
function goToChannel(channelObject)
{
    toggleDiv("channel-page");
    let theMiddle = document.getElementById("middleSection");
    let theChart = document.getElementById("chartSection");
    if(channelObject.getVideos() == 0)
    {
       theMiddle.style.visibility = 'hidden';
       theChart.style.visibility = 'hidden';
    }
    else
    {
        theMiddle.style.visibility = 'visible';
        theChart.style.visibility = 'visible';
    }

    //Calculate how many "pages" we need
    //(Total # of videos) / (# videos per graph)
    //Function "Math.ceil" rounds up no matter what
    let totalPages = Math.ceil(channelObject.getVideos() / maxVideos);
    if(totalPages == 0) totalPages = 1;
    let pageString = "1 / " + totalPages;
    document.getElementById("pagination").innerHTML = pageString;

    //Store Youtube description box information into a string
    const data = `
        <div class="font-setting">
            <b>${channelObject.getSubscription()}</b> Subscribers
            <br>
            <b>${addCommas(channelObject.getVideos())}</b> Uploads
            <br>
            <b>${channelObject.getViews()}</b> Total Views

            <div id='hide-level-three'>
                <hr>
                Description:<br/>${channelObject.getDescription()}
            </div>
        </div>
    `;

    //Load Youtuber profile picture, name, and channel data
    const tempId = channelObject.getId();
    const tempPic = channelObject.getPicture();
    const tempName = channelObject.getName();
    loadPictureName(tempId, tempPic, tempName);
    loadChannelData(data);

    //Main GLOBAL OBJECT (Playlist object)
    //Only one created once a channel is selected from "search-page"
    globalObject = new Playlist(channelObject.getPlaylist(), channelObject.getVideos(), totalPages);

    const remainder = channelObject.getVideos() % maxVideos;
    if(remainder == 0)
    {
        globalObject.setRemainder(maxVideos);
    }
    else 
    {
        globalObject.setRemainder(remainder);
    }
    requestPlaylist(requestVideos);
}

/*
Tag: WORK
Description: Load Youtube channel profile picture and name (also add link)
Parameters: "id" - id of Youtube channel
            "picture" - link to Youtube channel picture
            "name" - name of Youtube channel
Return: void
*/
function loadPictureName(id, picture, name) {
    //Create an "img" element variable
    //Set the settings
    let img = document.createElement("img");
    img.src = picture.toString();
    img.width = 200;
    img.height = 200;
    img.alt = "Picture of " + name;
    img.id = 'main-image';

    //Get "picture" id
    let position = document.getElementById("pictureName");

    //Remove previous loaded images (should be just one)
    while(position.hasChildNodes()) {
        position.removeChild(position.lastChild);
    }
    //Then append image
    position.append(img);

    //Create onclick function to open Youtube channel in another window
    let tempLink = "https://www.youtube.com/channel/" + id;
    img.onclick = function() {
        window.open(tempLink, '_blank');
    };

    //Then append name
    let appendName = document.createElement('h1');
    appendName.textContent = name;
    position.append(appendName);
}

/*
Tag: WORK
Description: Set "data" string to element id 
Parameters: "data" - string containing Youtube channel information
Return: void
*/
function loadChannelData(data) {
    let statistics = document.getElementById('statistics');
    statistics.innerHTML = data;
}

/*
Tag: WORK
Description: Request playlist of videos using a playlist id 
Parameters: void
Return: void
*/
function requestPlaylist(callback) {
    //If there is a valid token value use updated "requestOptions"
    const token = globalObject.getToken();
    let requestOptions;

    if(token == 0)
    {
        requestOptions = {
            playlistId: globalObject.getPlaylist(),
            part: 'snippet,contentDetails',
            maxResults: videoQuota,
        };
    }
    else
    {
        requestOptions = {
            playlistId: globalObject.getPlaylist(),
            part: 'snippet,contentDetails',
            maxResults: videoQuota,
            pageToken: token,
        };
    }

    //API request for "list" of "playlistItems"
    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    //Execute the API request
    request.execute(response => {
        if(response.result == undefined)
            alert("QUOTA LIMIT REACHED BLAME YOUTUBE");

        //Store the nextPageToken
        globalObject.setToken(response.result.nextPageToken);
        const itemArray = response.result.items;

        if(itemArray) {
            //Loop through video playlist and store data into LinkedLists
            //"idArray" is to be separated ","
            let idArray = [];

            //"itemArray.length" = videoQuota
            //EXCEPT when there isn't enough videos to grab
            //So either the channel has < videoQuota to start with
            //Or it's grabbing the remainding videos            
            if(itemArray.length > maxVideos)
            {
                globalObject.setSize(maxVideos);
            }
            else
            {
                globalObject.setSize(itemArray.length);
            }
            globalObject.setTotalSize(globalObject.getTotalSize() + itemArray.length);
            globalObject.setPosition(globalObject.getPosition() + itemArray.length);

            checkButtons();

            itemArray.forEach(item => {
                const date = `${item.snippet.publishedAt}`;
                const title = `${item.snippet.title}`
                const link = `${item.snippet.resourceId.videoId}`;

                //If LinkedList is empty then preload the first video
                //Which is the channel's latest upload
                if(globalObject.getLinkLL().isEmpty())
                {
                    preloadVideo(link);
                }

                //Store data into LinkedLists
                globalObject.addDate(formatDate(date));
                globalObject.addTitle(title);
                globalObject.addLink(link);
                globalObject.addColor(greyColor);

                idArray.push(link);
            });

            //Looks up the contentDetails for videos listed in "idArray"
            callback(idArray, drawGraph);
        }
        else{
            videoContainer.innerHTML = "No Uploaded Videos :(";
        }
    });
}

/*
Tag: WORK
Description: Store video details in global object and draw graph
Parameters: "idArray" - array of video ids
Return: void
*/
function requestVideos(idArray, callback)
{
    //Fill out request and execute 
    var dataRequestVar = gapi.client.youtube.videos.list({
        part: 'statistics',
        id: idArray.join(",")
    });                                                                                                                        

    dataRequestVar.execute(response => {
        if(response.result == undefined)
            alert("QUOTA LIMIT REACHED BLAME YOUTUBE");

        const videoDetailObjects = response.result.items;
        if(videoDetailObjects) {
            //Loop through videoDetailObjects and create VideoDetails objects
            for(let index = 0; index < videoDetailObjects.length; ++index) {
                const views = `${videoDetailObjects[index].statistics.viewCount}`;
                const likes = `${videoDetailObjects[index].statistics.likeCount}`;
                const dislikes = `${videoDetailObjects[index].statistics.dislikeCount}`;

                globalObject.addView(views);
                globalObject.addLike(likes);
                globalObject.addDislike(dislikes);
            }

           if(globalObject.getCurrentPage() == globalObject.getTotalPages())
            {
                globalObject.setSize(globalObject.getRemainder());
            }
            
            //Prepare the arrays as string for final parsing
            globalObject.setPosition(globalObject.getPosition() - globalObject.getSize());
            let viewString = globalObject.grabView(globalObject.getPosition(), globalObject.getSize());
            let likeString = globalObject.grabLike(globalObject.getPosition(), globalObject.getSize());
            let dislikeString = globalObject.grabDislike(globalObject.getPosition(), globalObject.getSize());
            let dateString = globalObject.grabDate(globalObject.getPosition(), globalObject.getSize());
            let colorString = globalObject.grabColor(globalObject.getPosition(), globalObject.getSize());

            callback(viewString, likeString, dislikeString, dateString, colorString);
        }
    })
    //Turn on buttons
    document.getElementById("leftButton").style.pointerEvents = "auto";
    document.getElementById("rightButton").style.pointerEvents = "auto";
}

/*
Tag: 
Description: 
Parameters: 
Return: 
*/
function drawGraph(viewString, likeString, dislikeString, dateString, colorString) {
    if(chartTrigger == 0)
    {
        chartTrigger = 1;
    }
    else
    {
        myChart.destroy();
    }

    myChart = new Chart(chartArea, {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
          labels: dateString,
          datasets: [{ 
              data: viewString,
              label: "Views",
              borderColor: "#0ABDE3",
              fill: false,
              pointRadius: 7,
              pointHoverRadius: 8,
              pointBackgroundColor: colorString,
              hidden: globalObject.getLegendOne(),
            },
            { 
              data: likeString,
              label: "Likes",
              borderColor: "#3de117",
              fill: false,
              pointRadius: 5,
              pointHoverRadius: 6,
              pointBackgroundColor: colorString,
              hidden: globalObject.getLegendTwo(),
            },
            {
                data: dislikeString,
                label: "Dislikes",
                borderColor: "#FFA500",
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 6,
                pointBackgroundColor: colorString,
                hidden: globalObject.getLegendThree(),
            }
          ]
        },
        options: {
            legend: {
                onClick: function(evt, legendItem) {
                    //Store the original legend onClick function because it somehow 
                    //redraws the graph immediately while "myChart.update()" doesn't work
                    let originalAction = Chart.defaults.global.legend.onClick;
                    let holdIndex;
                    let holdBool;
                    let counter = 0;

                    if(globalObject.getLegendOne() == true)
                    {
                        counter++;
                    }
                    if(globalObject.getLegendTwo() == true)
                    {
                        counter++;
                    }
                    if(globalObject.getLegendThree() == true)
                    {
                        counter++;
                    }

                    if(!(counter == 2 && legendItem.hidden == false))
                    {
                        //Assign index and bool values
                        if(legendItem.text == "Views") holdIndex = 0;
                        else if(legendItem.text == "Likes") holdIndex = 1;
                        else if(legendItem.text == "Dislikes") holdIndex = 2;
                        holdBool = !(legendItem.hidden);

                        //Call the original action
                        originalAction.call(this, evt, legendItem);

                        //Store values in globalObject for future graphs
                        globalObject.setLegend(holdIndex, holdBool);
                    }
                }
            },
            onClick: function(evt, activeElements) {
                //Check that a point is actually clicked
                if(activeElements[0] != undefined)
                {
                    var elementIndex = activeElements[0]._index;
                    let holdColor = this.data.datasets[0].pointBackgroundColor[elementIndex];
                    if(holdColor == greyColor)
                    {
                        this.data.datasets[0].pointBackgroundColor[elementIndex] = redColor;
                        this.data.datasets[1].pointBackgroundColor[elementIndex] = redColor;
                        this.data.datasets[2].pointBackgroundColor[elementIndex] = redColor;
                        globalObject.setColor(globalObject.getIndex(), redColor);
                    }
                    else
                    {
                        this.data.datasets[0].pointBackgroundColor[elementIndex] = greyColor;
                        this.data.datasets[1].pointBackgroundColor[elementIndex] = greyColor;
                        this.data.datasets[2].pointBackgroundColor[elementIndex] = greyColor;
                        globalObject.setColor(globalObject.getIndex(), greyColor);
                    }
                    myChart.update();
                }
            }, 
           tooltips: {
            callbacks: {
                //Btw "label" FIRST then "onClick"
                //So assign "globalObject.index" in "label" to use the value in "onClick"
                label: function(item, data) {
                    let value = data.datasets[item.datasetIndex].data[item.index];
                    let math;

                    if(globalObject.getCurrentPage() == globalObject.getTotalPages())
                    {
                        math = item.index;
                    }
                    else
                    {
                        math = globalObject.getTotalSize() - (globalObject.getCurrentPage() * maxVideos - item.index);
                    }
        
                    globalObject.setIndex(math);
                    globalObject.setUrl("https://www.youtube.com/embed/" + globalObject.getLinkLL().get(math));
                    let message = [];
                    message.push(globalObject.getTitleLL().get(math));
                    message.push(addCommas(value));
                    return message;
                },
                mode: 'index',
                intersect: false,
            }
          },
          scales: {
                yAxes: [{
                    ticks: {
                        //Change the y-axis ticks
                        //1,000,000 = million
                        //100,000 = k
                        callback: function(label) {
                            if(label/1000000 >= 1)
                                return label/1000000 + ' million';
                            else if(label/1000 >= 1)
                                return label/1000 + 'k';
                            else
                                return label;
                        }
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 12,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date Video Uploaded                  ',
                    }
                }
            ]
          },
        }
    });
}

/*
Tag: BG (background)
Description: Turns buttons "on" and "off" depending on "currentPage" value 
Parameters: void
Return: void
*/
function checkButtons() {
    //Right Button
     if(globalObject.getCurrentPage() == 1)
     {
         document.getElementById("rightButton").enabled = false;
         document.getElementById("rightButton").disabled = true;
     }
     else
     {
         document.getElementById("rightButton").enabled = true;
         document.getElementById("rightButton").disabled = false;
     }

     //Left Button
     if(globalObject.getCurrentPage() < globalObject.getTotalPages())
     {
         document.getElementById("leftButton").enabled = true;
         document.getElementById("leftButton").disabled = false;
 
     }
     else if(globalObject.getCurrentPage() == globalObject.getTotalPages())
     {
         document.getElementById("leftButton").enabled = false;
         document.getElementById("leftButton").disabled = true;
     }
 }

/*
Tag: EL (event listener)
Description: "cycleLeft" / "leftCycle"
            
Parameters: void
Return: void
*/
function cycleLeft(callback) {
    if( globalObject.getPosition() < maxVideos && globalObject.getTotalSize() != globalObject.getVideos())
    {
        //Turn off buttons
        document.getElementById("leftButton").style.pointerEvents = "none";
        document.getElementById("rightButton").style.pointerEvents = "none";
        //requestPlaylist(requestVideos);
        callback(requestVideos);
    }
    else
    {
        //"if" going to last page use remainder value
        if(globalObject.getCurrentPage() + 1 == globalObject.getTotalPages())
        {
            globalObject.setPosition(globalObject.getPosition() - globalObject.getRemainder());
            drawGraph(globalObject.grabView(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabLike(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabDislike(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabDate(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabColor(globalObject.getPosition(), globalObject.getRemainder()));
        }
        //"else" just use "maxVideos" value
        else
        {
            try {
                globalObject.setPosition(globalObject.getPosition() - maxVideos);
                drawGraph(globalObject.grabView(globalObject.getPosition(), maxVideos),
                globalObject.grabLike(globalObject.getPosition(), maxVideos),
                globalObject.grabDislike(globalObject.getPosition(), maxVideos),
                globalObject.grabDate(globalObject.getPosition(), maxVideos), 
                globalObject.grabColor(globalObject.getPosition(), maxVideos));
            }
            catch(e) {
                console.error("undefined");
            }
        }
    }

    globalObject.setCurrentPage(globalObject.getCurrentPage() + 1);
    checkButtons();
    let pageString = globalObject.getCurrentPage() + " / " + globalObject.getTotalPages();
    document.getElementById("pagination").innerHTML = pageString;

    window.scrollTo(0,document.body.scrollHeight);
}

/*
Tag: 
Description: "cycleRight" / "rightCycle"
Parameters: 
Return: 
*/
document.getElementById("rightButton").onclick = function(event) {
    //"if" at last page use remainder value
    if(globalObject.getCurrentPage() == globalObject.getTotalPages())
    {
        globalObject.setPosition(globalObject.getPosition() + globalObject.getRemainder());
    }
    //"else" just use "maxVideos"
    else
    {
        globalObject.setPosition(globalObject.getPosition() + maxVideos);
    }

    //Draw
    drawGraph(globalObject.grabView(globalObject.getPosition(), maxVideos),
    globalObject.grabLike(globalObject.getPosition(), maxVideos),
    globalObject.grabDislike(globalObject.getPosition(), maxVideos),
    globalObject.grabDate(globalObject.getPosition(), maxVideos), 
    globalObject.grabColor(globalObject.getPosition(), maxVideos));

    globalObject.setCurrentPage(globalObject.getCurrentPage() - 1);
    checkButtons();
    let pageString = globalObject.getCurrentPage() + " / " + globalObject.getTotalPages();
    document.getElementById("pagination").innerHTML = pageString;

    window.scrollTo(0, document.body.scrollHeight);
}

/*
Tag: BG
Description: adds line breaks to "x"
Parameters: "x" - string to add line breaks
Return: "x" - string with line breaks
*/
function addBreak(x) {
    return x.replace(/\n/g,"<br />");
}

/*
Tag: BG
Description: changes "d" date string to the format I want
Parameters: "d" - string of unmodified date
Return: "simplified" - string of modified date
*/
function formatDate(d) {
    let date = new Date(d);
    let month = date.toLocaleString('en-us', { month: 'short' });
    let simplified = month + " " + date.getDate() + ", " + date.getFullYear();
    return simplified;
}

/*
Tag: BG (background)
Description: Add proper commas in number string
Parameters: "x" - number string to add commas in
Return: string
*/
function addCommas(x) {
    let result = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result;
}

/*
Tag: BG [background]
Description: Turns displays on and off depending on "divName" parameter 
Parameters: "divName" - setting for which page to display
Return: void
*/
function toggleDiv(divName)
{
    //Scroll to top left instantly
    window.scrollTo(0, 0);

    //"Turn off" iframe by loading a different video
    document.getElementById('video-frame').src = "about:blank";

    if(divName == "home-page")
    {
        //document.getElementsByTagName("a")[0].setAttribute('href','https://www.lazybrowser.com');
        //window.location = 'https://www.lazybrowser.com';

        //Clear text "input" form
        document.getElementById('input').value = '';

        document.getElementById("search-page").style.display = 'none';
        document.getElementById("channel-page").style.display = 'none';
        document.getElementById("info-page").style.display = 'none';
    }
    else if(divName == "search-page")
    {
        //document.getElementsByTagName("a")[0].setAttribute('href','https://www.lazybrowser.com/search/');

        document.getElementById("home-page").style.display = 'none';
        document.getElementById("channel-page").style.display = 'none';
        document.getElementById("info-page").style.display = 'none';
    }
    else if(divName == "channel-page")
    {
        //document.getElementsByTagName("a")[0].setAttribute('href','https://www.lazybrowser.com/channel/');

        document.getElementById("home-page").style.display = 'none';
        document.getElementById("search-page").style.display = 'none';
        document.getElementById("info-page").style.display = 'none';
    }
    else if(divName == "info-page")
    {
        document.getElementById("home-page").style.display = 'none';
        document.getElementById("search-page").style.display = 'none';
        document.getElementById("channel-page").style.display = 'none';
    }
    document.getElementById(divName).style.display = 'block';
}

/*
Tag: BG [background]
Description: Returns the index of "paramId" within "paramArray"
Parameters: "paramId" - id to search for
            "paramArray" - array to search within
Return: int
*/
function findItem(paramId, paramArray)
{
    for(let i = 0; i < paramArray.length; i++)
    {
        if(paramId == paramArray[i])
        {
            return i;
        }
    }
    return -1;
}

/*
Tag: BG (background)
Description: "onClick" function that changes "video-frame"
Parameters: void
Return: void
*/
document.getElementById("myChart").onclick = function(evt){
    var activePoint = myChart.lastActive[0];
    if (activePoint !== undefined) 
    {
        document.getElementById('video-frame').src = globalObject.getUrl();
    }
};

/*
Tag: BG (background)
Description: Load latest video from Youtube channel as default
Parameters: "link" - video url to link to
Return: void
*/
function preloadVideo(link) {
    globalObject.setUrl("https://www.youtube.com/embed/" + link);
    document.getElementById('video-frame').src = globalObject.getUrl();
}