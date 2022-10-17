sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("vdl.com.br.exercicioapi.controller.Main", {
            onInit: function () {
                //definir estrutura para modelo
                var dataList = {
                    cryptos: [],
                    dexs: []
                };

                //definir modelo de dados
                this.getView().setModel(new JSONModel(dataList), "DataModel");

            },


            ajaxRequest: function (sQuery) {
                //chamar API asincrona
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: "https://api.coingecko.com/api/v3/search", //Endpoint
                        method: "GET", 
                        async: true,
                        crossDomain: true,
                        jsonpCallback: "getJSON",
                        contentType: "application/json",

                        headers: {
                            //    "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
                            //    "X-RapidAPI-Key": "SUA CHAVE AQUI CASO NECESSARIO
                        },

                        data: {
                            "query": sQuery
                            //"pageNumber": 1,
                            // "pageSize": 30,
                            // "autoCorrect": true,
                            //"safeSearch": false
                        },

                        success: (...args) => resolve(args),
                        error: (...args) => reject(args),

                    });
                });

            },

            onSearch: function (oEvent) {

                // coleta o termo de pesquisa digitado
                //var sQuery = oEvent.getSource().getValue();
                //if (!sQuery || sQuery.length == 0) {
                //    MessageBox.error("Informe um termo de pesquisa");
                //    return;
                //

                //valida se o botão de limpar foi pressionado
                if(oEvent.getParameters().clearButtonPressed){
                    return;
                }
                
                //chama a função de consulta da API
                var oRequest = this.ajaxRequest(oEvent.getParameters().query);
                //trata o retorno: then é o callback de sucesso
                oRequest.then(function (data, textStatus, jqXHR) {

                    //coletar a instancia do json model e seus dados 
                    var oModel = this.getView().getModel("DataModel");
                    var oData  = oModel.getData();

                    //zerar a lista para exibir novos resultados
                    oData = {
                        cryptos: [],
                        dexs: []
                    };

                    //definir modelo de dados para zerar a lista, funciona como um refresh *Apenas JSON*
                    oModel.setData(oData);

                    var countCrypto = 0;
                    var countDex = 0;
                    
                    //Loop para preencher os dados
                    data[0].coins.forEach(element => {
                        oData.cryptos.push(element);
                        countCrypto++;
                    });

                    //Loop para preencher os dados
                    data[0].exchanges.forEach((element, index) => {
                        oData.dexs.push(element);
                        countDex++;
                    });

                    //Setar contador
                    this.getView().byId("cryptoTabFilter").setCount(countCrypto.toString());
                    this.getView().byId("dexTabFilter").setCount(countDex.toString());
                    
                    //Atualizar modelo de dados com os registros
                    oModel.refresh();
                }.bind(this),
                    function (jqXHR, textStatus, errorThrown) {
                    }.bind(this))
            }


        });
    });
