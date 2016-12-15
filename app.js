var $ = jQuery
var input = document.getElementById('autocomplete')
var options = { types: ['(cities)'] }
var autocomplete = new google.maps.places.Autocomplete(input, options)
var locSubmitted, locArray, locCity, locCountry, loc

function resetLocation () {
  locSubmitted = ''
  locArray = ''
  locCity = ''
  locCountry = ''
  loc = ''
}

// SUBMIT Form and assign result to variable
$('form.form').submit(function (event) {
  event.preventDefault()
  locSubmitted = $('.query').val()
  $('.query').val('')
  locArray = locSubmitted.split(',')
  locCity = locArray[0]
  locCountry = locArray.slice(-1)[0]
  loc = locCity + ',' + locCountry
  $('.searchField, .myLinks').hide()
  $('.choicePage, .home').show(1000)
  var title = 'Which sense do you want experience about ' + loc + '?'
  $('.question').text(title)
  showEtsy()
  showPics()
  showlastFm()
  showFoursquare()
})

// HOME to "Search loc"
$('.home').on('click', function () {
  resetLocation()
  $('.choicePage, .home, .etsy, .pics, .lastFm, .foursquare, .up').hide().find('ul').empty()
  $('.searchField, .myLinks').show(1000)
})

// BACK to "senses Choice Page" (same loc)
$('.back').on('click', function () {
  $('.etsy, .pics, .lastFm, .foursquare, .up').hide()
  $('.choicePage').show(1000)
})

// Up arrow »
$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $('.up').fadeIn()
  } else {
    $('.up').fadeOut()
  }
})

// Up on click
$('.up').click(function (e) {
  e.preventDefault()
  $('html, body').animate({scrollTop: 0}, 500)
})

// ETSY API search related to TOUCH sense
function showEtsy () {
  $('.touch').click(function () {
    $('.choicePage').hide()
    $('.etsy, .up').show(100)
    etsyListings()
  })

  function etsyListings () {
    var apiKey = 'b1cxdz90op6vpzomscu9fr09'
    var terms = loc
    var etsyURL = 'https://openapi.etsy.com/v2/listings/active.js?keywords=' +
      terms + '&limit=12&includes=Images:1&api_key=' + apiKey

    // $('.etsy').empty()
    $.ajax({
      url: etsyURL,
      dataType: 'jsonp',
      success: function (data) {
        if (data.ok) {
          if (data.count > 0) {
            $('.etsy ul').empty()
            data.results.forEach(function (item) {
              var li = $('<li>')
              li.append(
                '<a href="' + item.url + '" target="_blank">' +
                '<img src="' + item.Images[0].url_570xN + '"/></a><br>' +
                item.title
              )
              li.appendTo('.etsy ul')
            })
          } else {
            $('<p>No results.</p>').appendTo('.etsy')
          }
        }
      }
    })
  }
}

// --- start VISION using Foursquare API
function showPics () {
  $('.vision').click(function () {
    $('.choicePage').hide()
    $('.pics, .up').show(100)
    pics()
  })

  function pics () {
    $.getJSON('https://api.foursquare.com/v2/venues/explore?near=' + loc +
      '&venuePhotos=1&section=arts,outdoors&client_id=OPA2NWMUWOEPKG121Z00AOZF53TSTBG510HABCG20Y5GZWZB&client_secret=5JJSG5341TMELPTZ5UBPI2KBSXI5KZJQIGU3ZTXJBW20EX5O&v=20161208',
      function (data) {
        $('.pics ul').empty()
        var base = data.response.groups[0].items
        $.each(base, function (index) {
          var url = base[index].tips[0].canonicalUrl
          var photo = base[index].venue.photos.groups[0].items[0]
          var name = base[index].venue.name
          var content = '<li><a href="' + url + '" target="_blank">' + '<img src="' + photo.prefix + 'cap300' + photo.suffix + '"/></br>' + name + '</br></a></li>'
          $(content).appendTo('.pics ul')
        })
      }
    )
  }
}

// show lastFm, calling lastFm API - API key  19b8a524d7b3e2f4e8a48a323aaa7938
function showlastFm () {
  $('.audition').click(function () {
    $('.choicePage').hide()
    $('.lastFm, .up').show(100)
    audioLastFm()
  })

  function audioLastFm () {
    var url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + loc + '&api_key=19b8a524d7b3e2f4e8a48a323aaa7938&format=json&callback=?'
    $.getJSON(url).done(function (res) {
      $('.lastFm ul').empty()
      $.each(res.results.albummatches.album, function (i, item) {
        var albumName = item.name
        var albumArtist = item.artist
        var albumUrl = item.url
        var albumCover = item.image[3]['#text']
        var content = '<li><a href="' + albumUrl + '" target="_blank">' + '<img src="' + albumCover + '"/></br>' + albumName + '</br>' +
                albumArtist + '</br></a></li>'
        $(content).appendTo('.lastFm ul')
      })
    })
  }
}

 // show Foursquare, calling Foursquare API - ClientID: OPA2NWMUWOEPKG121Z00AOZF53TSTBG510HABCG20Y5GZWZB
function showFoursquare () {
  $('.taste').click(function () {
    $('.choicePage').hide()
    $('.foursquare, .up').show(100)
    fourSquare()
  })

  function fourSquare () {
    $.getJSON('https://api.foursquare.com/v2/venues/explore?near=' + loc +
            '&venuePhotos=1&query=Restaurants&client_id=OPA2NWMUWOEPKG121Z00AOZF53TSTBG510HABCG20Y5GZWZB&client_secret=5JJSG5341TMELPTZ5UBPI2KBSXI5KZJQIGU3ZTXJBW20EX5O&v=20161208',
    function displayVenues (data) {
      $('.foursquare ul').empty()
      var base = data.response.groups[0].items
      $.each(base, function (index) {
        var url = base[index].tips[0].canonicalUrl
        var text = base[index].tips[0].text
        var photo = base[index].venue.photos.groups[0].items[0]
        var name = base[index].venue.name
        var address = base[index].venue.location.address
        var city = base[index].venue.location.city
        var content = '<li><a href="' + url + '" target="_blank">' + '<img src="' + photo.prefix + 'cap300' + photo.suffix + '"/></br>' + name + '</br>' +
          address + ' - ' + city + '</br>' + text + '</br></a></li>'
        $(content).appendTo('.foursquare ul')
      })
    })
  }
}
