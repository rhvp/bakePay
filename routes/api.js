const express = require('express');
const request = require('request');
const {createRecipent, listBanks, listVendors, initiateTransfer, finalizeTransfer, fetchTransfer} = require('../config/paystack')(request);
const _ = require('lodash');

const router = express.Router();
const Vendor = require('../models/vendors');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/paystack/pay', (req, res) => {
  const form = _.pick(req.body, ['amount', 'email', 'full_name']);
  form.metadata = {
    full_name: form.full_name
  }
  form.amount *= 100;

  initializePayment(form, (error, body) => {
    if (error) {
      console.log(error);
      return;
    }
    response = JSON.parse(body);

    console.log(response);

    res.redirect(response.data.authorization_url);
  })
});

router.get('/paystack/callback', (req, res) => {
  const ref = req.query.reference;
  verifyPayment(ref, (error,body) => {
    if(error) {
      console.log(error);
      return res.redirect('/error');
    }

    response = JSON.parse(body);

    console.log(response)

    const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.full_name']);
    [reference, amount, email, full_name] = data;
        newVendor = {reference, amount, email, full_name}
        const vendor = new Vendor(newVendor);
        vendor.save().then((donor) => {
          if(donor){
            res.redirect('/receipt/'+donor._id);
          }
        }).catch((e) => {
          res.redirect('/error');
        });
  });
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
      console.log(response);
      const data = response.data

      if (response.status) {
        res.redirect('/verifyTransfer?trans_code='+data.transfer_code)
      } else {
        console.log(response.message);
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
    console.log(response);
    res.render('transSuccess')
  })

})


// router.post('/paystack/finalizeTransfer', (req, res) => {
//   const form = _.pick(req.body, ['transfer_code', 'otp'])
//   console.log(form);
// })

module.exports = router
