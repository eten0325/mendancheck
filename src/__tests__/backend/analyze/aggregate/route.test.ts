{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockRequest, MockResponse } from 'node-mocks-http';
import aggregateHandler from '@/pages/api/analyze/aggregate';
import { jest } from '@jest/globals';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// Mock Supabase client and its methods
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockResolvedValue({
      data: [
        { id: '1', total_score: 100 },
        { id: '2', total_score: 150 },
        { id: '3', total_score: 200 },
      ],
      error: null,
    }),
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null }),
  },
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));


describe('/api/analyze/aggregate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 OK and aggregate data on successful GET request', async () => {
    const { req, res }: { req: MockRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await aggregateHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual(expect.any(Array));
    expect(mockSupabaseClient.from).toHaveBeenCalled();
    expect(mockSupabaseClient.from('health_check_results').select).toHaveBeenCalledWith('id, total_score');
  });

  it('should handle errors and return 500 on GET request', async () => {
    (mockSupabaseClient.from('health_check_results').select as jest.Mock).mockRejectedValue(new Error('Database error'));

    const { req, res }: { req: MockRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await aggregateHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'Internal Server Error' });
  });

  it('should return 405 Method Not Allowed for non-GET requests', async () => {
    const { req, res }: { req: MockRequest; res: MockResponse } = createMocks({
      method: 'POST',
    });

    await aggregateHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'Method Not Allowed' });
  });

  it('should handle no data returned from the database', async () => {
    (mockSupabaseClient.from('health_check_results').select as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });

    const { req, res }: { req: MockRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await aggregateHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual([{\"count\":0,\"range\":\"0-49\"},{\"count\":0,\"range\":\"50-99\"},{\"count\":0,\"range\":\"100-149\"},{\"count\":0,\"range\":\"150-199\"},{\"count\":0,\"range\":\"200+\"}]);
  });

  it('should handle database error and return 500', async () => {
    (mockSupabaseClient.from('health_check_results').select as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const { req, res }: { req: MockRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await aggregateHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'Internal Server Error' });
  });

  it('should handle valid data returned, but error during aggregation processing', async () => {
     const mockSupabaseClientWithError = {
         from: jest.fn(() => ({
           select: jest.fn().mockResolvedValue({
             data: [
               { id: '1', total_score: 100 },
               { id: '2', total_score: 150 },
               { id: '3', total_score: 200 },
               { id: '4', total_score: 'invalid' }, // Introduce an invalid total_score
             ],
             error: null,
           }),
         })),
         auth: {
           getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null }),
         },
       };

       jest.mock('@supabase/supabase-js', () => ({
        createClient: jest.fn(() => mockSupabaseClientWithError),
      }));


    const { req, res }: { req: MockRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await aggregateHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({\"error\": \"Internal Server Error\"});

    // Restore the original mock

  });
});"
}