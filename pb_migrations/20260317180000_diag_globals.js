/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    console.log("--- GLOBALS IN MIGRATION ---");
    console.log(Object.keys(globalThis).join(", "));
}, (db) => {
})
