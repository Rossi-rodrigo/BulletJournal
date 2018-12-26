
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(function () {
      // Inserts seed entries
      return knex('notes').insert([
        {id: 1, title: 'Titulo1', description: 'Bob Esponja', date: '2019-12-12', done: true},
        {id: 2, title: 'Titulo2', description: 'Skate', date: '2019-12-13', done: true},
        {id: 3, title: 'Titulo3', description: 'Homem-Aranha', date: '2019-12-14', done: true}
      ]);
    });
};
