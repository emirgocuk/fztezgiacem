/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  try {
    const collection = new Collection({
      "id": "mp22573215n2914",
      "created": "2024-12-25 00:00:00.000Z",
      "updated": "2024-12-25 00:00:00.000Z",
      "name": "messages",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "p0y8319z",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "8340156h",
          "name": "email",
          "type": "email",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "exceptDomains": null,
            "onlyDomains": null
          }
        },
        {
          "system": false,
          "id": "9273184x",
          "name": "message",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "2810452p",
          "name": "phone",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        }
      ],
      "indexes": [],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    });

    return db.saveCollection(collection);
  } catch (e) {
    // Ignore error if collection already exists
    console.log("Migration skipped: Collection 'messages' likely already exists.");
  }
}, (db) => {
  try {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("mp22573215n2914");
    return dao.deleteCollection(collection);
  } catch (e) { }
})
