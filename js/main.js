const videoQuota = 50,
 searchQuota = 20,
 maxVideos = 15,
 greyColor = "#DAE4E5",
 redColor = "#FF0000",
 chartArea = document.getElementById("myChart").getContext("2d");

function start() {
 gapi.client.init({
  apiKey: "AIzaSyDsX6BeWpKFCNbIhvIh-yICEN14TJSSANo",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
 }), toggleDiv("home-page")
}

function searchYoutube(e) {
 toggleDiv("search-page");
 let t = [],
  l = [];
 gapi.client.youtube.search.list({
  part: "snippet",
  type: "channel",
  q: input.value,
  maxResults: searchQuota
 }).execute(e => {
  if (null == e.result) alert('Quota Limit Reached Redirecting to "contact + info" page');
  else {
   let o = e.result.items;
   o && o.forEach(e => {
    const o = `${e.snippet.channelId}`,
     a = `${e.snippet.title}`,
     n = `${e.snippet.thumbnails.high.url}`;
    let i = new Channel(o, a, n);
    l.push(i), t.push(o)
   }), requestChannels(t, l)
  }
 })
}

function requestChannels(e, t) {
 gapi.client.youtube.channels.list({
  part: "statistics, contentDetails, snippet",
  id: e.join(",")
 }).execute(l => {
  null == l.result && alert('Quota Limit Reached Redirecting to "contact + info" page');
  let o = l.result.items;
  if (o) {
   o.forEach(l => {
    const o = addCommas(`${l.statistics.subscriberCount}`),
     a = `${l.statistics.videoCount}`,
     n = addCommas(`${l.statistics.viewCount}`),
     i = `${l.contentDetails.relatedPlaylists.uploads}`,
     s = `${addBreak(l.snippet.description)}`;
    let c = findItem(`${l.id}`, e);
    t[c].setSubscription(o), t[c].setVideos(a), t[c].setViews(n), t[c].setPlaylist(i), t[c].setDescription(s)
   });
   let l = new Array,
    a = 0,
    n = "\r\n";
   for (let o = 0; o < e.length; o++) {
    l[o] = document.createElement("div"), l[o].id = "sub-div";
    const e = t[o].getName(),
     i = t[o].getSubscription() + n + "Subscribers",
     s = addCommas(t[o].getVideos()) + n + "Uploads",
     c = t[o].getViews() + n + "Total Views",
     d = t[o].getPicture();
    let g = document.createElement("img");
    g.src = d.toString(), g.width = 100, g.height = 100, l[o].append(g);
    let r = document.createElement("h4"),
     b = document.createElement("h4"),
     u = document.createElement("h4"),
     p = document.createElement("h4");
    r.textContent = i, b.textContent = s, u.textContent = c, p.textContent = e, r.id = "hide-level-two", b.id = "hide-level-one", u.id = "hide-level-one", l[o].append(r), l[o].append(b), l[o].append(u), l[o].append(p);
    const m = t[o];
    l[o].addEventListener("click", function(e) {
     goToChannel(m)
    }), 0 == a ? (document.getElementById("search-page").appendChild(l[o]), a++) : document.getElementById("search-page").appendChild(l[o - 1].appendChild(l[o]))
   }
  }
 })
}

function goToChannel(e) {
 toggleDiv("channel-page");
 let t = document.getElementById("middleSection"),
  l = document.getElementById("chartSection");
 0 == e.getVideos() ? (t.style.visibility = "hidden", l.style.visibility = "hidden") : (t.style.visibility = "visible", l.style.visibility = "visible");
 let o = Math.ceil(e.getVideos() / maxVideos);
 0 == o && (o = 1);
 let a = "1 / " + o;
 document.getElementById("pagination").innerHTML = a;
 const n = `\n        <div class="font-setting">\n            <b>${e.getSubscription()}</b> Subscribers\n            <br>\n            <b>${addCommas(e.getVideos())}</b> Uploads\n            <br>\n            <b>${e.getViews()}</b> Total Views\n\n            <div id='hide-level-three'>\n                <hr>\n                Description:<br/>${e.getDescription()}\n            </div>\n        </div>\n    `;
 loadPictureName(e.getId(), e.getPicture(), e.getName()), loadChannelData(n), globalObject = new Playlist, globalObject.playlist = e.getPlaylist(), globalObject.videos = e.getVideos(), globalObject.totalPages = o;
 const i = e.getVideos() % maxVideos;
 globalObject.remainder = 0 == i ? maxVideos : i, requestPlaylist(requestVideos)
}

function loadPictureName(e, t, l) {
 let o = document.createElement("img");
 o.src = t.toString(), o.width = 200, o.height = 200, o.alt = "Picture of " + l, o.id = "main-image";
 let a = document.getElementById("pictureName");
 for (; a.hasChildNodes();) a.removeChild(a.lastChild);
 a.append(o);
 let n = "https://www.youtube.com/channel/" + e;
 o.onclick = function() {
  window.open(n, "_blank")
 };
 let i = document.createElement("h1");
 i.textContent = l, a.append(i)
}

function loadChannelData(e) {
 document.getElementById("statistics").innerHTML = e
}

function requestPlaylist(e) {
 const t = globalObject.token;
 let l;
 l = 0 == t ? {
  playlistId: globalObject.playlist,
  part: "snippet,contentDetails",
  maxResults: videoQuota
 } : {
  playlistId: globalObject.playlist,
  part: "snippet,contentDetails",
  maxResults: videoQuota,
  pageToken: t
 }, gapi.client.youtube.playlistItems.list(l).execute(t => {
  null == t.result && alert('Quota Limit Reached Redirecting to "contact + info" page'), globalObject.token = t.result.nextPageToken;
  const l = t.result.items;
  if (l) {
   let t = [];
   l.length > maxVideos ? globalObject.size = maxVideos : globalObject.size = l.length, globalObject.totalSize += l.length, globalObject.position += l.length, checkButtons(), l.forEach(e => {
    const l = `${e.snippet.publishedAt}`,
     o = `${e.snippet.title}`,
     a = `${e.snippet.resourceId.videoId}`;
    globalObject.linkLL.isEmpty() && preloadVideo(a), globalObject.dateLL.add(formatDate(l)), globalObject.titleLL.add(o), globalObject.linkLL.add(a), globalObject.colorLL.add(greyColor), t.push(a)
   }), e(t, drawGraph)
  } else videoContainer.innerHTML = "No Uploaded Videos :("
 })
}

function requestVideos(e, t) {
 gapi.client.youtube.videos.list({
  part: "statistics",
  id: e.join(",")
 }).execute(e => {
  null == e.result && alert('Quota Limit Reached Redirecting to "contact + info" page');
  const l = e.result.items;
  if (l) {
   for (let e = 0; e < l.length; ++e) {
    const t = `${l[e].statistics.viewCount}`,
     o = `${l[e].statistics.likeCount}`,
     a = `${l[e].statistics.dislikeCount}`;
    globalObject.viewLL.add(t), globalObject.likeLL.add(o), globalObject.dislikeLL.add(a)
   }
   globalObject.currentPage == globalObject.totalPages && (globalObject.size = globalObject.remainder), globalObject.position -= globalObject.size;
   let e = globalObject.viewLL.grabString(globalObject.position, globalObject.size),
    o = globalObject.likeLL.grabString(globalObject.position, globalObject.size),
    a = globalObject.dislikeLL.grabString(globalObject.position, globalObject.size),
    n = globalObject.dateLL.grabString(globalObject.position, globalObject.size),
    i = globalObject.colorLL.grabString(globalObject.position, globalObject.size);
   t(e, o, a, n, i)
  }
 }), document.getElementById("leftButton").style.pointerEvents = "auto", document.getElementById("rightButton").style.pointerEvents = "auto"
}

function drawGraph(e, t, l, o, a) {
 0 == chartTrigger ? chartTrigger = 1 : myChart.destroy(), myChart = new Chart(chartArea, {
  type: "line",
  responsive: !0,
  maintainAspectRatio: !1,
  data: {
   labels: o,
   datasets: [{
    data: e,
    label: "Views",
    borderColor: "#0ABDE3",
    fill: !1,
    pointRadius: 7,
    pointHoverRadius: 8,
    pointBackgroundColor: a,
    hidden: globalObject.legend[0]
   }, {
    data: t,
    label: "Likes",
    borderColor: "#3de117",
    fill: !1,
    pointRadius: 5,
    pointHoverRadius: 6,
    pointBackgroundColor: a,
    hidden: globalObject.legend[1]
   }, {
    data: l,
    label: "Dislikes",
    borderColor: "#FFA500",
    fill: !1,
    pointRadius: 5,
    pointHoverRadius: 6,
    pointBackgroundColor: a,
    hidden: globalObject.legend[2]
   }]
  },
  options: {
   legend: {
    onClick: function(e, t) {
     let l, o, a = Chart.defaults.global.legend.onClick;
     "Views" == t.text ? l = 0 : "Likes" == t.text ? l = 1 : "Dislikes" == t.text && (l = 2), o = !t.hidden, a.call(this, e, t), globalObject.legend[l] = o
    }
   },
   onClick: function(e, t) {
    if (null != t[0]) {
     var l = t[0]._index;
     this.data.datasets[0].pointBackgroundColor[l] == greyColor ? (this.data.datasets[0].pointBackgroundColor[l] = redColor, this.data.datasets[1].pointBackgroundColor[l] = redColor, this.data.datasets[2].pointBackgroundColor[l] = redColor, globalObject.colorLL.set(globalObject.index, redColor)) : (this.data.datasets[0].pointBackgroundColor[l] = greyColor, this.data.datasets[1].pointBackgroundColor[l] = greyColor, this.data.datasets[2].pointBackgroundColor[l] = greyColor, globalObject.colorLL.set(globalObject.index, greyColor)), myChart.update()
    }
   },
   tooltips: {
    callbacks: {
     label: function(e, t) {
      let l, o = t.datasets[e.datasetIndex].data[e.index];
      l = globalObject.currentPage == globalObject.totalPages ? e.index : globalObject.totalSize - (globalObject.currentPage * maxVideos - e.index), console.error("position: " + globalObject.position + " ||||||||||| math: " + l), globalObject.index = l, globalObject.url = "https://www.youtube.com/embed/" + globalObject.linkLL.get(l);
      let a = [];
      return a.push(globalObject.titleLL.get(l)), a.push(addCommas(o)), a
     },
     mode: "index",
     intersect: !1
    }
   },
   scales: {
    yAxes: [{
     ticks: {
      callback: function(e) {
       return e / 1e6 >= 1 ? e / 1e6 + " million" : e / 1e3 >= 1 ? e / 1e3 + "k" : e
      }
     }
    }],
    xAxes: [{
     ticks: {
      fontSize: 12
     },
     scaleLabel: {
      display: !0,
      labelString: "Date Video Uploaded                  "
     }
    }]
   }
  }
 })
}

function checkButtons() {
 1 == globalObject.currentPage ? (document.getElementById("rightButton").enabled = !1, document.getElementById("rightButton").disabled = !0) : (document.getElementById("rightButton").enabled = !0, document.getElementById("rightButton").disabled = !1), globalObject.currentPage < globalObject.totalPages ? (document.getElementById("leftButton").enabled = !0, document.getElementById("leftButton").disabled = !1) : globalObject.currentPage == globalObject.totalPages && (document.getElementById("leftButton").enabled = !1, document.getElementById("leftButton").disabled = !0)
}

function cycleLeft(e) {
 if (console.log("total size: " + globalObject.totalSize), console.log("position: " + globalObject.position), console.log(""), globalObject.position < maxVideos && globalObject.totalSize != globalObject.videos) document.getElementById("leftButton").style.pointerEvents = "none", document.getElementById("rightButton").style.pointerEvents = "none", e(requestVideos);
 else if (globalObject.currentPage + 1 == globalObject.totalPages) globalObject.position -= globalObject.remainder, drawGraph(globalObject.viewLL.grabString(globalObject.position, globalObject.remainder), globalObject.likeLL.grabString(globalObject.position, globalObject.remainder), globalObject.dislikeLL.grabString(globalObject.position, globalObject.remainder), globalObject.dateLL.grabString(globalObject.position, globalObject.remainder), globalObject.colorLL.grabString(globalObject.position, globalObject.remainder));
 else try {
  globalObject.position -= maxVideos, drawGraph(globalObject.viewLL.grabString(globalObject.position, maxVideos), globalObject.likeLL.grabString(globalObject.position, maxVideos), globalObject.dislikeLL.grabString(globalObject.position, maxVideos), globalObject.dateLL.grabString(globalObject.position, maxVideos), globalObject.colorLL.grabString(globalObject.position, maxVideos))
 } catch (e) {
  console.error("undefined")
 }
 globalObject.currentPage++, checkButtons();
 let t = globalObject.currentPage + " / " + globalObject.totalPages;
 document.getElementById("pagination").innerHTML = t
}

function addBreak(e) {
 return e.replace(/\n/g, "<br />")
}

function formatDate(e) {
 let t = new Date(e);
 return t.toLocaleString("en-us", {
  month: "short"
 }) + " " + t.getDate() + ", " + t.getFullYear()
}

function addCommas(e) {
 return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function toggleDiv(e) {
 window.scrollTo(0, 0), document.getElementById("video-frame").src = "about:blank", "home-page" == e ? (document.getElementById("input").value = "", document.getElementById("search-page").style.display = "none", document.getElementById("channel-page").style.display = "none", document.getElementById("info-page").style.display = "none") : "search-page" == e ? (document.getElementById("home-page").style.display = "none", document.getElementById("channel-page").style.display = "none", document.getElementById("info-page").style.display = "none") : "channel-page" == e ? (document.getElementById("home-page").style.display = "none", document.getElementById("search-page").style.display = "none", document.getElementById("info-page").style.display = "none") : "info-page" == e && (document.getElementById("home-page").style.display = "none", document.getElementById("search-page").style.display = "none", document.getElementById("channel-page").style.display = "none"), document.getElementById(e).style.display = "block"
}

function findItem(e, t) {
 for (let l = 0; l < t.length; l++)
  if (e == t[l]) return l;
 return -1
}

function preloadVideo(e) {
 globalObject.url = "https://www.youtube.com/embed/" + e, document.getElementById("video-frame").src = globalObject.url
}
chartTrigger = 0, gapi.load("client", start), document.getElementById("search-form").addEventListener("submit", e => {
 e.preventDefault();
 let t = document.getElementById("search-page");
 for (; t.firstChild;) t.removeChild(t.firstChild);
 input.value ? searchYoutube(input.value) : toggleDiv("home-page")
}), document.getElementById("rightButton").onclick = function(e) {
 console.log("total size: " + globalObject.totalSize), console.log("position: " + globalObject.position), console.log(""), globalObject.currentPage == globalObject.totalPages ? globalObject.position += globalObject.remainder : globalObject.position += maxVideos, drawGraph(globalObject.viewLL.grabString(globalObject.position, maxVideos), globalObject.likeLL.grabString(globalObject.position, maxVideos), globalObject.dislikeLL.grabString(globalObject.position, maxVideos), globalObject.dateLL.grabString(globalObject.position, maxVideos), globalObject.colorLL.grabString(globalObject.position, maxVideos)), globalObject.currentPage--, checkButtons();
 let t = globalObject.currentPage + " / " + globalObject.totalPages;
 document.getElementById("pagination").innerHTML = t
}, document.getElementById("myChart").onclick = function(e) {
 void 0 !== myChart.lastActive[0] && (document.getElementById("video-frame").src = globalObject.url)
};