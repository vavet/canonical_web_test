var dataURL = "https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json";

// After loading the json data the post cards are being generated and added to a container on the page
function loadData(){
        $.ajax({
            type: "get",
            url: dataURL,
            headers:{},
            data: {},

            //if received a response from the server
            success: function (postArr) {
                console.log(postArr)
                renderData(postArr)
            },
            error: function (xdh, statusText, postArr) {
                console.log("error occured while loading data");
                console.log(xdh, statusText, postArr)
            }
        });

}

function renderData(postArr){
    let container = document.getElementById("container");
    container.innerHTML = "";
    for (const postObj of postArr) {
        let card = document.createElement("div");
        card.className = "col-4 col-medium-2 p-card--highlighted custom-box-default " +
            "custom-card-body custom-border-top-solid-highlight";
        // building card body
        card.appendChild(buildHeader(postObj));
        card.appendChild(buildBody(postObj));
        card.appendChild(buildFooter(postObj));

        container.appendChild(card);
    }
}



// HEADER
function buildHeader(postObj){
    let header = document.createElement("header");
    let h5 = document.createElement("h5");
    h5.className = "custom-box-default custom-card-header";
    h5.innerText = getPostTitle(postObj);
    header.appendChild(h5);
    return header;
}

// to get the title for the header I look for a topic ID match in the content
// if no topic is provided then try by category ID
// if neither found then just take the name of the first wp:term
function getPostTitle(postObj){

    let categoryTitle;
    // trying to get the tile by topic id
    const topics = postObj.topic;
    if(topics != null && topics.length>0){
        for (const topic of topics) {
            categoryTitle = findPostCategoryName(postObj, topic);
           if(categoryTitle != null){
               break;
           }
        }
    }
    if(categoryTitle == null){
        // if not, trying by category id
        const categories = postObj.categories;
        if(categories != null && categories.length>0){
            for (const category of categories) {
                categoryTitle = findPostCategoryName(postObj, category);
                if(categoryTitle != null){
                    break;
                }
            }
        }
    }
    if(categoryTitle == null){
        // if not, just getting the first available
        categoryTitle = findPostCategoryName(postObj);

    }
    if(categoryTitle == null){
        categoryTitle = "untitled";
    }


    return categoryTitle
}

function findPostCategoryName(postObj, topic){
    try{
        terms = postObj._embedded['wp:term'];
        for (const term of terms) {
            for (const subterm of term) {
                if(topic == null){
                    return subterm.name
                }
                else if (subterm.id == topic) {
                    return subterm.name;
                }
            }
        }
    }
    catch (e){
        console.log("no category was found by topic")
        return null;
    }
}

// BODY
function buildBody(postObj){
    let body = document.createElement("div");
    body.style.height="100%"
    // image

    let articleURL = postObj.link;
    let mediaURL = postObj.featured_media;
    body.className = "p-card__content custom-box-default custom-border-top-dotted";
    let bodyImgDiv = document.createElement("div");
    bodyImgDiv.className = "u-crop--16-9 custom-box-vertical";
    let bodyImgA = document.createElement("a");
    bodyImgA.href = articleURL;
    let bodyImgImg = document.createElement("img");
    bodyImgImg.height = 311;
    bodyImgImg.width = 555;
    bodyImgImg.src = mediaURL;
    bodyImgA.appendChild(bodyImgImg);
    bodyImgDiv.appendChild(bodyImgA);
    body.appendChild(bodyImgDiv);

    // title
    let bodyTitleDiv = document.createElement("div");
    let bodyTitleH3 = document.createElement("h3");
    bodyTitleH3.className = "p-heading--4 custom-card-body";
    let bodyTitleA = document.createElement("a");
    bodyTitleA.href = articleURL;
    bodyTitleA.innerText = postObj.title.rendered;
    bodyTitleH3.appendChild(bodyTitleA);
    bodyTitleDiv.appendChild(bodyTitleH3);
    body.appendChild(bodyTitleDiv)

    let bodyDateAuthor = document.createElement("em");
    let authors = getAuthors(postObj);
    let dateStr = getDate(postObj);
    let byStr = "by "+ authors.join(", ") + dateStr;
    bodyDateAuthor.innerHTML = byStr;
    body.appendChild(bodyDateAuthor)

    return body;
}

function getAuthors(postObj){
    let authors = postObj._embedded.author;
    let nameURLMap = new Map();
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].name != null){
            nameURLMap.set(authors[i].name, authors[i].link);
        }
    }

    let authorLinks = [];
    for (let [authorNameURLMapKey, authorNameURLMapValue] of  nameURLMap) {
        let author = document.createElement("a");
        author.href = authorNameURLMapValue;
        author.innerText = authorNameURLMapKey;
        authorLinks.push(author.outerHTML);
    }

    return authorLinks;
}

function getDate(postObj){
    let day = postObj._start_day;
    let monthNumber = postObj._start_month;
    let year = postObj._start_year;
    return " on "+day + " " + getMonthName(monthNumber) + " " +year;
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
}

// FOOTER
function buildFooter(postObj){
    const categories = postObj.categories;
    let categoryTitle;
    let categoryDiv;
    if(categories != null && categories.length>0){
        for (const category of categories) {
            categoryTitle = findPostCategoryName(postObj, category);
            if(categoryTitle != null){
                break;
            }
        }
    }
    if(categoryTitle != null){
        categoryDiv = document.createElement("div");
        categoryDiv.className = "custom-box-default custom-card-footer custom-border-top-dotted";
        categoryDiv.innerText = categoryTitle;
    }
    return categoryDiv;
}
