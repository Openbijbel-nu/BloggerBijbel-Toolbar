console.log("v1.0.5");
/**
 * This code is used to create an toolbar for bloggersbijbel.nl
 */

 //global reftagger settings (default settings)
 var refTagger = {
		settings: {
			bibleReader: "bible.faithlife",
			bibleVersion: "NIV"			
		}
	};

// using anonymous self executing function to protect the functions in their own scope
// see: http://markdalgleish.com/2011/03/self-executing-anonymous-functions/
 (function (window, document, $, undefined) {

 	/**
 	 * For including scripts
 	 */
 	 function require(scriptUrl, optionalClassName, onLoadFunction) {
 	 	var s = document.createElement('script');

 	 	s.type = 'text/javascript';
 	 	s.src = scriptUrl;

 	 	if (typeof(optionalClassName) != 'undefined')
 	 		s.className = optionalClassName;

 	 	if (typeof(onLoadFunction) != 'undefined') {
 	 		s.onreadystatechange = onLoadFunction;
 	 		s.onload = onLoadFunction;
 	 	}

 	 	document.getElementsByTagName('head')[0].appendChild(s);

 	 }

	 var BCVParserLoaded = false;
	/**
 	  * Loads the bcvparser script with a protocol independant URL
 	  */
 	 function loadBCVParser(onLoadFunction) {
 	 	if (BCVParserLoaded) {
 	 		if (typeof(onLoadFunction) == 'function')
 	 			onLoadFunction();

 	 		return;
 	 	}

 	 	require('//raw.githubusercontent.com/openbibleinfo/Bible-Passage-Reference-Parser/master/js/nl_bcv_parser.js', 'openbijbelloadBCVParserscript', function () {
 	 		BCVParserLoaded = true;
 	 		if (typeof(onLoadFunction) == 'function')
 	 			onLoadFunction();
 	 	});
 	 }

 	/**
 	 * Shows references instead of verse numbers
 	 */

	console.log("Gods zegen");

	function transformSup(translation) {
		if (typeof(translation) == 'undefined') {
 			translation = 'NIV';
 		}
		 var refTaggerLoaded = false;
		 
		/**
	 	  * Loads the refTagger script with a protocol independant URL
	 	  */
	 	 function loadRefTagger(onLoadFunction) {
	 	 	if (refTaggerLoaded) {
	 	 		if (typeof(onLoadFunction) == 'function')
	 	 			onLoadFunction();
	
	 	 		return;
	 	 	}
	
	 	 	require('//api.reftagger.com/v2/RefTagger.js', 'openbijbelreftaggerscript', function () {
	 	 		refTaggerLoaded = true;
	 	 		
	 	 		if (typeof(onLoadFunction) == 'function')
	 	 			onLoadFunction();
	 	 	});
	 	 }

		if (!refTaggerLoaded)
	 		refTagger = {
				settings: {
					bibleReader: "bible.faithlife",
					bibleVersion: translation		
				}
			};

		loadRefTagger(function () {
			console.log("reftagger");
		});
	}

 	function showReferences() {

		loadBCVParser(function () {
			var bcv = new bcv_parser;

			var deorigineletekst = $("h2").html();
			var dereferenties = bcv.parse(deorigineletekst).osis();

		        console.log(dereferenties);
        		var dereferentie_arr = new Array();
	                var dereferentie_arr = dereferenties.split(".");
        	        var dereferentie = dereferentie_arr[0] + "." + dereferentie_arr[1];
                	console.log(dereferentie);
//		        var dereferenties = dereferenties.split(",").join("</span><br/><span class='BijbelVers'>");
//			$(".row h2").append("<br/ ><h3 class='OpenBijbel-Heading'>[[|]]</h3><br/ ><span class='BijbelVers'>" + dereferenties + "</span>");
//			$(".OpenBijbel-Heading").css("background","#465DFF").css("font-weight","bold").css("color","white");
//			$(".BijbelVers").css("background","#BCFFB9");
    
	 		$(".vers sup").each(function(){
 				var suptext = dereferentie + "." + $(this).text();
 				$(this).text(suptext);
			});
			
	 		transformSup("NIV");
			
		});
 	}

	var refTaggerTransformed = false;
	
		/**
	 	  * Loads the refTagger script with a protocol independant URL
	 	  */
	 	 function transformRefTagger(onLoadFunction) {
	 	 	if (refTaggerTransformed) {
	 	 		if (typeof(onLoadFunction) == 'function')
	 	 			onLoadFunction();
	
	 	 		return;
	 	 	}
	
	 	 	require('//api.reftagger.com/v2/RefTagger.js', 'openbijbelreftaggerscript', function () {
	 	 		refTaggerTransformed = true;
	 	 		
	 	 		if (typeof(onLoadFunction) == 'function')
	 	 			onLoadFunction();
	 	 	});
	 	 }

 	 /**
 	  * Loads the bible translation. By default it's NIV.
 	  */
 	function chooseTranslation(translation) {
 		if (typeof(translation) == 'undefined') {
 			translation = 'NIV';
 		}

 		// set the already existing global variable with new options (so no var before this variable)
 		if (!refTaggerTransformed)
	 		refTagger = {
				settings: {
					bibleReader: "bible.faithlife",
					bibleVersion: translation		
				}
			};

		transformRefTagger(function () {
			$(".rtBibleRef").each(function(){
				$(this).attr("data-version", translation.toLowerCase());
			});

			openBijbelToolBar.find(".openbijbelvertaling").html("[[|]] &nbsp; " + translation + " ");
			openBijbelToolBar.find('.vertalingkeus').css("text-decoration","none");
			openBijbelToolBar.find('.vertalingkeus[data-translation="' + translation + '"]').css("text-decoration","underline");
		
			$('.openbijbelvertaling').text(openBijbelToolBar.find(".openbijbelvertaling").text());
		});
 	}

 	/**
 	 * Adds a Biblia embedment in the extra column
 	 */
	function embedBiblia() {
		var startVerse = $(".vers sup").first().text();
//		alert(startVerse);
		$(".OpenBijbelEmbeddedBiblia").html('<biblia:bible layout="minimal" resource="niv2011" width="100%" height="1200px" startingReference="' + startVerse + '"></biblia:bible>');
		
		var url = "//biblia.com/api/logos.biblia.js";
		$.getScript( url, function() {
			logos.biblia.init();
		});
	}
	
 	/**
 	 * Split columns
 	 */
 	function splitColumns() {
 		$(".panel").after(
 			'<div class="openbijbelvertalingtekst">'
 				+ '<div id="OpenBijbelEmbeddedBiblia" class="OpenBijbelEmbeddedBiblia">'
				+ '</div>'
 			+ '</div>'
 		);


		embedBiblia();

		$('.openbijbelvertaling').text(openBijbelToolBar.find(".openbijbelvertalingnaam").text());

		$(".openbijbelvertalingtekst").css({
			"float": "left",
			"width": "45%",
			"height": "100%",
			"padding": "10px"
		});

		// breedte van translation - 30 voor bij 2 kolommen en 65 bij 1
		$(".panel").css({
				"width": "50%",
				"float": "left"
		});
		$(".footer").css({
				"clear": "both"
		});
		
 	}

 	// This variable will be used to attach a jQuery reference to the Open Bijbel top bar. 
 	// So we can use it in multiple functions.
 	var openBijbelToolBar = undefined;

 	/**
 	 *	Build the top bar
 	 */
 	function setupTopBar() {
 		// add the basics to the stickynotes top bar
 		$(".navbar").prepend("<div class='openbijbeltoolbar'></div>");

 		openBijbelToolBar = $(".navbar .openbijbeltoolbar");

 		// build the basic content of the toolbar
 		var toolbarContent = 
			'<div class="openbijbelvertalingnaam openbijbelvertaling">[[|]] &nbsp; NIV</div>'
			+ '<div class="openbijbelknoppenarea">'
				+ '<span class="openbijbelknoptoelichting">Tooltip vertaling: </span>'
				+ '<span class="openbijbelknop vertalingkeus NIV" data-translation="NIV">NIV</span> '
				+ '<span class="openbijbelknop vertalingkeus ESV" data-translation="ESV">ESV</span> '
				+ '<span class="openbijbelknop vertalingkeus KJV" data-translation="KJV">KJV</span> '
				+ '<span class="openbijbelknop vertalingkeus NKJV" data-translation="NKJV">NKJV</span> '
				+ '<span class="openbijbelknop vertalingkeus NLT" data-translation="NLT">NLT</span>'
				+ '&nbsp; | &nbsp;'
				+ '<span class="openbijbelknoptoelichting"> [[|]] Kolom: </span>'
				+ '<span class="openbijbelknop weergavekeus kiesbibliakolom">Toevoegen</span>'
				+ '<span class="openbijbelknop weergavekeus kiesreftagtooltip">Verwijderen</span>'
				+ ' <span class="openbijbelknop kiesReset">(Reset)</span> '
			+ '</div>';

 		openBijbelToolBar.append(toolbarContent);

 		// set styling
 		openBijbelToolBar.css({
			"left":"0px",
			"right":"0px",
			"background-color": "#3352BC",
			"height": "35px",
			"padding":"10px",
			"color": "white",
			"margin-bottom":"5px"
		});

 		openBijbelToolBar.find(".openbijbelvertalingnaam").css({
			"font-weight":"bold",
			"float":"left",
			"color": "white"
		});
		openBijbelToolBar.find(".kiesreftagtooltip").css({
			"display":"none",
		});

		openBijbelToolBar.find(".openbijbelknoppenarea").css({
			"color": "white",
			"float":"right"
		});

		openBijbelToolBar.find(".openbijbelknop").css({
			"color": "#A3A9BC",
			"cursor":"pointer"
		});

		openBijbelToolBar.find(".openbijbelknoptoelichting").css({
			"font-style": "italic"
		});

		openBijbelToolBar.find(".kiesReset").css({
			"color": "#646E8F",
			"cursor":"move"
		});
 	}

 	/**
 	 * Bind the events
 	 */
 	function bindEvents() {

 		openBijbelToolBar.on('click', '.vertalingkeus', function (e) {
 			e.preventDefault();

 			var translation = $(this).data('translation');

 			chooseTranslation(translation);
 		});

 		 		openBijbelToolBar.on('click', '.kiesReset', function() {
 			showReferences();

 			// choose default translation
 			chooseTranslation("NIV");
 			
		});

 		openBijbelToolBar.on('click', '.kiesbibliakolom', function() {
 			splitColumns();
			$('.row').css("margin-left","0px");
			$(this).hide();
			openBijbelToolBar.find('.kiesreftagtooltip').show();
			
		});

 		openBijbelToolBar.on('click', '.kiesreftagtooltip', function() {
 			// doet niks
			$('.openbijbelvertalingtekst').remove();
			
     		     $(".panel").css("width","100%");

			$(this).hide();
			openBijbelToolBar.find('.kiesbibliakolom').show();
		});

 	}

 	/**
 	 * This function gets executed after all is loaded. This gives a main entrypoint for the code
 	 */
 	function main() {
 		showReferences();
 		setupTopBar();
 		
 		// choose default translation
 		chooseTranslation("NIV");

 		bindEvents();
 	}

 	// execute the main function
 	main();
 })(window, document, jQuery);
