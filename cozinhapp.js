Pedidos = new Mongo.Collection("pedidos");

if (Meteor.isClient) {
  
  var lastHour = new Date();
  lastHour.setHours(lastHour.getHours()-1);

  Template.body.helpers({
    pedidos: function () {
      return Pedidos.find({"ativo": true, "createdAt":{$gt: lastHour},}, {sort: {createdAt: -1}});
    }
  });

  Template.pedido.events({
    "click .delete": function () {
      Pedidos.update(this._id, {
        $set: {ativo: false}
      });
    }
  });

  Template.registerHelper('horario', function(date) {
    return (date.getHours() + 100 + '').substr(1) + ':' + (date.getMinutes() + 100 + '').substr(1);
  });

}


if (Meteor.isServer) {
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
}