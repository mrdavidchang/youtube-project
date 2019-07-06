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
        'apiKey': 'AIzaSyDsX6BeWpKFCNbIhvIh-yICEN14TJSSANo',
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
        if(response.result == undefined) {
            alert("Quota Limit Reached!\nRedirecting to \"contact + info\" page.");
            toggleDiv('contact-page');
        }
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
            if(response.result == undefined) {
                alert("Quota Limit Reached!\nRedirecting to \"contact + info\" page.");
                toggleDiv('contact-page');
            }

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

                let app1 = document.createElement('p');
                let app2 = document.createElement('p');
                let app3 = document.createElement('p');
                let app4 = document.createElement('p');

                app1.textContent = tempSub;
                app2.textContent = tempVid;
                app3.textContent = tempView;
                app4.textContent = tempTitle;

                app1.className = "sub-font1";
                app2.className = "sub-font1";
                app3.className = "sub-font1";
                app4.className = "sub-font2";

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

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        if(response.result == undefined) {
            alert("Quota Limit Reached!\nRedirecting to \"contact + info\" page.");
            toggleDiv('contact-page');
        }

        globalObject.setToken(response.result.nextPageToken);
        const itemArray = response.result.items;

        if(itemArray) {
            let idArray = [];
          
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

                if(globalObject.getLinkLL().isEmpty())
                {
                    preloadVideo(link);
                }

                globalObject.addDate(formatDate(date));
                globalObject.addTitle(title);
                globalObject.addLink(link);
                globalObject.addColor(greyColor);

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
        if(response.result == undefined) {
            alert("Quota Limit Reached!\nRedirecting to \"contact + info\" page.");
            toggleDiv('contact-page');
        }

        const videoDetailObjects = response.result.items;
        if(videoDetailObjects) {
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
            
            globalObject.setPosition(globalObject.getPosition() - globalObject.getSize());
            let viewString = globalObject.grabView(globalObject.getPosition(), globalObject.getSize());
            let likeString = globalObject.grabLike(globalObject.getPosition(), globalObject.getSize());
            let dislikeString = globalObject.grabDislike(globalObject.getPosition(), globalObject.getSize());
            let dateString = globalObject.grabDate(globalObject.getPosition(), globalObject.getSize());
            let colorString = globalObject.grabColor(globalObject.getPosition(), globalObject.getSize());

            callback(viewString, likeString, dislikeString, dateString, colorString);
        }
    })
    document.getElementById("leftButton").style.pointerEvents = "auto";
    document.getElementById("rightButton").style.pointerEvents = "auto";
}

function drawGraph(viewString, likeString, dislikeString, dateString, colorString) {
    var pos = $(document).scrollTop();
    
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
        data: {
          labels: dateString,
          datasets: [{ 
              data: viewString,
              label: "Views",
              borderColor: "#0ABDE3",
              fill: false,
              pointRadius: 10,
              pointHoverRadius: 10,
              pointBackgroundColor: colorString,
              hidden: globalObject.getLegendOne(),
            },
            { 
              data: likeString,
              label: "Likes",
              borderColor: "#3de117",
              fill: false,
              pointRadius: 8,
              pointHoverRadius: 8,
              pointBackgroundColor: colorString,
              hidden: globalObject.getLegendTwo(),
            },
            {
                data: dislikeString,
                label: "Dislikes",
                borderColor: "#FFA500",
                fill: false,
                pointRadius: 8,
                pointHoverRadius: 8,
                pointBackgroundColor: colorString,
                hidden: globalObject.getLegendThree(),
            }
          ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                }
                
            },
            legend: {
                onClick: function(evt, legendItem) {
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
                        if(legendItem.text == "Views") holdIndex = 0;
                        else if(legendItem.text == "Likes") holdIndex = 1;
                        else if(legendItem.text == "Dislikes") holdIndex = 2;
                        holdBool = !(legendItem.hidden);

                        originalAction.call(this, evt, legendItem);

                        globalObject.setLegend(holdIndex, holdBool);
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
                        maxRotation: 30,
                        minRotation: 30,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date Video Uploaded                   ',
                    }
                }
            ]
          },
        }
    });

    $(document).scrollTop(pos);
}

function checkButtons() {
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

function cycleLeft(callback) {

    if( globalObject.getPosition() < maxVideos && globalObject.getTotalSize() != globalObject.getVideos())
    {
        document.getElementById("leftButton").style.pointerEvents = "none";
        document.getElementById("rightButton").style.pointerEvents = "none";
        callback(requestVideos);
    }
    else
    {
        if(globalObject.getCurrentPage() + 1 == globalObject.getTotalPages())
        {
            globalObject.setPosition(globalObject.getPosition() - globalObject.getRemainder());
            drawGraph(globalObject.grabView(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabLike(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabDislike(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabDate(globalObject.getPosition(), globalObject.getRemainder()),
            globalObject.grabColor(globalObject.getPosition(), globalObject.getRemainder()));
        }
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

}

document.getElementById("rightButton").onclick = function(event) {

    if(globalObject.getCurrentPage() == globalObject.getTotalPages())
    {
        globalObject.setPosition(globalObject.getPosition() + globalObject.getRemainder());
    }
    else
    {
        globalObject.setPosition(globalObject.getPosition() + maxVideos);
    }

    drawGraph(globalObject.grabView(globalObject.getPosition(), maxVideos),
    globalObject.grabLike(globalObject.getPosition(), maxVideos),
    globalObject.grabDislike(globalObject.getPosition(), maxVideos),
    globalObject.grabDate(globalObject.getPosition(), maxVideos), 
    globalObject.grabColor(globalObject.getPosition(), maxVideos));

    globalObject.setCurrentPage(globalObject.getCurrentPage() - 1);
    checkButtons();
    let pageString = globalObject.getCurrentPage() + " / " + globalObject.getTotalPages();
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
        document.getElementById("contact-page").style.display = 'none';
    }
    else if(divName == "search-page")
    {
        document.getElementById("home-page").style.display = 'none';
        document.getElementById("channel-page").style.display = 'none';
        document.getElementById("contact-page").style.display = 'none';
    }
    else if(divName == "channel-page")
    {
        document.getElementById("home-page").style.display = 'none';
        document.getElementById("search-page").style.display = 'none';
        document.getElementById("contact-page").style.display = 'none';
    }
    else if(divName == "contact-page")
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
        document.getElementById('video-frame').src = globalObject.getUrl();
    }
};

function preloadVideo(link) {
    globalObject.setUrl("https://www.youtube.com/embed/" + link);
    document.getElementById('video-frame').src = globalObject.getUrl();
}