#!/usr/bin/env node
const fs = require('fs');
const inputFile = process.argv[2];
const outPutDir = process.argv[3];
const inFile = require(`${process.cwd()}${inputFile}`);

console.log('\n',inputFile, outPutDir, '\n');

if(Object.keys(process.argv).length !== 4){
    return console.error('\nERROR: Please enter the following format:\n> node expressify <relative path to input file> <relative path to output file>');
}

const arrFile = Object.keys(inFile).map(route => `\trouter.use('/${route.toLowerCase()}', require('./${route.toLowerCase()}'));\n`).join('');

const indexMaker = (file) => {
    const ret =
    `//Created using Expressify for Sequelize

const router = require('express').Router();

${file}
router.use((req, res, next) => {
    const err = new Error('API route not found!');
    err.status = 404;
    next(err);
});
module.exports = router;
`;
    return ret;
};

const fileMaker = (str, fileName) => {
    const path = process.cwd();
    fs.writeFile(`${path}${outPutDir}${fileName}.js`, `${str}`, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log(`The ${fileName} route was saved!`);
    });
};



const getPostCreator = (route) => {
    const ret =
    `//Created using Expressify for Sequalize

const router = require('express').Router();
const {${route}} = require('../db/models');

router.get('/', async function(req, res, next){
    try {
        const response = await ${route}.findAll({
        include: [{all: true}]
    });
    res.send(response);
    } catch(error) {
        next(error);
    }
});

router.post('/', async function(req, res, next){
    try {
        const response = await ${route}.create(req.body);
        res.status(201);
        res.send(response);
    } catch(error) {
        next(error);
    }
});

router.get('/:id', async function(req, res, next){
    try {
        const response = await ${route}.findOne({
        where: {id: req.params.id},
        include: [{all: true}]
    });
    res.send(response);
    } catch(error) {
        next(error);
    }
});

router.delete('/:id', async function(req, res, next){
    try {
        const response = await ${route}.findById(req.params.id);
        !response && res.sendStatus(404);
        if(!response){
            res.sendStatus(404);
        }
        else {
            response.destroy();
            res.send(response);
        }
    } catch(error) {
        next(error);
    }
});

router.put('/:id', async function(req, res, next){
    try {
        console.log(req.body);
        const studentToUpdated = await ${route}.findOne({
            where: {
                id: req.params.id
            },
            include: [{all:true}]
        })
        studentToUpdated.update(req.body);
        res.send(studentToUpdated);
    } catch (error) {
        next(error);
    }
});


module.exports = router;`;
    return ret;
};

const routesMaker = (File) => {
    Object.keys(File).map(route => fileMaker(getPostCreator(route), `${route}`));
};

fileMaker(indexMaker(arrFile), 'index');
routesMaker(inFile);

