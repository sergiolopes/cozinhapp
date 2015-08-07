Pedidos = new Mongo.Collection("pedidos");
 
if (Meteor.isClient) {
  
  Template.body.helpers({
    pedidos: function () {
      return Pedidos.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.pedido.events({
    "click .delete": function () {
      Pedidos.remove(this._id);
    }
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
    } else if (!params.query.filial) {
      res.statusCode = 400;
      res.end('Passe um ID de filial (sugestão: seu email)');
    } else {

       var pedido = Pedidos.insert({ 
        mesa: params.query.mesa, 
        itens: params.query.pedido,
        filial: params.query.filial,
        createdAt: new Date()
      });

      res.statusCode = 200;
      res.end('Pedido cadastrado!');

    }
   
  });
}