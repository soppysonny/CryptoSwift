function match(selection, tags) {
  var result = 0;
  selection.forEach(function(item, index) {
    if (tags.includes(item)) {
      result++;
    }
  });
  return result == selection.length;
}
function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  for (var i = 0, iLen = options.length; i < iLen; i++) {
    var opt = options[i];
    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}
$(".mod-search-chosen").selectivity({
  multiple: true,
  placeholder: 'Tap to filter by tag'
});
$(".mod-search-chosen").on('change', function(evt, params) {
  var selectedTags = getSelectValues(evt.currentTarget);
  var articles = document.getElementsByClassName("mod-search-chosen-tag");
  for (k = 0; k < articles.length; k++) {
    var article = articles[k];
    if (selectedTags.length < 1) {
      article.style.display = "table-row";
      continue;
    }
    var tags = article.getAttribute("data-tags").split(",");
    if (match(selectedTags, tags)) {
      article.style.display = "table-row";
    } else {
      article.style.display = "none";
    }
  }
});