
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var articles = [];

    // Get inputs
    var streetInput = $('#street').val();
    var cityInput = $('#city').val();

    // Make url string
    var address = streetInput + ', ' + cityInput;

    // Greet da user with input location!
    $greeting.text('So, you want to live at ' + address + '?');

    // Background Image append
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + '';
    $body.append('<img class="bgimg" src="'+streetviewUrl +'">');

    // New York Times Json request
    var nyTimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyTimesUrl += '?' + $.param({
      'api-key': "0aa8325a68c04022a9abf72301daadaa",
      'q': cityInput
    });
    $.getJSON(nyTimesUrl, function(data){
        $nytHeaderElem.text('New York Times Articles About ' + cityInput);

        articles = data.response.docs;

        for (var i=0; i<articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
        };
    }).error(function(err) {
        $nytElem.append('<li class="article">'+'"New York Times Article Could Not Be Loaded"'+'</li>');
        throw err;
    });


    // Wikipedia Ajax request
    // "?callback=?"
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityInput + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resource");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function( response ) {
            var articleList = response[1];

            for(var i=0; i < articleList.length; i++) {
                var articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="'+ url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    // clear out old data before new request, This was here when I got here...
    $wikiElem.text("");
    $nytElem.text("");

    return false;
};

$('#form-container').submit(loadData);
