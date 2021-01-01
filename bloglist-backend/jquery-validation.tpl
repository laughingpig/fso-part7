
<script src="/admin/includes/js/jquery.validate.min.js"></script>

<script type="text/javascript">


if (jQuery.validator) {
	var error_msg = [];
	
	  jQuery.validator.setDefaults({
	    debug: false,
	    errorClass: 'has-error',
	    validClass: 'has-success',
	    ignore: "",
	    highlight: function (element, errorClass, validClass) {
	      $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	     /*  $('#error-text').html('<label class="control-label">Error, please check the red highlighted fields and submit again.</label>'); */
	      if ($.inArray($(element).closest('.row.form').attr('data-error'), error_msg) < 0 ) {
	    	  error_msg.push($(element).closest('.row.form').attr('data-error'));
		   };
		   if (error_msg.toString()) {
			   	$('#form-error-msg').html(error_msg.toString().replace(',', '<br>') );
		      	$('#form-error').slideDown();
				setTimeout(function(){
					$('#form-error').slideUp();
		    	},10000);
		   }
	    },
	    unhighlight: function (element, errorClass, validClass) {
	      $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
	      $(element).closest('.form-group').find('.help-block').text('');
	    },
	    errorPlacement: function (error, element) {
	      $(element).closest('.form-group').find('.help-block').text(error.text());
	    },
	    submitHandler: function (form) {
    	  	$('body').css('cursor','wait');
    	  	$('.btn-primary').addClass('disabled');
    	  	var callbackFn = $(form).attr('data-callback');
    		var datastring = $("#Edit_Record").serialize();
        //var adminForm = "{if $fields.admin_id neq ""}Edit{else}New{/if}";
              var zone = "{$zone}";

              if(zone == 'Agent members'){
                //pass these values to create/update user details in firebase
                var formAction = "{if $fields.admin_id neq ""}Edit{else}New{/if}";
                var email = $('#Edit_Record #admin_email').val();
                var password = $('#Edit_Record #password').val();
                var newEmail = $('#Edit_Record #new_email').val();
              } else {
                //pass these values to create/update user details in firebase
                var formAction = "{if $fields.admin_id neq ""}Edit{else}New{/if}";
                var email = $('#Edit_Record #admin_email').val();
                var password = $('#Edit_Record #password').val();
                var newEmail = $('#Edit_Record #new_email').val();
              }

              //On Success create/update Email and Password in firebase             
              if (formAction == "Edit") {
							firebase.auth().onAuthStateChanged(function(user) {
                  if(user) {
                    if(newEmail != '') {
											var user = firebase.auth().currentUser;
											user.updateEmail(newEmail).then(function() {
												// Update successful.
												console.log('Email Updated');
												dbchange();
											}).catch(function(error) {
												$('body').css('cursor','default'); 
												$('.btn-primary').removeClass('disabled');

												// An error happened.
												if(error.code === 'auth/invalid-email') {
													console.log('The email address is badly formatted.');
						              $('#warning').slideDown();
                					setTimeout(function(){
						                $('#warning').slideUp();
                  				},10000);													
												} else {
													console.log(error.message);
													$('#error.notification').slideDown();
													setTimeout(function(){
													$('#error.notification').slideUp();
													},10000);															
												}
											});
                    }
                    if(password != '') {
												var user = firebase.auth().currentUser;
												user.updatePassword(password).then(function() {
													// Update successful.
													console.log('Password Updated');
													dbchange();
												}).catch(function(error) {
													$('body').css('cursor','default'); 
													$('.btn-primary').removeClass('disabled');
													// An error happened.
													if (error.code === 'auth/requires-recent-login') {
														console.log(error.message);
							              $('#error.notification').slideDown();
														setTimeout(function(){
							              $('#error.notification').slideUp();
														},10000);																		
													} else {
														console.log('Error:'+error);
							              $('#error.notification').slideDown();
														setTimeout(function(){
							              $('#error.notification').slideUp();
														},10000);																
													}
												});
	                    }
                  }
                });
              } else {
								firebase.auth().createUserWithEmailAndPassword(email, password)
									.then(function() {
										dbchange();
									}).catch(function(error) {
										$('body').css('cursor','default'); 
										$('.btn-primary').removeClass('disabled');

										// An error happened.
										if (error.code === 'auth/email-already-in-use') {
											console.log('The email address is already in use by another account. Please enter a new email address.');
										} else if(error.code === 'auth/invalid-email') {
											console.log('The email address is badly formatted.');
											$('#warning').slideDown();
											setTimeout(function(){
												$('#warning').slideUp();
											},10000);										
										} else {
											console.log(error.message);
											setTimeout(function(){
				                $('#error.notification').slideDown();
											},10000);												
										}
								});
              }

							function dbchange() {
							$.ajax({
								type: "POST",
									url: "/admin/includes/processes/processes-record.php",
								cache: false,
								async: false,
								data: datastring,
								dataType: "html",
									success: function(data) {
                var obj = $.parseJSON(data);
                var notice = obj.notice;
                $('.notification').hide();
                $('#'+ notice).slideDown();
                setTimeout(function(){
                  $('#'+ notice).slideUp();
                  },10000);
                  if(obj.primaryID != null){
                    /* setTimeout(function(){
                      window.location =document.URL+"/"+obj.primaryID;
                    },4000);
                    return; 
                    window.history.pushState(null, null, );*/
                  }
                  if(obj.IDs){
                  $.each(obj.IDs, function(k, v) {
                    if(v > 0)
                      $('input[name="'+k+'"]').val(v);
                  });
                  } 
                  if(callbackFn){
                    var fn = window[callbackFn];
                    if (typeof fn === "function") fn();
                  }

									$('body').css('cursor','default'); 
									$('.btn-primary').removeClass('disabled');
									},
								error: function(){
									$('body').css('cursor','default'); 
									$('.btn-primary').removeClass('disabled');
									console.log('AJAX error');
											}
							});
							}
	    }
	});


	jQuery.validator.addMethod(
  		"uniqueURL", 
  		function(value, element, params) {
  			var response = false;
  			var idVal = params.id;  	
  	  	if(params.IdFormField) idVal = $(params.IdFormField).val();
  			$.ajax({
  				type: "POST",
  			    url: "/admin/includes/processes/urlencode.php",
  				cache: false,
  				async: false,
  				data: "value="+encodeURIComponent(value)+"&id="+idVal+"&idfield="+params.idfield+"&table="+params.table+"&field="+params.field+"&field2="+params.field2+"&value2="+$('#'+params.value2).val(),
  				dataType: "json",
  			    success: function(res, textStatus) {
  			    	try{
  			    		if ( res.duplicated ) {
  			    			response = false;
	  			    	} else {
		  			    	response = true;
		  			    }
  			    	}catch(err){ }
  			    }
  			});
  			return response;
  			
		}, 
		"Invalid URL: It's currently being used or has non-alphanumeric characters."
	);
	

	jQuery.validator.addMethod(
  		"uniqueEmail", 
  		function(value, element, params) {
  			var response = false;
  			var idVal = params.id;  	
  	  	if(params.field) idVal = $(params.field).val();
  	  	
  			$.ajax({
  				type: "POST",
  			    url: "/admin/includes/processes/checkEmail.php",
  				cache: false,
  				async: false,
  				data: "username="+value+"&id="+idVal+"&table="+params.table,
  				dataType: "json",
  			    success: function(res, textStatus) {
  			    	try{
  			    		if ( res.email ) {
  			    			response = false;
	  			    	} else {
		  			    	response = true;
		  			    }
  			    	}catch(err){ }
  			    }
  			});
  			return response;
  			
		}, 
		"Email needs to be unique, other user is already using that email address."
	);


	jQuery.validator.addMethod(
	  		"double", 
	  		function(value, element) {
	  			if ($.isNumeric(value) || value =='') {
	  				return true;
	  			} 
	  			return false;
			}, 
			"Invalid value. Must be numeric."
	);

	
	jQuery.validator.addClassRules({
		double: {
			double: true
		},
		number: {
			number: true,
			digits: true,
			maxlength: 4
		},
	});


	jQuery.validator.addMethod(
	  		"mindate", 
	  		function(value, element, params) {
		  		var mdate = new Date(params.date);
		  		var vdate =  new Date( convert_to_mysql_date_format(value) );
	  			if (mdate <= vdate) {
	  				return true;
	  			} 
	  			return false;
			}, 
			"Invalid date."
	);
	
}


</script>
