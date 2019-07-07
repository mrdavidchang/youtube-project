<<<<<<< HEAD
const videoQuota=50,searchQuota=20,maxVideos=15,greyColor="#DAE4E5",redColor="#FF0000",chartArea=document.getElementById("myChart").getContext("2d");function start(){gapi.client.init({apiKey:"AIzaSyDsX6BeWpKFCNbIhvIh-yICEN14TJSSANo",discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]}),toggleDiv("home-page")}function searchYoutube(e){toggleDiv("search-page");let t=[],o=[];gapi.client.youtube.search.list({part:"snippet",type:"channel",q:input.value,maxResults:searchQuota}).execute(e=>{if(null==e.result)alert('Quota Limit Reached!\nRedirecting to "contact + info" page.'),toggleDiv("contact-page");else{let l=e.result.items;l&&l.forEach(e=>{const l=`${e.snippet.channelId}`,a=`${e.snippet.title}`,n=`${e.snippet.thumbnails.high.url}`;let i=new Channel(l,a,n);o.push(i),t.push(l)}),requestChannels(t,o)}})}function requestChannels(e,t){gapi.client.youtube.channels.list({part:"statistics, contentDetails, snippet",id:e.join(",")}).execute(o=>{null==o.result&&(alert('Quota Limit Reached!\nRedirecting to "contact + info" page.'),toggleDiv("contact-page"));let l=o.result.items;if(l){l.forEach(o=>{const l=addCommas(`${o.statistics.subscriberCount}`),a=`${o.statistics.videoCount}`,n=addCommas(`${o.statistics.viewCount}`),i=`${o.contentDetails.relatedPlaylists.uploads}`,g=`${addBreak(o.snippet.description)}`;let s=findItem(`${o.id}`,e);t[s].setSubscription(l),t[s].setVideos(a),t[s].setViews(n),t[s].setPlaylist(i),t[s].setDescription(g)});let o=new Array,a=0,n="\r\n";for(let l=0;l<e.length;l++){o[l]=document.createElement("div"),o[l].id="sub-div";let e=t[l].getName();countWords(e)>18&&(e=e.substring(0,18),e+=" . . .");const i=t[l].getSubscription()+n+"Subscribers",g=addCommas(t[l].getVideos())+n+"Uploads",s=t[l].getViews()+n+"Total Views",c=t[l].getPicture();let d=document.createElement("img");d.src=c.toString(),d.width=100,d.height=100,o[l].append(d);let b=document.createElement("p"),r=document.createElement("p"),u=document.createElement("p"),m=document.createElement("p");b.textContent=i,r.textContent=g,u.textContent=s,m.textContent=e,b.className="sub-font1",r.className="sub-font1",u.className="sub-font1",m.className="sub-font2",b.id="hide-level-two",r.id="hide-level-one",u.id="hide-level-one",o[l].append(b),o[l].append(r),o[l].append(u),o[l].append(m);const p=t[l];o[l].addEventListener("click",function(e){goToChannel(p)}),0==a?(document.getElementById("search-page").appendChild(o[l]),a++):document.getElementById("search-page").appendChild(o[l-1].appendChild(o[l]))}}})}function goToChannel(e){toggleDiv("channel-page");let t=document.getElementById("middleSection"),o=document.getElementById("chartSection");0==e.getVideos()?(t.style.visibility="hidden",o.style.visibility="hidden"):(t.style.visibility="visible",o.style.visibility="visible");let l=Math.ceil(e.getVideos()/maxVideos);0==l&&(l=1);let a="1 / "+l;document.getElementById("pagination").innerHTML=a;const n=`\n        <div class="font-setting">\n            <b>${e.getSubscription()}</b> Subscribers\n            <br>\n            <b>${addCommas(e.getVideos())}</b> Uploads\n            <br>\n            <b>${e.getViews()}</b> Total Views\n\n            <div id='hide-level-three'>\n                <hr>\n                Description:<br/>${e.getDescription()}\n            </div>\n        </div>\n    `;loadPictureName(e.getId(),e.getPicture(),e.getName()),loadChannelData(n),globalObject=new Playlist(e.getPlaylist(),e.getVideos(),l);const i=e.getVideos()%maxVideos;0==i?globalObject.setRemainder(maxVideos):globalObject.setRemainder(i),requestPlaylist(requestVideos)}function loadPictureName(e,t,o){let l=document.createElement("img");l.src=t.toString(),l.width=200,l.height=200,l.alt="Picture of "+o,l.id="main-image";let a=document.getElementById("pictureName");for(;a.hasChildNodes();)a.removeChild(a.lastChild);a.append(l);let n="https://www.youtube.com/channel/"+e;l.onclick=function(){window.open(n,"_blank")};let i=document.createElement("h1");i.textContent=o,a.append(i)}function loadChannelData(e){document.getElementById("statistics").innerHTML=e}function requestPlaylist(e){const t=globalObject.getToken();let o;o=0==t?{playlistId:globalObject.getPlaylist(),part:"snippet,contentDetails",maxResults:videoQuota}:{playlistId:globalObject.getPlaylist(),part:"snippet,contentDetails",maxResults:videoQuota,pageToken:t},gapi.client.youtube.playlistItems.list(o).execute(t=>{null==t.result&&(alert('Quota Limit Reached!\nRedirecting to "contact + info" page.'),toggleDiv("contact-page")),globalObject.setToken(t.result.nextPageToken);const o=t.result.items;if(o){let t=[];o.length>maxVideos?globalObject.setSize(maxVideos):globalObject.setSize(o.length),globalObject.setTotalSize(globalObject.getTotalSize()+o.length),globalObject.setPosition(globalObject.getPosition()+o.length),checkButtons(),o.forEach(e=>{const o=`${e.snippet.publishedAt}`,l=`${e.snippet.title}`,a=`${e.snippet.resourceId.videoId}`;globalObject.getLinkLL().isEmpty()&&preloadVideo(a),globalObject.addDate(formatDate(o)),globalObject.addTitle(l),globalObject.addLink(a),globalObject.addColor(greyColor),t.push(a)}),e(t,drawGraph)}else videoContainer.innerHTML="No Uploaded Videos :("})}function requestVideos(e,t){gapi.client.youtube.videos.list({part:"statistics",id:e.join(",")}).execute(e=>{null==e.result&&(alert('Quota Limit Reached!\nRedirecting to "contact + info" page.'),toggleDiv("contact-page"));const o=e.result.items;if(o){for(let e=0;e<o.length;++e){const t=`${o[e].statistics.viewCount}`,l=`${o[e].statistics.likeCount}`,a=`${o[e].statistics.dislikeCount}`;globalObject.addView(t),globalObject.addLike(l),globalObject.addDislike(a)}globalObject.getCurrentPage()==globalObject.getTotalPages()&&globalObject.setSize(globalObject.getRemainder()),globalObject.setPosition(globalObject.getPosition()-globalObject.getSize());let e=globalObject.grabView(globalObject.getPosition(),globalObject.getSize()),l=globalObject.grabLike(globalObject.getPosition(),globalObject.getSize()),a=globalObject.grabDislike(globalObject.getPosition(),globalObject.getSize()),n=globalObject.grabDate(globalObject.getPosition(),globalObject.getSize()),i=globalObject.grabColor(globalObject.getPosition(),globalObject.getSize());t(e,l,a,n,i)}}),document.getElementById("leftButton").style.pointerEvents="auto",document.getElementById("rightButton").style.pointerEvents="auto"}function drawGraph(e,t,o,l,a){var n=$(document).scrollTop();0==chartTrigger?chartTrigger=1:myChart.destroy(),myChart=new Chart(chartArea,{type:"line",data:{labels:l,datasets:[{data:e,label:"Views",borderColor:"#0ABDE3",fill:!1,pointRadius:10,pointHoverRadius:10,pointBackgroundColor:a,hidden:globalObject.getLegendOne()},{data:t,label:"Likes",borderColor:"#3de117",fill:!1,pointRadius:8,pointHoverRadius:8,pointBackgroundColor:a,hidden:globalObject.getLegendTwo()},{data:o,label:"Dislikes",borderColor:"#FFA500",fill:!1,pointRadius:8,pointHoverRadius:8,pointBackgroundColor:a,hidden:globalObject.getLegendThree()}]},options:{responsive:!0,maintainAspectRatio:!1,layout:{padding:{left:11,right:11}},legend:{onClick:function(e,t){let o,l,a=Chart.defaults.global.legend.onClick,n=0;1==globalObject.getLegendOne()&&n++,1==globalObject.getLegendTwo()&&n++,1==globalObject.getLegendThree()&&n++,2==n&&0==t.hidden||("Views"==t.text?o=0:"Likes"==t.text?o=1:"Dislikes"==t.text&&(o=2),l=!t.hidden,a.call(this,e,t),globalObject.setLegend(o,l))}},onClick:function(e,t){if(null!=t[0]){var o=t[0]._index;this.data.datasets[0].pointBackgroundColor[o]==greyColor?(this.data.datasets[0].pointBackgroundColor[o]=redColor,this.data.datasets[1].pointBackgroundColor[o]=redColor,this.data.datasets[2].pointBackgroundColor[o]=redColor,globalObject.setColor(globalObject.getIndex(),redColor)):(this.data.datasets[0].pointBackgroundColor[o]=greyColor,this.data.datasets[1].pointBackgroundColor[o]=greyColor,this.data.datasets[2].pointBackgroundColor[o]=greyColor,globalObject.setColor(globalObject.getIndex(),greyColor)),myChart.update()}},tooltips:{callbacks:{label:function(e,t){let o,l=t.datasets[e.datasetIndex].data[e.index];o=globalObject.getCurrentPage()==globalObject.getTotalPages()?e.index:globalObject.getTotalSize()-(globalObject.getCurrentPage()*maxVideos-e.index),globalObject.setIndex(o),globalObject.setUrl("https://www.youtube.com/embed/"+globalObject.getLinkLL().get(o));let a=[];return a.push(globalObject.getTitleLL().get(o)),a.push(addCommas(l)),a},mode:"index",intersect:!1}},scales:{yAxes:[{ticks:{callback:function(e){return e/1e6>=1?e/1e6+" million":e/1e3>=1?e/1e3+"k":e}}}],xAxes:[{ticks:{fontSize:12,autoSkip:!1,maxRotation:30,minRotation:30},scaleLabel:{display:!0,labelString:"Date Video Uploaded                   "}}]}}}),$(document).scrollTop(n)}function checkButtons(){1==globalObject.getCurrentPage()?(document.getElementById("rightButton").enabled=!1,document.getElementById("rightButton").disabled=!0):(document.getElementById("rightButton").enabled=!0,document.getElementById("rightButton").disabled=!1),globalObject.getCurrentPage()<globalObject.getTotalPages()?(document.getElementById("leftButton").enabled=!0,document.getElementById("leftButton").disabled=!1):globalObject.getCurrentPage()==globalObject.getTotalPages()&&(document.getElementById("leftButton").enabled=!1,document.getElementById("leftButton").disabled=!0)}function cycleLeft(e){if(globalObject.getPosition()<maxVideos&&globalObject.getTotalSize()!=globalObject.getVideos())document.getElementById("leftButton").style.pointerEvents="none",document.getElementById("rightButton").style.pointerEvents="none",e(requestVideos);else if(globalObject.getCurrentPage()+1==globalObject.getTotalPages())globalObject.setPosition(globalObject.getPosition()-globalObject.getRemainder()),drawGraph(globalObject.grabView(globalObject.getPosition(),globalObject.getRemainder()),globalObject.grabLike(globalObject.getPosition(),globalObject.getRemainder()),globalObject.grabDislike(globalObject.getPosition(),globalObject.getRemainder()),globalObject.grabDate(globalObject.getPosition(),globalObject.getRemainder()),globalObject.grabColor(globalObject.getPosition(),globalObject.getRemainder()));else try{globalObject.setPosition(globalObject.getPosition()-maxVideos),drawGraph(globalObject.grabView(globalObject.getPosition(),maxVideos),globalObject.grabLike(globalObject.getPosition(),maxVideos),globalObject.grabDislike(globalObject.getPosition(),maxVideos),globalObject.grabDate(globalObject.getPosition(),maxVideos),globalObject.grabColor(globalObject.getPosition(),maxVideos))}catch(e){console.error("undefined")}globalObject.setCurrentPage(globalObject.getCurrentPage()+1),checkButtons();let t=globalObject.getCurrentPage()+" / "+globalObject.getTotalPages();document.getElementById("pagination").innerHTML=t}function addBreak(e){return e.replace(/\n/g,"<br />")}function formatDate(e){let t=new Date(e);return t.toLocaleString("en-us",{month:"short"})+" "+t.getDate()+", "+t.getFullYear()}function addCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function toggleDiv(e){window.scrollTo(0,0),document.getElementById("video-frame").src="about:blank","home-page"==e?(document.getElementById("input").value="",document.getElementById("search-page").style.display="none",document.getElementById("channel-page").style.display="none",document.getElementById("contact-page").style.display="none"):"search-page"==e?(document.getElementById("home-page").style.display="none",document.getElementById("channel-page").style.display="none",document.getElementById("contact-page").style.display="none"):"channel-page"==e?(document.getElementById("home-page").style.display="none",document.getElementById("search-page").style.display="none",document.getElementById("contact-page").style.display="none"):"contact-page"==e&&(document.getElementById("home-page").style.display="none",document.getElementById("search-page").style.display="none",document.getElementById("channel-page").style.display="none"),document.getElementById(e).style.display="block"}function findItem(e,t){for(let o=0;o<t.length;o++)if(e==t[o])return o;return-1}function preloadVideo(e){globalObject.setUrl("https://www.youtube.com/embed/"+e),document.getElementById("video-frame").src=globalObject.getUrl()}function countWords(e){var t=e.match(/[\u00ff-\uffff]|\S+/g);return t?t.length:0}chartTrigger=0,gapi.load("client",start),document.getElementById("search-form").addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("search-page");for(;t.firstChild;)t.removeChild(t.firstChild);input.value?searchYoutube(input.value):toggleDiv("home-page")}),document.getElementById("rightButton").onclick=function(e){globalObject.getCurrentPage()==globalObject.getTotalPages()?globalObject.setPosition(globalObject.getPosition()+globalObject.getRemainder()):globalObject.setPosition(globalObject.getPosition()+maxVideos),drawGraph(globalObject.grabView(globalObject.getPosition(),maxVideos),globalObject.grabLike(globalObject.getPosition(),maxVideos),globalObject.grabDislike(globalObject.getPosition(),maxVideos),globalObject.grabDate(globalObject.getPosition(),maxVideos),globalObject.grabColor(globalObject.getPosition(),maxVideos)),globalObject.setCurrentPage(globalObject.getCurrentPage()-1),checkButtons();let t=globalObject.getCurrentPage()+" / "+globalObject.getTotalPages();document.getElementById("pagination").innerHTML=t},document.getElementById("myChart").onclick=function(e){void 0!==myChart.lastActive[0]&&(document.getElementById("video-frame").src=globalObject.getUrl())};
=======
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

                let tempTitle = channelArray[i].getName();                
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

                app4.id = "truncate";

                app1.className = "sub-font1 hide-level-two";
                app2.className = "sub-font1 hide-level-one";
                app3.className = "sub-font1 hide-level-one";
                app4.className = "sub-font2";

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

            <div class='hide-level-three'>
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
                    left: 11,
                    right: 11,
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

function countWords(str) {
    var matches = str.match(/[\u00ff-\uffff]|\S+/g);
    return matches ? matches.length : 0;
}
>>>>>>> errorless
