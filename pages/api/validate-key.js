const jwt = require('jwt-simple');
const isReachable = require('is-reachable');
const unirest = require('unirest');
const cheerio = require('cheerio');
const DNS = require('../../lib/dns');
const secretKey = process.env.SECRET_KEY;

function hexToString (hex) {
  let string = '';
  for (let i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
}

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    if (!id) throw new Error('Invalid ID parameter');
    const decodeId = hexToString(id);
    if (!decodeId) {
      res.statusCode = 500;
      return res.json({
        statusCode: 500,
        error: 'Internal server error',
        message: 'Invalid ID'
      });
    }
    const [ domain, subDomain, targetDomain ] = decodeId.split(':');
    const isReach = await isReachable(targetDomain);
    if (!isReach) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad request',
        message: 'Your target domain is not raachable'
      });
    }
    const urlSite = `https://${targetDomain}`;

    try {
      const requestFile = await unirest.get(urlSite).headers({ "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"});
      if (requestFile.status === 200 || requestFile.raw_body) {
        const body = requestFile.raw_body;
        const $ = cheerio.load(body);
        const findMeta = $('meta[name="itsdev-verification"]', 0).attr('content');
        if (!findMeta || findMeta.length === 0) {
          throw new Error('Meta tag not found from your site!');
        }
        const content = findMeta;
        const decodeToken = jwt.decode(content.trim(), secretKey, false, 'HS256');
        if (!decodeToken) throw new Error('Invalid token');
        // is valid
        if (decodeToken.id === id) { 
          const dns = new DNS().getZone(domain);
          await dns.registerOrUpdate(subDomain, targetDomain);
          return res.status(200).json({
            statusCode: 200,
            message: 'Valid',
            data: {
              resultDomain: subDomain
            }
          });
        } else {
          throw new Error('ID not match');
        }
      } else {
        throw new Error('Validator file not found, please upload your file for validation!');
      }
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: error.message,
        detail: {
          url: urlSite,
          error_detail: error
        }
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: "Internal server error",
      message: error.message
    });
  }
}
