require('dotenv').config();

const videoQuota = 50;
const searchQuota = 20;
const maxVideos = 15;
const greyColor = "#DAE4E5";
const redColor = "#FF0000";

const chartArea = document.getElementById("myChart").getContext("2d");
chartTrigger = 0;

gapi.load('client', start);

function start() {
    gapi.client.init({
        'apiKey': process.env.API_KEY,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    })

    toggleDiv("home-page");
}

document.getElementById("search-form").addEventListener('submit', e => {
    e.preventDefault();

    let page = document.getElementById("search-page");
    while(page.firstChild) {
        page.removeChild(page.firstChild);
    }

    if(input.value) searchYoutube(input.value);
    else toggleDiv("home-page");
});

function searchYoutube(paramSearch)
{
    toggleDiv("search-page");
    let idArray = [];
    let channelArray = [];

    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        type: 'channel',
        q: input.value,
        maxResults: searchQuota
    })
    
    request.execute(response => {
        if(response.result == undefined) alert("Sorry quota limit reached please read the \"contact + info\" page.");
        else
        {
            let playlistItems = response.result.items;
            if(playlistItems) {
                playlistItems.forEach(item => {
                    const id = `${item.snippet.channelId}`;
                    const name = `${item.snippet.title}`;
                    const picture = `${item.snippet.thumbnails.high.url}`;
                    
                    let channel = new Channel(id, name, picture);
                    channelArray.push(channel);

                    idArray.push(id);
                })
            }
            requestChannels(idArray, channelArray);
        }
    })
}

function requestChannels(idArray, channelArray)
{
    var request = gapi.client.youtube.channels.list({
            part: 'statistics, contentDetails, snippet',
            id: idArray.join(","),
        });
        request.execute(response => {
            if(response.result == undefined) alert("Sorry quota limit reached please read the \"contact + info\" page.");

            let playlistItems = response.result.items;

            if(playlistItems) {
                playlistItems.forEach(item => {
                    const subs = addCommas(`${item.statistics.subscriberCount}`);
                    const videos = `${item.statistics.videoCount}`;
                    const views = addCommas(`${item.statistics.viewCount}`);
                    const playlist = `${item.contentDetails.relatedPlaylists.uploads}`;
                    const description = `${addBreak(item.snippet.description)}`;

                    let index = findItem(`${item.id}`, idArray);
                    channelArray[index].setSubscription(subs);
                    channelArray[index].setVideos(videos);
                    channelArray[index].setViews(views);
                    channelArray[index].setPlaylist(playlist);
                    channelArray[index].setDescription(description);
            })

            let appendDiv = new Array();
            let trigger = 0;
            let newline = "\r\n";

            for(let i = 0; i < idArray.length; i++)
            {
                appendDiv[i] = document.createElement('div');
                appendDiv[i].id = 'sub-div';

                const tempTitle = channelArray[i].getName();
                const tempSub = channelArray[i].getSubscription() + newline + "Subscribers";
                const tempVid = addCommas(channelArray[i].getVideos()) + newline + "Uploads";
                const tempView = channelArray[i].getViews() + newline + "Total Views";
                const tempPic = channelArray[i].getPicture();

                let img = document.createElement('img');
                img.src = tempPic.toString();
                img.width = 100;
                img.height = 100;
                appendDiv[i].append(img);

                let app1 = document.createElement('h4');
                let app2 = document.createElement('h4');
                let app3 = document.createElement('h4');
                let app4 = document.createElement('h4');

                app1.textContent = tempSub;
                app2.textContent = tempVid;
                app3.textContent = tempView;
                app4.textContent = tempTitle;

                app1.id = 'hide-level-two';
                app2.id = 'hide-level-one';
                app3.id = 'hide-level-one';

                appendDiv[i].append(app1);
                appendDiv[i].append(app2);
                appendDiv[i].append(app3);
                appendDiv[i].append(app4);

                const channelObject = channelArray[i];
                
                appendDiv[i].addEventListener('click', function(event) {
                    goToChannel(channelObject);
                });

                if(trigger == 0)
                {
                    document.getElementById("search-page").appendChild(appendDiv[i]);
                    trigger++;
                }
                else
                {
                    document.getElementById("search-page").appendChild(appendDiv[i - 1].appendChild(appendDiv[i]));
                }
            }
        }   
    })
}

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

    let totalPages = Math.ceil(channelObject.getVideos() / maxVideos);
    if(totalPages == 0) totalPages = 1;
    let pageString = "1 / " + totalPages;
    document.getElementById("pagination").innerHTML = pageString;

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

    const tempId = channelObject.getId();
    const tempPic = channelObject.getPicture();
    const tempName = channelObject.getName();
    loadPictureName(tempId, tempPic, tempName);
    loadChannelData(data);

    globalObject = new Playlist();
    globalObject.playlist = channelObject.getPlaylist();
    globalObject.videos = channelObject.getVideos();
    globalObject.totalPages = totalPages;

    const remainder = channelObject.getVideos() % maxVideos;
    if(remainder == 0)
    {
        globalObject.remainder = maxVideos;
    }
    else 
    {
        globalObject.remainder = remainder;
    }
    requestPlaylist(requestVideos);
}

function loadPictureName(id, picture, name) {
    let img = document.createElement("img");
    img.src = picture.toString();
    img.width = 200;
    img.height = 200;
    img.alt = "Picture of " + name;
    img.id = 'main-image';

    let position = document.getElementById("pictureName");

    while(position.hasChildNodes()) {
        position.removeChild(position.lastChild);
    }
    position.append(img);

    let tempLink = "https://www.youtube.com/channel/" + id;
    img.onclick = function() {
        window.open(tempLink, '_blank');
    };

    let appendName = document.createElement('h1');
    appendName.textContent = name;
    position.append(appendName);
}

function loadChannelData(data) {
    let statistics = document.getElementById('statistics');
    statistics.innerHTML = data;
}

function requestPlaylist(callback) {
    const token = globalObject.token;
    let requestOptions;

    if(token == 0)
    {
        requestOptions = {
            playlistId: globalObject.playlist,
            part: 'snippet,contentDetails',
            maxResults: videoQuota,
        };
    }
    else
    {
        requestOptions = {
            playlistId: globalObject.playlist,
            part: 'snippet,contentDetails',
            maxResults: videoQuota,
            pageToken: token,
        };
    }

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        if(response.result == undefined) alert("Sorry quota limit reached please read the \"contact + info\" page.");

        globalObject.token = response.result.nextPageToken;
        const itemArray = response.result.items;

        if(itemArray) {
            let idArray = [];
         
            if(itemArray.length > maxVideos)
            {
                globalObject.size = maxVideos;
            }
            else
            {
                globalObject.size = itemArray.length;
            }
            globalObject.totalSize += itemArray.length;
            globalObject.position += itemArray.length;

            checkButtons();

            itemArray.forEach(item => {
                const date = `${item.snippet.publishedAt}`;
                const title = `${item.snippet.title}`
                const link = `${item.snippet.resourceId.videoId}`;

                if(globalObject.linkLL.isEmpty())
                {
                    preloadVideo(link);
                }

                globalObject.dateLL.add(formatDate(date));
                globalObject.titleLL.add(title);
                globalObject.linkLL.add(link);
                globalObject.colorLL.add(greyColor);

                idArray.push(link);
            });

            callback(idArray, drawGraph);
        }
        else{
            videoContainer.innerHTML = "No Uploaded Videos :(";
        }
    });
}

function requestVideos(idArray, callback)
{
    var dataRequestVar = gapi.client.youtube.videos.list({
        part: 'statistics',
        id: idArray.join(",")
    });                                                                                                                        

    dataRequestVar.execute(response => {
        if(response.result == undefined) alert("Sorry quota limit reached please read the \"contact + info\" page.");

        const videoDetailObjects = response.result.items;
        if(videoDetailObjects) {
            for(let index = 0; index < videoDetailObjects.length; ++index) {
                const views = `${videoDetailObjects[index].statistics.viewCount}`;
                const likes = `${videoDetailObjects[index].statistics.likeCount}`;
                const dislikes = `${videoDetailObjects[index].statistics.dislikeCount}`;

                (globalObject.viewLL).add(views);
                (globalObject.likeLL).add(likes);
                (globalObject.dislikeLL).add(dislikes);
            }

           if(globalObject.currentPage == globalObject.totalPages)
            {
                globalObject.size = globalObject.remainder;
            }
            
            globalObject.position -= globalObject.size;
            let viewString = globalObject.viewLL.grabString(globalObject.position, globalObject.size);
            let likeString = globalObject.likeLL.grabString(globalObject.position, globalObject.size);
            let dislikeString = globalObject.dislikeLL.grabString(globalObject.position, globalObject.size);
            let dateString = globalObject.dateLL.grabString(globalObject.position, globalObject.size);
            let colorString = globalObject.colorLL.grabString(globalObject.position, globalObject.size);

            callback(viewString, likeString, dislikeString, dateString, colorString);
        }
    })
    document.getElementById("leftButton").style.pointerEvents = "auto";
    document.getElementById("rightButton").style.pointerEvents = "auto";
}

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
              hidden: globalObject.legend[0],
            },
            { 
              data: likeString,
              label: "Likes",
              borderColor: "#3de117",
              fill: false,
              pointRadius: 5,
              pointHoverRadius: 6,
              pointBackgroundColor: colorString,
              hidden: globalObject.legend[1],
            },
            {
                data: dislikeString,
                label: "Dislikes",
                borderColor: "#FFA500",
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 6,
                pointBackgroundColor: colorString,
                hidden: globalObject.legend[2],
            }
          ]
        },
        options: {
            legend: {
                onClick: function(evt, legendItem) {
                    let count = 0;
                    for(let i = 0; i < globalObject.legend.length; i++)
                    {
                        if(globalObject.legend[i] == true) count++;
                    }

                    let holdIndex;
                    let holdBool;

                    if(legendItem.text == "Views") holdIndex = 0;
                    else if(legendItem.text == "Likes") holdIndex = 1;
                    else if(legendItem.text == "Dislikes") holdIndex = 2;
                    holdBool = !(legendItem.hidden);
                    
                    if(!(count == 2 && globalObject.legend[holdIndex] == false))
                    {
                        let originalAction = Chart.defaults.global.legend.onClick;
                        originalAction.call(this, evt, legendItem);
                        globalObject.legend[holdIndex] = holdBool;
                    }
                }
            },
            onClick: function(evt, activeElements) {
                if(activeElements[0] != undefined)
                {
                    var elementIndex = activeElements[0]._index;
                    let holdColor = this.data.datasets[0].pointBackgroundColor[elementIndex];
                    if(holdColor == greyColor)
                    {
                        this.data.datasets[0].pointBackgroundColor[elementIndex] = redColor;
                        this.data.datasets[1].pointBackgroundColor[elementIndex] = redColor;
                        this.data.datasets[2].pointBackgroundColor[elementIndex] = redColor;
                        globalObject.colorLL.set(globalObject.index, redColor);
                    }
                    else
                    {
                        this.data.datasets[0].pointBackgroundColor[elementIndex] = greyColor;
                        this.data.datasets[1].pointBackgroundColor[elementIndex] = greyColor;
                        this.data.datasets[2].pointBackgroundColor[elementIndex] = greyColor;
                        globalObject.colorLL.set(globalObject.index, greyColor);
                    }
                    myChart.update();
                }
            }, 
           tooltips: {
            callbacks: {
                label: function(item, data) {
                    let value = data.datasets[item.datasetIndex].data[item.index];
                    let math;

                    if(globalObject.currentPage == globalObject.totalPages)
                    {
                        math = item.index;
                    }
                    else
                    {
                        math = globalObject.totalSize - (globalObject.currentPage * maxVideos - item.index);
                    }
        
                    globalObject.index = math;
                    globalObject.url = "https://www.youtube.com/embed/" + globalObject.linkLL.get(math);
                    let message = [];
                    message.push(globalObject.titleLL.get(math));
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
                        autoSkip: false,
                        maxRotation: 25,
                        minRotation: 25,
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

function checkButtons() {
     if(globalObject.currentPage == 1)
     {
         document.getElementById("rightButton").enabled = false;
         document.getElementById("rightButton").disabled = true;
     }
     else
     {
         document.getElementById("rightButton").enabled = true;
         document.getElementById("rightButton").disabled = false;
     }

     if(globalObject.currentPage < globalObject.totalPages)
     {
         document.getElementById("leftButton").enabled = true;
         document.getElementById("leftButton").disabled = false;
 
     }
     else if(globalObject.currentPage == globalObject.totalPages)
     {
         document.getElementById("leftButton").enabled = false;
         document.getElementById("leftButton").disabled = true;
     }
 }

function cycleLeft(callback) {
    if( globalObject.position < maxVideos && globalObject.totalSize != globalObject.videos)
    {
        document.getElementById("leftButton").style.pointerEvents = "none";
        document.getElementById("rightButton").style.pointerEvents = "none";
        callback(requestVideos);
    }
    else
    {
        if(globalObject.currentPage + 1 == globalObject.totalPages)
        {
            globalObject.position -= globalObject.remainder;
            drawGraph(globalObject.viewLL.grabString(globalObject.position, globalObject.remainder),
            globalObject.likeLL.grabString(globalObject.position, globalObject.remainder),
            globalObject.dislikeLL.grabString(globalObject.position, globalObject.remainder),
            globalObject.dateLL.grabString(globalObject.position, globalObject.remainder),
            globalObject.colorLL.grabString(globalObject.position, globalObject.remainder));
        }
        else
        {
            try {
                globalObject.position -= maxVideos;
                drawGraph(globalObject.viewLL.grabString(globalObject.position, maxVideos),
                globalObject.likeLL.grabString(globalObject.position, maxVideos),
                globalObject.dislikeLL.grabString(globalObject.position, maxVideos),
                globalObject.dateLL.grabString(globalObject.position, maxVideos), 
                globalObject.colorLL.grabString(globalObject.position, maxVideos));
            }
            catch(e) {
                console.error("undefined");
            }
        }
    }

    globalObject.currentPage++;
    checkButtons();
    let pageString = globalObject.currentPage + " / " + globalObject.totalPages;
    document.getElementById("pagination").innerHTML = pageString;
}

document.getElementById("rightButton").onclick = function(event) {
    if(globalObject.currentPage == globalObject.totalPages)
    {
        globalObject.position += globalObject.remainder;
    }
    else
    {
        globalObject.position += maxVideos;
    }

    //Draw
    drawGraph(globalObject.viewLL.grabString(globalObject.position, maxVideos),
    globalObject.likeLL.grabString(globalObject.position, maxVideos),
    globalObject.dislikeLL.grabString(globalObject.position, maxVideos),
    globalObject.dateLL.grabString(globalObject.position, maxVideos),
    globalObject.colorLL.grabString(globalObject.position, maxVideos));

    globalObject.currentPage--;
    checkButtons();
    let pageString = globalObject.currentPage + " / " + globalObject.totalPages;
    document.getElementById("pagination").innerHTML = pageString;
}

function addBreak(x) {
    return x.replace(/\n/g,"<br />");
}

function formatDate(d) {
    let date = new Date(d);
    let month = date.toLocaleString('en-us', { month: 'short' });
    let simplified = month + " " + date.getDate() + ", " + date.getFullYear();
    return simplified;
}

function addCommas(x) {
    let result = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result;
}

function toggleDiv(divName)
{
    window.scrollTo(0, 0);
    document.getElementById('video-frame').src = "about:blank";

    if(divName == "home-page")
    {
        document.getElementById('input').value = '';

        document.getElementById("search-page").style.display = 'none';
        document.getElementById("channel-page").style.display = 'none';
        document.getElementById("info-page").style.display = 'none';
    }
    else if(divName == "search-page")
    {
        document.getElementById("home-page").style.display = 'none';
        document.getElementById("channel-page").style.display = 'none';
        document.getElementById("info-page").style.display = 'none';
    }
    else if(divName == "channel-page")
    {
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

document.getElementById("myChart").onclick = function(evt){
    var activePoint = myChart.lastActive[0];
    if (activePoint !== undefined) 
    {
        document.getElementById('video-frame').src = globalObject.url;
    }
};

function preloadVideo(link) {
    globalObject.url = "https://www.youtube.com/embed/" + link;
    document.getElementById('video-frame').src = globalObject.url;
}