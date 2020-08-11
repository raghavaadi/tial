const router = require('express').Router()
const request = require('request')
const auth = require('../middleware/auth')
router.post('/', auth, (req, res, callback) => {
    let uszip = false
    let indzip = false
    let zip = req.body.zipcode.toString()
    let zipsize = zip.split('')
    let url
    if (zipsize.length === 5) {
        uszip = true
        url = `https://www.zip-codes.com/zip-code/${req.body.zipcode}/zip-code-${req.body.zipcode}.asp`
    }
    else if (zipsize.length === 6) {
        indzip = true
        url = `http://www.getpincodes.com/pincode/${req.body.zipcode}`
    } else {
        res.send({ 'msg': 'Sorry we currently donot support this Region' })
    }
    let latitude = 0
    let longitude = 0
    try{
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            res.status(500).send({ 'msg': 'some error' })
        } else if (body.error) {
            res.status(500).send({ 'msg': 'some error' })
        } else {
            if (uszip === true) {
                var myRe = /<title>(.+?)<\/title>/;
                var myReg = /<span class="Tips2" title="Latitude :(.+?)<\/tr>/;
                var myRege = /<span class="Tips2" title="Longitude :(.+?)<\/tr>/;
                var cleanse = /<td class="info">(.+?)<\/td>/;
                var myArray = myRe.exec(body);
                var latarray = myReg.exec(body);
                var lonarray = myRege.exec(body)
                try {
                    longitude = cleanse.exec(lonarray[1])
                    latitude = cleanse.exec(latarray[1])
                }
                catch (e) {
                    res.status(404).send({ 'msg': 'Kindly check the pincode' })
                }
                let val = myArray[1].split(',')
                let ans = val[0].split(' ')
                let final = {
                    'zipcode': ans[2],
                    'address': myArray[1],
                    'latitude': latitude[1],
                    'longitude': longitude[1]
                }
                res.send(final)
            }
            else if (indzip === true) {
                var myRes = /<title>(.+?)<\/title>/g;
                var myArrays = myRes.exec(body);
                let o = myArrays[1]
                let s = o.split(',')
                let district = s[2].split(' ')
                let city = s[3].split(' ')
                let address = district[district.length - 1] + ', ' + city[city.length - 1] + ', ' + req.body.zipcode
                try {
                    let indurl = `https://indiamapia.com/${city[city.length - 1]}/${district[district.length - 1]}.html`
                    var options = {
                        'method': 'POST',
                        'url': indurl,
                        'headers': {
                        }
                    };
                    request(options, function (error, response) {
                        if (error) throw new Error(error);
                        else {
                            let indbody = response.body.toString().replace(/ /g, '')
                            var indLatRegex = /https:\/\/maps.google.it\/maps\?q=(.+?)>/g;
                            var latitudeInd = indLatRegex.exec(indbody)
                            try {
                                let latlon = latitudeInd[1].split(',')
                                let lon = latlon[1].split('&')
                                let finals = {
                                    'zipcode': req.body.zipcode,
                                    'address': address,
                                    'latitude': latlon[0] ? latlon[0] : 'unavailable',
                                    'longitude': lon[0] ? lon[0] : 'unavailable'
                                }
                                res.send(finals)
                            }
                            catch (e) {
                                res.status(404).send({ 'msg': 'Kindly check the pincode || url down' })
                            }
                        }
                    })
                } catch (e) {
                    console.log(e + 'error scrapping')
                }
            }
        }
    })
}
catch(e){
    console.log(e)
}
})
module.exports = router;