//var BASE_URL            = 'http://localhost/plopi/proyectos/amies/';
var BASE_URL            = 'http://amies.com.ar/';
var vpWidth 			= $(window).width();
var vpHeight 			= $(window).height();
var centroW_escenario	= Math.round(vpWidth / 2);
var centroH_escenario	= Math.round(vpHeight / 2);
var margen 				= 20;
var margen_barra_scroll = 20;
var pjw                 = 416;
var pjh                 = 900;
var controles_width 	= 150;
var controles_height 	= 150;
var distancia_controles	= 150;
var margenH 			= (margen*2)+margen_barra_scroll;
var margenV 			= (margen*2);
var IMG_URL             = BASE_URL + 'assets/images/';
var CAPAS_URL           = BASE_URL + 'assets/images/cdn/personaje/';
var img_cuerpo = new Image(); var img_ojos = new Image(); var img_pelo = new Image(); var img_tipo = new Image();
var img_left = new Image(); var img_right = new Image();
var tipos = {1:{nombre:"Color de Ojos", total:0}, 2:{nombre:"Pecas", total:0}, 3:{nombre:"Color de Pelo", total:0}, 4:{nombre:"Peinado", total:0}};
var capas_data;
var activa = { ojos: {id:null, op:null, idx:null}, pelo: {id:null, op:null, idx:null}, tipo:null};
var total_cargado = 0;
var primera_carga = true;
var personaje = {
    init: function() {
        var self = this;
        console.log('Iniciando personaje...');
        //$('#hola').animateCss('bounce');
        personaje.getData();
        personaje.cargado(0);
        $('#tipo_up').click(function(){ personaje.cambiar_tipo('up'); });
        $('#tipo_down').click(function(){ personaje.cambiar_tipo('down'); });
        $('#op_left').click(function(){ personaje.cambiar_opcion('left'); });
        $('#op_right').click(function(){ personaje.cambiar_opcion('right'); });
    },
    escalar_escenario: function() {
        var self = this;
		vpWidth = $(window).width();
		vpHeight = $(window).height();
        console.log('Iniciando escalar_escenario a '+vpWidth+' x '+vpHeight);
		$("#escenario").css("margin-left", (margen+(margen_barra_scroll/2))+"px");
		$("#escenario").css("margin-right", (margen+(margen_barra_scroll/2))+"px");
		$("#escenario").css("margin-top", margen+"px");
		$("#escenario").css("margin-bottom", margen+"px");
        $('#escenario').width(vpWidth-margenH);
        $('#escenario').height(vpHeight-margenV);
        centroW_escenario = Math.round($('#escenario').width()/2);
		centroH_escenario = Math.round($('#escenario').height()/2);
		setTimeout(function(){ $(window).scrollTop($("#escenario").offset().top-margen) }, 300);
		personaje.escalar_principal();
    },
    escalar_principal: function() {
        var self = this;
        prop = ($('#escenario').height() / pjh);
        $('#pj_pelu').height(piso(pjh*prop));
        $('#pj_pelu').width(piso(pjw*prop));
        $('#pj_head').height(piso(pjh*prop));
        $('#pj_head').width(piso(pjw*prop));
        $('#pj_body').height(piso(pjh*prop));
        $('#pj_body').width(piso(pjw*prop));
        mleft = piso(($('#escenario').width() - $('#pj_head').width()) / 2);
        $("#pj_pelu").css("margin-left", mleft+"px");
		$("#pj_head").css("margin-left", mleft+"px");
        $("#pj_body").css("margin-left", mleft+"px");
        personaje.escalar_controles();
    },
    escalar_controles: function() {
        var self = this;
        prop = ($('#escenario').height() / pjh);
        dis_prop = distancia_controles * prop;
        //escala
        //$('#op_left').width(controles_width * prop);
        //$('#op_left').height(controles_height * prop);
        $('#img_left').width(controles_width * prop);
        $('#img_left').height(controles_height * prop);
        //$('#op_right').width(controles_width * prop);
        //$('#op_right').height(controles_height * prop);
        $('#img_right').width(controles_width * prop);
        $('#img_right').height(controles_height * prop);
        $('#nav-items-vertical').width(controles_width * prop);
        //$('#nav-items-vertical').height(controles_height * prop);
        //posicion
		$("#op_left").css("left", (centroW_escenario-($('#op_left').width()+dis_prop))+"px");
		$("#op_right").css("left", (centroW_escenario+dis_prop)+"px");
		$("#nav-items-vertical").css("left", margen+"px");

        if (vpHeight < 400) {
            $("#op_left").css("bottom", margen+"px");
            $("#op_right").css("bottom", margen+"px");
        } else {
            mtop = (($('#pj_body').height() - (controles_height*prop))/2);
            $("#op_left").css("top", mtop+"px");
            $("#op_right").css("top", mtop+"px");            
        }


		//$("#nav-items-vertical").css("top", (centroH_escenario-($('#nav-items-vertical').height()/2))+"px");

    },
    getData: function() {
        var self = this;
        console.log('Iniciando getData...');
        $.ajax
        ({
            type: "POST",
            url: BASE_URL + "personajes/data",
            cache: false,
            success: function(response) {
                capas_data = response;
                //var tipos = {1:"Color de Ojos", 2:"Pecas", 3:"Color de Pelo", 4:"Peinado"};
               tipos[1].total = capas_data.ojos.length;
               tipos[2].total = 2;
               tipos[3].total = capas_data.pelo.length;
               //contar peinados
               var tot_peinados = 0;
               for (var i = 1; i <= 10; i++) {
                   if ( _.isNull(capas_data.pelo[0]["img_op"+i]) == false ) tot_peinados += 1;  
               };
               tipos[4].total = tot_peinados;
                personaje.render();
            },
            error: function(xhr, status, error) {
                alert("Ocurrió un Error.");
            }
        });
    },
    render: function() {
        var self = this;
        console.log('Iniciando render a '+vpWidth+' x '+vpHeight);
	    personaje.escalar_escenario();
        personaje.cargar_defaults();
    },
    cargar_defaults: function () {
        var self = this;
        console.log('Iniciando cargar_defaults');
        //activa = { ojos: {id:null, op:null}, pelo: {id:null, op:null}};
        activa.ojos.id  = capas_data.ojos[0].id;
        activa.ojos.op  = 1;
        activa.ojos.idx = 0;
        activa.pelo.id  = capas_data.pelo[0].id;
        activa.pelo.op  = 1;
        activa.pelo.idx = 0;
        activa.tipo     = 1;
        // capas_data.ojos[activa.ojos.idx]["img_op"+activa.ojos.op] = capas_data.ojos[activa.ojos.idx].img_op1];
        img_ojos.onload = personaje.cargado;
        img_ojos.src = CAPAS_URL + capas_data.ojos[activa.ojos.idx]["img_op"+activa.ojos.op];
        $('#pj_head').attr('src', img_ojos.src);

        img_pelo.onload = personaje.cargado;
        img_pelo.src = CAPAS_URL + capas_data.pelo[activa.pelo.idx]["img_op"+activa.pelo.op];
        $('#pj_pelu').attr('src', img_pelo.src);

        codigo = 'o'+activa.ojos.id+'-'+activa.ojos.op+'_p'+activa.pelo.id+'-'+activa.pelo.op;
        $('#combinacion_codigo').val(codigo);
        personaje.cargar_controles();     
    },
    cargar_controles: function() {
        var self = this;
        console.log('Iniciando cargar_controles');
        personaje.cargar_tipo();
        personaje.cargar_opcion();
    },
    cargar_tipo: function() {
        var self = this;
        console.log('Iniciando cargar_tipo');
        $('#txt_opcion').html(tipos[activa.tipo].nombre);

        img_tipo.onload = personaje.cargado;
        img_tipo.src = IMG_URL + 'amies/personaje/0' + activa.tipo + '.jpg';
        $('#img_tipo').attr('src', img_tipo.src);
    },
    cargar_opcion: function() {
        var self = this;
        console.log('Iniciando cargar_opcion');
        //img_left.onload = personaje.cargado;
        //img_right.onload = personaje.cargado;
        switch(activa.tipo) {
            case 2:
                img_left.src = CAPAS_URL + capas_data.ojos[activa.ojos.idx]["img_bt"+activa.ojos.op];
                idx_right = (activa.ojos.op < tipos[2].total) ? activa.ojos.op + 1 : 1;
                img_right.src = CAPAS_URL + capas_data.ojos[activa.ojos.idx]["img_bt"+idx_right];
                break;
            case 3:
                img_left.src = CAPAS_URL + capas_data.pelo[activa.pelo.idx]["img_bt"+activa.pelo.op];
                idx_right = (activa.pelo.idx < (tipos[3].total -1)) ? activa.pelo.idx + 1 : 0;
                img_right.src = CAPAS_URL + capas_data.pelo[idx_right]["img_bt"+activa.pelo.op];
                break;
            case 4:
                img_left.src = CAPAS_URL + capas_data.pelo[activa.pelo.idx]["img_bt"+activa.pelo.op];
                idx_right = (activa.pelo.op < tipos[4].total) ? activa.pelo.op + 1 : 1;
                img_right.src = CAPAS_URL + capas_data.pelo[activa.pelo.idx]["img_bt"+idx_right];
                break;
            default:
                img_left.src = CAPAS_URL + capas_data.ojos[activa.ojos.idx]["img_bt"+activa.ojos.op];
                idx_right = (activa.ojos.idx < (tipos[1].total -1)) ? activa.ojos.idx + 1 : 0;
                img_right.src = CAPAS_URL + capas_data.ojos[idx_right]["img_bt"+activa.ojos.op];
        }
        $('#img_left').attr('src', img_left.src);
        $('#img_right').attr('src', img_right.src);
    },
    cambiar_tipo: function(destino) {
        var self = this;
        console.log('Iniciando cambiar_tipo');
        if ((destino == 'up') && (activa.tipo >= 2)) activa.tipo -= 1;
        if ((destino == 'down') && (activa.tipo <= 3)) activa.tipo += 1;
        personaje.cargar_controles();
    },
    cambiar_opcion: function(destino) {
        var self = this;
        console.log('Iniciando cambiar_opcion '+destino);
        //personaje.procesando(1);
        personaje.cargado(0);
        switch(activa.tipo) {
            case 2:
                if (destino == 'right') {
                    activa.ojos.op = (activa.ojos.op < tipos[2].total) ? activa.ojos.op + 1 : 1;
                } else if (destino == 'left') {
                    activa.ojos.op = (activa.ojos.op > 1) ? activa.ojos.op - 1 : tipos[2].total;
                }
                img_ojos.onload = personaje.cargado;
                img_ojos.src = CAPAS_URL + capas_data.ojos[activa.ojos.idx]["img_op"+activa.ojos.op];
                $('#pj_head').attr('src', img_ojos.src);
                break;
            case 3:
                if (destino == 'right') {
                    activa.pelo.idx = (activa.pelo.idx < (tipos[3].total -1)) ? activa.pelo.idx + 1 : 0;
                } else if (destino == 'left') {
                    activa.pelo.idx = (activa.pelo.idx > 0) ? activa.pelo.idx - 1 : (tipos[3].total -1);
                }
                activa.pelo.id = capas_data.pelo[activa.pelo.idx]["id"];
                img_pelo.onload = personaje.cargado;
                img_pelo.src = CAPAS_URL + capas_data.pelo[activa.pelo.idx]["img_op"+activa.pelo.op];
                $('#pj_pelu').attr('src', img_pelo.src);
                break;
            case 4:
                if (destino == 'right') {
                    activa.pelo.op = (activa.pelo.op < tipos[4].total) ? activa.pelo.op + 1 : 1;
                } else if (destino == 'left') {
                    activa.pelo.op = (activa.pelo.op > 1) ? activa.pelo.op - 1 : tipos[4].total;
                }
                img_pelo.onload = personaje.cargado;
                img_pelo.src = CAPAS_URL + capas_data.pelo[activa.pelo.idx]["img_op"+activa.pelo.op];
                $('#pj_pelu').attr('src', img_pelo.src);
                break;
            default:
                if (destino == 'right') {
                    activa.ojos.idx = (activa.ojos.idx < (tipos[1].total -1)) ? activa.ojos.idx + 1 : 0;
                } else if (destino == 'left') {
                    activa.ojos.idx = (activa.ojos.idx > 0) ? activa.ojos.idx - 1 : (tipos[1].total -1);
                }
                activa.ojos.id = capas_data.ojos[activa.ojos.idx]["id"];
                img_ojos.onload = personaje.cargado;
                img_ojos.src = CAPAS_URL + capas_data.ojos[activa.ojos.idx]["img_op"+activa.ojos.op];
                $('#pj_head').attr('src', img_ojos.src);
        }
        personaje.cargar_opcion();
    },
    habilitar_controles: function(estado) {
        var self = this;
        /*
        if (estado == 1) {
            $('#tipo_up').click(function(){ personaje.cambiar_tipo('up'); });
            $('#tipo_down').click(function(){ personaje.cambiar_tipo('down'); });
            $('#op_left').click(function(){ personaje.cambiar_opcion('left'); });
            $('#op_right').click(function(){ personaje.cambiar_opcion('right'); });
        } else {
            $('#tipo_up').click(function(){ personaje.esperar(); });
            $('#tipo_down').click(function(){ personaje.esperar(); });
            $('#op_left').click(function(){ personaje.esperar(); });
            $('#op_right').click(function(){ personaje.esperar(); });
        }
        */
    },
    esperar: function() {
        var self = this;
        console.log('espera un poco');
    },
    cargado: function(cuanto) {
        var self = this;
        cuanto = typeof cuanto !== 'undefined' ? cuanto : 1;
        personaje.habilitar_controles(0);
        $('#logo_rotando').show();
        if (cuanto == 0) {
            total_cargado = 0;
            $('#logo_rotando').show();            
        } else {
            total_cargado += 1;
            if (primera_carga == true) {
                if (total_cargado == 3) {
                    $('#logo_rotando').hide();
                    total_cargado = 0;
                    primera_carga = false;        
                    personaje.habilitar_controles(1);
                } else {
                    //$('#logo_rotando').show();
                }
            } else {
                if (total_cargado == 1) {
                    $('#logo_rotando').hide();
                    total_cargado = 0;             
                    personaje.habilitar_controles(1);
                } else {
                    //$('#logo_rotando').show();
                }
            }
        }
    },
    terminar: function() {
        var self = this;
        codigo = 'o'+activa.ojos.id+'-'+activa.ojos.op+'_p'+activa.pelo.id+'-'+activa.pelo.op;
        ir(PATH_COMBINACION+'/'+codigo);
    },
    jugar: function() {
        var self = this;
        $("#escenario").removeClass("hidden");
        $("#inicio").addClass("hidden");
        personaje.escalar_escenario();
    },
    inicio: function() {
        var self = this;
        $("#inicio").removeClass("hidden");
        $("#escenario").addClass("hidden");
    },

};

// With jQuery, you use $(document).ready() to execute something when the DOM is loaded 
// and $(window).on("load", handler) to execute something when all other things are loaded as well, such as the images.
// $(function() { personaje.init(); });

$(window).resize(function() {
    personaje.escalar_escenario();
});

$(window).on("load", function() {
    personaje.init();
});
