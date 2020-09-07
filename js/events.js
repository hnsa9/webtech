$(function(){

	//form submit events cannot be put in handlebars
	//each time a form is load, the event handle for submit will be overlapped over and over
	//NOT GOOD!, EXTREMELY BAD

	//if overlap 3 times, for example opening the add-movie view 3 times
	//when submmitting the form, it will be submitted 3 times
	//means there will be 3 movies inserted
	


	//add movie form submit event
	$(document.body).on("submit", "#formadd", function(e) {

		e.preventDefault();

		//get the value from the form
		var movie_title = $("#addmovie_title").val();
		var showtimes = $("#addshowtimes").val();
		var genre = $("#addgenre").val();

		if (genre === "none" ) {
			bootbox.alert("Please select movie genre!");
			return;
		}
		
		var obj = new Object();
	 	obj.movie_title = movie_title;
	 	obj.showtimes = showtimes;
	 	obj.genre = genre;

		$.ajax({
		   type: "post",
		   url: 'api/movies',
		   contentType: 'application/json',
      	data: JSON.stringify(obj),            
		   dataType: "json",
		   success: function(data){

		      if (data.insertStatus) {

		         bootbox.alert("movie insertion successful");

		         //redirect to the /#movie
		         window.location.href = "#movies";

		      } 
		      else {

		         alert("movie insertion failed - please try again: " + data.errorMessage)
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
	});

	//add movie form cancel click event
	$(document.body).on("click", "#formaddcancel", function(e) {
		window.location.href = "#movies";
	});

	//edit movie form submit event
	$(document.body).on("submit", "#formedit", function(e) {

		e.preventDefault();

		//get the value from the form
		var showtimes = $("#editshowtimes").val();
		var movie_id = $("#movie_id").val();

		var obj = new Object();
	 	obj.showtimes = showtimes;


		$.ajax({
         type: "put",
         url: 'api/movies/' + movie_id,
		   contentType: 'application/json',
      	data: JSON.stringify(obj),            
		   dataType: "json",
		   success: function(data){

            if (data.updateStatus) {

               bootbox.alert("movie's showtime update successful");

               //redirect to the /#movies
		         window.location.href = "#movies/view/" + movie_id;

            } 
            else {

               alert("movie's showtime update failed - please try again: " + data.errorMessage)
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
	});

	//edit movie form cancel click event
	$(document.body).on("click", "#formeditcancel", function(e) {
		window.location.href = "#movies";
	});
	
	
	
	
	//book movie form submit event
	$(document.body).on("submit", "#formbook", function(e) {

		e.preventDefault();

		//get the value from the form
		var ticket = $("#ticket").val();
		var movie_id = $("#movie_id").val();

		var obj = new Object();
	 	obj.movie_id = movie_id;
		obj.ticket= ticket;


		$.ajax({
         type: "post",
         url: 'api/booking/' + movie_id,
		   contentType: 'application/json',
      	data: JSON.stringify(obj),            
		   dataType: "json",
		   success: function(data){

             if (data.insertStatus) {

		         bootbox.alert("Booking successful");

		         //redirect to the /#movie
		         window.location.href = "#booking";

		      } 
		      else {

		         alert("Booking failed - please try again: " + data.errorMessage)
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
	});

	//edit movie form cancel click event
	$(document.body).on("click", "#formbookcancel", function(e) {
		window.location.href = "#movies";
	});

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	//edit profile (user) form submit event
	$(document.body).on("submit", "#formupdateprofile", function(e) {

		e.preventDefault();

		//get the value from the form
		var name = $("#updateprofilename").val();
		var email = $("#updateprofileemail").val();
		var mobileno = $("#updateprofilemobileno").val();

		var obj = new Object();
	 	obj.name = name;
	 	obj.email = email;
	 	obj.mobileno = mobileno;

		$.ajax({
         type: "put",
         url: 'api/users',
		   contentType: 'application/json',
      	data: JSON.stringify(obj),            
		   dataType: "json",
		   success: function(data){

            if (data.updateStatus) {

               bootbox.alert("user profile update successful");

               //redirect to the /#home
		         window.location.href = "#home";

            } 
            else {

               alert("user profile update failed - please try again: " + data.errorMessage)
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
	});

	//profile password reset
	$(document.body).on("submit", "#formresetpassword", function(e) {

		e.preventDefault();

		//get the value from the form
		var oldpassword = $("#oldpassword").val();
		var newpassword = $("#newpassword").val();
		var repeatpassword = $("#repeatpassword").val();

		//check if newpassword !== repeatpassword
		if (newpassword !== repeatpassword) {
			bootbox.alert("New password not the same as the repeat password!");
			return false;
		}

		//check if newpassword == oldpassword
		if (newpassword === oldpassword) {
			bootbox.alert("New password is the same as old password!");
			return false;
		}

		var obj = new Object();
	 	obj.oldpassword = oldpassword;
	 	obj.newpassword = newpassword;

		$.ajax({
         type: "put",
         url: 'api/users/resetpassword',
		   contentType: 'application/json',
      	data: JSON.stringify(obj),            
		   dataType: "json",
		   success: function(data){

            if (data.updateStatus) {

               bootbox.alert("Password reset successful");

               //redirect to the /#home
		         window.location.href = "#home";

            } 
            else {

               bootbox.alert("Password reset failed [" + data.errorMessage + "] - please try again!");
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
	});

	//guest login form
	$(document.body).on("submit", "#loginform", function(e) {

		e.preventDefault();

		//get the value from the form
		var login = $("#loginformusername").val();
		var password = $("#loginformpassword").val();
		
	   var obj = new Object();
	   obj.login = login;
	   obj.password = password;

	   $.ajax({
	      type: "post",
	      url: 'api/auth',
	      contentType: 'application/json',      
	      data: JSON.stringify(obj),            
	      dataType: "json",
	      success: function(data){

            if (data.loginStatus) {

               bootbox.alert("Login successful");

               sessionStorage.setItem("token", data.token);

               //redirect to the /#home
		         window.location.href = "#home";

            } 
            else {

               bootbox.alert("Login failed [" + data.errorMessage + "] - please try again!");
            }
		   },
		   error: function() {
		      console.log("error");
		   }
		});
	});

	//guest register form
	$(document.body).on("submit", "#registerform", function(e) {

		e.preventDefault();

		//get the value from the form
		var login = $("#registerformusername").val();
		var password = $("#registerformpassword").val();
		var email = $("#registerformemail").val();

   	var obj = new Object();
   	obj.login = login;
   	obj.password = password;
	obj.email = email;

	   $.ajax({
	      type: "post",
	      url: 'api/registration',
	      contentType: 'application/json',      
	      data: JSON.stringify(obj),            
	      dataType: "json",
	      success: function(data){

            if (data.registrationStatus) {

               bootbox.alert("Registration successful");

               //redirect to the /#login
		         window.location.href = "#login";

            } 
            else {

               bootbox.alert("Registration failed [" + data.errorMessage + "] - please try again!");
            }
		   },
		   error: function() {
		      console.log("error");
		   }
		});

	});


});

/**
* Template Name: Gp - v2.1.0
* Template URL: https://bootstrapmade.com/gp-free-multipurpose-html-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
	"use strict";
  
	// Preloader
	$(window).on('load', function() {
	  if ($('#preloader').length) {
		$('#preloader').delay(100).fadeOut('slow', function() {
		  $(this).remove();
		});
	  }
	});
  

	// Mobile Navigation
	if ($('.nav-menu').length) {
	  var $mobile_nav = $('.nav-menu').clone().prop({
		class: 'mobile-nav d-lg-none'
	  });
	  $('body').append($mobile_nav);
	  $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
	  $('body').append('<div class="mobile-nav-overly"></div>');
  
	  $(document).on('click', '.mobile-nav-toggle', function(e) {
		$('body').toggleClass('mobile-nav-active');
		$('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
		$('.mobile-nav-overly').toggle();
	  });
  
	  $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
		e.preventDefault();
		$(this).next().slideToggle(300);
		$(this).parent().toggleClass('active');
	  });
  
	  $(document).click(function(e) {
		var container = $(".mobile-nav, .mobile-nav-toggle");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
		  if ($('body').hasClass('mobile-nav-active')) {
			$('body').removeClass('mobile-nav-active');
			$('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
			$('.mobile-nav-overly').fadeOut();
		  }
		}
	  });
	} else if ($(".mobile-nav, .mobile-nav-toggle").length) {
	  $(".mobile-nav, .mobile-nav-toggle").hide();
	}
  
	// Navigation active state on scroll
	var nav_sections = $('section');
	var main_nav = $('.nav-menu, #mobile-nav');
  
	$(window).on('scroll', function() {
	  var cur_pos = $(this).scrollTop() + 200;
  
	  nav_sections.each(function() {
		var top = $(this).offset().top,
		  bottom = top + $(this).outerHeight();
  
		if (cur_pos >= top && cur_pos <= bottom) {
		  if (cur_pos <= bottom) {
			main_nav.find('li').removeClass('active');
		  }
		  main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
		}
		if (cur_pos < 300) {
		  $(".nav-menu ul:first li:first").addClass('active');
		}
	  });
	});
  
	// Toggle .header-scrolled class to #header when page is scrolled
	$(window).scroll(function() {
	  if ($(this).scrollTop() > 100) {
		$('#header').addClass('header-scrolled');
	  } else {
		$('#header').removeClass('header-scrolled');
	  }
	});
  
	if ($(window).scrollTop() > 100) {
	  $('#header').addClass('header-scrolled');
	}
  
	// Back to top button
	$(window).scroll(function() {
	  if ($(this).scrollTop() > 100) {
		$('.back-to-top').fadeIn('slow');
	  } else { 
		$('.back-to-top').fadeOut('slow');
	  }
	});
  
	$('.back-to-top').click(function() {
	  $('html, body').animate({
		scrollTop: 0
	  }, 1500, 'easeInOutExpo');
	  return false;
	});
  
  
	// Init AOS
	function aos_init() {
	  AOS.init({
		duration: 1000,
		once: true
	  });
	}
	$(window).on('load', function() {
	  aos_init();
	});
  
  })(jQuery);