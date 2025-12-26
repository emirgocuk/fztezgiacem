migrate((db) => {
    try {
        const collection = db.findCollectionByNameOrId("messages");

        // Allow everyone to create (public access)
        collection.createRule = "";

        // Only admins can view/list/update/delete
        return db.saveCollection(collection);
    } catch (e) {
        console.log("Collection 'messages' not found, skipping rule update.");
    }
}, (db) => {
    try {
        const collection = db.findCollectionByNameOrId("messages");
        collection.createRule = null;
        return db.saveCollection(collection);
    } catch (e) { }
})
