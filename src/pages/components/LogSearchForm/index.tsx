import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LogSearchForm = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [logLevel, setLogLevel] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSearch = async () => {
    setNoResults(false);
    setError(null);

    const params = new URLSearchParams();
    if (startDate) {
      params.append('startDate', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      params.append('endDate', endDate.toISOString().split('T')[0]);
    }
    if (logLevel) {
      params.append('logLevel', logLevel);
    }
    if (message) {
      params.append('message', message);
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('logs')
        .select('*')
        .gte('timestamp', startDate ? startDate.toISOString() : '1970-01-01T00:00:00.000Z')
        .lte('timestamp', endDate ? endDate.toISOString() : '2100-01-01T00:00:00.000Z')
        .ilike('log_level', `%${logLevel}%`)
        .ilike('message', `%${message}%`);

      if (fetchError) {
        console.error('Supabaseエラー:', fetchError);
        setError(`エラーが発生しました: ${fetchError.message}`);
        setSearchResults([]);
        return;
      }

      if (data && data.length > 0) {
        setSearchResults(data);
        setNoResults(false);
      } else {
        setSearchResults([]);
        setNoResults(true);
      }
    } catch (e: any) {
      console.error('APIエラー:', e);
      setError(`エラーが発生しました: ${e.message}`);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">ログ検索フォーム</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">開始日:</label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full mt-2 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="開始日を選択"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">終了日:</label>
                  <DatePicker
                    id="endDate"
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full mt-2 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="終了日を選択"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="logLevel" className="block text-sm font-medium text-gray-700">ログレベル:</label>
                  <select
                    id="logLevel"
                    className="w-full mt-2 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                  >
                    <option value="">全て</option>
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ERROR">ERROR</option>
                  </select>
                </div>
                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">メッセージ:</label>
                  <input
                    type="text"
                    id="message"
                    className="w-full mt-2 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="メッセージを入力"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-700"
                    onClick={handleSearch}
                  >
                    検索
                  </button>
                </div>
              </div>
            </div>
            {
              searchResults.length > 0 && (
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-xl font-semibold">検索結果</h2>
                  <ul>
                    {searchResults.map((result) => (
                      <li key={result.id} className="mb-4 p-4 border rounded-md bg-gray-50">
                        <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                        <p><strong>Log Level:</strong> {result.log_level}</p>
                        <p><strong>Message:</strong> {result.message}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            {noResults && <p>ログが見つかりませんでした。</p>}
            {error && <p>エラーが発生しました: {error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogSearchForm;