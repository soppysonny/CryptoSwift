// Add event to load language preferenc; 
// Note: body onload did not work reliably for cached pages. This appears to.
window.addEventListener("pageshow", function() {
  // var selectMenu = document.getElementById("code-language-select");
  // loadSelectLanguages();
  pageLoad();
}, false);

// Add languages here as need; case of characters match to class name
// is important; must tie up with options and div class in posts.
var languages = ['C#', 'C++', 'Java', 'JavaScript', 'Perl',
  'PHP', 'Python', 'Ruby', 'Rust', 'Swift', 'VB.Net'
];

// ---------------------------------------------------------------------------
// Extender functions
// ---------------------------------------------------------------------------

function rangeThrough(from, through, step)
{
  var distance = Math.ceil((through - from) / step);
  while (((distance - 1) * step) + from < through) 
  {
    distance += 1; 
  }
  return Array.from(Array(distance).keys(), function(v) { return (v * step) + from });
}

function rangeTo(from, to, step)
{
  var distance = Math.floor((to - from) / step);
  while (((distance - 1) * step) + from > to) 
  { 
    distance -= 1; 
  }
  return Array.from(Array(distance).keys(), function(v) { return (v * step) + from; });
}

function retrievePostElements()
{
  return document.getElementsByClassName("codefunc-js-post");
}

// Left to right partial applcations of parameters.
function partialApplication(func /*, args...*/) {
  // A reference to the Array#slice method.
  var slice = Array.prototype.slice;
  // Convert arguments object to an array, removing the first argument.
  var args = slice.call(arguments, 1);

  return function() {
    // Invoke the originally-specified function, passing in all originally-
    // specified arguments, followed by any just-specified arguments.
    return func.apply(this, args.concat(slice.call(arguments, 0)));
  };
}

function addToggleEventListener(source, event, target, classes)
{
  var targetElement = document.getElementById(target);
  var sourceElement = document.getElementById(source);
  if (targetElement == null || sourceElement == null)
  {
    return;
  }

  // Add toggle click event that cycles through a list of class changes on the target
  sourceElement.addEventListener(event, function() {
    var toggleClasses = classes;
    var currentIndex = toggleClasses.indexOf(targetElement.className);
    if (currentIndex == -1) { 
      console.log("toggleClass: classes.indexOf(element.className) == -1; defaulting to index 0");
      currentIndex = 0; 
    }
    targetElement.className = toggleClasses[currentIndex < toggleClasses.length - 1 ? currentIndex + 1 : 0];
  }, false);
}

class ToggleEvent {
  // source: HTML DOM element classname to attach click event listener 
  // target: HTML DOM element classname for toggled element i.e. toggle classes
  // classes: Text name of target classes to be cycled through. 
  constructor(source, target, event, classes) {
    this.source = source;
    this.target = target;
    this.event = event;
    this.classes = classes;
  }

  static create(classes, event, source, target)
  {
    return new ToggleEvent(source, target, event, classes);
  }

  addClickToggleEventListener() {
    if (this.source == null || this.target == null) { 
      console.log("Abort addClickToggleEventListener: source / target == null;")
      return; 
    }
    addToggleEventListener(this.source, this.event, this.target, this.classes);
  }
}

// ---------------------------------------------------------------------------
// Page load action - tied to window.addEventListener("pageshow"...
// ---------------------------------------------------------------------------
function pageLoad() 
{
  // --- Bug Fix: Scripts Issues with browser caching Back / Forward Button. ---
  if (isLoadingFromCache()) 
  { 
    return; 
  }

  // --- Using HTML 5 Custom Data Tags --- 
  activateShowHide();
  
  // --- Activate language selector only if languageselect frontmatter is true
  activateLanguageSelector();
}

// --- Bug Fix: Scripts Issues with browser caching Back / Forward Button. ---
function isLoadingFromCache()
{  
  if (document.getElementById("codefunc_browserCacheFix") != null)
  {
    return true;
  }
  // Add hidden tag: if detected then we'll abort the pageLoad because everything should already
  // be initialised. Used to fix a scripting bug with browser caching : Back / Forward actions
  var e = document.createElement("div");
  e.id = "codefunc_browserCacheFix";
  e.innerText="bug fix: scripting bug with browser caching : Back / Forward actions";
  e.style.display = "none";
  document.body.appendChild(e);
  return false;
}

function parseShowHideData(element)
{
  var index = parseInt(element.getAttribute("data-startno"));
  var divPrefix = element.getAttribute("data-divprefix");
  var buttonPrefix = element.getAttribute("data-buttonprefix");
  var languages = element.getAttribute("data-languages");
  var quantity = languages == null ? 1 : languages.split(",").length;
  var newToggle = partialApplication(ToggleEvent.create, showHideClasses(), 'click');
  if (index == null || divPrefix == null || buttonPrefix == null) {
    return [];
  }

  // Single Show / Hide Block
  if (quantity == 1) {
    return [newToggle(buttonPrefix + index, divPrefix + index)];
  }

  // Multiple Show / Hide Block (Languages)
  return rangeTo(index, index + quantity, 1).map(function(rangeIndex) { 
    return newToggle(buttonPrefix + rangeIndex, divPrefix + rangeIndex);
  });
}

function extractShowHideBlocks(dataElements) {
  return dataElements.reduce(function(acc, ne) {
    return acc.concat(parseShowHideData(ne));
  }, []);
}

function convertHTMLCollectionToArray(collection)
{
  var result = [];
  for (var index = 0; index < collection.length; index++) {
    result.push(collection[index]);
  }
  return result;
}

function getShowHideDataElements()
{
  return ["codefunc-js-showhide", "codefunc-js-showhide-code"].map(function(className) {
    return convertHTMLCollectionToArray(document.getElementsByClassName(className));
  }).reduce(function(acc, na) { return acc.concat(na); }, []);
}

function activateShowHide() {
  getShowHideDataElements().reduce(function(acc, ne) {
    return acc.concat(parseShowHideData(ne));
  }, []).forEach(function(toggleEvent) {
    toggleEvent.addClickToggleEventListener();
  })
}

// ---------------------------------------------------------------------------
// Activation of Language Selection Blocks
// ---------------------------------------------------------------------------
function activateLanguageSelector()
{
  var post = retrievePostElements();
  if (post.length == 0) { return; }
  var languages = post[0].getAttribute("data-languages").split(",");
  var selector = post[0].getAttribute("data-selectlanguage");
  var title = post[0].getAttribute("data-title");
  var subtitle = post[0].getAttribute("data-subtitle");
  var snippetpath = post[0].getAttribute("data-snippetpath");
  var languageCount = languages.length > 1 ? languages.length : languages[0].trim().length;
  var languageSelect = selector.trim() == "true" ? true : false;
  if (languageSelect == true)
  {
    loadSelectLanguages();
  }
}

// Scan for elements with a matching class names to array of languages
function identifyLanguagesUsedOnPage() 
{
  var languagesOnPage = [];
  for (var i = 0; i < languages.length; i++) 
  {
    if (document.getElementsByClassName(languages[i]).length > 0) 
    {
      languagesOnPage.push(languages[i])
    }
  }
  console.log(languagesOnPage);
  return languagesOnPage;
}

// Add the language selector elements 
function addSelectTags()
{
  var langSpan = document.getElementById("code-language-span");
  var selectElement = document.createElement("select");
  if (langSpan == null || selectElement == null) {
    console.log("Aborting no language selector found.")
    return;
  }
  selectElement.id = "code-language-select";
  selectElement.dataset.placeholder = "Select Language...";
  selectElement.setAttribute("onchange", "javascript: choose_language(this.options[this.selectedIndex].text);");
  langSpan.appendChild(selectElement);
}

// Load Language Selector
function loadSelectLanguages() 
{
  var languagesOnPage = identifyLanguagesUsedOnPage();
  if (languagesOnPage.length == 0) 
  {
    document.getElementById("code-menu").style.display = 'none';
    console.log("Aborting: No languages found on page.");
    return;
  }

  addSelectTags();
  var preferredLanguage = readLanguagePreference().trim();
  var selectMenu = document.getElementById("code-language-select");

  if (selectMenu == null) 
  {
    console.log("Aborting: No language selection tag found.");
    return;
  }

  for (var i = 0; i < languagesOnPage.length; i++) 
  {
    var langOption = document.createElement("option");
    langOption.text = languagesOnPage[i];
    selectMenu.options.add(langOption, i);
  }
  
  var matchIndex = languagesOnPage.indexOf(preferredLanguage);
  selectMenu.selectedIndex = matchIndex > -1 ? matchIndex : 0;
  choose_language(preferredLanguage.length > 0 ? preferredLanguage : languagesOnPage[0]);
  $("#code-language-select").css({"min-width":"100px"});
}

// Read language preference cookie
function readLanguagePreference() 
{
  var allCookies = document.cookie;
  var language = document.cookie.replace(/(?:(?:^|.*;\s*)language\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return language.trim();
}

// Save language preference
function saveLanguagePreference(language) 
{
  var languagePref = "language=" + language + "";
  document.cookie = languagePref;
}

// Hide all the elements related to the other languages
function hide(language) 
{
  var languageIndex = languages.indexOf(language);
  delete languages[languageIndex];
  for (var i = 0; i < languages.length; i++) {
    var otherLanguage = languages[i];
    if (otherLanguage == null) {
      continue;
    }
    var otherElements = document.getElementsByClassName(otherLanguage);

    // find all elements matching this class name & hide
    for (j = 0; j < otherElements.length; j++) {
      var otherElement = otherElements[j];
      otherElement.style.display = 'none';
    }
  }
}

// Testing code; shows all languages
function showAll() 
{
  var allLanguages = identifyLanguagesUsedOnPage();
  console.log(allLanguages);
  for (k = 0; k < allLanguages.length; k++) 
  {
    show(allLanguages[k]);
  }
}

// Unhide all the elements linked with the chosen language
function show(language) 
{
  var chosenElements = document.getElementsByClassName(language);
  for (k = 0; k < chosenElements.length; k++) 
  {
    var chosenElement = chosenElements[k];
    chosenElement.style.display = 'block';
  }
}

// Show chosen language, hide the others, remember preference
function choose_language(selectedOption) 
{
  var language = selectedOption;
  saveLanguagePreference(language);
  hide(languages);
  show(language);
  $("#code-language-select").css({"min-width":"100px"});
}