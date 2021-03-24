(function(){
	function appendStyle(styles) {
	  var css = document.createElement('style');
	  css.type = 'text/css';

	  if (css.styleSheet) css.styleSheet.cssText = styles;
	  else css.appendChild(document.createTextNode(styles));

	  document.getElementsByTagName("head")[0].appendChild(css);
	}

	var styles = `#parlTooltip{
			position: fixed;
			border-radius: 10px;
			overflow: hidden;
			font-family: sans-serif;
			font-size: 14px;
			line-height:1.1em;
			width: 320px;
			-webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.24);
			        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.24);
			z-index: 9999;
			left: 0px;
			top: 0px;
			opacity: 0;
			visibility: hidden;
			-webkit-transition: opacity 0.3s, visibility 0.3s;
			-o-transition: opacity 0.3s, visibility 0.3s;
			transition: opacity 0.3s, visibility 0.3s;
		}

		#parlTooltip.ativo{
			opacity: 1;
			visibility: visible;
		}

		.parlTooltip-content{
			background: -webkit-gradient(linear, left top, left bottom, from(#3f3fc3), to(#2c2599));
			background: -o-linear-gradient(#3f3fc3, #2c2599);
			background: linear-gradient(#3f3fc3, #2c2599);
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: horizontal;
			-webkit-box-direction: normal;
			    -ms-flex-direction: row;
			        flex-direction: row;
			-webkit-box-align: start;
			    -ms-flex-align: start;
			        align-items: flex-start;
			color: white;
		}

		.parlTooltip-content-col-1, .parlTooltip-content-col-2{
			padding: 15px;
		}

		.parlTooltip-content-col-1{
			-ms-flex-negative: 0;
			    flex-shrink: 0;
		}

		.parlTooltip-content-col-2{
			padding-left: 0px;
			padding-right: 25px;
		}

		.parlTooltip-content-bloco{
			margin-bottom: 15px;
		}

		.parlTooltip-foto{
			border-radius: 7.5px;
			width: 65px;
			-webkit-filter: grayscale(100%);
			        filter: grayscale(100%);
		}

		.parlTooltip-titulo{
			font-size: 16px;
			margin-bottom: 5px;
		}

		.parlTooltip-afiliacao{
			opacity: .5;
		}

		.parlTooltip-analises{
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: horizontal;
			-webkit-box-direction: normal;
			    -ms-flex-direction: row;
			        flex-direction: row;
			-webkit-box-align: start;
			    -ms-flex-align: start;
			        align-items: flex-start;
		}

		.parlTooltip-analise{
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			    -ms-flex-direction: column;
			        flex-direction: column;
			-webkit-box-align: start;
			    -ms-flex-align: start;
			        align-items: flex-start;
		}

		.parlTooltip-analise span:first-child{
			font-size: 20px;
			margin-bottom: 5px;
		}

		.parlTooltip-analise-transparencia{
			opacity: .5;
			padding-left: 20px;
		}

		.parlTooltip-footer{
			padding: 12px 15px;
			text-align: center;
			background-color: white;
		}

		.parlTooltip-footer a{
			color: #2c2599;
			text-decoration: none;
			font-weight: bold;
			font-size: 14px;
		}

		.parlTooltip-footer a:after{
			content: "";
			display: inline-block;
			height: 20px;
			width: 20px;
			margin-bottom: -5px;
			margin-left: 10px;
			-webkit-transition: all .3s;
			-o-transition: all .3s;
			transition: all .3s;
			background-image: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.9 14.9"><circle cx="7.4" cy="7.4" r="6.7" fill="none" stroke="%232c2599" stroke-width="1.4" stroke-miterlimit="10"/><line x1="4.4" y1="7.4" x2="9.7" y2="7.4" fill="none" stroke="%232c2599" stroke-width="1.4" stroke-miterlimit="10"/><polygon points="7.4 4.4 10.4 7.4 7.4 10.4 7.4 4.4" fill="%232c2599"/></svg>');
		}

		.parlTooltip-footer a:hover:after, .parlTooltip-footer a:focus:after{
			margin-left: 15px;
			margin-right: -5px;
		}

		.parlTooltip-fechar{
			-webkit-appearance: none;
			   -moz-appearance: none;
			        appearance: none;
			background:none;
			border: none;
			-webkit-transform: rotate(45deg);
			    -ms-transform: rotate(45deg);
			        transform: rotate(45deg);
			background-image: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><g><line x1="14.5" y1="2" x2="14.5" y2="27" style="fill: none;stroke: %23ffffff;stroke-linecap: round;stroke-miterlimit: 10;stroke-width: 5px"/><line x1="27" y1="14.5" x2="2" y2="14.5" style="fill: none;stroke: %23ffffff;stroke-linecap: round;stroke-miterlimit: 10;stroke-width: 5px"/></g></svg>');
			height: 14px;
			width: 14px;
			position: absolute;
			top: 15px;
			right: 10px;
			background-repeat: no-repeat;
		}

		.parlLink{
			padding: .25em .5em;
	    border-radius: 50px;
	    background-color: #dddddd;
	    text-decoration: none !important;
	    color: black !important;
	        white-space: nowrap;
		}

		.parlLink:after{
			content: "i";
	    height: 16px;
	    width: 16px;
	    display: inline-block;
	    text-align: center;
	    color: white;
	    background-color: #111;
	    border-radius: 50%;
	    line-height: 16px;
			margin-left: 8px;
			margin-top: -2px;
	    font-size: 10px;
	    font-family: sans-serif;
	    vertical-align: middle;
	}`;

	// Monta o conteúdo do Tooltip´//
	function montarTooltip(id){
		o = '<div class="parlTooltip-content">'+(window.innerWidth>1000?'<button class="parlTooltip-fechar" onclick="this.parent().classList.remove("ativo")">':'')+'</button><div class="parlTooltip-content-col-1"><img class="parlTooltip-foto" src="'+parlData[id].foto+'" alt="'+parlData[id].nome+'" width="114" height="152"></div><div class="parlTooltip-content-col-2"><div class="parlTooltip-content-bloco"><div class="parlTooltip-titulo"><span class="parlTooltip-nome">'+parlData[id].nome+'</span> <span class="parlTooltip-afiliacao">'+parlData[id].afiliacao+'-'+parlData[id].uf+'</span></div><span class="parlTooltip-content-cargo">'+parlData[id].cargo+'</span></div>';
		
		o+='<div class="parlTooltip-content-bloco"><div class="parlTooltip-analises">';
			if(typeof parlData[id].governismo !== "undefined") o+='<div class="parlTooltip-analise parlTooltip-analise-governismo"><span>'+parlData[id].governismo+'%</span><span>governismo</span></div>';
			if(typeof parlData[id].transparencia !== "undefined") o+='<div class="parlTooltip-analise  parlTooltip-analise-transparencia"><span>'+parlData[id].transparencia+'%</span><span>transparencia</span></div>';
		o+='</div></div>';
		
		if(typeof parlData[id].acusacoes !== "undefined") o+='<div class="parlTooltip-content-bloco"><span class="parlTooltip-obs">'+(parlData[id].acusacoes==0?"O deputado não possui acusações":parlData[id].acusacoes==1?"O deputado é investigado em <strong>1 acusação</strong>":"O deputado é investigado em <strong>"+parlData[id].acusacoes+" acusações</strong>")+'</span></div>';

		o+='</div></div>';
		o+='<div class="parlTooltip-footer"><a class="parlTooltip-link" href="'+parlData[id].url+'">Veja o perfil completo</a></div>';
		parlTooltip.innerHTML=o;
		parlTooltip.classList.add("ativo");
	}

	// Posiciona o Tooltip //
	function posicionarTooltip(e){
		var w = parlTooltip.offsetWidth,
			ml = -w/2,
			h = parlTooltip.offsetHeight,
			x = e.clientX,
			y = e.clientY,
			top = y-h-30,
			left = Math.max((w/2+30),Math.min(window.innerWidth-(w/2+30),x));
		
		if(y<=450){
			top = y-30;
			left = x<window.innerWidth/2 ? x+30 : x-w-30;
			ml = 0;
		}

		parlTooltip.style.marginLeft = ml+"px";
		parlTooltip.style.left = left+"px";
		parlTooltip.style.top = top+"px";
	}

	// Checar se já foram requisitados dados do parlamentar //
	function checkData(id){
		if(parlData[id]){
			montarTooltip(id);
		}else{
			// Se não houver dados ele faz a requisição e monta aqui // 
			var http = new XMLHttpRequest(),
				url = 'https://radar.congressoemfoco.com.br/api/parlamentares/simplificado/' + id.toString();
				http.open('GET', url, true);
				http.onreadystatechange = function() {
			    if (http.readyState == 4 && http.status == 200) {
					var a = JSON.parse(http.responseText);
					if (a) {
						parlData[id] = {
							foto: a.foto,
							nome: a.nome,
							afiliacao: a.partido,
							uf: a.uf,
							cargo: a.casa == 'camara' ? 'Deputado' : 'Senador',
							governismo: a.governismo,
							transparencia: a.transparencia,
							acusacoes: a.acusacoes,
							url: "https://radar.congressoemfoco.com.br/parlamentar/" + id,
						}
						montarTooltip(id);
					}
			    }
			}
			http.withCredentials = true;
			http.send();
		}
	}

	appendStyle(styles);

	var urlBase = "radar.congressoemfoco.com.br/parlamentar/"

	var parlTooltip = document.createElement('div');
	parlTooltip.id = 'parlTooltip';
	document.getElementsByTagName("body")[0].appendChild(parlTooltip);

	//var parlTooltip = document.getElementById("parlTooltip")
	var parlLinks = document.querySelectorAll('a[href*="'+urlBase+'"]');
	var parlData = {};
	// Passa por todos os links e define os eventos //
	parlLinks.forEach(function(a){
		var intervalo;
		a.classList.add('parlLink');
		a.addEventListener('mouseenter', function(e){
			var parlURL = a.getAttribute("href")
			var parlID = parlURL.split(urlBase).pop().split("/").shift();
			checkData(parlID);
			posicionarTooltip(e);
			clearTimeout(intervalo);
		});
		a.addEventListener('mouseleave', function(e){
			intervalo = setTimeout(function(){
				parlTooltip.classList.remove("ativo")
			},2000);
		});
		a.addEventListener('click', function(e){
			if(window.innerWidth<1000){
				e.preventDefault();
			}
		});
	});
})();