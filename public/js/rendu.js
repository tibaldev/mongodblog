$( document ).ready(function() {

	// Lien par défaut
	$('#linktest').attr('href', '/admin/addtest?data=' + JSON.stringify($('#textjade').val()));

	// Modif du lien à la saisie du textarea
	$('#textjade').bind('input propertychange', function() {
		$('#linktest').attr('href', '/admin/addtest?data=' + JSON.stringify($('#textjade').val()));
	});
});

