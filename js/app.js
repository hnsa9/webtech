$(function(){

	$.ajaxSetup({
	   beforeSend: function (xhr)
	   {
	   	var token = sessionStorage.getItem("token");
	   	xhr.setRequestHeader("Authorization","Bearer " + token);        
	   }
	});

   $(document).ajaxStart(function() {
      $('#spinner').show();
   });  

   $(document).ajaxStop(function() {
   	setTimeout(function(){ 
   		$('#spinner').hide(); 
   	}, 500);  	
   });

	function parseHash(newHash, oldHash){
	  crossroads.parse(newHash);
	}

	Handlebars.registerHelper("fullname", function(fname, lname) {
		return fname + " " + lname; 
	});


	Handlebars.registerHelper("displaymoviestatus", function(status) {
		var thestatus = parseInt(status);
		if (thestatus === 0)        
         return "<span class='label label-danger'>Coming Soon</span>";
      else if (thestatus === 1)        
         return "<span class='label label-success'>Now Showing</span>";
	});
	
	
	Handlebars.registerHelper("displaybookingstatus", function(status) {
		var thestatus = parseInt(status);
		if (thestatus === 0)        
         return "<span class='label label-danger'>Booked</span>";
      else if (thestatus === 1)        
         return "<span class='label label-success'>Collected</span>";
	});

	Handlebars.registerHelper("displaygenre", function(genre) {
		 
		 if (genre === "Drama")        
			return "<span class='label label-info'>Drama</span>";      
		else if (genre === "Thriller")        
			return "<span class='label label-success'>Thriller</span>";
		else if (genre === "Action")        
			return "<span class='label label-success'>Action</span>";
		else if (genre === "Horror")        
			return "<span class='label label-success'>Horror</span>";
		else if (genre === "Animation")        
			return "<span class='label label-success'>Animation</span>";
		else if (genre === "Comedy")        
			return "<span class='label label-success'>Comedy</span>";
		else if (genre === "Sci-Fi")        
			return "<span class='label label-success'>Sci-Fi</span>";
	});	


	var routelogin = crossroads.addRoute('/login', function(){

		if (sessionStorage.token) {
			window.location.href = "#home";			
			return;
		}

		$("#loginname").html("noname");
		var loginTemplate = Handlebars.templates['login'];

		$("#divcontent").empty();
		$("#divcontent").html(loginTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li class='active'>Login</li>");

		$(".navbar-collapse li").removeClass('active');

	});

	var routeregister = crossroads.addRoute('/register', function(){

		if (sessionStorage.token) {
			window.location.href = "#home";			
			return;
		}

		$("#loginname").html("noname");
		var registerTemplate = Handlebars.templates['register'];

		$("#divcontent").empty();
		$("#divcontent").html(registerTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li class='active'>Register</li>");

		$(".navbar-collapse li").removeClass('active');

	});

	var routeforgotpassword = crossroads.addRoute('/forgotpassword', function(){

		if (sessionStorage.token) {
			window.location.href = "#home";			
			return;
		}

		$("#loginname").html("noname");
		var forgotPasswordTemplate = Handlebars.templates['forgot-password'];

		$("#divcontent").empty();
		$("#divcontent").html(forgotPasswordTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li class='active'>Forgot Password</li>");

		$(".navbar-collapse li").removeClass('active');

	});

	var routelogout = crossroads.addRoute('/logout', function(){

		$("#loginname").html("noname");
		sessionStorage.removeItem("token");
		window.location.href = "#login";
		return;

	});

	var route1 = crossroads.addRoute('', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);		

		//get user login data
	   $.ajax({
	      type: "GET",
	      url: 'api/users',               
	      dataType: "json",
	      success: function(data){

				var homeTemplate = Handlebars.templates['home'](data);

				$("#divcontent").empty();
				$("#divcontent").html(homeTemplate).hide().fadeIn(1000);
		
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);

					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li class='active'>Home</li>");

		$(".navbar-collapse li").removeClass('active');
  		$(".navbar-collapse li a[href='#home']").parent().addClass('active');

	});

	var route2 = crossroads.addRoute('/home', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);		

		//get user login data
	   $.ajax({
	      type: "GET",
	      url: 'api/users',               
	      dataType: "json",
	      success: function(data){

				var homeTemplate = Handlebars.templates['home'](data);

				$("#divcontent").empty();
				$("#divcontent").html(homeTemplate).hide().fadeIn(1000);
		
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);

					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li class='active'>Home</li>");

		$(".navbar-collapse li").removeClass('active');
  		$(".navbar-collapse li a[href='#home']").parent().addClass('active');

	});

	//complete the template code for movies
	var route3 = crossroads.addRoute('/movies', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		var role = decoded.role; 
		
		if (role!="admin") {
		
			 ///member
	  
	   $.ajax({
	      type: "get", 
	      url: 'api/active/movies',
	      dataType: "json",
	      success: function(data){
			  
				var moviesTemplate = Handlebars.templates['movies-member']({"movielist": data});
				
				$("#divcontent").empty();
				$("#divcontent").html(moviesTemplate).hide().fadeIn(1000);

				//add data using json array in context to first-td for each row in tbody
				$('#tblmovies tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);

					var movie_id = data[i].movie_id;

					var movie_title = data[i].movie_title;
					var genre = data[i].genre;
					var showtimes = data[i].showtimes;
					var status = data[i].status;				

					$(tdIndex).data("movie_id", movie_id);

					$(tdIndex).data("movie_title", movie_title);
					$(tdIndex).data("genre", genre);
					$(tdIndex).data("showtimes", showtimes);
					$(tdIndex).data("status", status);					
						
				});

				//reading the data from the first td of each row in tbody
				$('#tblmovies tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);
					console.log("Movie ID: " + $(tdIndex).data("movie_id"));
					console.log("Movie Title: " + $(tdIndex).data("movie_title"));
					console.log("Genre: " + $(tdIndex).data("genre"));
					console.log("Showtimes: " + $(tdIndex).data("showtimes"));
					console.log("Status: " + $(tdIndex).data("status"));					
					
					console.log("");
				});
				

				
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

		 }

      });		
	  
	  
	  ///member
	  
				
	   } 
	   
	   else 
	   {
		   
		   
        //admin
		//get all movies using user login => ownerlogin
	   $.ajax({
	      type: "get", 
	      url: 'api/movies',
	      dataType: "json",
	      success: function(data){
			  
				var moviesTemplate = Handlebars.templates['movies']({"movielist": data});
				
				$("#divcontent").empty();
				$("#divcontent").html(moviesTemplate).hide().fadeIn(1000);

				//add data using json array in context to first-td for each row in tbody
				$('#tblmovies tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);

					var movie_id = data[i].movie_id;

					var movie_title = data[i].movie_title;
					var genre = data[i].genre;
					var showtimes = data[i].showtimes;
					var status = data[i].status;				

					$(tdIndex).data("movie_id", movie_id);

					$(tdIndex).data("movie_title", movie_title);
					$(tdIndex).data("genre", genre);
					$(tdIndex).data("showtimes", showtimes);
					$(tdIndex).data("status", status);					
						
				});

				//reading the data from the first td of each row in tbody
				$('#tblmovies tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);
					console.log("Movie ID: " + $(tdIndex).data("movie_id"));
					console.log("Movie Title: " + $(tdIndex).data("movie_title"));
					console.log("Genre: " + $(tdIndex).data("genre"));
					console.log("Showtimes: " + $(tdIndex).data("showtimes"));
					console.log("Status: " + $(tdIndex).data("status"));					
					
					console.log("");
				});
				
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

		 }

      });		
	  
	  
	  ///admin

		   
		   
		   
		   
	   }
		
	  

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li class='active'>Movies</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#movies']").parent().addClass('active');
	});

	var route3b = crossroads.addRoute('/movies/add', function(){	
	

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		var role = decoded.role; 
		
		if (role!="admin") {
			window.location.href = "#home";
			return;
		} 
		else {
			var moviesAddTemplate = Handlebars.templates['movies-add'];
			}
	
		//var contactsAddTemplate = Handlebars.templates['contacts-add'](context);
		//var contactsAddTemplate = Handlebars.templates['movies-add'];

		$("#divcontent").empty();
		$("#divcontent").html(moviesAddTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> /</li>");
		$(".breadcrumb").append("<li><a href='#movies'>Movie</a> /</li>");
		$(".breadcrumb").append("<li class='active'>Add</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#movies']").parent().addClass('active');

		//refresh the token for another 15 minutes			
	   $.ajax({
	      type: "post",
	      url: "api/refreshtoken",      
	      dataType: "json",            
	      success: function(data){
				sessionStorage.setItem("token", data.token);
				console.log("refresh token: " + data.token);
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);

					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      }); 
	});

	var route3c = crossroads.addRoute('/movies/view/{movie_id}', function(movie_id){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		
		var role = decoded.role; 
		
		

		//get contact via id
	   $.ajax({
	      type: "get",
	      url: 'api/movies/' + movie_id,
	      dataType: "json",
	      success: function(data){

         	if (!$.isEmptyObject(data)) {
				
				
				
				if (role!="admin") {
				var moviesViewTemplate = Handlebars.templates['movies-view-member'](data);
				} 
				else {
				var moviesViewTemplate = Handlebars.templates['movies-view'](data);
				}
			  
					//var contactsViewTemplate = Handlebars.templates['movies-view'](data);

					$("#divcontent").empty();
					$("#divcontent").html(moviesViewTemplate).hide().fadeIn(1000);

				} else {

					bootbox.alert("Rolling no hacking detected! - Login Id is submitted to the NSA BlackHat list");
					window.location.href = "#movies";

				}

         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li><a href='#movies'>Movie</a> / </li>");
		$(".breadcrumb").append("<li class='active'>View</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#movies']").parent().addClass('active');
	});

	var route3d = crossroads.addRoute('/movies/edit/{movie_id}', function(movie_id){	

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		var role = decoded.role; 
		
		
		

		//get contact via id
	   $.ajax({
	      type: "get",
	      url: 'api/movies/' + movie_id,
	      dataType: "json",
	      success: function(data){

         	if (!$.isEmptyObject(data)) {
				
				
				
					if (role!="admin") {
						window.location.href = "#home";
						return;
					}
 
					var moviesEditTemplate = Handlebars.templates['movies-edit'](data);

					$("#divcontent").empty();
					$("#divcontent").html(moviesEditTemplate).hide().fadeIn(1000);


				} else {

					bootbox.alert("Rolling no hacking detected! - Login Id is submitted to the NSA BlackHat list");
					window.location.href = "#movies/{movie_id}";

				}

         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li><a href='#movies'>Movie</a> / </li>");
		$(".breadcrumb").append("<li class='active'>Update</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#movies']").parent().addClass('active');
	});
	
	
	var routebook = crossroads.addRoute('/booking/booking/{movie_id}', function(movie_id){	
	

			if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		var role = decoded.role; 
		
		
		

		//get contact via id
	   $.ajax({
	      type: "get",
	      url: 'api/movies/' + movie_id,
	      dataType: "json",
	      success: function(data){

         	if (!$.isEmptyObject(data)) {
				
				
				
					if (role!="member") {
						window.location.href = "#home";
						return;
					}
 
					var bookingTemplate = Handlebars.templates['movie-book'](data);

					$("#divcontent").empty();
					$("#divcontent").html(bookingTemplate).hide().fadeIn(1000);


				} else {

					bootbox.alert("Rolling no hacking detected! - Login Id is submitted to the NSA BlackHat list");
					window.location.href = "#movies/{movie_id}";

				}

         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li><a href='#movies'>Movie</a> / </li>");
		$(".breadcrumb").append("<li class='active'>Book</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#movies']").parent().addClass('active');
	});
	
	
	
	//complete the template code for movies
	var booking = crossroads.addRoute('/booking', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		var role = decoded.role; 
		
		if (role!="admin") {
		
			 ///member
	  
	   $.ajax({
	      type: "get", 
	      url: 'api/booking',
	      dataType: "json",
	      success: function(data){
			  
				var bookingTemplate = Handlebars.templates['booking']({"bookinglist": data});
				
				$("#divcontent").empty();
				$("#divcontent").html(bookingTemplate).hide().fadeIn(1000);

				//add data using json array in context to first-td for each row in tbody
				$('#tblbooking tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);
					
					var booking_id = data[i].booking_id;
					var movie_title = data[i].movie_title;
					//var genre = data[i].genre;
					//var showtimes = data[i].showtimes;
					
					
					//var movie_id = data[i].movie_id;
					var ticket = data[i].ticket;
					var bookdate = data[i].bookdate;
					var status = data[i].status;				
					
					
					$(tdIndex).data("booking_id", booking_id);
					//$(tdIndex).data("movie_id", movie_id);
					$(tdIndex).data("movie_title", movie_title);
					//$(tdIndex).data("genre", genre);
					//$(tdIndex).data("showtimes", showtimes);
					$(tdIndex).data("ticket", ticket);
					$(tdIndex).data("bookdate", bookdate);
					$(tdIndex).data("status", status);					
						
				});

				//reading the data from the first td of each row in tbody
				$('#tblbooking tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);
					console.log("Booking ID: " + $(tdIndex).data("booking_id"));
					console.log("Movie Title: " + $(tdIndex).data("movie_title"));
					console.log("Genre: " + $(tdIndex).data("genre"));
					console.log("Showtimes: " + $(tdIndex).data("showtimes"));
					console.log("Ticket: " + $(tdIndex).data("ticket"));	
					console.log("Booking Date: " + $(tdIndex).data("bookdate"));	
					console.log("Status: " + $(tdIndex).data("status"));					
					
					console.log("");
				});
				

				
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

		 }

      });		
	  
	  
	  ///member
	  
				
	   } 
	   
	   else 
	   {
		   
		   
        //admin
		//get all movies using user login => ownerlogin
	   $.ajax({
	      type: "get", 
	      url: 'api/booking/admin',
	      dataType: "json",
	      success: function(data){
			  
				var bookingTemplate = Handlebars.templates['booking-admin']({"bookinglist": data});
				
				$("#divcontent").empty();
				$("#divcontent").html(bookingTemplate).hide().fadeIn(1000);

				//add data using json array in context to first-td for each row in tbody
				$('#tblbooking tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);

					var booking_id = data[i].booking_id;

					var movie_title = data[i].movie_title;
					var bookdate = data[i].bookdate;
					var ticket = data[i].ticket;
					var user = data[i].user;
					var status = data[i].status;				

					$(tdIndex).data("booking_id", booking_id);
					$(tdIndex).data("movie_title", movie_title);
					$(tdIndex).data("bookdate", bookdate);
					$(tdIndex).data("ticket", ticket);
					$(tdIndex).data("user", user);
					$(tdIndex).data("status", status);					
						
						
				});

				//reading the data from the first td of each row in tbody
				$('#tblbooking tbody tr').each(function(i) {
					var tdIndex = $(this).children().eq(0);
					console.log("Booking ID: " + $(tdIndex).data("booking_id"));
					console.log("Movie Title: " + $(tdIndex).data("movie_title"));
					console.log("Ticket: " + $(tdIndex).data("ticket"));	
					console.log("Booking Date: " + $(tdIndex).data("bookdate"));
					console.log("User: " + $(tdIndex).data("user"));						
					console.log("Status: " + $(tdIndex).data("status"));	
					console.log("");
				});
				
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

		 }

      });		
	  
	  
	  ///admin

		   
		   
		   
		   
	   }
		
	  

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li class='active'>Booking</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#booking']").parent().addClass('active');
	});

	
	var routeviewbook = crossroads.addRoute('/booking/view/{booking_id}', function(booking_id){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
		
		var role = decoded.role; 
		
		

		//get contact via id
	   $.ajax({
	      type: "get",
	      url: 'api/booking/' + booking_id,
	      dataType: "json",
	      success: function(data){

         	if (!$.isEmptyObject(data)) {
				
				
				
				if (role!="admin") {
				var bookingViewTemplate = Handlebars.templates['booking-view-member'](data);
				} 
				else {
				var bookingViewTemplate = Handlebars.templates['booking-view-admin'](data);
				}
			  
					//var contactsViewTemplate = Handlebars.templates['movies-view'](data);

					$("#divcontent").empty();
					$("#divcontent").html(bookingViewTemplate).hide().fadeIn(1000);

				} else {

					bootbox.alert("Rolling no hacking detected! - Login Id is submitted to the NSA BlackHat list");
					window.location.href = "#booking";

				}

         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li><a href='#movies'>Movie</a> / </li>");
		$(".breadcrumb").append("<li class='active'>View</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#movies']").parent().addClass('active');
	});

	
	
	
	
	
	
	
	
	
	var routereports = crossroads.addRoute('/reports', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
		
	
		var reportsTemplate = Handlebars.templates['reports'];

		$("#divcontent").empty();
		$("#divcontent").html(reportsTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a></li>");
		$(".breadcrumb").append("<li class='active'>Reports</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#reports']").parent().addClass('active');

		//refresh the token for another 15 minutes			
	   $.ajax({
	      type: "post",
	      url: "api/refreshtoken",      
	      dataType: "json",            
	      success: function(data){
				sessionStorage.setItem("token", data.token);
				console.log("refresh token: " + data.token);
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);

					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });
	});

	//complete the template code for about
	var route4 = crossroads.addRoute('/about', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);
	
		var aboutTemplate = Handlebars.templates['about'];

		$("#divcontent").empty();
		$("#divcontent").html(aboutTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li class='active'>About</li>");

		$(".navbar-collapse li").removeClass('active');
	  	$(".navbar-collapse li a[href='#about']").parent().addClass('active');

		//refresh the token for another 15 minutes			
	   $.ajax({
	      type: "post",
	      url: "api/refreshtoken",      
	      dataType: "json",            
	      success: function(data){
				sessionStorage.setItem("token", data.token);
				console.log("refresh token: " + data.token);
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);

					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });
	});

	//complete the template code for profile
	var route5 = crossroads.addRoute('/profile', function(){	

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);	

		//get user login data
	   $.ajax({
	      type: "GET",
	      url: 'api/users',               
	      dataType: "json",
	      success: function(data){

				var profileTemplate = Handlebars.templates['profile'](data);

				$("#divcontent").empty();
				$("#divcontent").html(profileTemplate).hide().fadeIn(1000);
		
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);
			     	
					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });			

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li class='active'>Profile</li>");

		$(".navbar-collapse li").removeClass('active');
	});

	//complete the template code for passwordreset
	var route5b = crossroads.addRoute('/profile/passwordreset', function(){

		if (!sessionStorage.token) {
			$("#loginname").html("noname");
			sessionStorage.removeItem("token");
			window.location.href = "#login";
			return;
		}

		//get token from sessionStorage
		var token = sessionStorage.getItem("token");

		//decode jwt token using jwt-decode
		var decoded = jwt_decode(token);
		$("#loginname").html(decoded.login);	

		context = {
			login: decoded.login
		};
	
		var aboutTemplate = Handlebars.templates['profile-passwordreset'](context);

		$("#divcontent").empty();
		$("#divcontent").html(aboutTemplate).hide().fadeIn(1000);

		$(".breadcrumb").empty();
		$(".breadcrumb").append("<li><a href='#home'>Home</a> / </li>");
		$(".breadcrumb").append("<li><a href='#profile'>Profile</a> / </li>");
		$(".breadcrumb").append("<li class='active'>Password Reset</li>");

		$(".navbar-collapse li").removeClass('active');

		//refresh the token for another 15 minutes			
	   $.ajax({
	      type: "post",
	      url: "api/refreshtoken",      
	      dataType: "json",            
	      success: function(data){
				sessionStorage.setItem("token", data.token);
				console.log("refresh token: " + data.token);
         },
         error: function(xhr, statusText, err) {

         	if (xhr.status == 401) {
			     	//response text from the server if there is any
			     	var responseText = JSON.parse(xhr.responseText);
			     	bootbox.alert("Error 401 - Unauthorized: " + responseText.message);

					$("#loginname").html("noname");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("login");
					window.location.href = "#login";
					return;
			   }

			   if (xhr.status == 404) {
			     	bootbox.alert("Error 404 - API resource not found at the server");
			   }

         }
      });
	});	

	hasher.initialized.add(parseHash); //parse initial hash
	hasher.changed.add(parseHash); //parse hash changes
	hasher.init(); //start listening for history change

});