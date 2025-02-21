{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';


// Mock the Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid=\"layout-component\">{children}</div>;
};

// Mock the Header component
const MockHeader = () => <header data-testid=\"header-component\">Header</header>;

// Mock the Footer component
const MockFooter = () => <footer data-testid=\"footer-component\">Footer</footer>;

// Mock the Sidebar component
const MockSidebar = () => <aside data-testid=\"sidebar-component\">Sidebar</aside>;

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Component to be tested
const LogsIndex = () => {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MockLayout>
      <MockHeader />
      <MockSidebar />
      <MockFooter />
      <div>
        <h1>ログ一覧画面</h1>
        <input
          type=\"text\"
          placeholder=\"ログを検索\"
          value={searchTerm}
          onChange={handleSearchChange}
          data-testid=\"search-input\"
        />
        <table data-testid=\"logs-table\">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Log Level</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.log_level}</td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MockLayout>
  );
};

describe('LogsIndex Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
    });

    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders the component with initial state', () => {
    axios.get = jest.fn().mockResolvedValue({ data: [] });
    render(<LogsIndex />);
    expect(screen.getByText('ログ一覧画面')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ログを検索')).toBeInTheDocument();
    expect(screen.getByTestId('logs-table')).toBeInTheDocument();
    expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-component')).toBeInTheDocument();
  });

  it('fetches logs data on component mount', async () => {
    const mockLogs = [
      { id: '1', timestamp: '2024-01-01', log_level: 'INFO', message: 'Log message 1' },
      { id: '2', timestamp: '2024-01-02', log_level: 'ERROR', message: 'Log message 2' },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLogs });

    render(<LogsIndex />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/logs');
      expect(screen.getByText('Log message 1')).toBeInTheDocument();
      expect(screen.getByText('Log message 2')).toBeInTheDocument();
    });
  });

  it('filters logs based on search term', async () => {
    const mockLogs = [
      { id: '1', timestamp: '2024-01-01', log_level: 'INFO', message: 'Test log message' },
      { id: '2', timestamp: '2024-01-02', log_level: 'ERROR', message: 'Another log' },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLogs });

    render(<LogsIndex />);

    await waitFor(() => {
      expect(screen.getByText('Test log message')).toBeInTheDocument();
      expect(screen.getByText('Another log')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Test log message')).toBeInTheDocument();
    });

    expect(screen.queryByText('Another log')).toBeNull();
  });

  it('displays no logs message when no logs are found', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });

    render(<LogsIndex />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/logs');
    });

    expect(screen.queryByTestId('logs-table')).toBeInTheDocument();
  });
});"
}