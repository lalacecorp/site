jQuery(document).ready(function(){

jQuery('.submit').click(function(){
	jQuery("li.danger").removeClass("danger");
	jQuery(".alert").hide();
	var b=!1
	,e=function(){
		grecaptcha.reset()
	}
	,f=jQuery("input#name").val();
	2>f.length&&(jQuery("input#name").parent().addClass("danger"),b=!0);
	var c=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
	d=jQuery("input#email").val()
	""==d?(jQuery("input#email").parent().addClass("danger"),b=!0):c.test(d)||(jQuery("input#email").parent().addClass("danger"),b=!0);
	c=jQuery("textarea#message").val();""==c&&(jQuery("textarea#message").parent().addClass("danger"),b=!0);

	var a={};
	a['g-recaptcha-response']=jQuery('textarea[name=g-recaptcha-response]').val();
	a.name=f;
	a.email=d;
	a.message=c;



	jQuery.ajax(
			{url:"/api/contact"
			,type:"POST"
			,data:a
			,dataType: 'json'
			,async:!1
			,success:function(a){
				if(!a.email_sent || !a.valid){
					$('.formSubmitError').show();
				} else if (a.email_sent && a.valid) {
					$('.formSubmitError').hide();
					$('.formSubmitSuccess').show();
				}

				!0!==a.valid?(jQuery(".formSubmitError").show()
					,b=!0):a&&a.email_sent&&(jQuery(".formSubmitSuccess").show()
					,jQuery("input#name").val(""),jQuery("input#email").val("")
					,jQuery("textarea#message").val("")
					,e())
			}
			, error: function(error){
				err = error.responseJSON;
				jQuery(".formSubmitError").show();
			}
	});

	e();
	        return false;
	 });
});
