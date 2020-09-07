<?php
   /*
   POST movies DONE
   GET movies => get al movies using ownerlogin in token payload DONE
   GET movies/{id, ownerlogin} DONE => ownerlogin for rolling no hacking prevention
   PUT movies/{id} DONE 
   PUT movies/status/{id} DONE => update status
   DELETE movies/{id} DONE

   GET users/{login} get profile DONE
   PUT users/{login} profile update DONE
   PUT users/password/{login} reset password DONE
   */

   ini_set("date.timezone", "Asia/Kuala_Lumpur");

   header('Access-Control-Allow-Origin: *');   

   //*
   // Allow from any origin
   if (isset($_SERVER['HTTP_ORIGIN'])) {
      // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
      // you want to allow, and if so:
      header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
   }

   // Access-Control headers are received during OPTIONS requests
   if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

      if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
         header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");         

      if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
         header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

      exit(0);
   }
   //*/

   include_once("database_class.php");

   require_once 'vendor/autoload.php';

   use \Psr\Http\Message\ServerRequestInterface as Request;
   use \Psr\Http\Message\ResponseInterface as Response;

   use Ramsey\Uuid\Uuid;
   use Ramsey\Uuid\Exception\UnsatisfiedDependencyException;

   //load environment variable - jwt secret key
   $dotenv = new Dotenv\Dotenv(__DIR__);
   $dotenv->load();

   //jwt secret key in case dotenv not working in apache
   //$jwtSecretKey = "jwt_secret_key";

   use Slim\App;
   use Slim\Middleware\TokenAuthentication;
   use Firebase\JWT\JWT;

   //functions /////////////////////////////////////////////start

   function generateToken($role, $login, $name) {      

      //create JWT token
      $date = date_create();
      $jwtIAT = date_timestamp_get($date);
      $jwtExp = $jwtIAT + (180 * 60); //expire after 3 hours

      $jwtToken = array(
         "iss" => "rbk.net", //issuer of the token
         "iat" => $jwtIAT, //issued at time
         "exp" => $jwtExp, //expire
         "role" => $role,
         "login" => $login,
         "name" => $name
      );
      $token = JWT::encode($jwtToken, getenv('JWT_SECRET'));
      return $token;
   }

   function getDatabase() {
      $dbhost="127.0.0.1";
      $dbuser="root";
      $dbpass="";
      $dbname="cinema";

      $db = new Database($dbhost, $dbuser, $dbpass, $dbname);
      return $db;
   }

   function getLoginFromTokenPayload($request, $response) {
      $token_array = $request->getHeader('HTTP_AUTHORIZATION');
      $token = substr($token_array[0], 7);

      //decode the token
      try
      {
         $tokenDecoded = JWT::decode(
            $token, 
            getenv('JWT_SECRET'), 
            array('HS256')
         );

         //in case dotenv not working
         /*
         $tokenDecoded = JWT::decode(
            $token, 
            $GLOBALS['jwtSecretKey'], 
            array('HS256')
         );
         */
      }
      catch(Exception $e)
      {
         $data = Array(
            "message" => "Token invalid"
         ); 

         return $response->withJson($data, 401)
                         ->withHeader('Content-tye', 'application/json');
      }

      return $tokenDecoded->login;
   }
   
    function getRoleFromTokenPayload($request, $response) {
      $token_array = $request->getHeader('HTTP_AUTHORIZATION');
      $token = substr($token_array[0], 7);

      //decode the token
      try
      {
         $tokenDecoded = JWT::decode(
            $token, 
            getenv('JWT_SECRET'), 
            array('HS256')
         );

         //in case dotenv not working
         /*
         $tokenDecoded = JWT::decode(
            $token, 
            $GLOBALS['jwtSecretKey'], 
            array('HS256')
         );
         */
      }
      catch(Exception $e)
      {
         $data = Array(
            "message" => "Token invalid"
         ); 

         return $response->withJson($data, 401)
                         ->withHeader('Content-tye', 'application/json');
      }

      return $tokenDecoded->role;
   }
   
   
   
   
   
   
   //functions /////////////////////////////////////////////ends

   $config = [
      'settings' => [
         'displayErrorDetails' => true,
		 'determineRouteBeforeAppMiddleware' => true
      ]
   ];

   $app = new App($config);

   /**
     * Token authentication middleware logic
     */
   $authenticator = function($request, TokenAuthentication $tokenAuth){

      /**
         * Try find authorization token via header, parameters, cookie or attribute
         * If token not found, return response with status 401 (unauthorized)
      */
      $token = $tokenAuth->findToken($request); //from header

      try {
         $tokenDecoded = JWT::decode($token, getenv('JWT_SECRET'), array('HS256'));

         //in case dotenv not working
         //$tokenDecoded = JWT::decode($token, $GLOBALS['jwtSecretKey'], array('HS256'));
      }
      catch(Exception $e) {
         throw new \app\UnauthorizedException('Invalid Token');
      }
   };

   /**
     * Add and manage token authentication middleware => $authenticator
     * passthrough means, no token needed, a public/guest route
     */
   $app->add(new TokenAuthentication([
        'path' => '/', //secure route - need token
        'passthrough' => [ //public route, no token needed
            '/ping', 
            '/token',
            '/auth',
            '/hello',
            '/calc',
            '/registration',
			'/login'
         ], 
        'authenticator' => $authenticator
   ]));

   /**
     * Public route example
     */
   $app->get('/ping', function($request, $response){
      $output = ['msg' => 'RESTful API works, active and online!'];
      return $response->withJson($output, 200, JSON_PRETTY_PRINT);
   });

   /**
     * Public route example
     * in real application, this must be disable
     * only for debugging, generating token instantly
     * without login
     */
   $app->get('/token', function($request, $response){
      $token = generateToken('member', 'bean', 'mr bean');
      $output = ['token' => $token];
      return $response->withJson($output, 200, JSON_PRETTY_PRINT);
   });

   //public route sample with 1 parameter
   $app->get('/hello/[{name}]', function($request, $response, $args){

      $name = $args['name'];
      $msg = "Hello $name, welcome to RESTFul world";

      $data = array(
         'msg' => $msg
      );

      return $response->withJson($data, 200, JSON_PRETTY_PRINT);
   });

   //public route sample with more than one parameters
   $app->get('/calc[/{num1}/{num2}]', function($request, $response, $args){

      $num1 = $args['num1'];
      $num2 = $args['num2'];
      $total = $num1 + $num2;

      $msg = "$num1 + $num2 = $total";

      $data = array(
         'msg' => $msg
      );

      return $response->withJson($data, 200, JSON_PRETTY_PRINT);
   });

   /**
     * Public route /registration for member registration
     */
   $app->post('/registration', function($request, $response){

      $json = json_decode($request->getBody());
      $login = $json->login;
      $clearpassword = $json->password;
	  $email = $json->email;

      //insert user
      $db = getDatabase();
      $dbs = $db->insertUser($login, $clearpassword, $email);
      $db->close();

      $data = array(
         "registrationStatus" => $dbs->status,
         "errorMessage" => $dbs->error
      ); 

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
   });

   /**
     * Public route /auth for creds authentication / login process
     */
   $app->post('/auth', function($request, $response){
      
      //extract form data - email and password
      $json = json_decode($request->getBody());
      $login = $json->login;
      $clearpassword = $json->password;

      //do db authentication
      $db = getDatabase();
      $data = $db->authenticateUser($login);
      $db->close();

      //status -1 -> user not found
      //status 0 -> wrong password
      //status 1 -> login success

      $returndata = array(
      );

      //user not found
      if ($data === NULL) {
         $returndata = array(
            "loginStatus" => false,
            "errorMessage" => "Username/password is incorrect!"
         );           
      }      
      else { //user found

         if (password_verify($clearpassword, $data->passwordhash)) {

            //create JWT token
            $date = date_create();
            $jwtIAT = date_timestamp_get($date);
            $jwtExp = $jwtIAT + (60 * 60 * 12); //expire after 12 hours

            $jwtToken = array(
               "iss" => "mycinema.net", //token issuer
               "iat" => $jwtIAT, //issued at time
               "exp" => $jwtExp, //expire
               "role" => $data->role,
               "login" => $data->login,
               "name" => $data->name
            );
            $token = JWT::encode($jwtToken, getenv('JWT_SECRET'));

            $returndata = array(
               "loginStatus" => true, 
               "token" => $token
            );

         } else {

            $returndata = array(
               "loginStatus" => false,
               "errorMessage" => "Username/password is incorrect!"
            );

         }
      }  

      return $response->withJson($returndata, 200)
                      ->withHeader('Content-type', 'application/json');    
   }); 

   //restricted route
   //refresh token
   //if current token valid, extend token for another 15 minutes
   $app->post('/refreshtoken', function($request, $response) {

      $token_array = $request->getHeader('HTTP_AUTHORIZATION');
      $token = substr($token_array[0], 7);
      
      $decodedToken = new stdClass();
      $isValidToken = false;

      //we need to validate the token, for decoding it, no choice
      //double validation here
      //this is restricted route, so token validation happen in middleware
      try
      {
         $decodedToken = JWT::decode($token, getenv('JWT_SECRET'), array('HS256'));
      }
      catch(Exception $e)
      {
         $data = array(
            "message" => "Invalid Token"
         ); 

         return $response->withJson($data, 401)
                         ->withHeader('Content-type', 'application/json');
      }

      $role = $decodedToken->role;
      $login = $decodedToken->login;
      $name = $decodedToken->name;

      $token = generateToken($role, $login, $name);

      $data = array(
         "token" => $token,
         "isValidToken" => true
      );

      return $response->withJson($data, 200)
                      ->withHeader('Content-tye', 'application/json');

   });

   //movies CRUD  ///////////////////////////////////////////////////////////////////  strart
   //
   //restricted route
   //POST - INSERT MOVIE - secure route - need token
   $app->post('/movies', function($request, $response){

      $ownerlogin = getLoginFromTokenPayload($request, $response);
	  $role = getRoleFromTokenPayload($request, $response);
	  
      //form data
      $json = json_decode($request->getBody());
      $movie_title = $json->movie_title;
      $showtimes = $json->showtimes;
      $genre = $json->genre;

	  if ($role=="admin") {
		  
      $db = getDatabase();
      $dbs = $db->insertMovie($movie_title, $showtimes, $genre, $ownerlogin);
      $db->close();

      $data = array(
         "insertStatus" => $dbs->status,
         "errorMessage" => $dbs->error
      ); 
	  
	  } else {
		
		$data = array(
         "insertStatus" => false,
         "errorMessage" => "Not authorized"
		); 
	  
	  }


      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
   });   

   //restricted route
   //- secure route - need token
   //GET - ALL MOVIES using login in token payload as ownerlogin
   $app->get('/movies', function($request, $response){

      $ownerlogin = getLoginFromTokenPayload($request, $response);

      $db = getDatabase();
      $data = $db->getAllMoviesViaLogin($ownerlogin);
      $db->close();

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });
   
   
   //GET ACTIVE MOVIES ONLY
   $app->get('/active/movies', function($request, $response){

      $ownerlogin = getLoginFromTokenPayload($request, $response);

      $db = getDatabase();
      $data = $db->getActiveMovies($ownerlogin);
      $db->close();

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });

   
   
   
   
   
   
   
   

   //restricted route
   //- secure route - need token
   //GET - SINGLE MOVIE VIA ID
   $app->get('/movies/[{movie_id}]', function($request, $response, $args){

      //get owner login - to prevent rolling no hacking, bcoz of insecure get method
      //$ownerlogin = getLoginFromTokenPayload($request, $response);  
      
      $movie_id = $args['movie_id'];

      $db = getDatabase();
      $data = $db->getMovieViaId($movie_id);
      $db->close();

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
   }); 

   //restricted route
   //- secure route - need token
   //PUT - UPDATE SINGLE MOVIE VIA ID
   $app->put('/movies/[{movie_id}]', function($request, $response, $args){
     
      //from url
      //rolling no hack not possible as extracting the data for update
      //is using ownerlogin
	  $role = getRoleFromTokenPayload($request, $response);
      $movie_id = $args['movie_id'];

      //form data using json structure
      $json = json_decode($request->getBody());
      $showtimes = $json->showtimes;
	  //$movie_id = $json->movie_id;


	 if ($role=="admin") {

      $db = getDatabase();
      $dbs = $db->updateMovieViaId($movie_id, $showtimes);
      $db->close();

      $data = Array(
         "updateStatus" => $dbs->status,
         "errorMessage" => $dbs->error
      );
	  
	  } 
	  else {
		$data = Array(
         "updateStatus" => false,
         "errorMessage" => "Not authorized"
		);
	  
	  }
	 

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });

   //restricted route
   //- secure route - need token
   //PUT - UPDATE MOVIE STATUS VIA ID
   $app->put('/movies/status/[{movie_id}]', function($request, $response, $args){
     
      //from url
      $movie_id = $args['movie_id'];
	  $role = getRoleFromTokenPayload($request, $response);

      //form data, from json data
      $json = json_decode($request->getBody());
      $status = $json->status;

	  if ($role=="admin") {


      $db = getDatabase();

      if ($status) {
	  $status = 0; 
	  }
      else {
         $status = 1;
	  }

      $dbs = $db->updateMovieStatusViaId($movie_id, $status);
      $db->close();

      $data = Array(
         "updateStatus" => $dbs->status,
         "errorMessage" => $dbs->error,
         "status" => $status
      );
	  
	  }
	  
	  else {
		 $data = Array(
         "updateStatus" => false,
         "errorMessage" => "Not authorized"
       
      );
	  }

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });

   //restricted route
   //- secure route - need token
   //DELETE - SINGLE MOVIE VIA ID
   $app->delete('/movies/[{movie_id}]', function($request, $response, $args){

      $movie_id = $args['movie_id'];

	  $role = getRoleFromTokenPayload($request, $response);

	  if ($role=="admin") {
	
      $db = getDatabase();
      $dbs = $db->deleteMovieViaId($movie_id);
      $db->close();

      $data = Array(
         "deleteStatus" => $dbs->status,
         "errorMessage" => $dbs->error
      );
	  
	  }
	  
	  else {
		 $data = Array(
         "deleteStatus" => false,
         "errorMessage" => "Not authorized"
      );
	  }

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');     
   });
   //
   //movies CRUD  /////////////////////////////////////////////////////////////////////  ends



	//BOOKING CRUD//
	
	 $app->post('/booking/[{movie_id}]', function($request, $response){

      $ownerlogin = getLoginFromTokenPayload($request, $response);
	  $role = getRoleFromTokenPayload($request, $response);
	  
      //form data
      $json = json_decode($request->getBody());
      $movie_id = $json->movie_id;
      $ticket = $json->ticket;
     

	  if ($role=="member") {
		  
      $db = getDatabase();
      $dbs = $db->insertBooking($movie_id, $ticket, $ownerlogin);
      $db->close();

      $data = array(
         "insertStatus" => $dbs->status,
         "errorMessage" => $dbs->error
      ); 
	  
	  } else {
		
		$data = array(
         "insertStatus" => false,
         "errorMessage" => "Not authorized"
		); 
	  
	  }


      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
   });   


	 $app->get('/booking', function($request, $response){

	   $ownerlogin = getLoginFromTokenPayload($request, $response);
	   $role = getRoleFromTokenPayload($request, $response);
 
      
		 $db = getDatabase();
		 $data = $db->getBookingViaOwnerLogin($ownerlogin);
		 $db->close();
	

     
      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
   }); 


 $app->get('/booking/admin', function($request, $response){

	   $ownerlogin = getLoginFromTokenPayload($request, $response);
	   $role = getRoleFromTokenPayload($request, $response);
 
      
	   if ($role=="admin") {
	
      $db = getDatabase();
		$data = $db->getAllBooking();
		 $db->close();

	  }
	  
	  else {
		 $data = Array(
         "errorMessage" => "Not authorized"
      );
	  }

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');     
   });
	  
	  
	  
	  
	  
	  
	  
	  
		
	




	$app->get('/booking/[{booking_id}]', function($request, $response, $args){

      //get owner login - to prevent rolling no hacking, bcoz of insecure get method
      //$ownerlogin = getLoginFromTokenPayload($request, $response);  
      
      $booking_id = $args['booking_id'];

      $db = getDatabase();
      $data = $db->getBookingViaId($booking_id);
      $db->close();

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
   }); 


	$app->put('/booking/status/[{booking_id}]', function($request, $response, $args){
     
      //from url
      $booking_id = $args['booking_id'];
	  $role = getRoleFromTokenPayload($request, $response);

      //form data, from json data
      $json = json_decode($request->getBody());
      $status = $json->status;

	  if ($role=="admin") {


      $db = getDatabase();

      if ($status) {
	  $status = 0; 
	  }
      else {
         $status = 1;
	  }

      $dbs = $db->updateBookingStatusViaId($booking_id, $status);
      $db->close();

      $data = Array(
         "updateStatus" => $dbs->status,
         "errorMessage" => $dbs->error,
         "status" => $status
      );
	  
	  }
	  
	  else {
		 $data = Array(
         "updateStatus" => false,
         "errorMessage" => "Not authorized"
       
      );
	  }

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });












   //users CRUD  //////////////////////////////////////////////////////////////////////  starts

   //restricted route
   //- secure route - need token
   //GET - single user using login in token payload
   $app->get('/users', function($request, $response){

      $login = getLoginFromTokenPayload($request, $response);

      $db = getDatabase();
      $data = $db->getUserViaLogin($login);
      $db->close();

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });

   //restricted route
   //- secure route - need token
   //PUT - UPDATE SINGLE user VIA login from token payload
   $app->put('/users', function($request, $response, $args){
     
      $login = getLoginFromTokenPayload($request, $response);

      //form data using json structure
      $json = json_decode($request->getBody());
      $name = $json->name;
      $email = $json->email;
      $mobileno = $json->mobileno;

      $db = getDatabase();
      $dbs = $db->updateUserViaLogin($login, $name, $email, $mobileno);
      $db->close();

      $data = Array(
         "updateStatus" => $dbs->status,
         "errorMessage" => $dbs->error
      );

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json');
   });

   //restricted route
   //- secure route - need token
   //PUT - UPDATE SINGLE user VIA login from token payload
   $app->put('/users/resetpassword', function($request, $response, $args){
     
      $login = getLoginFromTokenPayload($request, $response);

      //form data using json structure
      $json = json_decode($request->getBody());
      $oldpassword = $json->oldpassword;
      $clearpassword = $json->newpassword;

      $db = getDatabase();

      $passwordhash = $db->getUserPasswordViaLogin($login);

      //check the hash against the oldpassword
      if (password_verify($oldpassword, $passwordhash)) {

         //same, proceed for password reset/update         

         //update users table for new password
         $dbs = $db->updateUserPasswordViaLogin($login, $clearpassword);

         if ($dbs->status)
            $data = Array(
               "updateStatus" => true
            ); 
         else
            $data = Array(
               "updateStatus" => false,
               "errorMessage" => $dbs->error
            );      
         
         $db->close();

         return $response->withJson($data, 200)
                          ->withHeader('Content-type', 'application/json');   

      } else { //oldpassword not the same as the one in db

         $data = Array(
            "updateStatus" => false,
            "errorMessage" => "Old password is incorrect!"
         );
         
         $db->close();

         return $response->withJson($data, 200)
                          ->withHeader('Content-type', 'application/json'); 
      } 
   });
   //users CRUD  ////////////////////////////////////////////////////////////////////////  ends
   
   
   
   /*
   //public route sample with more than one parameters
   $app->get('/reports', function($request, $response){

      $ownerlogin = getLoginFromTokenPayload($request, $response);

      $db = getDatabase();
      $dbs = $db->getBookingStats();
      $db->close();

   

      return $response->withJson($data, 200)
                      ->withHeader('Content-type', 'application/json'); 
	 
	 
	 
   }); */
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   

   $app->run();