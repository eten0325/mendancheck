{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockRequest, MockResponse } from 'node-mocks-http';
import { jest } from '@jest/globals';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
    update: jest.fn(() => Promise.resolve({ data: [], error: null })),
    delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
  })),
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  },
};

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => mockSupabaseClient),
  };
});

// Path to the API route
const modulePath = '@/pages/api/auth/login';

// Dynamically import the API route
async function importRoute() {
  return await import(modulePath) as any;
}


describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 if method is not POST', async () => {
    const { default: handler } = await importRoute();
    const { req, res }: { req: MockRequest<NextApiRequest>; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toContain('Method Not Allowed');
  });

  it('should return 200 if login is successful', async () => {
    const { default: handler } = await importRoute();

    // Mock successful user retrieval
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: [{ user_id: 'testuser', password_hash: 'hashedpassword' }], error: null })),
    });

    // Mock password verification and token generation (replace with actual logic)
    const mockVerifyPassword = jest.fn(() => true);
    const mockGenerateToken = jest.fn(() => 'mockedToken');

    const { req, res }: { req: MockRequest<NextApiRequest>; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        user_id: 'testuser',
        password: 'password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._get_data()).toContain('mockedToken');
  });

  it('should return 401 if user is not found', async () => {
    const { default: handler } = await importRoute();

    // Mock user not found
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    });

    const { req, res }: { req: MockRequest<NextApiRequest>; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        user_id: 'nonexistentuser',
        password: 'password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._get_data()).toContain('Invalid credentials');
  });

  it('should return 401 if password verification fails', async () => {
    const { default: handler } = await importRoute();

    // Mock successful user retrieval
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: [{ user_id: 'testuser', password_hash: 'hashedpassword' }], error: null })),
    });

    // Mock failed password verification
    const mockVerifyPassword = jest.fn(() => false);

    const { req, res }: { req: MockRequest<NextApiRequest>; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        user_id: 'testuser',
        password: 'wrongpassword',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._get_data()).toContain('Invalid credentials');
  });

  it('should return 500 if database select fails', async () => {
    const { default: handler } = await importRoute();

    // Mock database error
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
    });

    const { req, res }: { req: MockRequest<NextApiRequest>; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        user_id: 'testuser',
        password: 'password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._get_data()).toContain('Failed to fetch user');
  });

  it('should return 500 if password hashing fails', async () => {
    const { default: handler } = await importRoute();

    // Mock successful user retrieval
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: [{ user_id: 'testuser', password_hash: 'hashedpassword' }], error: null })),
    });

    // Mock password hashing failure (replace with actual logic)
    const mockHashPassword = jest.fn(() => {
      throw new Error('Hashing failed');
    });

    const { req, res }: { req: MockRequest<NextApiRequest>; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        user_id: 'testuser',
        password: 'password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._get_data()).toContain('Internal Server Error');
  });
});
"
}