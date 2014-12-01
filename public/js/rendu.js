$( document ).ready(function() {

	// Lien par défaut
	$('#linkhidden').val(JSON.stringify($('#textjade').val()));

	// Modif du lien à la saisie du textarea
	$('#textjade').bind('input propertychange', function() {
		$('#linkhidden').val(JSON.stringify($('#textjade').val()));
	});
});

