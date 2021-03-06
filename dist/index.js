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
const port = process.env.PORT || 3003;
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
/*const errorsCollect = (errors: FieldErrorType[], field: string, message: string, variableCheckIsOutOfScope: string) => {
    const variableCheckIsOutOfScope
    const error: FieldErrorType = {
        field: field,
        message: message
    }
    errors.push(error)
}*/
const errorsCollect = (errors, field, message) => {
    const error = {
        field: field,
        message: message
    };
    errors.push(error);
};
const response = (res, errorsMessages, resultCode) => {
    const responseObj = {
        errorsMessages: errorsMessages,
        resultCode: resultCode
    };
    res.status(400).send(responseObj);
};
// make get-request on root dir '/'
app.get('/', (req, res) => {
    res.send('Hello, Lenkjlkko');
});
app.get('/videos', (req, res) => {
    res.status(200).send(videos);
});
app.post('/videos', (req, res) => {
    // create array with type FieldErrorType
    const errors = [];
    // ---------------------- Проверка тайтла -----------------------------------------------
    if (typeof req.body.title !== "string") {
        errorsCollect(errors, "title", "Error Type: Field is not string");
    }
    else {
        // если тайтл пустой + когда трим - если пустой и несколько пробелов, сжирает пробелы
        if (!req.body.title.trim()) {
            errorsCollect(errors, "title", "Error Type: Field is empty");
            /*        const error: FieldErrorType = {
                        field: "title",
                        message: "Type error: field is empty"
                    }
                    errors.push(error)*/
        }
        if (req.body.title.length > 40) {
            errorsCollect(errors, "title", "Error Type: Title should be less than 40 symbols");
        }
    }
    // ---------------------- Проверка автора --------------------------------------------------
    /*    // the same for author
        if (typeof req.body.author !== "string") {
            errorsCollect(errors, "author", "Error Type: Field is not string")
        } else {
            if (!req.body.author.trim()) {
                errorsCollect(errors, "author", "Error Type: Field is empty")
                /!*        const error: FieldErrorType = {
                            field: "title",
                            message: "Type error: field is empty"
                        }
                        errors.push(error)*!/
            }
            if (req.body.author.length > 40) {
                errorsCollect(errors, "author", "Error Type: Author should be less than 40 symbols")
            }
        }*/
    // ---------------------- Если есть ошибки, выдаем массив с ошибками -------------------------
    // if array is more than 0
    if (errors.length !== 0) {
        response(res, errors, 1);
        /*
        create response object with special fields/attributes
        const responseObj: APIResultType = {
                    data: {},
                    errorMessages: errors,
                    resultCode: 400
                }

                res.status(400).send(responseObj)
                */
        // ----------------------- Прошли все проверки -------------------------------------------------
    }
    else {
        // create video object with special fields/attributes
        const video = {
            id: getLastId(videos) + 1,
            title: req.body.title,
            author: "it-incubator.eu"
        };
        // push this video to the array with videos
        videos.push(video);
        res.status(201);
        res.send(video);
    }
});
app.get('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const video = videos.find(f => f.id === id);
    const errors = [];
    if (!req.params.id) {
        errorsCollect(errors, "id", "Error Type: You should specify the id");
    }
    if (!video) {
        res.send(404);
    }
    /* Кажется, так было бы правильней, но чтобы соответствовать сваггеру, сделала так :)
        if (!video) {
            errorsCollect(errors, "id", "Error Type: Given Id is out of id range")
        }
        if (errors.length !== 0) {
            response (res, errors, 404)
        }*/ else {
        res.status(200);
        res.send(video);
    }
});
app.put('/videos/:id', (req, res) => {
    // create array with type FieldErrorType
    const errors = [];
    const id = parseInt(req.params.id);
    const video = videos.find(v => v.id === id);
    if (!id) {
        errorsCollect(errors, "id", "Error Type: id is empty");
    }
    if (typeof req.body.title !== "string") {
        errorsCollect(errors, "title", "Error Type: title is not string");
    }
    else {
        if (!req.body.title.trim()) {
            errorsCollect(errors, "title", "Error Type: field is empty");
        }
        if (req.body.title.length > 40) {
            errorsCollect(errors, "title", "Error Type: title should be less than 40 symbols");
        }
    }
    if (errors.length !== 0) {
        response(res, errors, 1);
    }
    if (!video) {
        res.send(404);
    }
    else {
        const body = req.body;
        video.title = body.title;
        res.status(204).send();
    }
});
app.delete('/videos/:id', (req, res) => {
    const errors = [];
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (!id) {
        errorsCollect(errors, "id", "Type Error: You should specify the Id");
        response(res, errors, 400);
    }
    if (!video) {
        res.send(404);
        /*const problemDetail: ProblemDetailsType = {
            type: "Problem Type",
            title: "There is no video with such Id in the array",
            status: 404,
            detail: "Put another video with the right id",
            instance: "some instance"
        }
        res.send(problemDetail)*/
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
/*type ProblemDetailsType = {
    type: string
    title: string
    status: number
    detail: string
    instance: string
}*/
//# sourceMappingURL=index.js.map