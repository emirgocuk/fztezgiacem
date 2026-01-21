/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        "name": "subscribers",
        "type": "base",
        "system": false,
        "fields": [
            {
                "name": "email",
                "type": "email",
                "required": true,
                "unique": true,
                "presentable": false,
                "system": false
            },
            {
                "name": "source",
                "type": "text",
                "required": false,
                "presentable": false,
                "system": false
            },
            {
                "name": "active",
                "type": "bool",
                "required": false,
                "presentable": false,
                "system": false
            }
        ],
        "indexes": [],
        "listRule": "@request.auth.id != ''",
        "viewRule": "@request.auth.id != ''",
        "createRule": "",
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("subscribers");

    return app.delete(collection);
})
