<?php
        $userName = $_POST["UserName"];
		$to = $_POST["Email"];
		$language = $_POST["Language"];
		$from = 'registration@opalmedapps.ca';

        /*$firstame = "Jinal";
        $lastName = "Vyas";
		$to = "jinalmohakvyas@gmail.com";
		$from = 'registration@opalmedapps.ca';
		$language = "1";*/
		
		$headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
 
        // Create email headers
        $headers .= 'From: '.$from."\r\n".
        'Reply-To: '.$from."\r\n" .
        'X-Mailer: PHP/' . phpversion();
    
		if($language == "2"){
			$subject = 'Thank you for registering for Opal!';
	
	        $message = "<html><body>";
            $message .= "<p>Dear $userName, </p>";
            $message .= "<p>Thank you for registering for the Opal app. If you haven't already downloaded the app onto your mobile device, please click on one of the buttons below to start the download process.</p>";
            $message .= "<a href='https://apps.apple.com/ca/app/opal-health/id1446920350' target='blank' style='color:transparent;'>";
            $message .= "<img src='https://registration.opalmedapps.ca/images/logos/AppStore_Icon_EN.png' alt='logo' style='width:200px;'/>
				</a>";
            $message .= "<a href='https://play.google.com/store/apps/details?id=com.hig.opal2&hl=en' target='blank'>
				<img src='https://registration.opalmedapps.ca/images/logos/PlayStore_Icon_EN.png' alt='logo' style='width:200px;'/>
				</a>";
			$message .= "<p>Once done, launch the application and sign in with the username and password you created when you registered.</p><br/>";
			$message .= "<p>If you have any problems with the app, you may contact us at <a href='mailto:opal@muhc.mcgill.ca'>opal@muhc.mcgill.ca</a> or by using the Feedback from available within the General tab of Opal. If you find the app useful, please let us know and rate it on the app store. We are working hard to make Opal useful and empowering for out patients.</p>";
            $message .= "<label>Thank you,</label><br />";
            $message .= "<label>The Opal development team</label>";
            $message .= "</body></html>";
		}
		
		if($language == "1"){
			$subject = 'Merci pour votre inscription à Opal!';
	
	        $message = "<html><body>";
	        $message .= "<p>Chère/Cher $userName, </p>";
            $message .= "<p>Merci de vous être enregistré(e) à l’application Opal. Si vous n’avez pas encore téléchargé l’application sur votre appareil mobile, veuillez appuyer sur l’un des boutons ci-dessous pour commencer le téléchargement.</p>";
            $message .= "<a href='https://apps.apple.com/ca/app/opal-health/id1446920350' target='blank' style='color:transparent;'>";
            $message .= "<img src='https://registration.opalmedapps.ca/images/logos/AppStore_Icon_EN.png' alt='logo' style='width:200px;'/>
				</a>";
            $message .= "<a href='https://play.google.com/store/apps/details?id=com.hig.opal2&hl=en' target='blank'>
				<img src='https://registration.opalmedapps.ca/images/logos/PlayStore_Icon_EN.png' alt='logo' style='width:200px;'/>
				</a>";
			$message .= "<p>Une fois le téléchargement terminé, lancez l’application et connectez-vous avec le nom d’utilisateur et le mot de passe que vous avez créés lors de l’inscription. </p>";
			$message .= "<p>Si vous rencontrez des problèmes avec l’application, n’hésitez pas à nous contacter à <a href='mailto:opal@muhc.mcgill.ca'>opal@muhc.mcgill.ca</a> utilisant la section « Commentaires » située dans l’onglet « Général » de l’application Opal. Si vous trouvez l’application utile, il serait grandement apprécié de nous le laisser savoir et de nous laisser une note dans l'un des magasins d'applis. Nous travaillons fort pour répondre aux besoins de nos patients et rendre Opal aussi utile que possible.</p>";
            $message .= "<label>Merci,</label><br />";
            $message .= "<label>L’équipe de développement Opal</label>";
            $message .= "</body></html>";
		}
		
		// Sending email
    if(mail($to, $subject, $message, $headers)){
        echo 'Your mail has been sent successfully.';
    } else{
        echo 'Unable to send email. Please try again.';
    }
?>