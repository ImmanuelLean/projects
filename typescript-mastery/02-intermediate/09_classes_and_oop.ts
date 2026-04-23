// ============================================
// CLASSES & OOP IN TYPESCRIPT
// ============================================

// ===== BASIC CLASS =====
class Animal {
  // Properties with access modifiers
  public name: string;           // accessible everywhere (default)
  protected species: string;     // accessible in class + subclasses
  private _age: number;          // accessible only in this class
  readonly id: number;           // can't be changed after construction

  constructor(name: string, species: string, age: number) {
    this.id = Math.random();
    this.name = name;
    this.species = species;
    this._age = age;
  }

  // Getter
  get age(): number {
    return this._age;
  }

  // Setter with validation
  set age(value: number) {
    if (value < 0) throw new Error("Age cannot be negative");
    this._age = value;
  }

  // Method
  describe(): string {
    return `${this.name} is a ${this.species}, age ${this._age}`;
  }
}

const dog = new Animal("Rex", "Dog", 5);
console.log(dog.describe());
console.log(dog.name);      // ✅ public
// console.log(dog._age);   // ❌ private
// console.log(dog.species); // ❌ protected

// ===== PARAMETER PROPERTIES (shorthand) =====
class Point {
  // Declares AND assigns in constructor
  constructor(
    public x: number,
    public y: number,
    public readonly label: string = "origin"
  ) {}

  distanceTo(other: Point): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }
}

const p1 = new Point(3, 4);
const p2 = new Point(6, 8);
console.log(`Distance: ${p1.distanceTo(p2).toFixed(2)}`);

// ===== INHERITANCE =====
class Dog extends Animal {
  constructor(
    name: string,
    age: number,
    public breed: string
  ) {
    super(name, "Dog", age);  // must call super()
  }

  // Override method
  describe(): string {
    return `${super.describe()}, breed: ${this.breed}`;
  }

  bark(): string {
    return `${this.name} says Woof!`;
  }
}

const rex = new Dog("Rex", 5, "Labrador");
console.log(rex.describe());
console.log(rex.bark());

// ===== ABSTRACT CLASSES =====
abstract class Shape {
  abstract area(): number;       // must be implemented by subclasses
  abstract perimeter(): number;

  // Concrete method — shared by all subclasses
  describe(): string {
    return `${this.constructor.name}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(public radius: number) { super(); }

  area(): number { return Math.PI * this.radius ** 2; }
  perimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) { super(); }

  area(): number { return this.width * this.height; }
  perimeter(): number { return 2 * (this.width + this.height); }
}

// const shape = new Shape(); // ❌ Cannot instantiate abstract class
const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.describe()));

// ===== INTERFACES WITH CLASSES =====
interface Serializable {
  serialize(): string;
}

interface Comparable<T> {
  compareTo(other: T): number;
}

class Product implements Serializable, Comparable<Product> {
  constructor(
    public id: number,
    public name: string,
    public price: number
  ) {}

  serialize(): string {
    return JSON.stringify({ id: this.id, name: this.name, price: this.price });
  }

  compareTo(other: Product): number {
    return this.price - other.price;
  }
}

const products = [
  new Product(1, "Widget", 29.99),
  new Product(2, "Gadget", 19.99),
  new Product(3, "Doohickey", 39.99),
];
products.sort((a, b) => a.compareTo(b));
console.log(products.map(p => `${p.name}: $${p.price}`));

// ===== STATIC MEMBERS =====
class Counter {
  static count = 0;

  static increment(): void {
    Counter.count++;
  }

  static reset(): void {
    Counter.count = 0;
  }
}

Counter.increment();
Counter.increment();
console.log(`Counter: ${Counter.count}`); // 2

// ===== PRIVATE FIELDS (ES2022 #) =====
class BankAccount {
  #balance: number;  // truly private (runtime + compile time)

  constructor(initialBalance: number) {
    this.#balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this.#balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }

  get balance(): number {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(`Balance: $${account.balance}`); // 150
// account.#balance; // ❌ Error: truly private

// ===== SINGLETON PATTERN =====
class Database {
  private static instance: Database;
  private constructor(public url: string) {}

  static getInstance(url: string = "localhost"): Database {
    if (!Database.instance) {
      Database.instance = new Database(url);
    }
    return Database.instance;
  }

  query(sql: string): string {
    return `Executing: ${sql} on ${this.url}`;
  }
}

const db1 = Database.getInstance("postgres://localhost");
const db2 = Database.getInstance("other");
console.log(db1 === db2); // true (same instance)

// ===== GENERIC CLASS =====
class Result<T, E extends Error = Error> {
  private constructor(
    private value?: T,
    private error?: E
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result(value);
  }

  static err<T, E extends Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
  }

  isOk(): boolean { return this.error === undefined; }

  unwrap(): T {
    if (this.error) throw this.error;
    return this.value!;
  }

  unwrapOr(fallback: T): T {
    return this.error ? fallback : this.value!;
  }
}

const success = Result.ok(42);
const failure = Result.err(new Error("Something went wrong"));
console.log(`Success: ${success.unwrap()}`);
console.log(`Failure: ${failure.unwrapOr(0)}`);

export {};
