const express = require('express');
const app = express.Router();
const ctrl = require('../controllers/mtController');
const auth = require('../middlewares/auth');
const isadmin = require('../middlewares/isadmin');
const ischecker = require('../middlewares/ischecker');
const ismaker = require('../middlewares/ismaker');
const ismakerorchecker = require('../middlewares/ismakerorchecker');
const isviewer = require('../middlewares/isview');


app.post('/addstaff',[auth,isadmin],ctrl.addstaff);//admin
app.get('/getstaff',auth,ctrl.getstaff);//all
// app.get('/verifytoken',auth);
app.get('/deletestaff/:id',[auth,isadmin],ctrl.deletestaff);//admin
app.post('/logshead',[auth,isadmin],ctrl.addlogshead);//admin
app.get('/getlogshead',[auth,isadmin],ctrl.getlogshead);//admin
app.get('/getchecker',[auth,ismaker],ctrl.getChecker);//maker
app.get('/getmaker',[auth,ischecker],ctrl.getMaker);//checker
app.post('/addmtswift',[auth,ismakerorchecker],ctrl.addmtswift);//maker,checker
app.get('/getmtswift',[auth,isviewer],ctrl.getmtswift);//trade,TI,Risk
app.post('/addmtlogs',[auth,ismakerorchecker],ctrl.addmtlogs);//maker,checker
app.get('/getmtswiftlogs/:id',[auth,isviewer],ctrl.getmtswiftlogs);//trade,TI,Risk
app.get('/getmtdatacbs/:rid',[auth,ismaker],ctrl.getmtdatacb);
app.post('/gettradedata/:tickid',[auth,ismaker],ctrl.gettradedata);
app.get('/getswiftcode',[auth,ismaker],ctrl.getcodeswift);
app.get('/getnostrocode/:rid',[auth,ismaker],ctrl.getnostrocode);
app.get('/getmmibcbs/:rid',[auth,ismaker],ctrl.getmmibcbs);
app.get('/getmibamount/:rid',[auth,ismaker],ctrl.getmibamount);
app.post('/searchmt',[auth,isviewer],ctrl.searchMT);//trade,TI,Risk
app.post('/addswiftlogs',[auth,ischecker],ctrl.addswiftlogs);
app.post('/revertswift',ctrl.revertswift);//santosh dai
app.post('/fileupload',ctrl.upload,ctrl.addfile);//santosh dai
app.post('/uploadfile',[auth,ismakerorchecker],ctrl.upload,ctrl.addfile);//done by checker
app.post('/sendtrade',[auth,ischecker],ctrl.sendTrade);
app.post('/sendmail',[auth,ischecker],ctrl.sendmail);
app.get('/getfile/:id',auth,ctrl.getfile);
app.get('/getswiftlogs/:id',[auth,isviewer],ctrl.getswiftlogs);//trade,TI,Risk
app.get('/getallmtswift/:id',[auth,ismakerorchecker],ctrl.getallmtswift);//maker,checker
app.get('/verifyadmin',[auth,isadmin],ctrl.verifyrole);
app.get('/verifymaker',[auth,ismaker],ctrl.verifyrole);
app.get('/verifychecker',[auth,ischecker],ctrl.verifyrole);
app.get('/verifyviewer',[auth,isviewer],ctrl.verifyrole);//viewer
app.get('/checktranid',[auth,ismaker],ctrl.checktranid);//maker
app.put('/updateticket/:id',[auth,ismaker],ctrl.updateticket);//maker
app.get('/deletemtswift/:id',[auth,ismaker],ctrl.deletemtswift);//admin

module.exports = app;