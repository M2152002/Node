const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');

require('dotenv').config();

exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
    const { amount, description, category } = req.body;

    if(amount == undefined || amount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    const expense = await Expense.create({ amount, description, category, userId: req.user.id}, { transaction: t });
        const totalExpense = Number(req.user.totalExpenses) + Number(amount)
        await User.update({ totalExpense: totalExpense }, 
            {
            where: {id: req.user.id},
            transaction: t
        })
            await t.commit();
            res.status(200).json({ expense: expense})
    }
    catch(err) {
        await t.rollback();
        return res.status(500).json({success : false, error: err})
    }
}

exports.getExpenses = async (req, res, next) => {
    Expense.findAll({ where : { userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

exports.deleteExpense = async (req, res, next) => {
    const expenseid = req.params.expenseid;
    if(expenseid == undefined || expenseid.length === 0){
        return res.status(400).json({success: false})
    }
    Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows) => {
        if(noofrows === 0){
            return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
        }
        return res.status(200).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    })
}

// exports.downloadExpenses =  async (req, res) => {

//     try {
//         if(!req.user.ispremiumuser){
//             return res.status(401).json({ success: false, message: 'User is not a premium User'})
//         }
//         const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
//         // Create the BlobServiceClient object which will be used to create a container client
//         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

//         // V.V.V.Imp - Guys Create a unique name for the container
//         // Name them your "mailidexpensetracker" as there are other people also using the same storage

//         const containerName = 'prasadyash549yahooexpensetracker'; //this needs to be unique name

//         console.log('\nCreating container...');
//         console.log('\t', containerName);

//         // Get a reference to a container
//         const containerClient = await blobServiceClient.getContainerClient(containerName);

//         //check whether the container already exists or not
//         if(!containerClient.exists()){
//             // Create the container if the container doesnt exist
//             const createContainerResponse = await containerClient.create({ access: 'container'});
//             console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
//         }
//         // Create a unique name for the blob
//         const blobName = 'expenses' + uuidv1() + '.txt';

//         // Get a block blob client
//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         console.log('\nUploading to Azure storage as blob:\n\t', blobName);

//         // Upload data to the blob as a string
//         const data =  JSON.stringify(await req.user.getExpenses());

//         const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//         console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

//         //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
//         const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
//         res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
//     } catch(err) {
//         res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
//     }

// };