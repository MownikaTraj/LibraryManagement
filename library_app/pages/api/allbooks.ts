import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    try {
      const response = await axios.get('http://127.0.0.1:5000/books');
      const data = response.data;

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else if (method === 'PUT') {
    const bookId = query.bookId;
    const bookData = req.body;

    try {
      const response = await axios.put(`http://127.0.0.1:5000/books/${bookId}`, bookData);
      const updatedBook = response.data;

      res.status(200).json(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'Error updating book' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
