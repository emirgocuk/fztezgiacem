/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    console.log("--- POCKETBASE CLASS DISCOVERY ---");
    const globals = Object.keys(globalThis);
    console.log("Found globals beginning with D/d/R/r/C/c:");
    console.log(globals.filter(g => /^[DdRrCc]/.test(g)).join(", "));
    
    // Check for common namespaces
    console.log("Namespaces: $app: " + (typeof $app !== 'undefined') + ", core: " + (typeof core !== 'undefined'));
}, (db) => {
})
