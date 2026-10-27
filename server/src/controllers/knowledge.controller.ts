import { Request, Response, NextFunction } from 'express';
import { listDocuments, addDocument, removeDocument, search } from '../rag/store.js';

export class KnowledgeController {
  static async listDocuments(_req: Request, res: Response, next: NextFunction) {
    try {
      const docs = listDocuments();
      res.status(200).json(docs);
    } catch (error) {
      next(error);
    }
  }

  static async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, text, question, answer } = req.body;
      const docName = name || (question ? `FAQ: ${question.slice(0, 30)}...` : 'Document');
      const docText = text || (question && answer ? `Q: ${question}\nA: ${answer}` : '');

      if (!docText.trim()) {
        res.status(400).json({ success: false, message: 'Document content is required' });
        return;
      }

      const doc = await addDocument(docName, docText);
      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const success = removeDocument(id);
      res.status(200).json({ ok: success });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = String(req.query.q || '');
      const results = await search(query);
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
}
