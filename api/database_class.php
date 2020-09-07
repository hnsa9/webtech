<?php

   class User {
      var $id;
      var $login;
      var $name;
      var $email;
      var $mobileno;
      var $photo;
      var $addeddate;
	  var $role; 
   }

   class Movie {
      var $movie_id;
      var $movie_title;
      var $showtimes;
      var $genre;
      var $status;
   }
   
    class Booking {
      var $booking_id;
      var $movie_id;
      var $ticket;
	  var $bookdate; 
      var $status;
   }
   
  
	class BookMovie {
	  var $booking_id;
	  var $movie_id;
      var $movie_title;
      var $showtimes;
      var $genre;
      var $ticket;
	  var $bookdate; 
      var $status;
	  var $user;

	}
	
   
   

   class DbStatus {
      var $status;
      var $error;
      var $lastinsertid;
   }

   function time_elapsed_string($datetime, $full = false) {

      if ($datetime == '0000-00-00 00:00:00')
         return "none";

      if ($datetime == '0000-00-00')
         return "none";

      $now = new DateTime;
      $ago = new DateTime($datetime);
      $diff = $now->diff($ago);

      $diff->w = floor($diff->d / 7);
      $diff->d -= $diff->w * 7;

      $string = array(
         'y' => 'year',
         'm' => 'month',
         'w' => 'week',
         'd' => 'day',
         'h' => 'hour',
         'i' => 'minute',
         's' => 'second',
      );
      
      foreach ($string as $k => &$v) {
         if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
         } else {
            unset($string[$k]);
         }
      }

      if (!$full) $string = array_slice($string, 0, 1);
         return $string ? implode(', ', $string) . ' ago' : 'just now';
   }

   function hashPassword($password) { 

      $cost = 10;

      $options = [
         'cost' => $cost,
      ];

      $passwordhash =  password_hash($password, PASSWORD_BCRYPT, $options);
      return $passwordhash;
   }

	class Database {
 		protected $dbhost;
    	protected $dbuser;
    	protected $dbpass;
    	protected $dbname;
    	protected $db;

 		function __construct( $dbhost, $dbuser, $dbpass, $dbname) {
   		$this->dbhost = $dbhost;
   		$this->dbuser = $dbuser;
   		$this->dbpass = $dbpass;
   		$this->dbname = $dbname;

   		$db = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
         $db->setAttribute(PDO::MYSQL_ATTR_FOUND_ROWS, true);
    		$this->db = $db;
   	}

      function beginTransaction() {
         try {
            $this->db->beginTransaction(); 
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();
            return 0;
         } 
      }

      function commit() {
         try {
            $this->db->commit();
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();
            return 0;
         } 
      }

      function rollback() {
         try {
            $this->db->rollback();
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();
            return 0;
         } 
      }

      function close() {
         try {
            $this->db = null;   
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();
            return 0;
         } 
      }

      function insertUser($login, $clearpassword, $email) {

         //hash the password using one way md5 brcrypt hashing
         $passwordhash = hashPassword($clearpassword);
         try {
            
            $sql = "INSERT INTO users(login, password, email, addeddate) 
                    VALUES (:login, :password, :email, NOW())";

            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("login", $login);
            $stmt->bindParam("password", $passwordhash);
			$stmt->bindParam("email", $email);
            $stmt->execute();

            $dbs = new DbStatus();
            $dbs->status = true;
            $dbs->error = "none";
            $dbs->lastinsertid = $this->db->lastInsertId();

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         } 
      }

      function checkemail($email) {
         $sql = "SELECT *
                 FROM users
                 WHERE email = :email";

         $stmt = $this->db->prepare($sql);
         $stmt->bindParam("email", $email);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();
         return $row_count;
      }

      function authenticateUser($login) {
         $sql = "SELECT login, password as passwordhash, email, name, role
                 FROM users
                 WHERE login = :login";        

         $stmt = $this->db->prepare($sql);
         $stmt->bindParam("login", $login);
         $stmt->execute(); 
         $row_count = $stmt->rowCount(); 

         $user = null;

         if ($row_count) {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
               $user = new User();
               $user->login = $row['login'];
               $user->passwordhash = $row['passwordhash'];
               $user->email = $row['email'];
               $user->name = $row['name'];
			   $user->role = $row['role'];
            }
         }

         return $user;
      }


      /////////////////////////////////////////////////////////////////////////////////// movies

      // insert movies
      function insertMovie($movie_title, $showtimes, $genre, $ownerlogin) {

         try {
            
            $sql = "INSERT INTO movies(movie_title, showtimes, genre, ownerlogin) 
                    VALUES (:movie_title, :showtimes, :genre, :ownerlogin)";

            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("movie_title", $movie_title);
            $stmt->bindParam("showtimes", $showtimes);
            $stmt->bindParam("genre", $genre);
            $stmt->bindParam("ownerlogin", $ownerlogin);
            $stmt->execute();

            $dbs = new DbStatus();
			
			
            $dbs->status = true;
            $dbs->error = "none";
            $dbs->lastinsertid = $this->db->lastInsertId();

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         }          
      }

      //get all movies
      function getAllMoviesViaLogin() {
         $sql = "SELECT *
                 FROM movies";
                 //WHERE ownerlogin = :ownerlogin";

         $stmt = $this->db->prepare($sql);
         //$stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();

         $data = array();

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $movie = new Movie();
			   
               $movie->movie_id = $row['movie_id'];
               $movie->movie_title = $row['movie_title'];
               $movie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $movie->genre = $row['genre']; 

               $movie->status = $row['status'];  

				
               array_push($data, $movie);
            }
         }

         return $data;
      }
	  
	  
	  //get all active movies
      function getActiveMovies() {
         $sql = "SELECT *
                 FROM movies
				 WHERE status=1";
                 //WHERE ownerlogin = :ownerlogin";

         $stmt = $this->db->prepare($sql);
         //$stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();

         $data = array();

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $movie = new Movie();
               $movie->movie_id = $row['movie_id'];
               $movie->movie_title = $row['movie_title'];
               $movie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $movie->genre = $row['genre']; 

               $movie->status = $row['status'];  

				
               array_push($data, $movie);
            }
         }

         return $data;
      }
	  
	  
	  
	  

      //get single movie via id
      //ownerlogin for rolling no hacking (the id)
      function getMovieViaId($movie_id) {
         $sql = "SELECT *
                 FROM movies
                 WHERE movie_id = :movie_id";
                // AND ownerlogin = :ownerlogin

         $stmt = $this->db->prepare($sql);
         $stmt->bindParam("movie_id", $movie_id);
        // $stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();         

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $movie = new Movie();

               $movie->movie_id = $row['movie_id'];
               
               $movie->movie_title = $row['movie_title'];
               $movie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $movie->genre = $row['genre'];

               $movie->status = $row['status'];    
			   
			   
			   
			   
			   //date_format($row['showtimes'],"h:i A");
            }
         }
         else {
            //return empty array
            $movie = array();
         }

         return $movie;
      }

      //update movie via id
      function updateMovieViaId($movie_id, $showtimes) {

         $sql = "UPDATE movies
                 SET showtimes = :showtimes
                 WHERE movie_id = :movie_id";

         try {
            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("movie_id", $movie_id);
            $stmt->bindParam("showtimes", $showtimes);
            $stmt->execute();

            $dbs = new DbStatus();
            $dbs->status = true;
            $dbs->error = "none";

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         } 
      }

      //update movie status via id
      function updateMovieStatusViaId($movie_id, $status) {

         $sql = "UPDATE movies
                 SET status = :status
                 WHERE movie_id = :movie_id";

         try {
            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("movie_id", $movie_id);
            $stmt->bindParam("status", $status);
            $stmt->execute();

            $dbs = new DbStatus();
            $dbs->status = true;
            $dbs->error = "none";

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         } 
      } 

      //delete movie via id
      function deleteMovieViaId($movie_id) {

         $dbstatus = new DbStatus();

         $sql = "DELETE 
                 FROM movies 
                 WHERE movie_id = :movie_id";

         try {
            $stmt = $this->db->prepare($sql); 
            $stmt->bindParam("movie_id", $movie_id);
            $stmt->execute();

            $dbstatus->status = true;
            $dbstatus->error = "none";
            return $dbstatus;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbstatus->status = false;
            $dbstatus->error = $errorMessage;
            return $dbstatus;
         }           
      } 
	  
	  
	   function insertBooking($movie_id, $ticket, $ownerlogin) {

         try {
            
            $sql = "INSERT INTO booking(movie_id, ticket, ownerlogin, bookdate) 
                    VALUES (:movie_id, :ticket, :ownerlogin, CURDATE())";

            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("movie_id", $movie_id);
            $stmt->bindParam("ticket", $ticket);
            $stmt->bindParam("ownerlogin", $ownerlogin);
            $stmt->execute();

            $dbs = new DbStatus();
			
			
            $dbs->status = true;
            $dbs->error = "none";
            $dbs->lastinsertid = $this->db->lastInsertId();

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         }          
      }
	  
	  
	   //get single movie via id
      //ownerlogin for rolling no hacking (the id)
      function getBookingViaOwnerLogin($ownerlogin) {
         $sql = "SELECT booking.*, movies.movie_id, movies.movie_title, movies.showtimes, movies.genre 
				 FROM booking 
				 INNER JOIN movies ON booking.movie_id=movies.movie_id
				 WHERE booking.ownerlogin = :ownerlogin";
                // AND ownerlogin = :ownerlogin
		
		$stmt = $this->db->prepare($sql);
         $stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();
				
				
		  $data = array();

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $bookmovie = new BookMovie();
			  
			   $bookmovie->booking_id = $row['booking_id'];
               $bookmovie->movie_id = $row['movie_id'];
               
               $bookmovie->movie_title = $row['movie_title'];
               $bookmovie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $bookmovie->genre = $row['genre'];
			  
			  
			   $bookmovie->ticket = $row['ticket'];
			   $bookmovie->bookdate = date('d M Y', strtotime( $row['bookdate'] ) );
			   $bookmovie->status = $row['status'];
			   $bookmovie->user = $row['ownerlogin'];
			   
				
               array_push($data, $bookmovie);
            }
         }

         return $data;
      }
	  		
				
				
				
				
		
		

    
	  
	  
	  
	  
	      function getAllBooking() {
         $sql = "SELECT booking.*, movies.movie_id, movies.movie_title, movies.showtimes, movies.genre 
				 FROM booking 
				 INNER JOIN movies ON booking.movie_id=movies.movie_id";
                // AND ownerlogin = :ownerlogin
		

      	$stmt = $this->db->prepare($sql);
       //  $stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();
				
				
		  $data = array();

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $bookmovie = new BookMovie();
			  
			   $bookmovie->booking_id = $row['booking_id'];
               $bookmovie->movie_id = $row['movie_id'];
               
               $bookmovie->movie_title = $row['movie_title'];
               $bookmovie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $bookmovie->genre = $row['genre'];
			  
			  
			   $bookmovie->ticket = $row['ticket'];
			   $bookmovie->bookdate = date('d M Y', strtotime( $row['bookdate'] ) );
			   $bookmovie->status = $row['status'];
			   $bookmovie->user = $row['ownerlogin'];
			   
				
               array_push($data, $bookmovie);
            }
         }

         return $data;
      }
	  		
				
	  
	  
	   function getBookingViaId($booking_id) {
         $sql = "SELECT booking.*, movies.movie_id, movies.movie_title, movies.showtimes, movies.genre 
				 FROM booking 
				 INNER JOIN movies ON booking.movie_id=movies.movie_id
				 WHERE booking_id = :booking_id ";
                // AND ownerlogin = :ownerlogin

         $stmt = $this->db->prepare($sql);
         $stmt->bindParam("booking_id", $booking_id);
        // $stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();         

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $bookmovie = new BookMovie();
			  
			   $bookmovie->booking_id = $row['booking_id'];
               $bookmovie->movie_id = $row['movie_id'];
               
               $bookmovie->movie_title = $row['movie_title'];
               $bookmovie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $bookmovie->genre = $row['genre'];
			  
			  
			   $bookmovie->ticket = $row['ticket'];
			   $bookmovie->bookdate = date('d M Y', strtotime( $row['bookdate'] ) );
			   $bookmovie->status = $row['status'];
			   $bookmovie->user = $row['ownerlogin'];
			   
			   
			   
			   //date_format($row['showtimes'],"h:i A");
            }
         }
         else {
            //return empty array
           $bookmovie = array();
         }

         return $bookmovie;
      }
	  
	  
	    //update movie status via id
      function updateBookingStatusViaId($booking_id, $status) {

         $sql = "UPDATE booking
                 SET status = :status
                 WHERE booking_id = :booking_id";

         try {
            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("booking_id", $booking_id);
            $stmt->bindParam("status", $status);
            $stmt->execute();

            $dbs = new DbStatus();
            $dbs->status = true;
            $dbs->error = "none";

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         } 
      } 

	  
	  
	  
	  
	  

      //get single user via login
      function getUserViaLogin($login) {
         $sql = "SELECT *
                 FROM users
                 WHERE login = :login";

         $stmt = $this->db->prepare($sql);
         $stmt->bindParam("login", $login);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();

         $user = new User();

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {               
               $user->id = $row['id'];
               $user->login = $row['login'];
               $user->name = $row['name'];
               $user->email = $row['email'];
               $user->mobileno = $row['mobileno'];
               $user->photo = $row['photo'];

               $addeddate = $row['addeddate'];
               $user->addeddate = time_elapsed_string($addeddate); 
            }
         }

         return $user;
      }

      //update user via login
      function updateUserViaLogin($login, $name, $email, $mobileno) {

         $sql = "UPDATE users
                 SET name = :name,
                     email = :email,
                     mobileno = :mobileno
                 WHERE login = :login";

         try {
            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("login", $login);
            $stmt->bindParam("name", $name);
            $stmt->bindParam("email", $email);
            $stmt->bindParam("mobileno", $mobileno);
            $stmt->execute();

            $dbs = new DbStatus();
            $dbs->status = true;
            $dbs->error = "none";

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         } 
      }

      function getUserPasswordViaLogin($login) {

         $sql = "SELECT password
                 FROM users
                 WHERE login = :login";

         $stmt = $this->db->prepare($sql);
         $stmt->bindParam("login", $login);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();

         $password = "";

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {               
               $password = $row['password'];
            }
         }  

         return $password;       
      }

      //update user password via login
      function updateUserPasswordViaLogin($login, $clearpassword) {

         //hash the new password using one way md5 brcrypt encrypted hashing
         $passwordhash = hashPassword($clearpassword);

         $sql = "UPDATE users
                 SET password = :password
                 WHERE login = :login";

         try {
            $stmt = $this->db->prepare($sql);  
            $stmt->bindParam("login", $login);
            $stmt->bindParam("password", $passwordhash);
            $stmt->execute();

            $dbs = new DbStatus();
            $dbs->status = true;
            $dbs->error = "none";

            return $dbs;
         }
         catch(PDOException $e) {
            $errorMessage = $e->getMessage();

            $dbs = new DbStatus();
            $dbs->status = false;
            $dbs->error = $errorMessage;

            return $dbs;
         } 
      }
	  
	  
	  
	  
	  
	  
	  /*
	  //in progress booking
		SELECT COUNT(*) 
		FROM booking
		WHERE status = 0;


		//completed booking
		SELECT COUNT(*) 
		FROM booking
		WHERE status = 1;

		//total booking
		SELECT COUNT(*) 
		FROM booking;


	  
	  
	  
	  
	  
	  
	  
	  
	   //get all movies
      function getBookingStats() {
         $sql = "	SELECT COUNT(*) 
					FROM booking;"
                 //WHERE ownerlogin = :ownerlogin";

         $stmt = $this->db->prepare($sql);
         //$stmt->bindParam("ownerlogin", $ownerlogin);
         $stmt->execute(); 
         $row_count = $stmt->rowCount();

         $data = array();

         if ($row_count)
         {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
               $movie = new Movie();
               $movie->movie_id = $row['movie_id'];
               $movie->movie_title = $row['movie_title'];
               $movie->showtimes = date('h:i A', strtotime( $row['showtimes'] ) );
               $movie->genre = $row['genre']; 

               $movie->status = $row['status'];  

				
               array_push($data, $movie);
            }
         }

         return $data;
      }
	  
	  */
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  

   }