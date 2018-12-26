import knex from "../config/knex";

const requestHandler = (request, reply) => {
    return (
      knex
        .from("notes")
        .where({ done: false })
        .select("oid", "title", "description", "date", "done")
        .then(results => reply.response(results))
        .catch(err => console.log(err))
    );
  };
  

const notes = [
  {
    method: "GET",
    path: "/notes",
    handler: (request, reply) => {
      return requestHandler(request, reply);
    }
  },
  {
    method: "GET",
    path: "/notes/{note_id}",
    handler: (request, reply) => {
      const id = request.params.note_id;
      return (
        knex
          .from("notes")
          .where("oid", id)
          .select("oid", "title", "description", "date", "done")
          .then(results => reply.response(results))
          .catch(err => console.log(err))
      );
    }
  },
  {
    method: "POST",
    path: "/notes",
    handler: (request, reply) => {
      try {
        let { title, description, type, date } = JSON.parse(request.payload);

        if ( title === undefined) {
          title = "";
          return reply.response({ error: "undefined title" }).code(400);
        }

        if ( description === undefined) {
          description = "";
          return reply.response({ error: "undefined description" }).code(400);
        }

        if ( date === undefined) {
          date = "";
          return reply.response({ error: "undefined date" }).code(400);
        }

        const note = {
          title: title,
          description: description,
          date: date,
          done: false
        };

        return knex
          .into("notes")
          .insert(note)
          .then(result => {
            note.oid = result[0];
            return reply.response({ status: "inserted", data: note }).code(201);
          })
          .catch(err => {
            return reply.response(err).code(400);
          });
      } catch (err) {
        return reply.response({ error: "undefined note in json object" }).code(400)
      }
    }
  },
  {
    method: "PUT",
    path: "/notes/{note_id}",
    handler: (request, reply) => {
      try {
        const { title, description, type, date } = JSON.parse(request.payload);
        const id = request.params.note_id;
        let note = {};

        if ( title != undefined) {
          note.title = title;
        }

        if ( description != undefined) {
          note.description = description;
        }

        if ( date != undefined) {
          note.date = date;
        }

        return knex("notes")
          .where("oid", id)
          .update(note)
          .then(result => 
            knex("notes")
              .where("oid", id)
              .select("oid", "title", "description", "date")
              .then(result => 
                reply.response({ status: "updated", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response({error: err}).code(401);
      }
    }
  },
  {
    method: "PUT",
    path: "/notes/{note_id}/done",
    handler: (request, reply) => {
      try {
        const id = request.params.note_id;
        let note = { done: true };

        return knex("notes")
          .where("oid", id)
          .update(note)
          .then(result => 
            knex("notes")
              .where("oid", id)
              .select("oid", "title", "description", "date")
              .then(result => 
                reply.response({ status: "done", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response(err).code(401);
      }
    }
  },
  {
    method: "PUT",
    path: "/notes/{note_id}/undone",
    handler: (request, reply) => {
      try {
        const id = request.params.note_id;
        let note = { done: false };

        return knex("notes")
          .where("oid", id)
          .update(note)
          .then(result => 
            knex("notes")
              .where("oid", id)
              .select("oid", "title", "description", "date")
              .then(result => 
                reply.response({ status: "undone", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response(err).code(401);
      }
    }
  },
  {
    method: "DELETE",
    path: "/notes/{note_id}/",
    handler: (request, reply) => {
      const id = request.params.note_id;

      const note = knex
          .from("notes")
          .where("oid", id)
          .select("oid", "title", "description", "date", "done")
          .then(results => reply.response(results))
          .catch(err => console.log(err));

      return knex("notes")
        .where("oid", id)
        .del()
        .then(result => {
          if (result === 0) {
            return reply.response({ status: "not deleted", message: "note not found"}).code(409);
          } else {
            return reply.response({ status: "deleted", data: note})
          }
        })
        .catch(err => reply.response(err).code(401));
    }
  } 
];

export default notes;
