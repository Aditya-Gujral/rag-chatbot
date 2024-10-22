"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pinecone_1 = require("@pinecone-database/pinecone");
var pc = new pinecone_1.Pinecone({
    apiKey: env.PINECONE_API_KEY
});
console.log(pc.listIndexes());
