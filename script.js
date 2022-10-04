(function(){
	'use strict';

	// Configurações
	var qtdePosicoes = 96;
	var qtdeMinas = 20;
	var qtdeMinasRestantes = qtdeMinas;
	var numReveladas = 0;
	var numPorLinhas = 8;
	var acao = 'mina';

	// Elementos
	var campo = document.querySelector('.campo');
	var cronometro = document.querySelector('#cronometro');
	var minasRestantes = document.querySelector('#minas-restantes');
	var btnPlacar = document.querySelector('.btn-placar');
	var btnAcao = document.querySelector('#acao');
	
	// Altera a ação do click
	function alteraAcao() {
		if (acao == 'mina') {
			acao = 'bandeira';
			btnAcao.setAttribute('class','placar-item bandeira');
			var posicoes = document.querySelectorAll('.posicao');
			for (var i = 0; i < posicoes.length; i++) {
				posicoes[i].removeEventListener('click', revelaPosicao);
				posicoes[i].addEventListener('click', marcaPosicao);
			}
		} else {
			acao = 'mina';
			btnAcao.setAttribute('class','placar-item mina');
			var posicoes = document.querySelectorAll('.posicao');
			for (var i = 0; i < posicoes.length; i++) {
				posicoes[i].removeEventListener('click', marcaPosicao);
				posicoes[i].addEventListener('click', revelaPosicao);
			}
		}
	}		

	// Evento de clique simples em uma posição
	function revelaPosicao() {		
		var posicao = this;
		var posicaoNumero = this.dataset.posicao;
		var posicaoConteudo = this.dataset.conteudo;
		// Verifica se a posição está oculta
		if (posicao.dataset.status == 'oculta') {
			var qtdeMinasRedor = getMinasRedor(posicaoNumero);
			posicao.className += ' revelada';		
			posicao.setAttribute('data-status','revelada');	
			// Verifica se a posição contém alguma mina
			if (posicaoConteudo == "mina") {
				posicao.className += ' explodida';
				perderJogo();
			}
			// Verifica se a posição não contém nenhuma mina ao redor 
			else if (qtdeMinasRedor == 0) {
				revelaPosicoesVazias(posicaoNumero);
				numReveladas++;
			} 
			// Revela a quantidade de minas ao redor da posição
			else {	
				numReveladas++;
				posicao.className += ' qtde-minas-'+qtdeMinasRedor;
				if (qtdeMinasRedor > 0) {
					posicao.innerHTML = qtdeMinasRedor;	
				}	
			}
			// Verifica se todas as minas foram descobertas
			if ((qtdePosicoes - qtdeMinas) == numReveladas) {
				vencerJogo();
			}			
		}		
	}

	// Marca uma posição suspeita
	function marcaPosicao() {
		var posicao = this;
		if (posicao.dataset.status != 'marcada' && posicao.dataset.status != 'revelada') {
			posicao.className += ' marcada';		
			posicao.setAttribute('data-status','marcada');
			if (qtdeMinasRestantes > 0) {
				qtdeMinasRestantes--;
				minasRestantes.innerHTML = qtdeMinasRestantes;
			}			
		} else if (posicao.dataset.status == 'marcada') {	
			posicao.setAttribute('class','posicao');
			posicao.setAttribute('data-status','oculta');
			qtdeMinasRestantes++;
			minasRestantes.innerHTML = qtdeMinasRestantes;
		}			
	}

	// Retorna todas a posições ao redor da posição informada
	function getPosicoesRedor(pos) {
		var pos = Number(pos);
		var posicoesRedor = [];
		// Verifica se a posição encontra-se na direita
		if ((pos % numPorLinhas) == 0) {
			if (pos == numPorLinhas) {
				posicoesRedor.push(pos+numPorLinhas);
				posicoesRedor.push(pos+(numPorLinhas-1));
				posicoesRedor.push(pos-1);
			} else if (pos == qtdePosicoes) {
				posicoesRedor.push(pos-(numPorLinhas+1));
				posicoesRedor.push(pos-numPorLinhas);
				posicoesRedor.push(pos-1);
			} else {
				posicoesRedor.push(pos-(numPorLinhas+1));
				posicoesRedor.push(pos-numPorLinhas);
				posicoesRedor.push(pos+numPorLinhas);
				posicoesRedor.push(pos+(numPorLinhas-1));
				posicoesRedor.push(pos-1);
			}
		} 
		// Verifica se a posição encontra-se na esquerda
		else if ((pos % numPorLinhas) == 1) {
			if (pos == 1) {
				posicoesRedor.push(pos+1);
				posicoesRedor.push(pos+(numPorLinhas+1));
				posicoesRedor.push(pos+numPorLinhas);
			} else if (pos == qtdePosicoes-(numPorLinhas-1)) {
				posicoesRedor.push(pos-numPorLinhas);
				posicoesRedor.push(pos-(numPorLinhas-1));
				posicoesRedor.push(pos+1);
			} else {
				posicoesRedor.push(pos-numPorLinhas);
				posicoesRedor.push(pos-(numPorLinhas-1));
				posicoesRedor.push(pos+1);
				posicoesRedor.push(pos+(numPorLinhas+1));
				posicoesRedor.push(pos+numPorLinhas);
			}
		}
		// Verifica se a posição encontra-se na primeira linha
		else if (pos < numPorLinhas && pos > 1) {
			posicoesRedor.push(pos+1);
			posicoesRedor.push(pos+(numPorLinhas+1));
			posicoesRedor.push(pos+numPorLinhas);
			posicoesRedor.push(pos+(numPorLinhas-1));
			posicoesRedor.push(pos-1);	
		}		
		// Verifica se a posição encontra-se na última linha
		else if (pos < qtdePosicoes && pos > (qtdePosicoes-(numPorLinhas+1))) {
			posicoesRedor.push(pos-(numPorLinhas+1));
			posicoesRedor.push(pos-numPorLinhas);
			posicoesRedor.push(pos-(numPorLinhas-1));
			posicoesRedor.push(pos+1);	
			posicoesRedor.push(pos-1);			
		} else {
			posicoesRedor.push(pos-(numPorLinhas+1));
			posicoesRedor.push(pos-numPorLinhas);
			posicoesRedor.push(pos-(numPorLinhas-1));
			posicoesRedor.push(pos+1);
			posicoesRedor.push(pos+(numPorLinhas+1));
			posicoesRedor.push(pos+numPorLinhas);
			posicoesRedor.push(pos+(numPorLinhas-1));
			posicoesRedor.push(pos-1);
		};
		//console.log(posicoesRedor);
		return posicoesRedor
	}

	// Retorna a quantidade de minas ao redor da posição informada
	function getMinasRedor(pos) {
		var posicoesRedor = getPosicoesRedor(pos);
		var qtdeMinasRedor = 0;
		for (var i = 0; i < posicoesRedor.length; i++) {
			var posicao = document.querySelector('[data-posicao="'+posicoesRedor[i]+'"]');
			if (posicao.dataset.conteudo == "mina") {
				qtdeMinasRedor++
			}
		}
		return qtdeMinasRedor;
	}

	// Revela todas as posições vizinhas onde não há minas ao redor
	function revelaPosicoesVazias(pos) {
		var posicoesRedor = getPosicoesRedor(pos);		
		for (var i = 0; i < posicoesRedor.length; i++) {
			var posicao = document.querySelector('[data-posicao="'+posicoesRedor[i]+'"]');
			if (posicao.dataset.status == 'oculta') {
				posicao.className += ' revelada';
				posicao.setAttribute('data-status','revelada');
				numReveladas++;
				var qtdeMinasRedor = getMinasRedor(posicoesRedor[i]);
				if (qtdeMinasRedor > 0) {
					posicao.className += ' qtde-minas-'+qtdeMinasRedor;
					posicao.innerHTML = qtdeMinasRedor;					
				} else {
					revelaPosicoesVazias(posicoesRedor[i]);
				} 						
			}
		}
	}

	// Revela todas as minas
	function revelaTodasMinas() {
		var posMinas = document.querySelectorAll('[data-conteudo="mina"]');
		for (var i = 0; i < posMinas.length; i++) {
			posMinas[i].className += ' revelada';
			posMinas[i].setAttribute('data-status','revelada');
		}
	}

	// Perde o jogo
	function perderJogo() {
		revelaTodasMinas();
		var posicoes =  document.querySelectorAll('.posicao');
		for (var i = 0; i < posicoes.length; i++) {
			posicoes[i].removeEventListener('click', revelaPosicao);
			posicoes[i].removeEventListener('click', marcaPosicao);
		}
		btnAcao.removeEventListener('click', alteraAcao);
		btnPlacar.setAttribute('class','btn-placar triste');	
	}

	// Vence o jogo
	function vencerJogo() {
		var posicoes =  document.querySelectorAll('.posicao');
		for (var i = 0; i < posicoes.length; i++) {
			posicoes[i].removeEventListener('click', revelaPosicao);
			posicoes[i].removeEventListener('click', marcaPosicao);
		}
		btnAcao.removeEventListener('click', alteraAcao);
		btnPlacar.setAttribute('class','btn-placar feliz');	
	}

	// Reinicia o jogo
	function reiniciarJogo() {
		qtdeMinasRestantes = qtdeMinas;
		numReveladas = 0;
		campo.innerHTML = '';
		init();
	}

	// Inicializa o jogo
	function init() {

		btnPlacar.setAttribute('class','btn-placar normal');
		btnPlacar.addEventListener('click', reiniciarJogo);
		minasRestantes.innerHTML = qtdeMinasRestantes;

		// Quantidade de minas plantadas
		var qtdeMinasPlantadas = 0;

		// Posições aleatórias para plantas as minas
		var posPlantar = [];		
		while (posPlantar.length < qtdeMinas) {
			var posAleatoria = Math.floor(Math.random() * qtdePosicoes) + 1;
			if (posPlantar.indexOf(posAleatoria) == -1) {
				posPlantar.push(posAleatoria);
			}
		}

		// Cria as posições do campo
		for (var i = 1; i <= qtdePosicoes; i++) {
			
			var posicao = document.createElement('div');
			posicao.setAttribute('class','posicao');	
			posicao.setAttribute('data-posicao',i);	
			posicao.setAttribute('data-status','oculta');
			// Verifica se a posição atual está no array de posições para plantar as minas
			if (posPlantar.indexOf(i) != -1) {
				posicao.setAttribute('data-conteudo','mina');
			} else {				
				posicao.setAttribute('data-conteudo','vazio');
			}	
			//posicao.innerHTML = i;

			if (acao == "mina") {
				posicao.removeEventListener('click', marcaPosicao);
				posicao.addEventListener('click', revelaPosicao);
			} else {
				posicao.removeEventListener('click', revelaPosicao);
				posicao.addEventListener('click', marcaPosicao);
			}

			
			campo.appendChild(posicao);
			btnAcao.addEventListener('click', alteraAcao);

		}
	}
	
	init();


}())