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
    playlist = 0; //channel playlist id

    videos = 0;
    currentPage = 1;
    totalPages = 0; //total pages of graphs

    size = 0;
    totalSize = 0;
    position = 0;
    remainder = 0;

    token = 0;
    index = 0;
    url = 0;

    dateLL = new LinkedList();
    titleLL = new LinkedList();
    linkLL = new LinkedList();
    viewLL = new LinkedList();
    likeLL = new LinkedList();
    dislikeLL = new LinkedList();
    colorLL = new LinkedList();
    legend = [false, false, false];
}