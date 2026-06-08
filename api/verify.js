export default function handler(req, res) {
  // 1. Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  
  // 2. Fetch valid codes from the Vercel Environment Variable we just created
  const validCodesString = process.env.VALID_ACCESS_CODES || "";
  
  // 3. Clean up the string (split by comma and trim accidental spaces)
  const validCodes = validCodesString.split(',').map(c => c.trim());

  // 4. Check if the user's code matches our secure list
  if (code && validCodes.includes(code.trim())) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid access key.' });
  }
}