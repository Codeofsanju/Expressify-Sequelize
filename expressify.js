// process.argv.map((arg, index) => console.log(index, ' ' ,arg));
const fs = require('fs');

const inputFile = process.argv[2];
const outPutDir = process.argv[3];


let inFile = require(`${inputFile}`);

const arrFile = Object.keys(inFile).map(route => `router.use('/${route.toLowerCase()}', require('./${route.toLowerCase()}'));\n\t`).join('');
if(Object.keys(process.argv).length !== 4){
    return console.error('\nERROR: Please enter the following format:\n> node expressify <relative path to input file> <relative path to output file>');
}

const fileMaker = (str, fileName) => {
    const path = process.cwd();
    fs.writeFile(`${path}/db/api/${fileName}.js`, `${str}`, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log(`The ${fileName} route was saved!`);
    }); 
};

const indexMaker = (file) => {
    const ret = 
    `//Created using Expressify for Sequelize
    const router = require('express').Router();
    
\t${file}

    router.use((req, res, next) => {
\t\tconst err = new Error('API route not found!');
\t\terr.status = 404;
\t\tnext(err);
    });
    
    module.exports = router;
    `;
    return ret;
};


const getPostCreator = (route) => {
    const ret = 
    `//Created using Expressify for Sequalize
const router = require('express').Router();
const ${route} = require('../db');

router.get('/', async function(req, res, next){
\ttry {
    const response = await ${route}.findAll({
        include: [{all: true}]
    });
    res.send(response);
\t} catch(error) {
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

module.exports = router;`;
    return ret;
};

const routesMaker = (File) => {
    Object.keys(File).map(route => fileMaker(getPostCreator(route), `${route}`));
};




console.log(fileMaker(indexMaker(arrFile), 'index'));
routesMaker(inFile);





// const outFileIndex = 
// `//Created using Expressify for Sequelize
// const router = require('express').Router()\n

// ${inFile}

// router.use((req, res, next) => {\n
//   const err = new Error('API route not found!')\n
//   err.status = 404\n
//   next(err)\n
// })\n

// module.exports = router\n
// `;

// const outFileCampus =;
// const router = require('express').Router()
// const {Campus} = require('../db');

// router.post('/', async function (req, res, next){
//     try {
//         const exists = await Campus.findOne({
//             where: {id: req.body.id}
//         })
//         if (!exists){
//             const newCampus = await Campus.create(req.body);
//             res.status(201);
//             res.send(newCampus);
//         } else {
//             res.sendStatus(303);
//         }
//     } catch (error) {
//         next(error);
//     }
// });



// console.log(outFileIndex);
