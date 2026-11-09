import { authVerifier, createUserSupabase } from '../supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const { data, error } = await authVerifier.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Session is invalid or expired.' });
    }

    req.user = data.user;
    req.supabase = createUserSupabase(token);
    next();
  } catch (error) {
    next(error);
  }
}
