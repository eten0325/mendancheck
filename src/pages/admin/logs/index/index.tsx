import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/../supabase/types';

const LogsIndex: NextPage = () => {
  const [logs, setLogs] = useState<Database['public']['Tables']['logs']['Row'][]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('logs')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Error fetching logs:', error);
          // Display sample data in case of an error
          setLogs([
            {
              id: 'sample-1',
              timestamp: new Date(),
              log_level: 'ERROR',
              message: 'Failed to fetch logs from database.',
            },
            {
              id: 'sample-2',
              timestamp: new Date(),
              log_level: 'INFO',
              message: 'Using sample data instead.',
            },
          ]);
        } else {
          setLogs(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching logs:', error);
        // Display sample data in case of an unexpected error
        setLogs([
          {
            id: 'sample-3',
            timestamp: new Date(),
            log_level: 'CRITICAL',
            message: 'An unexpected error occurred.',
          },
        ]);
      }
    };

    fetchLogs();
  }, [supabase]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">ログ一覧画面</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">
            <div className="mb-4">
              <input
                type="text"
                placeholder="ログを検索"
                value={searchTerm}
                onChange={handleSearchChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイムスタンプ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ログレベル
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メッセージ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.log_level}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogsIndex;