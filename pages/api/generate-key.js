const jwt = require('jwt-simple');
const secretKey = process.env.SECRET_KEY;

export default function handler(req, res) {
  const domain = req.query.domain;
  const sub = req.query.sub;
  const targetDomain = req.query.targetDomain;
  if (!domain || !sub || !targetDomain) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad request",
      message: 'Domain not allowed'
    });
  }
  const subDomain = `${sub}.${domain}`;
  const today = new Date();
  today.setHours(today.getHours() + 1);
  const expiry = parseInt(today / 1000, 10);
  const key = `${domain}:${subDomain}:${targetDomain}`;
  const keyToHex = Buffer.from(key).toString('hex');
  const payload = { id: keyToHex, exp: expiry };
  const token = jwt.encode(payload, secretKey);
  const metaValidation = `<meta name="itsdev-verification" content="${token}">`;
  return res.status(200).json({
    statusCode: 200,
    data: {
      id: keyToHex,
      fileName: `${subDomain}.html`,
      targetDomain,
      content: metaValidation
    }
  });
}
