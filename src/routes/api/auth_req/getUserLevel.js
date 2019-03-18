export function get(req,res,next) {
  res.json({'type':req.user.type}).end();
}
