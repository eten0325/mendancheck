import React from 'react';
import Layout from '@/components/Layout';

// 脂質スコアリングの定数
const LIPID_THRESHOLDS = {
  LDL: {
    A: { max: 120, score: 1, color: 'bg-green-100' },
    B: { max: 140, score: 2, color: 'bg-yellow-100' },
    C: { max: 180, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  },
  TG: {
    A: { max: 150, score: 1, color: 'bg-green-100' },
    B: { max: 300, score: 2, color: 'bg-yellow-100' },
    C: { max: 500, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  }
};

const ScoringConfigLipid = () => {
  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">脂質スコアリングルール</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* LDLコレステロール */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">LDLコレステロール</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.LDL.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>LDL &lt; 120</p>
                </div>
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.LDL.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>120 ≦ LDL &lt; 140</p>
                </div>
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.LDL.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>140 ≦ LDL &lt; 180</p>
                </div>
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.LDL.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>180 ≦ LDL</p>
                </div>
              </div>
            </div>

            {/* 中性脂肪 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">中性脂肪（TG）</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.TG.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>TG &lt; 150</p>
                </div>
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.TG.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>150 ≦ TG &lt; 300</p>
                </div>
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.TG.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>300 ≦ TG &lt; 500</p>
                </div>
                <div className={`p-4 rounded-lg ${LIPID_THRESHOLDS.TG.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>500 ≦ TG</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">評価方法</h2>
            <p className="text-gray-700">
              LDLコレステロールと中性脂肪（TG）のそれぞれで評価を行い、
              より高い（リスクが大きい）方の評価点を採用します。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfigLipid;