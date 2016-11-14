function ir(destino){
	if(destino!='') {
    	window.location = destino;
	}
}
function confirmar(mensaje, destino){
	var r = confirm(mensaje);
	if (r==true) {
		ir(destino);
	}
}
function piso(numero) {
	numero = parseInt(numero);
	numero = Math.floor(numero);
	return numero;
}

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});
//$('#hola').animateCss('bounce');

function animationHover(element, animation){
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);        
        },
        function(){
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 1500);         
        });
}

function animationClick(element, animation){
    element = $(element);
    element.click(
        function() {
            element.addClass('animated ' + animation);        
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 1500);         
  
        });
}