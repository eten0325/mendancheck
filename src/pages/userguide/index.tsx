import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaQuestionCircle } from 'react-icons/fa';

const UserGuide = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Head>
        <title>操作ガイド</title>
      </Head>

      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            健康診断評価システム
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500">
                  <FaHome className="inline-block mr-1" />
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/userguide" className="hover:text-blue-500">
                  <FaQuestionCircle className="inline-block mr-1" />
                  操作ガイド
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold mb-4">操作ガイド</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">概要</h2>
          <p className="text-gray-700 leading-relaxed">
            本システムは、健康診断結果の効率的な評価・分析を支援するWebアプリケーションです。CSVファイルによるデータ一括取込、自動スコアリング、リスクの高い対象者の抽出など、様々な機能を提供します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">主要機能</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>CSVファイルによる健康診断データの一括取込</li>
            <li>定義されたルールに基づく自動スコアリング処理</li>
            <li>BMI、血圧、血糖値、脂質、肝機能等の各項目の評価</li>
            <li>評価結果のA～Dランク付けと色分け表示</li>
            <li>総スコアの算出と分布のグラフ表示</li>
            <li>リスクの高い対象者の上位抽出機能</li>
            <li>評価結果のCSV/PDFダウンロード</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">操作手順</h2>
          <ol className="list-decimal list-inside text-gray-700 leading-relaxed">
            <li><Link href="/login" className="text-blue-500 hover:underline">ログイン画面</Link>からログインしてください。</li>
            <li>メインメニューから必要な機能を選択してください。</li>
            <li>各機能の画面で指示に従い操作を行ってください。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">お問い合わせ</h2>
          <p className="text-gray-700 leading-relaxed">
            ご不明な点がございましたら、システム管理者までお問い合わせください。
          </p>
        </section>
      </div>

      <footer className="bg-gray-200 py-4 text-center">
        <p className="text-gray-600">© 2025 健康診断評価システム</p>
      </footer>
    </div>
  );
};

export default UserGuide;
