# 健康診断結果評価システム

健康診断の結果（CSV）を取り込み、各項目（体重、血圧、血糖、脂質、肝機能）に対して定義されたスコアリングを実施し、IDごとの総スコアを算出するWebアプリケーションです。

## 機能

- CSVファイルアップロード
- 健康診断データのスコアリング処理
- 結果の可視化（グラフ表示）
- 上位抽出機能
- 検索・ソート機能

## 必要要件

- Node.js 18.0.0以上
- npm または yarn
- Supabase アカウント

## セットアップ手順

1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd [プロジェクトディレクトリ]
```

2. 依存パッケージのインストール
```bash
npm install
# または
yarn install
```

3. Supabaseプロジェクトの作成
- [Supabase](https://supabase.com) にアクセスし、新規プロジェクトを作成
- プロジェクトの設定から以下の情報を取得：
  - Project URL
  - Project API Key (anon public)

4. 環境変数の設定
プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を設定：
```
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase Project API Key
```

5. データベースの初期化
Supabaseのダッシュボードで以下のSQLを実行：
```sql
create table public.health_check_results (
  id text primary key,
  user_id text not null,
  total_score integer not null,
  bmi numeric not null,
  bmi_evaluation text not null,
  systolic_blood_pressure integer not null,
  diastolic_blood_pressure integer not null,
  bp_evaluation text not null,
  blood_sugar numeric not null,
  hba1c numeric not null,
  glucose_evaluation text not null,
  ldl_cholesterol numeric not null,
  tg numeric not null,
  lipid_evaluation text not null,
  ast numeric not null,
  alt numeric not null,
  gamma_gtp numeric not null,
  liver_evaluation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシーの設定
alter table public.health_check_results enable row level security;

create policy "Enable read access for all users"
  on public.health_check_results for select
  using (true);

create policy "Enable insert access for all users"
  on public.health_check_results for insert
  with check (true);

create policy "Enable update access for all users"
  on public.health_check_results for update
  using (true)
  with check (true);
```

6. アプリケーションの起動（開発環境）
```bash
npm run dev
# または
yarn dev
```

7. 本番環境へのデプロイ
Vercelを使用してデプロイする場合：
- [Vercel](https://vercel.com) にアカウントを作成
- GitHubリポジトリと連携
- 環境変数（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）を設定
- デプロイを実行

## 使用方法

1. CSVファイルの準備
以下のカラムを含むCSVファイルを用意：
- ID
- BMI
- sBP（収縮期血圧）
- dBP（拡張期血圧）
- BS（血糖値）
- HbA1c
- LDL
- TG
- AST
- ALT
- γGTP

2. ファイルのアップロード
- アプリケーションにアクセス
- 「ファイルを選択」ボタンをクリックまたはドラッグ＆ドロップでCSVファイルをアップロード
- 「アップロード」ボタンをクリック

3. 結果の確認
- スコア分布のグラフを確認
- 上位抽出結果を確認
- 全結果一覧で詳細を確認
  - ユーザーIDで検索可能
  - スコアでソート可能
  - 各項目の評価結果を色分けで表示

## スコアリング基準

### BMI
- A: BMI < 25 → 1点
- B: 25 ≦ BMI < 30 → 2点
- C: 30 ≦ BMI < 35 → 4点
- D: 35 ≦ BMI → 8点

### 血圧
収縮期血圧（sBP）：
- A: sBP < 130 → 1点
- B: 130 ≦ sBP < 140 → 2点
- C: 140 ≦ sBP < 160 → 4点
- D: 160 ≦ sBP → 8点

拡張期血圧（dBP）：
- A: dBP < 85 → 1点
- B: 85 ≦ dBP < 90 → 2点
- C: 90 ≦ dBP < 100 → 4点
- D: 100 ≦ dBP → 8点

※ sBPとdBPのうち、より高いリスクの評価を採用

### 血糖
血糖値（BS）：
- A: BS < 100 → 1点
- B: 100 ≦ BS < 110 → 2点
- C: 110 ≦ BS < 126 → 4点
- D: 126 ≦ BS → 8点

HbA1c：
- A: HbA1c < 5.5 → 1点
- B: 5.5 ≦ HbA1c < 6.0 → 2点
- C: 6.0 ≦ HbA1c < 6.4 → 4点
- D: 6.5 ≦ HbA1c → 8点

※ BSとHbA1cのうち、より高いリスクの評価を採用

### 脂質
LDL：
- A: LDL < 120 → 1点
- B: 120 ≦ LDL < 140 → 2点
- C: 140 ≦ LDL < 180 → 4点
- D: 180 ≦ LDL → 8点

TG：
- A: TG < 150 → 1点
- B: 150 ≦ TG < 300 → 2点
- C: 300 ≦ TG < 500 → 4点
- D: 500 ≦ TG → 8点

※ LDLとTGのうち、より高いリスクの評価を採用

### 肝機能
AST：
- A: AST < 31 → 1点
- B: 31 ≦ AST < 35 → 2点
- C: 35 ≦ AST < 50 → 4点
- D: 50 ≦ AST → 8点

ALT：
- A: ALT < 31 → 1点
- B: 31 ≦ ALT < 40 → 2点
- C: 40 ≦ ALT < 50 → 4点
- D: 50 ≦ ALT → 8点

γGTP：
- A: γGTP < 51 → 1点
- B: 51 ≦ γGTP < 80 → 2点
- C: 80 ≦ γGTP < 100 → 4点
- D: 100 ≦ γGTP → 8点

※ AST、ALT、γGTPのうち、最も高いリスクの評価を採用

## ライセンス

MIT License
