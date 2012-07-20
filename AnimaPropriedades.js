/**
 * @victorvhpg
 * AnimaPropriedades 
 * faz animacao linear das propriedades de um objeto qualquer de acordo com o tempo decorrido 
 *
 * 19/07/2012
 *
 */

var AnimaPropriedades = function(objPropriedades , duracao){
 
    this.propriedades = objPropriedades || {};    
    this.tempoInicio = 0;
    this.duracaoAnimacao  = duracao || 1000;
    this.animando = false;
 
    
};
AnimaPropriedades.anima = function(objPropriedades , duracao){
 
    return (new this(objPropriedades , duracao));
}

AnimaPropriedades.prototype = {
    onAnimacaoCompleta : function(func){
        var that = this;
        if(typeof func  == "function"){
            this.onAnimacaoCompleta = function(){
                func.call(that,that.propriedades);
            }
        }
        return this;
    },
    aCadaPasso : function(func){
        var that = this;
        if(typeof func  == "function"){
            this.aCadaPasso = function(){
                func.call(that,that.propriedades);
            }
        } 
        return this;
    },
    loop : function(){
        var that = this;
        this.passo();
        window.setTimeout(function(){
            if(that.animando){
                that.loop();
            }
        },1000/60);
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
            //percorre  todas as propriedades
            for(var prop in this.propriedades){
                var p = this.propriedades[prop];
                //atualiza o valor atual da propriedade
                p.atual  =  p.de + ((p.ate - p.de) * progresso) ;
            }
            this.aCadaPasso();
        }else{        
            //terminou a animacao entao atualiza os valores para 'ate'
            //e executa o  'onAnimacaoCompleta'
            this.irParaFinal(); 
            this.aCadaPasso();
            this.animando = false;
            this.onAnimacaoCompleta();
        }
    },
    iniciar : function(){
        this.tempoInicio = Date.now();
        this.animando =  true;
        this.loop( );
        return this;
    }
    
};
AnimaPropriedades.prototype.constructor = AnimaPropriedades;
