Pedidos = new Mongo.Collection("pedidos");

Meteor.methods({
  finalizar: function (id) {
    Pedidos.update(id, {
      $set: {ativo: false}
    });
  }
});

if (Meteor.isServer) {
  
  Meteor.publish("pedidos", function () {
    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours()-1);

    return Pedidos.find({
        "ativo": true, 
        "createdAt": {$gt: lastHour}
      });
  });

  Picker.route('/novo-pedido', function(params, req, res, next) {
    
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!params.query.mesa) {
      res.statusCode = 400;
      res.end('Faltou definir a Mesa');
    } else if (!params.query.pedido) {
      res.statusCode = 400;
      res.end('Faltou incluir os itens do pedido');
    } else {

       var pedido = Pedidos.insert({ 
        mesa: params.query.mesa, 
        itens: params.query.pedido,
        ativo: true,
        userAgent: req.headers['user-agent'],
        createdAt: new Date()
      });

      res.statusCode = 200;
      res.end('Pedido cadastrado!');

    }
   
  });

  Picker.route('/produtos', function(params, req, res, next) {
    
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    var resposta = {
      bolos: [
        {
          subcategoria: "Fatia",
          produtos: ["Só de Cenoura", "Com Nutella", "De Brigadeiro", "Açucarado"]
        },{
          subcategoria: "Pra levar",
          produtos: ["Só de Cenoura inteiro", "Com Nutella inteiro", "De Brigadeiro inteiro", "Açucarado inteiro"]
        }
      ],
      bebidas: [
        {
          subcategoria: "Cafés",
          produtos: ["Espresso", "Capuccino", "Mocachino"]
        },{
          subcategoria: "Refrigerantes",
          produtos: ["Soda", "Guaraná", "Coca"]
        },{
          subcategoria: "Sucos",
          produtos: ["Melancia", "Tangerina", "Limão"]
        }
      ]
    };
    
    res.end(JSON.stringify(resposta));
  });
}


if (Meteor.isClient) {
  Meteor.subscribe("pedidos");
  
  Template.body.helpers({
    pedidos: function () {
      return Pedidos.find({}, {
        sort: {createdAt: -1}
      });
    }
  });

  Template.pedido.events({
    "click .delete": function () {
      Meteor.call("finalizar", this._id);
    }
  });

  Template.registerHelper('horario', function(date) {
    return (date.getHours() + 100 + '').substr(1) + ':' + (date.getMinutes() + 100 + '').substr(1);
  });

}