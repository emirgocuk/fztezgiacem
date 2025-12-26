/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3940974")

  // remove field
  collection.fields.removeById("number223244161")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3940974")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number223244161",
    "max": null,
    "min": null,
    "name": "address",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
