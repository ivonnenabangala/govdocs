import express from 'express';
import { addDocument, getAllDocuments, getDocument } from '../controllers/documents.js';

const router = express.Router();

router.post('/documents', addDocument);
router.get('/', getAllDocuments);
router.get('/documents/:documentId', getDocument);

export default router;
