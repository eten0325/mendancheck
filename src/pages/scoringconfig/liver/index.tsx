import React from 'react';
import Layout from '@/components/Layout';

// 肝機能スコアリングの定数
const LIVER_THRESHOLDS = {
  AST: {
    A: { max: 31, score: 1, color: 'bg-green-100' },
    B: { max: 35, score: 2, color: 'bg-yellow-100' },
    C: { max: 50, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  },
  ALT: {
    A: { max: 31, score: 1, color: 'bg-green-100' },
    B: { max: 40, score: 2, color: 'bg-yellow-100' },
    C: { max: 50, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  },
  GTP: {
    A: { max: 51, score: 1, color: 'bg-green-100' },
    B: { max: 80, score: 2, color: 'bg-yellow-100' },
    C: { max: 100, score: 4, color: 'bg-orange-100' },
    D: { max: Infinity, score: 8, color: 'bg-red-100' }
  }
};

const ScoringConfigLiver = () => {
  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">肝機能スコアリングルール</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* AST */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">AST</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.AST.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>AST &lt; 31</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.AST.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>31 ≦ AST &lt; 35</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.AST.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>35 ≦ AST &lt; 50</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.AST.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>50 ≦ AST</p>
                </div>
              </div>
            </div>

            {/* ALT */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">ALT</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.ALT.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>ALT &lt; 31</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.ALT.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>31 ≦ ALT &lt; 40</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.ALT.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>40 ≦ ALT &lt; 50</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.ALT.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>50 ≦ ALT</p>
                </div>
              </div>
            </div>

            {/* γ-GTP */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">γ-GTP</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.GTP.A.color}`}>
                  <h3 className="font-semibold">評価A（1点）</h3>
                  <p>γ-GTP &lt; 51</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.GTP.B.color}`}>
                  <h3 className="font-semibold">評価B（2点）</h3>
                  <p>51 ≦ γ-GTP &lt; 80</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.GTP.C.color}`}>
                  <h3 className="font-semibold">評価C（4点）</h3>
                  <p>80 ≦ γ-GTP &lt; 100</p>
                </div>
                <div className={`p-4 rounded-lg ${LIVER_THRESHOLDS.GTP.D.color}`}>
                  <h3 className="font-semibold">評価D（8点）</h3>
                  <p>100 ≦ γ-GTP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">評価方法</h2>
            <p className="text-gray-700">
              AST、ALT、γ-GTPのそれぞれで評価を行い、
              最も高い（リスクが大きい）評価点を採用します。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfigLiver;