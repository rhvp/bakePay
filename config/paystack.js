const paystack = (request) => {

  const MyTestKey = process.env.Test_key;

  const initializePayment = (form, mycallback) => {
    const options = {
      url: 'https://api.paystack.co/transaction/initialize',
      headers : {
            authorization: MyTestKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        },
       form
    }

    const callback = (error, response, body)=>{
        return mycallback(error, body);
    }

    request.post(options, callback);
  }

  const verifyPayment = (ref, mycallback) => {
    const options = {
        url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
        headers : {
            authorization: MyTestKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
       }
    }
    const callback = (error, response, body)=>{
        return mycallback(error, body);
    }
    request(options,callback);
  }

  const createRecipent = (form, mycallback) => {
    const options = {
      url: 'https://api.paystack.co/transferrecipient',
      headers: {
        authorization: MyTestKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      form
    }
    const callback = (error, response, body) => {
      return mycallback(error, body);
    }
    request.post(options, callback);
  }


  const listBanks = (mycallback) => {
    const options = {
      url: 'https://api.paystack.co/bank',
      headers: {
        Authorization: MyTestKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
    const callback = (error, response, body) => {
      return mycallback(error, body);
    }
    request(options, callback);
  }


  const listVendors = (mycallback) => {
    const options = {
      url: 'https://api.paystack.co/transferrecipient',
      headers: {
        Authorization: MyTestKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
    const callback = (error, response, body) => {
      return mycallback(error, body);
    }
    request(options, callback);
  }

  const initiateTransfer =(form, mycallback) => {
    const options ={
      url: 'https://api.paystack.co/transfer',
      headers: {
        Authorization: MyTestKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      form
    }
    const callback = (error, response, body) => {
      return mycallback(error, body)
    }
    request.post(options, callback);
  }

  const fetchTransfer = (code, mycallback) => {
    const options = {
      url: 'https://api.paystack.co/transfer/'+encodeURIComponent(code),
      headers: {
        Authorization: MyTestKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
    const callback = (error, response, body) => {
      return mycallback(error, body);
    }
    request(options, callback);
  }




  return{createRecipent, listBanks, listVendors, initiateTransfer, fetchTransfer};
}

module.exports = paystack;
