import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';

const GraphScreen = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();
  const [graphData, setGraphData] = useState<any>({
    totalScoreDistribution: [],
    itemScores: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      // Replace with your actual API endpoint
      // const { data, error } = await supabase.from('health_check_results').select('*');
      // if (error) {
      //   console.error('Error fetching graph data:', error);
      //   // Fallback to sample data in case of error
      //   setGraphData({
      //     totalScoreDistribution: [10, 20, 30, 40, 50],
      //     itemScores: { bmi: 70, bloodPressure: 80, bloodSugar: 90 },
      //   });
      //   setLoading(false);
      //   return;
      // }

      // Process the fetched data to prepare it for the graph
      // const processedData = processData(data);
      // setGraphData(processedData);

      // Sample data for demonstration
      setGraphData({
        totalScoreDistribution: [10, 20, 30, 40, 50],
        itemScores: { bmi: 70, bloodPressure: 80, bloodSugar: 90 },
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
      // Fallback to sample data in case of error
      setGraphData({
        totalScoreDistribution: [10, 20, 30, 40, 50],
        itemScores: { bmi: 70, bloodPressure: 80, bloodSugar: 90 },
      });
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for data processing function
  const processData = (data: any) => {
    // Implement your data processing logic here
    return data;
  };

  const handleSettingsClick = () => {
    alert('設定画面へ遷移');
  };

  if (!session) {
    return (
      <div className="min-h-screen h-full flex justify-center items-center">
        <h1>ログインしてください</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">グラフ表示画面</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div data-testid="graph-component">
              <h2 className="text-xl font-semibold mb-2">総スコア分布</h2>
              <GraphPlaceholder />
              <p className="text-center">[ {graphData.totalScoreDistribution.join(', ')} ]</p>

              <h2 className="text-xl font-semibold mt-4 mb-2">項目別スコア</h2>
              <GraphPlaceholder />
              <p className="text-center">BMI: {graphData.itemScores.bmi}, 血圧: {graphData.itemScores.bloodPressure}, 血糖値: {graphData.itemScores.bloodSugar}</p>
            </div>
          )}

          <button
            onClick={handleSettingsClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            設定画面へ
          </button>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Placeholder component for graph display
const GraphPlaceholder = () => (
  <img
    src="https://placehold.co/600x300?text=Graph+Placeholder"
    alt="Graph Placeholder"
    className="w-full h-auto border rounded shadow-md"
  />
);

export default GraphScreen;
