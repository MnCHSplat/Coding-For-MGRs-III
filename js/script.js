
//************************************************************************************************************* */
//Code to handle Help page functionality

// initially hide Work Order help contents
$(".toggle1").hide();
$(".toggle2").hide();
$(".toggle3").hide();
$(".toggle4").hide();
$(".toggle5").hide();
$(".toggle6").hide();
$(".toggle7").hide();
$(".toggle8").hide();
$(".toggle9").hide();

// for each step, toggle the help contents when clicked per Epic 5, user story 1
$('#step1').click(function() {
  $(".toggle1").toggle();

// Change the color of the Step/Heading when details are displayed per Epic 5, user story 2 (repeated for all steps)
  var compare = $(".toggle1").is(":visible");
  if (compare) { 
    $("#step1").css("color", "red");
  }  
  else { 
    $("#step1").css("color", "black");
  }
});

$('#step2').click(function() {
  $(".toggle2").toggle();

  var compare = $(".toggle2").is(":visible");
  if (compare) { 
    $("#step2").css("color", "red");
  }  
  else { 
    $("#step2").css("color", "black");
  }
});

$('#step3').click(function() {
  $(".toggle3").toggle();

  var compare = $(".toggle3").is(":visible");
  if (compare) { 
    $("#step3").css("color", "red");
  }  
  else { 
    $("#step3").css("color", "black");
  }
});

$('#step4').click(function() {
  $(".toggle4").toggle();

  var compare = $(".toggle4").is(":visible");
  if (compare) { 
    $("#step4").css("color", "red");
  }  
  else { 
    $("#step4").css("color", "black");
  }
});

$('#step5').click(function() {
  $(".toggle5").toggle();

  var compare = $(".toggle5").is(":visible");
  if (compare) { 
    $("#step5").css("color", "red");
  }  
  else { 
    $("#step5").css("color", "black");
  }
});

$('#step6').click(function() {
  $(".toggle6").toggle();

  var compare = $(".toggle6").is(":visible");
  if (compare) { 
    $("#step6").css("color", "red");
  }  
  else { 
    $("#step6").css("color", "black");
  }
});

$('#step7').click(function() {
  $(".toggle7").toggle();

  var compare = $(".toggle7").is(":visible");
  if (compare) { 
    $("#step7").css("color", "red");
  }  
  else { 
    $("#step7").css("color", "black");
  }
});

$('#step8').click(function() {
  $(".toggle8").toggle();

  var compare = $(".toggle8").is(":visible");
  if (compare) { 
    $("#step8").css("color", "red");
  }  
  else { 
    $("#step8").css("color", "black");
  }
});

$('#step9').click(function() {
  $(".toggle9").toggle();

  var compare = $(".toggle9").is(":visible");
  if (compare) { 
    $("#step9").css("color", "red");
  }  
  else { 
    $("#step9").css("color", "black");
  }
});
//End of code to handle Help page functionality
//************************************************************************************************************* */

//************************************************************************************************************* */
//Code for firebase login and related functionality

//Code to allow links to show only with logged-in users
$(".search-link-visible").hide();
$(".page-visible").hide();
$(".login-message").show();

//Code That Deals with Transitioning the State of the Log In/Auth Pane
// this code provides the registration and log-in functionality (using my personal firebase) per Epic 6 user stories 1 and 2
$('#register-link').click(function() {
	$('#login-form').toggle(); 
	$('#register-form').toggle(); 
});

$('#forgotten-link').click(function() {
	$('#forgotten-form').show(); 
	$('#before-reset').show(); 	
	$('#login-form').hide(); 
});

$('#login-link-modal').click(function() {
	$("#after-reset").hide();
	$('#login-form').show(); 
});


$('#login-trigger').click(function() {	
	handle_auth();
});

//Code that deals with initial display for modal pane that deals with authentication and, for a user that's logged in, logging them out.
function handle_auth() {
//The function below lets us know if/who is logged in- you can read more about it here: https://firebase.google.com/docs/auth/web/manage-users. 
var user = firebase.auth().currentUser;
console.log("dealing with " + user); 
	
if (!user) {
	//If there's no user (user var is null)  
	$('#login-content').toggle();
  //Reset/hide other forms and div's so the login page displays right.
  $('#register-form').hide();
  $('#before-reset').hide(); 
  $("#after-reset").hide();
  $("#if-error").hide();
  $('#login-form').show();
} else {
// Sign out the current user
firebase.auth().signOut().then(function() {
// Sign-out successful.
console.log("Signed out " + user.email) 
	}).catch(function(error) {
	// An error happened.
	alert("Something went wrong.");
	});
	$("#auth-text").text("Log In");
	}
}

//This listens for a submit event on the login form. For more on this type of event, see https://api.jquery.com/submit/. It then passes the inputs to the function you see below it. 
$('#login-form').submit(function(){
	// pass the login email and pwd to our login handler function (below)
	login_user($('#login_email').val(), $('#login_pwd').val());
});

function login_user(email, pwd) {
	console.log("attempting to login user " + email); 
  
  // use the Firebase API to sign in the user
  firebase.auth().signInWithEmailAndPassword(email, pwd).then(function(user) {
	  //clear the form inputs

checkuser(user); // had to convert the onAuthStateChanged method of firebase.auth() to a function to be explicitly called
                 // (i.e. no longer an observer function).  I'm guessing this might be due to the time it takes to load the page.

	$("#login-form input[type=text], input[type=password]").val('');
    //deal with errors
    }, function(error) {
      // Handle Errors here.
      var errorCode = error.code;
	  var errorMessage = error.message;
	  if(chk_domain(email)) {
		  alert("Reminder: This is a stand-alone system you need to register for separately (sorry for the nuisance!). " + errorMessage);
	  } else {
		  alert("Improper credentials. Please ensure you are on the proper site and contact your supervisor with questions.");
		
	  }
  });
}

//This takes the registration form inputs and passes them to the function below.
$('#register-form').submit(function(){
			// pass the registration data to our register function (below)
			register_user($('#register_email').val(), $('#register_pwd').val(),$('#register_re_pwd').val());
});

function register_user(email, pwd, re_pwd) {
	console.log("I'll try to register user " + email); 

	// ensure password and re_password match
  if(pwd != re_pwd){
  	$('#reg-error-response').text("Error: passwords do not match.");
    $("#if-reg-error").show();

  } else {
	// register user, but only if user used a valid domain
	if(chk_domain(email)) {
		firebase.auth().createUserWithEmailAndPassword(email, pwd).then(function(user) {
			if (user) {
				//clear the form
			  $("#register-form input[type=text], input[type=password]").val('');
			  checkuser(user);
			}
		}, function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
				console.log("oh my: " + errorMessage);
				$('#reg-error-response').text(errorMessage);
				$("#if-reg-error").show();
			});
		console.log("user created");
	}
	else {
		$('#reg-error-response').text("Error: Only emails from the HVACNHURRY.COM domain allowed");
		$('#if-reg-error').show();
	}
	  // register the user with the Firebase API (NOTE: auto logs in)
  }	
}

// function to validate domain - returns True if valid, False if not
function chk_domain(email) {
	var domain = email.substring(email.lastIndexOf("@"));
	var OK_domains = valid_domains();
	for(var x=0; x < OK_domains.length; x++) {
		if(domain == OK_domains[x]) {
			return true;
		}
	}
	return false;
}

// function to identify valid domain(s)
function valid_domains() {
	var domains = new Array;
	domains[0] = '@hotmail.com';
	domains[1] = '@hvacnhurry.com';
	return domains;
}

//This takes the inputs for the forget password form and passes them to the function below. 
$('#forgotten-form').submit(function(){
	recover_password($('#recovery_email').val());
});

function recover_password(email) {
	console.log("sending recovery to " + email); 
  firebase.auth().sendPasswordResetEmail(email).then(function() {
  	//Email sent, give an alert with a prompt for further action
		console.log("sending recovery to " + email); 
		$("#before-reset").hide();
		$("#after-reset").show();
		$('#submitted-email').text(email);
    $("#forgotten-form input[type=text], input[type=password]").val('');
  }).catch(function(error) {
  	//An error happened...display the error so the User knows what's going wrong
    var errorCode = error.code;
    var errorMessage = error.message;
		console.log("oh my: " + errorMessage);
		$('#error-response').text(errorMessage);
		$("#before-reset").hide(); 
		$("#after-reset").hide();
		$("#if-error").show();
});
  //Notes: This will send an email with a template specified in the Firebase Console.  That template has a lot of powerful tools to help make good looking emails, and the password reset is completely handled by Google without any need for developer work to support it.
}

//Code That Deals with Checking Whether Users are Signed In
//This is an observer that will wait for the firebase user object to change auth state.
//This is the recommended way to detect when you log in, as it will check upon page load.

// As mentioned above, the onAuthStateChanged method has been shifted from observer to a function
function checkuser(user) {
	firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		//alert("Welcome " + user.email + "!");
			console.log("welcoming now..." + user.email);
		$("#auth-text").text("Log Out " + user.email);
			//$("#login-trigger").css("display", "inline"); //not working as inteded yet
      $('#login-content').toggle();
      $(".search-link-visible").show(); // allow logged-in user to access the search link on Home page per Epic 6 user story 3
      $(".page-visible").show(); // allow logged-in user to access the Parts and Search pages from the Home page per Epic 6 user story 3
      $(".login-message").hide(); // do not display this message once a user is successfully logged in
    } else {
			console.log('onAuthStateChanged running with no user')
		// No user is signed in.
	}
		console.log('end of onAuthState...')
		var nowuser = firebase.auth().currentUser;
	});
}
//end of code for firebase/log-in/log-out functionality
//************************************************************************************************************* */

//************************************************************************************************************* */
// Functionality to allow search by filter on the Search page
$("#btn-search").on("click", function() {
  //On new search, start w/ all parts to start
  $('.catalog-part').show(); 
  
  //Code to filter by Manufacturer
  var selmfr = $('#dd-mfr').find(':selected').val(); //JQuery event for drop-down
  
  if(selmfr != "All") {
     $('.catalog-part').each(function(){ //.each lets you do something to all items in the selected class
      if ($(this).attr('mfr') != selmfr) {
          $(this).hide();  	
      }
    });
  }
  
  //Very similar code to filter by Model
  var selmodel = $('#dd-model').find(':selected').val();

  if(selmodel != "All") {
    $('.catalog-part').each(function(){
      if($(this).attr('model') != selmodel) {
        $(this).hide(); 
      }
  });
  }
  // similar code to filter by Type
  var seltype = $('#dd-type').find(':selected').val();

  if(seltype != "All") {
    $('.catalog-part').each(function(){
      if($(this).attr('type') != seltype) {
        $(this).hide(); 
      }
    });
  }
});
// End of code for Functionality to allow search by filter on the Search page
//************************************************************************************************************* */


//************************************************************************************************************* */
//Code to load and display Part Information dynamically

//code to load part information for searching
//This is the URL of the Google sheet with a 'callback function' that converts it to JSON. What's JSON? See: https://en.wikipedia.org/wiki/JSON
//If you want to see the URL of the sheet itself, copy this into your browser: https://docs.google.com/spreadsheets/d/1DA6htKy-Z-8QRkifkLbzlzG2r5YWOKE77JXEJNmq45g/. 
var JSONFEED = 'https://spreadsheets.google.com/feeds/list/1DA6htKy-Z-8QRkifkLbzlzG2r5YWOKE77JXEJNmq45g/1/public/basic?alt=json';

//This waits until the baseline page is loaded and then gets the JSON feed, and as long as it doesn't error, calls the readdata function to start taking that feed and drawing the HVAC parts. The way it does this is through 'AJAX', which stands for 'Asynchronous JavaScript And XML'. This allows you to go and get data from a server/service (like Google Sheets) after the page has loaded. 
//For more on AJAX, see: https://www.w3schools.com/xml/ajax_intro.asp
//For more on the JQuery function that does this for us, see: https://www.w3schools.com/jquery/ajax_ajax.asp
$(document).ready(function() {
  $.ajax({
    url: JSONFEED,
    success: function(data) {
      readData(data);
    }
  });
});

function readData(data) {
console.log(data.feed.entry[0].content.$t);
  var partfeed = data.feed.entry;

  //these statements initialize the variables below, meaning that it puts them in the baseline state we want before we start doing stuff with them
  var divData = [];

  //This is a for loop that iterates through the rows from the Google Sheet, now JSON objects. What is a for loop? See: https://www.w3schools.com/js/js_loop_for.asp. See also the Codecademy module on Javascript: https://www.codecademy.com/learn/introduction-to-javascript. 
  for (var i = 0; i < partfeed.length; i++) {
    //partfeed[i] indexes a given row in the array of data that has the JSON content. What is an array? See: https://www.w3schools.com/js/js_arrays.asp or check out the Codecademy tutorial above (module on arrays). 
    var JSONrow = partfeed[i].content.$t.split(',');
    var row = [];
    console.log('the JSONrow I have is: ' + JSONrow + ' and it is ' + JSONrow.length + ' long.');

    //this loop cleans up the rest of the JSON syntax from Google Sheets and gives us an array that has just the values we want
    for (var j = 0; j < JSONrow.length; j++) {
      console.log('we are on the ' + j + 'th iteration');
      val = JSONrow[j].split(':')[1];
      console.log('the value is ' + val);
      row[j] = val;
    }
    //this control statement throws away the first row which has the descriptive headers
    if (i != 0) {
      drawDiv(row, "#parts-content");
    }
  }
}

//Basically, this function takes a rows-worth/parts-worth of data and maps the right parameters onto JQuery functions that draw the div.
function drawDiv(divData, parent) {
  if (divData == null) return null;

  partNum = $.trim(divData[0]);
  imgURL = $.trim(divData[1]);
  mfr = $.trim(divData[2]);
  model = $.trim(divData[3]);
  type = $.trim(divData[4]);
  price = $.trim(divData[5]);
  avail = $.trim(divData[6]);
  orders = $.trim(divData[7]);

//Create the parts-content Div
  var $firstdiv = $("<div/>");
  $firstdiv.addClass('catalog-part');
  $firstdiv.attr({
    'mfr': mfr,
    'model': model,
    'type': type
  })

//Create clickable image for part
  var $ahref = $('<a href="part_details.html"><img src="https://' + imgURL + '"><div class="overlay"><p>' + mfr + ' ' + partNum + '<br>' + type + '<br>' + orders + ' Orders <br>' + price + ' ' + avail + '</p></div></a>');
    
//complete the Div by adding the clickable image 'into' the first Div
  $partsDiv = $firstdiv.append($ahref);

  console.log(JSON.stringify($partsDiv));
  $('#parts-content').append($partsDiv);
}
//End of Code to load and display Part Information dynamically
//************************************************************************************************************* */