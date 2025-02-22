import React from 'react';
import Layout from '@/components/Layout';

// 血糖値スコアリングの定数
const GLUCOSE_THRESHOLDS = {
  BS: {
    A: { max: 100, score: 1, color: 'bg-green-100' },
    B: { max: 110, score: 2, color: 'bg-yellow-100' },
    C: { max: 126, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  },
  HBA1C: {
    A: { max: 5.5, score: 1, color: 'bg-green-100' },
    B: { max: 6.0, score: 2, color: 'bg-yellow-100' },
    C: { max: 6.4, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  }
};

const ScoringConfigGlucose = () => {
  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">血糖値スコアリングルール</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 血糖値 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">血糖値（BS）</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.BS.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>BS &lt; 100</p>
                </div>
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.BS.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>100 ≦ BS &lt; 110</p>
                </div>
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.BS.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>110 ≦ BS &lt; 126</p>
                </div>
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.BS.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>126 ≦ BS</p>
                </div>
              </div>
            </div>

            {/* HbA1c */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">HbA1c</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.HBA1C.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>HbA1c &lt; 5.5</p>
                </div>
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.HBA1C.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>5.5 ≦ HbA1c &lt; 6.0</p>
                </div>
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.HBA1C.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>6.0 ≦ HbA1c &lt; 6.4</p>
                </div>
                <div className={`p-4 rounded-lg ${GLUCOSE_THRESHOLDS.HBA1C.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>6.5 ≦ HbA1c</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">評価方法</h2>
            <p className="text-gray-700">
              血糖値（BS）とHbA1cのそれぞれで評価を行い、
              より高い（リスクが大きい）方の評価点を採用します。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfigGlucose;
