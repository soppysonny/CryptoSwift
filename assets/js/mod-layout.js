function initOffCanvasMenu() {
  var h1 = function(id, title) {
    return '<li class="uk-parent"><a href="#" class="mod-offcanvas-toc-h1">' + title + '</a><ul class="uk-nav-sub">';
  };
  var h2 = function(id, title) {
    return '<li><a class="mod-offcanvas-toc-h2" href="#' + id +
           '" uk-scroll="offset: 100" onclick="UIkit.offcanvas(\'#offcanvas-push\').hide();">' + title + '</a></li>';
  };

  var link = function(tag, id, title, h1open) {
    return (tag == "H1" && h1open == true) ? "</ul></li>" + h1(id, title) : (tag == "H1") ? h1(id, title) : h2(id, title);
  };
  var h1Open = false;
  var comb = ""
  $(".mod-base-content-section h1, h2").each(function() {
    el = $(this);
    var title = el.text();
    var id = el.attr("id");
    var tag = el.prop("tagName"); 
    if (title == undefined || id == undefined) { return; }
    comb += link(tag, id, title, h1Open);
    if (tag == 'H1') { h1Open = true; }
  });
  if (h1Open == true) {
    comb += "</ul></li>";
    $(".mod-offcanvas-toc").html(comb);
  }
}

function initScrollToTop() {
  var pixelOffset = 40,
  $back_to_top = $('.mod-to-top');
  $(window).scroll(function(){
    ( $(this).scrollTop() > pixelOffset ) ? $back_to_top.show() : $back_to_top.hide();;
  });
}

jQuery(document).ready(function($){
  initOffCanvasMenu();
  initScrollToTop();
});

function copyElementInnerTextToClipboard(elementId) {
  var element = document.getElementById(elementId);
  copyTextToClipboard(element.innerText);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
    var successMessage = "<div class='uk-margin-remove uk-card uk-card-secondary uk-card-body uk-card-small uk-border-rounded uk-text-large'><span class='uk-margin-small-right' uk-icon='icon: info; ratio: 2;'></span>copied...</div>";
    var failMessage = "<div class='uk-margin-remove uk-card uk-card-secondary uk-card-body uk-card-small uk-border-rounded uk-text-large'><span 'uk-margin-small-right' uk-icon='icon: warning; ratio: 2;'></span>failed to copy...</div>";
    UIkit.notification({
      message: successful ? successMessage : failMessage,
      pos: 'bottom-center',
      timeout: 3000
    });
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
}

function switchLogo(value) {
  var completed = false;
  $("#active-avatar-logos").each(function() {
    el = $(this);
    console.log(el.attr("data-active-logos"));
  });

  jQuery(".mod-nav-avatar-img").each(function() {
    if (completed) {
     return false;
    }
    el = $(this);
    var limit = parseInt(el.attr("data-count"));
    var id = el.attr("id");
    if (el.css("display") == "inline") {
      var number = parseInt(id.substring(6));
      number = number += value;
      if (number > limit) {
        number = 1;
      } else if (number < 1) {
        number = limit;
      }
      el.css("display", "none");
      $("#avatar" + number).css("display", "inline");
      completed = true;
      return false;
    }
  });
}

function convertReleaseNotesToList(text) {
  return "<ul class='uk-list uk-list-bullet'>" + text.split("\n").map( function(v) {
    return (v.trim().startsWith("-")) ? v.replace(/- /g, "<li>") + "</li>" : "<p>" + v.trim() + "</p>";
  }).join("") + "</ul>";
}

var scrollToPosition = false;

function applyOffsetToHREF() {
  if (!scrollToPosition) {
    if (typeof window.location.hash == "undefined" || window.location.hash == null || window.location.hash.length <= 1 ) { return; }
    console.log(window.location.hash.length);
    UIkit.scroll(window.location.hash, {offset: 100}).scrollTo(window.location.hash);
    scrollToPosition = true;
  }
}

var latestRelease="https://api.github.com/repos/krzyzanowskim/CryptoSwift/releases/latest";
$.getJSON(latestRelease, {
  format: "json"
})
.done(function(data) {
  $(".mod-download-release-notes-title").text(data.tag_name + " release notes");
  $(".mod-download-zip-text").append(" release " + data.tag_name + " (.zip)");
  $(".mod-download-zip").attr("href", data.zipball_url);
  $(".mod-download-tar-text").append(" release " + data.tag_name + " (.tar.gz)");
  $(".mod-download-tar").attr("href", data.tarball_url);
  $(".mod-download-release-notes").html(convertReleaseNotesToList(data.body));
})
.fail(function() {
  console.log("getJSON github latest release failed");
});

$( document ).ready( function() {
  UIkit.components.sticky.options.defaults.bottom = true;
  var $header = $('.mod-header-card'); //Cache this for performance
  var setBodyScale = function() {
    var scaleSource = $header.width(),
        scaleFactor = 1.2,           
        maxScale = 1000,
        minScale = 30; //Tweak these values to taste
    var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:
    if (fontSize > maxScale) fontSize = maxScale;
    if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums
    $('.mod-header-title').css('font-size', fontSize + '%');
    $('.mod-header-title-small').css('font-size', fontSize + '%');
  };

  $(window).resize(function() { 
    setBodyScale();
    setTimeout(function() { applyOffsetToHREF(); }, 1000);
  });

  //Fire it when the page first loads:
  setBodyScale();
  setTimeout(function() { applyOffsetToHREF(); }, 1000);
});

  window.onhashchange = function(){
    scrollToPosition = false;
    setTimeout(function() { applyOffsetToHREF(); }, 1000);
  };

  window.onPageShow = function() {
    scrollToPosition = false;
    setTimeout(function() { applyOffsetToHREF(); }, 1000);
  };

  $(window).scroll(function() {
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
      setTimeout(function() { applyOffsetToHREF(); }, 1000);
    }, 250));
  });