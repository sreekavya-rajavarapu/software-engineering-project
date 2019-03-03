export function get(req,res,next) {
  res.json({'level':req.user.id}).end();
}
