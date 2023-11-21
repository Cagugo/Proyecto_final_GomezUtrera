const { ObjectId } = require('mongodb');

exports.validateCartId = (req, res, next, cid) => {
  if (!ObjectId.isValid(cid)) {
    return res.status(400).json({ error: 'Invalid cart ID format. Must be an id in the MongoDB format' });
  }
  req.cartId = cid;
  next();
};
exports.validateProductId = (req, res, next, pid) => {
  if (!ObjectId.isValid(pid)) {
    return res.status(400).json({ error: 'Invalid product ID format. Must be an id in the MongoDB format' });
  }
  req.productId = pid;
  next();
};
exports.validateMessageId = (req, res, next, mid) => {
  if (!ObjectId.isValid(mid)) {
    return res.status(400).json({ error: 'Invalid message ID format. Must be an id in the MongoDB format' });
  }
  req.messageId = mid;
  next();
};
exports.validateUserId = (req, res, next, uid) => {
  if (!ObjectId.isValid(uid)) {
    return res.status(400).json({ error: 'Invalid user ID format. Must be an id in the MongoDB format' });
  }
  req.userId = uid;
  next();
};
exports.validateTicketId = (req, res, next, tid) => {
  if (!ObjectId.isValid(tid)) {
    return res.status(400).json({ error: 'Invalid ticket ID format. Must be an id in MongoDB format' });
  }
  req.ticketId = tid;
  next();
};
exports.validateDocumentId = (req, res, next, did) => {
  if (!ObjectId.isValid(did)) {
    return res.status(400).json({ error: 'Invalid document ID format. Must be an id in MongoDB format' });
  }
  req.documentId = did;
  next();
};
