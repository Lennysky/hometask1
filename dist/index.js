"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// create express app
const app = (0, express_1.default)();
const port = 3003;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
let videos = [
    { id: 1, title: 'About JS - 01', author: 'it-incubator.eu' },
    { id: 2, title: 'About JS - 02', author: 'it-incubator.eu' },
    { id: 3, title: 'About JS - 03', author: 'it-incubator.eu' },
    { id: 4, title: 'About JS - 04', author: 'it-incubator.eu' },
    { id: 5, title: 'About JS - 05', author: 'it-incubator.eu' },
];
const errorCollect = (errors, field, message) => {
    const error = {
        field: field,
        message: message
    };
    errors.push(error);
};
// make get-request on rood dir '/'
app.get('/', (req, res) => {
    res.send('Hello, Lenkjlkko');
});
app.get('/lesson_01/api/videos', (req, res) => {
    res.send(videos);
});
app.post('/lesson_01/api/videos', (req, res) => {
    // create array with type FieldErrorType
    const errors = [];
    if (!req.body.title) {
        errorCollect(errors, "title", "Type error: field is empty");
        /*        const error: FieldErrorType = {
                    field: "title",
                    message: "Type error: field is empty"
                }
                errors.push(error)*/
    }
    if (req.body.title.length > 40) {
        errorCollect(errors, "title", "Title should be less than 40 symbols");
    }
    // if title is not a string
    if (typeof req.body.title !== "string") {
        // create Error Object
        const error = {
            field: "title",
            message: "Type error: field is not string"
        };
        //push this error to array with errors
        errors.push(error);
    }
    // the same for author
    if (typeof req.body.author !== "string") {
        const error = {
            field: "author",
            message: "Type error: field is not string"
        };
        errors.push(error);
    }
    // if array is more than 0
    if (errors.length !== 0) {
        // create response object with special fields/attributes
        const responseObj = {
            data: {},
            errorMessages: errors,
            resultCode: 400
        };
        res.status(400).send(responseObj);
        //return
    }
    else {
        // create video object with special fields/attributes
        const video = {
            id: getLastId(videos) + 1,
            title: req.body.title,
            author: req.body.author
        };
        // push this video to the array with videos
        videos.push(video);
        res.status(201);
        res.send(video);
    }
});
app.get('/lesson_01/api/videos/:id', (req, res) => {
    const errors = [];
    if (!req.params.id) {
        //if ('/lesson_01/api/videos/'){
        const error = {
            field: "title",
            message: "Type error: you should specify the id"
        };
        errors.push(error);
    }
    if (errors.length !== 0) {
        // create response object with special fields/attributes
        const responseObj = {
            data: {},
            errorMessages: errors,
            resultCode: 400
        };
        res.status(400).send(responseObj);
    }
    else {
        const id = +req.params.id;
        const video = videos.find(v => v.id === id);
        res.status(200);
        res.send(video);
    }
});
app.put('/lesson_01/api/videos/:id', (req, res) => {
    // create array with type FieldErrorType
    const errors = [];
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (!req.body.title) {
        const error = {
            field: "title",
            message: "Type error: field is empty"
        };
        errors.push(error);
    }
    if (req.body.title.length > 40) {
        const error = {
            field: "title",
            message: "Title should be less than 40 symbols"
        };
        errors.push(error);
    }
    if (typeof req.body.title !== "string") {
        // create Error Object
        const error = {
            field: "title",
            message: "Type error: title is not string"
        };
        //push this error to array with errors
        errors.push(error);
    }
    if (errors.length !== 0) {
        // create response object with special fields/attributes
        const responseObj = {
            data: {},
            errorMessages: errors,
            resultCode: 400
        };
        res.status(400).send(responseObj);
        //return
    }
    if (!video) {
        const problemDetails = {
            type: "Problem Type",
            title: "There is no video with such Id in the array",
            status: 404,
            detail: "Put another video with the right id",
            instance: "some instance"
        };
        res.send(problemDetails);
    }
    else {
        video.title = req.body.title;
        res.send(204);
    }
});
app.delete('/lesson_01/api/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (!video) {
        const problemDetail = {
            type: "Problem Type",
            title: "There is no video with such Id in the array",
            status: 404,
            detail: "Put another video with the right id",
            instance: "some instance"
        };
        res.send(problemDetail);
    }
    else {
        videos = videos.filter(v => v.id !== id);
        res.send(204);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
function getLastId(db) {
    let lastIndex = 0;
    db.forEach(el => {
        if (el.id > lastIndex) {
            lastIndex = el.id;
        }
    });
    return lastIndex;
}
//# sourceMappingURL=index.js.map