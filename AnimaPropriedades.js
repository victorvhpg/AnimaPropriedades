/**
 * @victorvhpg
 * AnimaPropriedades 
 * faz animacao  das propriedades de um objeto qualquer de acordo com o tempo decorrido 
 *
 * 19/07/2012
 * 
 */

var AnimaPropriedades =function(){
   
    var vetAnim  = [];
   
    
    var AnimaPropriedades =   function(objPropriedades , duracao,efeito){
 
        this.propriedades = objPropriedades || {};    
        this.tempoInicio = 0;
        this.duracaoAnimacao  = duracao || 1000;
        this.animando = false;
        this.efeito = efeito ;
       
    
    };
    
    var loopAtivo = false;
    AnimaPropriedades.loop = function(){
      
        loopAtivo = true;
        var i  = 0;
        while(i <  vetAnim.length){
            if(vetAnim[i].animando){
                vetAnim[i].passo();
                i++;
            }else{
                //remove
                vetAnim.splice(i, 1 );
            }
        }
          
        window.setTimeout(function(){
            if(vetAnim.length > 0){
                AnimaPropriedades.loop();
            }else{
                loopAtivo = false;
            }
        },1000/60);// 
    };
    
    AnimaPropriedades.anima = function(objPropriedades , duracao,efeito){
 
        return (new this(objPropriedades , duracao ,efeito));
    }

    AnimaPropriedades.prototype = {
        onAnimacaoCompleta_ : function(){
            
        },
        onAnimacaoCompleta : function(func){
            var that = this;
            if(typeof func  == "function"){
                this.onAnimacaoCompleta_ = function(){
                    func.call(that,that.propriedades);
                }
            }
            return this;
        },
        aCadaPasso_ :function(){
            
        },
        aCadaPasso : function(func){
            var that = this;
            if(typeof func  == "function"){
                this.aCadaPasso_ = function(){
                    func.call(that,that.propriedades);
                }
            } 
            return this;
        },
 
        irParaFinal : function(){
            for(var prop in this.propriedades){
                var p = this.propriedades[prop];
                //atualiza o valor atual da propriedade para o valor 'ate''
                p.atual  = p.ate;
            }
        },
        passo : function(){
            var tempoEmAnimacao  = Date.now() - this.tempoInicio;
            //se ainda nao passou o tempo total da animacao
            if(tempoEmAnimacao < this.duracaoAnimacao){
                var progresso  = (Math.floor((tempoEmAnimacao / this.duracaoAnimacao) * 100) / 100);
                progresso = (this.efeito) ?  EASING[this.efeito]( progresso ) : progresso;
                //percorre  todas as propriedades
                for(var prop in this.propriedades){
                    var p = this.propriedades[prop];
                    //atualiza o valor atual da propriedade
                    p.atual  =  p.de + ((p.ate - p.de) * progresso) ;
                }
                this.aCadaPasso_();
            }else{        
                //terminou a animacao entao atualiza os valores para 'ate'
                //e executa o  'onAnimacaoCompleta_'
                this.irParaFinal(); 
                this.aCadaPasso_();
                this.animando = false;
                this.onAnimacaoCompleta_();
            }
        },
        reiniciaInverso : function(){
            this.tempoInicio = Date.now();
            this.animando =  true;
            for(var prop in this.propriedades){
                var p = this.propriedades[prop];
                var temp = p.de ;
                p.de  = p.ate;
                p.ate = temp;
            }
        },
      
        iniciar : function(){
            vetAnim[vetAnim.length] = this;
            this.tempoInicio = Date.now();
            this.animando =  true;
            if(!loopAtivo){//se o loop  principal nao esta ativo entao inicia o loop
                AnimaPropriedades.loop();
            }
            return this;
        }
    
    };
    AnimaPropriedades.prototype.constructor = AnimaPropriedades;
    
    return AnimaPropriedades;
   
}(); 
//====================================================================================
  
 
 
 
 
 
 
 
 
 
 
 
 
//================================================      
//Equações easing foram retiradas  de 
// https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js
// http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js
// http://www.robertpenner.com/easing_terms_of_use.html
//===================================================
        
var EASING  = {
    easeInQuad: function(pos) {
        return Math.pow(pos, 2);
    },

    easeOutQuad: function(pos) {
        return -(Math.pow((pos-1), 2) -1);
    },

    easeInOutQuad: function(pos) {
        if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
        return -0.5 * ((pos-=2)*pos - 2);
    },

    easeInCubic: function(pos) {
        return Math.pow(pos, 3);
    },

    easeOutCubic: function(pos) {
        return (Math.pow((pos-1), 3) +1);
    },

    easeInOutCubic: function(pos) {
        if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
        return 0.5 * (Math.pow((pos-2),3) + 2);
    },

    easeInQuart: function(pos) {
        return Math.pow(pos, 4);
    },

    easeOutQuart: function(pos) {
        return -(Math.pow((pos-1), 4) -1)
    },

    easeInOutQuart: function(pos) {
        if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
        return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
    },

    easeInQuint: function(pos) {
        return Math.pow(pos, 5);
    },

    easeOutQuint: function(pos) {
        return (Math.pow((pos-1), 5) +1);
    },

    easeInOutQuint: function(pos) {
        if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
        return 0.5 * (Math.pow((pos-2),5) + 2);
    },

    easeInSine: function(pos) {
        return -Math.cos(pos * (Math.PI/2)) + 1;
    },

    easeOutSine: function(pos) {
        return Math.sin(pos * (Math.PI/2));
    },

    easeInOutSine: function(pos) {
        return (-0.5 * (Math.cos(Math.PI*pos) -1));
    },

    easeInExpo: function(pos) {
        return (pos===0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },

    easeOutExpo: function(pos) {
        return (pos===1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },

    easeInOutExpo: function(pos) {
        if(pos===0) return 0;
        if(pos===1) return 1;
        if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },

    easeInCirc: function(pos) {
        return -(Math.sqrt(1 - (pos*pos)) - 1);
    },

    easeOutCirc: function(pos) {
        return Math.sqrt(1 - Math.pow((pos-1), 2))
    },

    easeInOutCirc: function(pos) {
        if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
        return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
    },

    easeOutBounce: function(pos) {
        if ((pos) < (1/2.75)) {
            return (7.5625*pos*pos);
        } else if (pos < (2/2.75)) {
            return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
        } else if (pos < (2.5/2.75)) {
            return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
        } else {
            return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
        }
    },

    easeInBack: function(pos) {
        var s = 1.70158;
        return (pos)*pos*((s+1)*pos - s);
    },

    easeOutBack: function(pos) {
        var s = 1.70158;
        return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
    },

    easeInOutBack: function(pos) {
        var s = 1.70158;
        if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
        return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
    },

    elastic: function(pos) {
        return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
    },
    elasticInOut: function ( pos ) {

        var s, a = 0.1, p = 0.4;
        if ( pos === 0 ) return 0;
        if ( pos === 1 ) return 1;
        if ( !a || a < 1 ) {
            a = 1;
            s = p / 4;
        }
        else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
        if ( ( pos *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( pos -= 1 ) ) * Math.sin( ( pos - s ) * ( 2 * Math.PI ) / p ) );
        return a * Math.pow( 2, -10 * ( pos -= 1 ) ) * Math.sin( ( pos - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

    },

    swingFromTo: function(pos) {
        var s = 1.70158;
        return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
        0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
    },

    swingFrom: function(pos) {
        var s = 1.70158;
        return pos*pos*((s+1)*pos - s);
    },

    swingTo: function(pos) {
        var s = 1.70158;
        return (pos-=1)*pos*((s+1)*pos + s) + 1;
    },

    bounce: function(pos) {
        if (pos < (1/2.75)) {
            return (7.5625*pos*pos);
        } else if (pos < (2/2.75)) {
            return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
        } else if (pos < (2.5/2.75)) {
            return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
        } else {
            return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
        }
    },

    bouncePast: function(pos) {
        if (pos < (1/2.75)) {
            return (7.5625*pos*pos);
        } else if (pos < (2/2.75)) {
            return 2 - (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
        } else if (pos < (2.5/2.75)) {
            return 2 - (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
        } else {
            return 2 - (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
        }
    },

    easeFromTo: function(pos) {
        if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
        return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
    },

    easeFrom: function(pos) {
        return Math.pow(pos,4);
    },

    easeTo: function(pos) {
        return Math.pow(pos,0.25);
    }
};