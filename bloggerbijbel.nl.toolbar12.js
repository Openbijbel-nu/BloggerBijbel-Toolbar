/**
 * This code is used to create an toolbar for debijbel.nl
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

 	/**
 	 * Shows references instead of verse numbers
 	 */
 	 
 var firstversereferentie;
 var dereferentie;

        require("//raw.githubusercontent.com/openbibleinfo/Bible-Passage-Reference-Parser/master/js/nl_bcv_parser.js");

 	function showReferences() {

		var bcv = new bcv_parser;

	        var deorigineletekst = $("h2").html();

	        var dereferenties = bcv.parse(deorigineletekst).osis();
//	        alert(dereferenties);
        	var dereferentie_arr = new Array();
                var dereferentie_arr = dereferenties.split(".");
                var dereferentie = dereferentie_arr[0] + "." + dereferentie_arr[1];
                var firstversereferentie = dereferentie_arr[0] + "." + dereferentie_arr[1] + "." + dereferentie_arr[2];
//               alert(dereferentie);
	        var dereferenties = dereferenties.split(",").join("</span><br/><span class='BijbelVers'>");
	        $(".row h2").append("<br/ ><h3 class='OpenBijbel-Heading'>[[|]]</h3><br/ ><span class='BijbelVers'>" + dereferenties + "</span>");

		   $(".OpenBijbel-Heading").css("background","#465DFF").css("font-weight","bold").css("color","white");
		    $(".BijbelVers").css("background","#BCFFB9");
    
 		$("sup").each(function(){
 			var suptext = dereferentie + "." + $(this).text();
 			$(this).text(suptext);
		});
		var startVerse = firstversereferentie;
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

 	 /**
 	  * Loads the bible translation. By default it's NIV.
 	  */
 	function chooseTranslation(translation) {
 		if (typeof(translation) == 'undefined') {
 			translation = 'NIV';
 		}

 		// set the already existing global variable with new options (so no var before this variable)
 		if (!refTaggerLoaded)
	 		refTagger = {
				settings: {
					bibleReader: "bible.faithlife",
					bibleVersion: translation		
				}
			};

		loadRefTagger(function () {
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
		var startVerse = $("sup").first().text();
		$(".OpenBijbelEmbeddedBiblia").html('<biblia:bible layout="minimal" resource="niv2011" width="400px" height="1200px" startingReference="' + startVerse + '"></biblia:bible>');
		
		var url = "//biblia.com/api/logos.biblia.js";
		$.getScript( url, function() {
			logos.biblia.init();
		});
	}
	
 	/**
 	 * Split columns
 	 */
 	function splitColumns(extraColumnCount) {
 		$(".panel").after(
 			'<div class="openbijbelvertalingtekst">'
 				+ '<div id="OpenBijbelEmbeddedBiblia" class="OpenBijbelEmbeddedBiblia">'
				+ '</div>'
 			+ '</div>'
 		);


		embedBiblia();

		$('.openbijbelvertaling').text(openBijbelToolBar.find(".openbijbelvertalingnaam").text());

		$(".openbijbelvertalingtekst").css({
			"float": "right",
			"width": "400px",
			"height": "100%",
			"padding": "10px"
		});

		// breedte van translation - 30 voor bij 2 kolommen en 65 bij 1
		$(".panel").css({
				"width": "400px",
				"float": "left"
		});
		$(".container").css({
				"width": "400px",
				"float": "left"
		});
		$(".row").css({
				"width": "400px",
				"float": "left"
		});
		$(".col-md-8").css({
				"width": "400px",
				"float": "left"
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
			$('.row').css("margin-left","0px");
			$(this).hide();
			openBijbelToolBar.find('.kiesreftagtooltip').show();
			
		});

 		openBijbelToolBar.on('click', '.kiesreftagtooltip', function() {
 			// doet niks
			$('.openbijbelvertalingtekst').remove();
			
     		     $(".container").css("width","800px");
     		     $(".panel").css("width","800px");
		     $(".row").css("width","800px");
     		     $(".col-md-8").css("width","800px");

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
