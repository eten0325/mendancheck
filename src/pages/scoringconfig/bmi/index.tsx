import React from 'react';
import Layout from '../Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// BMIスコアリングの定数
const BMI_THRESHOLDS = {
  A: { max: 25, score: 1, color: 'bg-green-100' },
  B: { max: 30, score: 2, color: 'bg-yellow-100' },
  C: { max: 35, score: 4, color: 'bg-orange-100' },
  D: { max: Infinity, score: 8, color: 'bg-red-100' }
};

const BMIScoringRuleSetting = () => {
  return (
    <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-6">BMIスコアリングルール</h1>
            </div>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${BMI_THRESHOLDS.A.color}`}>
                <h2 className="font-semibold">評価A（1点）</h2>
                <p>BMI &lt; 25</p>
              </div>
              <div className={`p-4 rounded-lg ${BMI_THRESHOLDS.B.color}`}>
                <h2 className="font-semibold">評価B（2点）</h2>
                <p>25 ≦ BMI &lt; 30</p>
              </div>
              <div className={`p-4 rounded-lg ${BMI_THRESHOLDS.C.color}`}>
                <h2 className="font-semibold">評価C（4点）</h2>
                <p>30 ≦ BMI &lt; 35</p>
              </div>
              <div className={`p-4 rounded-lg ${BMI_THRESHOLDS.D.color}`}>
                <h2 className="font-semibold">評価D（8点）</h2>
                <p>35 ≦ BMI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BMIScoringRuleSetting.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default BMIScoringRuleSetting;
