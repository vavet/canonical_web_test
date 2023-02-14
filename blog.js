function loadPage(){
    //document.getElementById("main").innerHTML = "loading ..."
        $.ajax({
            type: "get",
            url: "https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json",
            headers:
                {
                    //"RequestVerificationToken": tkn
                },
            data: {
                //prospectId: id
            },

            //if received a response from the server
            success: function (responseText) {
                console.log(responseText)
            },
            error: function (xdh, statusText, responseText) {
                console.log("error occured while loading data");
                console.log(xdh, statusText, responseText)
            }
        });

}
