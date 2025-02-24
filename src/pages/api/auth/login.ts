import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ message: 'ユーザIDとパスワードを入力してください' });
  }

  try {
    // ユーザをデータベースから検索
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user_id)
      .limit(1);

    if (userError) {
      console.error('Supabaseエラー:', userError);
      return res.status(500).json({ message: 'ユーザ情報の取得に失敗しました' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'ユーザIDまたはパスワードが正しくありません' });
    }

    const user = users[0];

    // パスワードを検証（実際にはハッシュ化されたパスワードを比較する必要があります）
    // ここでは単純な比較を実装しています。bcryptなどのライブラリを使用することを推奨します。
    if (user.password !== password) {   //この部分は、実際にはハッシュ化されたパスワード比較を行う必要があります。
      return res.status(401).json({ message: 'ユーザIDまたはパスワードが正しくありません' });
    }

    // 認証成功
    // JWTを生成するなどの処理をここに追加できます
    const token = 'mockedToken'; // Replace with actual token generation logic

    //成功したログの記録
    const logMessage = `ユーザ ${user_id} が正常にログインしました。`;
    await supabase.from('logs').insert([{ timestamp: new Date(), log_level: 'INFO', message: logMessage }]);

    return res.status(200).json({ token, message: 'ログインに成功しました' });

  } catch (error: any) {
    console.error('サーバーエラー:', error);

    // エラーログの記録
    const logMessage = `ログイン処理中にエラーが発生しました: ${error.message}`;
    await supabase.from('logs').insert([{ timestamp: new Date(), log_level: 'ERROR', message: logMessage }]);

    return res.status(500).json({ message: 'ログイン処理中にエラーが発生しました' });
  }
}
