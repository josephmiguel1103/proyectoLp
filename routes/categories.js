var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* listar. */
router.get('/', function (req, res, next) {

  dbConn.query('SELECT * FROM categorias ORDER BY id_category desc', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('categories/index', { dato: '' });
    } else {
      res.render('categories/index', { dato: rows });
    }   
  });
}); 

/*formulario para agregar */
router.get ('/add',function(req,res ,next) {
  res.render('categories/add',{
    nombre:''
  })
})

// add a new categoria
router.post('/add', function(req, res, next) {    

  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0 ) {
      errors = true;
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('categories/add', {
          nombre: nombre
      })
  }

  // if no error
  if(!errors) {

      var form_data = {
          nombre: nombre,
      }      
      // insert query
      dbConn.query('INSERT INTO categorias SET ?', form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              req.flash('error', err)
              res.render('categories/add', {
                  name: form_data.nombre                   
              })
          } else {                
              req.flash('success', 'categories successfully added');
              res.redirect('/categories');
          }
      })
  }
})

// ver formulario editar
router.get('/edit/(:id_category)', function(req, res, next) {
  let id_category = req.params.id_category;
  dbConn.query('SELECT * FROM categorias WHERE id_category = ' + id_category, function(err, rows, fields) {
      if(err) throw err       
      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id_category = ' + id_category)
          res.redirect('/categories')
      }
      // if book found
      else {
          // render to edit.ejs
          res.render('categories/edit', {
              id_category: rows[0].id_category,
              nombre: rows[0].nombre              
          })
      }
  })
})

// update categoria data
router.post('/update/:id_category', function(req, res, next) {
  let id_category = req.params.id_category;
  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0) {
      errors = true;      
      // set flash message
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('categories/edit', {
          id_category: req.params.id_category,
          nombre: nombre
      })
  }
  // if no error
  if( !errors ) { 
      var form_data = {
          nombre: nombre
      }
      // update query
      dbConn.query('UPDATE categorias SET ? WHERE id_category = ' + id_category, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              // set flash message
              req.flash('error', err)
              // render to edit.ejs
              res.render('categories/edit', {
                  id_category: req.params.id_category,
                  nombre: form_data.nombre
              })
          } else {
              req.flash('success', 'categories successfully updated');
              res.redirect('/categories');
          }
      })
  }
})

// delete categorias
router.get('/delete/(:id_category)', function(req, res, next) {
  let id_category = req.params.id_category;   
  dbConn.query('DELETE FROM categorias WHERE id_category = ' + id_category, function(err, result) {
      //if(err) throw err
      if (err) {
          // set flash message
          req.flash('error', err)
          // redirect to books page
          res.redirect('/categories')
      } else {
          // set flash message
          req.flash('success', 'Book successfully deleted! ID = ' + id)
          // redirect to books page
          res.redirect('/categories')
      }
  })
})


module.exports = router;
