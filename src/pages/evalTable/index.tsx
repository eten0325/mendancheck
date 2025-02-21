import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { Layout } from './Layout';
import { Header } from './Header';

const EvalTable = () => {
  const [healthCheckResults, setHealthCheckResults] = useState<any[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState<string>('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchHealthCheckResults = async () => {
      try {
        const { data, error } = await supabase
          .from('health_check_results')
          .select(
            'id, bmi, systolic_blood_pressure, diastolic_blood_pressure, blood_sugar, hba1c, ldl_cholesterol, tg, ast, alt, gamma_gtp, bmi_evaluation, blood_pressure_evaluation, blood_sugar_evaluation, lipid_evaluation, liver_function_evaluation, total_score'
          );

        if (error) {
          console.error('Error fetching health check results:', error);
          // Display sample data in case of an error
          setHealthCheckResults([
            {
              id: 'sample-1',
              bmi: 22.5,
              systolic_blood_pressure: 120,
              diastolic_blood_pressure: 80,
              blood_sugar: 90,
              hba1c: 5.5,
              ldl_cholesterol: 120,
              tg: 150,
              ast: 20,
              alt: 25,
              gamma_gtp: 30,
              bmi_evaluation: 'A',
              blood_pressure_evaluation: 'B',
              blood_sugar_evaluation: 'A',
              lipid_evaluation: 'B',
              liver_function_evaluation: 'A',
              total_score: 85
            },
            {
              id: 'sample-2',
              bmi: 28.0,
              systolic_blood_pressure: 140,
              diastolic_blood_pressure: 90,
              blood_sugar: 110,
              hba1c: 6.2,
              ldl_cholesterol: 140,
              tg: 180,
              ast: 30,
              alt: 35,
              gamma_gtp: 40,
              bmi_evaluation: 'C',
              blood_pressure_evaluation: 'D',
              blood_sugar_evaluation: 'C',
              lipid_evaluation: 'D',
              liver_function_evaluation: 'C',
              total_score: 60
            }
          ]);
        } else {
          setHealthCheckResults(data || []);
        }
      } catch (error: any) {
        console.error('Unexpected error:', error.message);
        setHealthCheckResults([
          {
            id: 'sample-1',
            bmi: 22.5,
            systolic_blood_pressure: 120,
            diastolic_blood_pressure: 80,
            blood_sugar: 90,
            hba1c: 5.5,
            ldl_cholesterol: 120,
            tg: 150,
            ast: 20,
            alt: 25,
            gamma_gtp: 30,
            bmi_evaluation: 'A',
            blood_pressure_evaluation: 'B',
            blood_sugar_evaluation: 'A',
            lipid_evaluation: 'B',
            liver_function_evaluation: 'A',
            total_score: 85
          },
          {
            id: 'sample-2',
            bmi: 28.0,
            systolic_blood_pressure: 140,
            diastolic_blood_pressure: 90,
            blood_sugar: 110,
            hba1c: 6.2,
            ldl_cholesterol: 140,
            tg: 180,
            ast: 30,
            alt: 35,
            gamma_gtp: 40,
            bmi_evaluation: 'C',
            blood_pressure_evaluation: 'D',
            blood_sugar_evaluation: 'C',
            lipid_evaluation: 'D',
            liver_function_evaluation: 'C',
            total_score: 60
          }
        ]);
      }
    };

    fetchHealthCheckResults();
  }, [supabase]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedResults = React.useMemo(() => {
    if (!sortColumn) return healthCheckResults;

    return [...healthCheckResults].sort((a: any, b: any) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA === null || valueA === undefined) return 1; // Move null/undefined to the end
      if (valueB === null || valueB === undefined) return -1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }, [healthCheckResults, sortColumn, sortOrder]);

  const filteredResults = React.useMemo(() => {
    if (!filterValue) return sortedResults;

    const lowerCaseFilter = filterValue.toLowerCase();
    return sortedResults.filter((result: any) =>
      Object.values(result).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(lowerCaseFilter)
      )
    );
  }, [sortedResults, filterValue]);

  return (
    <Layout>
      <Header />
      <div className="container mx-auto px-4 min-h-screen h-full">
        <h1 className="text-2xl font-bold mb-4">評価結果一覧画面</h1>
        <div className="mb-4">
          <label htmlFor="filter" className="mr-2">フィルタ:</label>
          <input
            type="text"
            id="filter"
            className="border rounded py-2 px-3 w-full md:w-64"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            data-testid="filter-input"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('id')} data-testid="sort-button">
                    ID {sortColumn === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('bmi')}>
                    BMI {sortColumn === 'bmi' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('systolic_blood_pressure')}>
                    Systolic Blood Pressure {sortColumn === 'systolic_blood_pressure' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('diastolic_blood_pressure')}>
                    Diastolic Blood Pressure {sortColumn === 'diastolic_blood_pressure' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('blood_sugar')}>
                    Blood Sugar {sortColumn === 'blood_sugar' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('hba1c')}>
                    HbA1c {sortColumn === 'hba1c' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('ldl_cholesterol')}>
                    LDL Cholesterol {sortColumn === 'ldl_cholesterol' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('tg')}>
                    TG {sortColumn === 'tg' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('ast')}>
                    AST {sortColumn === 'ast' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('alt')}>
                    ALT {sortColumn === 'alt' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('gamma_gtp')}>
                    Gamma GTP {sortColumn === 'gamma_gtp' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('bmi_evaluation')}>
                    BMI Evaluation {sortColumn === 'bmi_evaluation' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('blood_pressure_evaluation')}>
                    Blood Pressure Evaluation {sortColumn === 'blood_pressure_evaluation' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('blood_sugar_evaluation')}>
                    Blood Sugar Evaluation {sortColumn === 'blood_sugar_evaluation' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('lipid_evaluation')}>
                    Lipid Evaluation {sortColumn === 'lipid_evaluation' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('liver_function_evaluation')}>
                    Liver Function Evaluation {sortColumn === 'liver_function_evaluation' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b">
                  <button onClick={() => handleSort('total_score')}>
                    Total Score {sortColumn === 'total_score' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result: any) => (
                <tr key={result.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{result.id}</td>
                  <td className="py-2 px-4 border-b">{result.bmi}</td>
                  <td className="py-2 px-4 border-b">{result.systolic_blood_pressure}</td>
                  <td className="py-2 px-4 border-b">{result.diastolic_blood_pressure}</td>
                  <td className="py-2 px-4 border-b">{result.blood_sugar}</td>
                  <td className="py-2 px-4 border-b">{result.hba1c}</td>
                  <td className="py-2 px-4 border-b">{result.ldl_cholesterol}</td>
                  <td className="py-2 px-4 border-b">{result.tg}</td>
                  <td className="py-2 px-4 border-b">{result.ast}</td>
                  <td className="py-2 px-4 border-b">{result.alt}</td>
                  <td className="py-2 px-4 border-b">{result.gamma_gtp}</td>
                  <td className="py-2 px-4 border-b">{result.bmi_evaluation}</td>
                  <td className="py-2 px-4 border-b">{result.blood_pressure_evaluation}</td>
                  <td className="py-2 px-4 border-b">{result.blood_sugar_evaluation}</td>
                  <td className="py-2 px-4 border-b">{result.lipid_evaluation}</td>
                  <td className="py-2 px-4 border-b">{result.liver_function_evaluation}</td>
                  <td className="py-2 px-4 border-b">{result.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => router.push('/TableSort')}
          >
            ソート設定へ
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/TableFilter')}
          >
            フィルタ設定へ
          </button>
        </div>
          <div>Sort Order: {sortOrder}</div>
      </div>
    </Layout>
  );
};

export default EvalTable;