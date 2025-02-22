import React from 'react';
import Layout from '@/components/Layout';

// 血圧スコアリングの定数
const BP_THRESHOLDS = {
  SYSTOLIC: {
    A: { max: 130, score: 1, color: 'bg-green-100' },
    B: { max: 140, score: 2, color: 'bg-yellow-100' },
    C: { max: 160, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  },
  DIASTOLIC: {
    A: { max: 85, score: 1, color: 'bg-green-100' },
    B: { max: 90, score: 2, color: 'bg-yellow-100' },
    C: { max: 100, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  }
};

const ScoringConfigBP = () => {
  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">血圧スコアリングルール</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 収縮期血圧 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">収縮期血圧（sBP）</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.SYSTOLIC.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>sBP &lt; 130</p>
                </div>
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.SYSTOLIC.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>130 ≦ sBP &lt; 140</p>
                </div>
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.SYSTOLIC.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>140 ≦ sBP &lt; 160</p>
                </div>
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.SYSTOLIC.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>160 ≦ sBP</p>
                </div>
              </div>
            </div>

            {/* 拡張期血圧 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">拡張期血圧（dBP）</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.DIASTOLIC.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>dBP &lt; 85</p>
                </div>
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.DIASTOLIC.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>85 ≦ dBP &lt; 90</p>
                </div>
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.DIASTOLIC.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>90 ≦ dBP &lt; 100</p>
                </div>
                <div className={`p-4 rounded-lg ${BP_THRESHOLDS.DIASTOLIC.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>100 ≦ dBP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">評価方法</h2>
            <p className="text-gray-700">
              収縮期血圧（sBP）と拡張期血圧（dBP）のそれぞれで評価を行い、
              より高い（リスクが大きい）方の評価点を採用します。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfigBP;