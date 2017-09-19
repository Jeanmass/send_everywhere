$('document').ready(function(){

	// Focus form
	$('input[type="text"], input[type="email"], textarea').focus(function(){
		var background = $(this).attr('id');
		$('#' + background + '-form').addClass('formgroup-active');
		$('#' + background + '-form').removeClass('formgroup-error');
	});
	$('input[type="text"], input[type="email"], textarea').blur(function(){
		var background = $(this).attr('id');
		$('#' + background + '-form').removeClass('formgroup-active');
	});

	function errorfield(field){
		$(field).addClass('formgroup-error');
		console.log(field);
	}

	//Twitter Alert
	$('#message').keyup(function(){
		if($('#message').val().length >= 140) {
			$("#confirmation").html("Watch out, your message is<br>too long for Twitter !");
		}
	});

	// Send form
	$("#button").click(function() {
		var submit=true;
		var twitteralert=0;
		if($('#name').val() == "") {
			errorfield('#name-form');
			submit=false;
		}
		if($('#message').val() == "") {
			errorfield('#message-form');
			submit=false;
		}
		if($('#message').val().length >= 140) {
			submit=true;
			twitteralert=1;
		}
		if (submit) {
			var title = $('#name').val();
			var message = $('#message').val();
			$.post('/send',{title:title,message:message,twitteralert:twitteralert},function (confirmation){
				if (confirmation && !twitteralert) {
					$("#confirmation").html("Your message has been sent everywhere !");
				}
				if (confirmation && twitteralert) {
					$("#confirmation").html("Your message has been sent everywhere except on Twitter !");
				}
				if (!confirmation){
					$("#confirmation").html("Hu ho ! Something went wrong !");
				}
				$('#name').val('');
				$('#message').val('');
			});
		}
		return false;
	});

});
