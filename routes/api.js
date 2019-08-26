const express = require('express');
const request = require('request');
const {createRecipent, listBanks, listVendors, initiateTransfer, fetchTransfer} = require('../config/paystack')(request);
const _ = require('lodash');

const router = express.Router();
const Vendor = require('../models/vendors');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/addVendor', (req, res) => {
  listBanks((error, body) => {
    if(error) {
      console.log(error);
      return res.redirect('/error');
    }
    response = JSON.parse(body);

    const data = response.data;
    res.render('newVendor', {banks: data});
  })
});


router.post('/paystack/addVen', (req, res) => {
  const form = _.pick(req.body, ['name','account_number', 'bank_code', 'description'])
  form.type = 'nuban';
  console.log(form);
  createRecipent(form,(error, body) => {
    if (error) {
      console.log(error);
      return res.redirect('/error');
    }
    response = JSON.parse(body);
    res.redirect('/listVendors');
  })
});

router.get('/listVendors', (req, res) => {
  listVendors((error, body) => {
    if (error) {
      console.log(error);
      return res.redirect('/error');
    }
    response = JSON.parse(body)
    const data = response.data

    res.render('listVendor', {vendors: data});
  });
});

router.post('/paystack/payVendor', (req, res) => {
  const form = _.pick(req.body, ['amount', 'reason', 'recipient']);
  form.amount *= 100;
  form.source = 'balance';
  console.log(form);
  initiateTransfer(form, (error, body) => {
    if (error) {
      console.log(error)
      return res.redirect('/error');
    }
      response = JSON.parse(body)
      const data = response.data

      if (response.status) {
        res.redirect('/verifyTransfer?trans_code='+data.transfer_code)
      } else {
        res.redirect('/message?res='+response.message)
      }

  });
});

router.get('/message', (req, res) => {
  const data = {
    message: req.query.res
  }
  res.render('message', {data: data});
})

router.get('/verifyTransfer', (req, res) => {
  const code = req.query.trans_code;
  fetchTransfer(code, (error, body) => {
    if (error) {
      console.log(error);
      return res.redirect('/error');
    }
    response = JSON.parse(body);
    res.render('transSuccess')
  })

})

module.exports = router
