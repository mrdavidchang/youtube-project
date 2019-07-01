class Node {
    constructor(element)
    {
        this.element = element;
        this.next = null;
    }
}

class LinkedList {
    constructor()
    {
        this.head = null;
        this.size = 0;
    }

    add(data)
    {
        //Creates a new node
        let node = new Node(data);
        node.next = this.head;
        this.head = node;
        this.size++;
    }

    get(index)
    {
        //Variables
        let node = this.head;
        let counter = 0;


        if(node == null)
            return null;
        else if(index == 0)
        {
            return node.element;
        }
        else 
        {
            //Loops thru
            while(counter < index)
            {
                node = node.next;
                counter++;
            }
            return node.element;
        }
    }

    set(index, value)
    {
        let node = this.head;
        let counter = 0;

        if(node == null)
        {
            return null;
        }
        else if(index == 0)
        {
            node.element = value;
        }
        else
        {
            //Loops thru
            while(counter < index)
            {
                node = node.next;
                counter++;
            }
            node.element = value;
        }
    }

    grabString(index, length)
    {
        //First loop the number of "index" times
        let node = this.head;

        if(index != 0)
        {
            for( let i = 0; i < index; i++)
            {
                node = node.next;
            }
        }

        //Then loop the length
        let result = [];
        for(let i = 0; i < length; i++)
        {
            let hold = node.element;
            result.push(hold);
            node = node.next;
        }
        return result;
    }

    isEmpty()
    {
        return this.size == 0;
    }
}

class Channel {
    constructor(id, name, picture)
    {
        this.id = id;
        this.name = name;
        this.picture = picture;

        this.subscription = null;
        this.videos = null;
        this.views = null;
        this.playlist = null;
        this.description = null;
    }

    getId()
    {
        return this.id;
    }

    getName()
    {
        return this.name;
    }

    getPicture()
    {
        return this.picture;
    }

    getDescription()
    {
        return this.description;
    }

    getSubscription()
    {
        return this.subscription;
    }

    getVideos()
    {
        return this.videos;
    }

    getViews()
    {
        return this.views;
    }

    getPlaylist()
    {
        return this.playlist;
    }

    setSubscription(sub)
    {
        this.subscription = sub;
    }

    setVideos(videos)
    {
        this.videos = videos;
    }

    setViews(views)
    {
        this.views = views;
    }

    setPlaylist(playlist)
    {
        this.playlist = playlist;
    }

    setDescription(description)
    {
        this.description = description;
    }

    print()
    {
        console.log("id: " + this.id);
        console.log("name: " + this.name);
        console.log("picture: " + this.picture);
        console.log("subscription: " + this.subscription);
        console.log("videos: " + this.videos);
        console.log("views: " + this.views);
        console.log("description: " + this.description); 
    }
}

class Playlist {
    constructor(playlist, videos, totalPages)
    {
        this.playlist = playlist;
        this.videos = videos;
        this.totalPages = totalPages;
        this.currentPage = 1;

        this.size = 0;
        this.totalSize = 0;
        this.position = 0;
        this.remainder = 0;

        this.token = 0;
        this.index = 0;
        this.url = 0;

        this.dateLL = new LinkedList();
        this.titleLL = new LinkedList();
        this.linkLL = new LinkedList();
        this.viewLL = new LinkedList();
        this.likeLL = new LinkedList();
        this.dislikeLL = new LinkedList();
        this.colorLL = new LinkedList();
        this.legend = [false, false, false];
    }

    getPlaylist(){
        return this.playlist;
    }

    setPlaylist(playlist) {
        this.playlist = playlist;
    }

    getVideos() {
        return this.videos;
    }

    setVideos(videos) {
        this.videos = videos;
    }

    getTotalPages() {
        return this.totalPages;
    }

    setTotalPages(totalPages) {
        this.totalPages = totalPages;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setCurrentPage(currentPage) {
        this.currentPage = currentPage;
    }

    getSize() {
        return this.size;
    }

    setSize(size) {
        this.size = size;
    }

    getTotalSize() {
        return this.totalSize;
    }

    setTotalSize(totalSize) {
        this.totalSize = totalSize;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
    }

    getRemainder() {
        return this.remainder;
    }

    setRemainder(remainder) {
        this.remainder = remainder;
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
    }

    getIndex() {
        return this.index;
    }

    setIndex(index) {
        this.index = index;
    }

    getUrl() {
        return this.url;
    }

    setUrl(url) {
        this.url = url;
    }

    getDateLL() {
        return this.dateLL;
    }

    addDate(value) {
        (this.dateLL).add(value);
    }

    getTitleLL() {
        return this.titleLL;
    }

    addTitle(value) {
        (this.titleLL).add(value);
    }

    getLinkLL() {
        return this.linkLL;
    }

    addLink(value) {
        (this.linkLL).add(value);
    }

    getViewLL() {
        return this.viewLL;
    }

    addView(value) {
        (this.viewLL).add(value);
    }

    getLikeLL() {
        return this.likeLL;
    }

    addLike(value) {
        (this.likeLL).add(value);
    }

    getDislikeLL() {
        return this.dislikeLL;
    }

    addDislike(value) {
        (this.dislikeLL).add(value);
    }

    getColorLL() {
        return this.colorLL;
    }

    addColor(value) {
        (this.colorLL).add(value);
    }

    grabView(position, size) {
        return (this.viewLL).grabString(position, size);
    }

    grabLike(position, size) {
        return (this.likeLL).grabString(position, size);
    }

    grabDislike(position, size) {
        return (this.dislikeLL).grabString(position, size);
    }

    grabDate(position, size) {
        return (this.dateLL).grabString(position, size);
    }

    grabColor(position, size) {
        return (this.colorLL).grabString(position, size);
    }

    getLegendOne() {
        return this.legend[0];
    }

    getLegendTwo() {
        return this.legend[1];
    }

    getLegendThree() {
        return this.legend[2];
    }

    setLegend(index, value)
    {
        this.legend[index] = value;
    }

    setColor(index, value)
    {
        this.colorLL.set(index, value);
    }








    
}