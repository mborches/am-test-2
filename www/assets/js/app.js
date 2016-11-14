var vpWidth             = $(window).width();
var vpHeight            = $(window).height();
var centroW_escenario   = Math.round(vpWidth / 2);
var centroH_escenario   = Math.round(vpHeight / 2);
var margen              = 20;
var margen_barra_scroll = 20;
var pjw                 = 416;
var pjh                 = 900;
var controles_width     = 150;
var controles_height    = 150;
var distancia_controles = 150;
var margenH             = (margen*2)+margen_barra_scroll;
var margenV             = (margen*2);
var seccion_activa      = 'inicio';

//var BASE_URL = 'http://localhost/plopi/proyectos/amies/';
var BASE_URL = 'http://amies.com.ar/';
var img_cuerpo = new Image();

var app = {
    init: function() {
        var self = this;
        console.log('Iniciando AMIES Game...');
    },
    jugar: function() {
        var self = this;
        console.log('Iniciando jugar...');
        $('#inicio').hide();
        $('#escenario').show();
        seccion_activa = 'escenario';
    },
    inicio: function() {
        var self = this;
        console.log('Iniciando inicio...');
        $('#escenario').hide();
        $('#inicio').show();
        seccion_activa = 'inicio';
    },

    escalar_escenario: function() {
        var self = this;
        vpWidth = $(window).width();
        vpHeight = $(window).height();
        console.log('Iniciando escalar_escenario a '+vpWidth+' x '+vpHeight);
    },
    getData: function() {
        var self = this;
        console.log('Iniciando getData...');

		$.ajax({
		    url: BASE_URL + "juegos/mensaje",
		    jsonp: "callback",
		    dataType: "jsonp",
		    data: {
		        nombre: "Martin"
		    },
		    success: function( response ) {
                $('#mensaje').html(response.rta);
                app.getImage();
		    },
		    error: function(xhr, status, error) {
		        alert("Ocurrió un Error.");
		    }
		});
    },
    getImage: function() {
        var self = this;
        console.log('Iniciando getImage...');

        img_cuerpo.onload = app.cargado;
        img_cuerpo.src = BASE_URL + "assets/images/amies/demo/cuerpo_completo.png";
        $('#cuerpo').attr('src', img_cuerpo.src);
    },
    cargado: function() {
        var self = this;
        console.log('Cargue');
    },    
};
// With jQuery, you use $(document).ready() to execute something when the DOM is loaded 
// and $(window).on("load", handler) to execute something when all other things are loaded as well, such as the images.
// $(function() { personaje.init(); });
// $(window).resize(function() {});
$(window).resize(function() {
    app.escalar_escenario();
});
$(window).on("load", function() {
    app.init();
});
