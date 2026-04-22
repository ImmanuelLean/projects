// ============================================
// UNIT TESTING WITH JEST & REACT TESTING LIBRARY
// ============================================
// npm install --save-dev jest @testing-library/react @testing-library/jest-dom

// ---- 1. JEST BASICS ----

const jestBasics = `
// math.js
function add(a, b) { return a + b; }
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
module.exports = { add, divide };

// math.test.js
const { add, divide } = require('./math');

// ===== describe: group related tests =====
describe('Math functions', () => {

  // ===== test/it: individual test =====
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('adds negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });

  test('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(10, 3)).toBeCloseTo(3.333, 3);
  });

  test('throws on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});
`;

// ---- 2. MATCHERS ----

const matchers = `
describe('Jest Matchers', () => {

  // ===== Equality =====
  test('exact equality', () => {
    expect(2 + 2).toBe(4);           // strict ===
    expect({ a: 1 }).toEqual({ a: 1 }); // deep equality
    expect([1, 2]).toEqual([1, 2]);
  });

  // ===== Truthiness =====
  test('truthiness', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('hello').toBeDefined();
    expect(1).toBeTruthy();
    expect(0).toBeFalsy();
  });

  // ===== Numbers =====
  test('numbers', () => {
    expect(10).toBeGreaterThan(5);
    expect(10).toBeGreaterThanOrEqual(10);
    expect(5).toBeLessThan(10);
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });

  // ===== Strings =====
  test('strings', () => {
    expect('Hello World').toMatch(/World/);
    expect('Hello World').toContain('World');
    expect('hello').toHaveLength(5);
  });

  // ===== Arrays & Objects =====
  test('arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toContain(3);
    expect(arr).toHaveLength(5);
    expect(arr).toEqual(expect.arrayContaining([2, 4]));
  });

  test('objects', () => {
    const user = { name: 'Alice', age: 30, role: 'admin' };
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('name', 'Alice');
    expect(user).toMatchObject({ name: 'Alice', role: 'admin' });
    expect(user).toEqual(expect.objectContaining({ name: 'Alice' }));
  });

  // ===== Exceptions =====
  test('exceptions', () => {
    const bomb = () => { throw new TypeError('Boom!'); };
    expect(bomb).toThrow();
    expect(bomb).toThrow(TypeError);
    expect(bomb).toThrow('Boom!');
    expect(bomb).toThrow(/boom/i);
  });

  // ===== Negation =====
  test('not', () => {
    expect(5).not.toBe(3);
    expect([1, 2]).not.toContain(5);
  });
});
`;

// ---- 3. SETUP & TEARDOWN ----

const setupTeardown = `
describe('Database tests', () => {
  let db;

  // Runs once before all tests in this describe
  beforeAll(async () => {
    db = await connectToTestDB();
  });

  // Runs once after all tests
  afterAll(async () => {
    await db.close();
  });

  // Runs before EACH test
  beforeEach(async () => {
    await db.clear();
    await db.seed();
  });

  // Runs after EACH test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('finds users', async () => {
    const users = await db.findUsers();
    expect(users).toHaveLength(3);
  });
});
`;

// ---- 4. MOCKING ----

const mocking = `
// ===== jest.fn() — Mock Functions =====
test('mock function', () => {
  const mockFn = jest.fn();
  mockFn('hello');
  mockFn('world');

  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('hello');
  expect(mockFn).toHaveBeenLastCalledWith('world');
});

test('mock return values', () => {
  const mockFn = jest.fn()
    .mockReturnValue('default')
    .mockReturnValueOnce('first')
    .mockReturnValueOnce('second');

  expect(mockFn()).toBe('first');
  expect(mockFn()).toBe('second');
  expect(mockFn()).toBe('default');
});

test('mock implementation', () => {
  const mockFn = jest.fn((x) => x * 2);
  expect(mockFn(5)).toBe(10);
});

// ===== jest.mock() — Mock Modules =====
jest.mock('./emailService');
const emailService = require('./emailService');

test('sends welcome email', async () => {
  emailService.sendEmail.mockResolvedValue({ sent: true });

  await registerUser({ name: 'Alice', email: 'alice@test.com' });

  expect(emailService.sendEmail).toHaveBeenCalledWith(
    'alice@test.com',
    expect.stringContaining('Welcome')
  );
});

// ===== jest.spyOn() — Spy on existing methods =====
test('spy on method', () => {
  const calculator = { add: (a, b) => a + b };
  const spy = jest.spyOn(calculator, 'add');

  calculator.add(2, 3);

  expect(spy).toHaveBeenCalledWith(2, 3);
  expect(spy).toHaveReturnedWith(5);

  spy.mockRestore();
});

// ===== Mock async functions =====
test('mock async', async () => {
  const fetchUser = jest.fn()
    .mockResolvedValue({ id: 1, name: 'Alice' });

  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});

// Mock rejected
test('mock error', async () => {
  const fetchUser = jest.fn()
    .mockRejectedValue(new Error('Network error'));

  await expect(fetchUser(1)).rejects.toThrow('Network error');
});
`;

// ---- 5. TESTING ASYNC CODE ----

const asyncTesting = `
// ===== async/await =====
test('fetches user data', async () => {
  const data = await fetchUserData(1);
  expect(data.name).toBe('Alice');
});

// ===== resolves/rejects =====
test('resolves with user', () => {
  return expect(fetchUserData(1)).resolves.toEqual(
    expect.objectContaining({ name: 'Alice' })
  );
});

test('rejects for invalid user', () => {
  return expect(fetchUserData(999)).rejects.toThrow('Not found');
});

// ===== Testing timers =====
jest.useFakeTimers();

test('debounce', () => {
  const callback = jest.fn();
  const debounced = debounce(callback, 300);

  debounced('a');
  debounced('b');
  debounced('c');

  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(300);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('c');
});
`;

// ---- 6. REACT TESTING LIBRARY ----

const reactTesting = `
// npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Counter from './Counter';

// ===== Render & Query =====
test('renders counter', () => {
  render(<Counter />);

  // Queries (by priority):
  // getByRole     — accessible role (best)
  // getByLabelText — form elements
  // getByText     — visible text
  // getByTestId   — data-testid (last resort)

  expect(screen.getByRole('heading')).toHaveTextContent('Counter');
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
});

// ===== User Interactions =====
test('increments counter on click', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

test('types in input', async () => {
  const user = userEvent.setup();
  render(<SearchBar />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'hello');

  expect(input).toHaveValue('hello');
});

// ===== Async: waitFor =====
test('loads and displays users', async () => {
  render(<UserList />);

  // Wait for loading to finish
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

// ===== findBy (async query) =====
test('shows error message', async () => {
  render(<LoginForm />);

  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  const error = await screen.findByText(/email is required/i);
  expect(error).toBeInTheDocument();
});

// ===== Snapshot Testing =====
test('matches snapshot', () => {
  const { container } = render(<ProfileCard user={{ name: 'Alice' }} />);
  expect(container).toMatchSnapshot();
});
`;

// ---- SUMMARY ----
console.log("=== Testing Summary ===");
console.log(`
  Jest:
    describe/test/it, expect matchers
    beforeEach/afterEach, beforeAll/afterAll
    jest.fn(), jest.mock(), jest.spyOn()

  React Testing Library:
    render, screen, waitFor, findBy
    userEvent for interactions
    Query priority: role > label > text > testId

  Commands:
    npx jest                    — run all tests
    npx jest --watch            — watch mode
    npx jest --coverage         — code coverage
    npx jest path/to/test.js    — run specific test
`);
