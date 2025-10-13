import pool from '../dbHelper/db.js';
import { uploadFile } from '../middleware/fileUpload.js';

const uploadDocument = uploadFile('documents').single('document');

// === API CONTROLLERS ===
export async function addDocument(req, res) {
  uploadDocument(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, description } = req.body;
      const fileUrl = req.file.location;

      const query = `
        INSERT INTO documents (title, description, s3_url, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
      `;
      const values = [title, description, fileUrl];
      const result = await pool.query(query, values);

      res.status(201).json({
        message: 'Document uploaded successfully',
        document: result.rows[0],
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  });
}

export async function getAllDocuments(req, res) {
  try {
    const query = 'SELECT * FROM documents ORDER BY created_at DESC;';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getDocument(req, res) {
  try {
    const { documentId } = req.params;
    const query = 'SELECT * FROM documents WHERE id = $1;';
    const result = await pool.query(query, [documentId]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}

// === WEB VIEW CONTROLLER ===
export async function renderHomePage(req, res) {
  try {
    const query = 'SELECT * FROM documents ORDER BY created_at DESC;';
    const result = await pool.query(query);

    // Always send an array, even if empty
    res.render('index', { documents: result.rows || [] });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.render('index', { documents: [] });
  }
}
