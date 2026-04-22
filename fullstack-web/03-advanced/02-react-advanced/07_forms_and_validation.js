// ============================================
// REACT FORMS & VALIDATION
// ============================================
// Controlled forms, validation, React Hook Form, Zod

// ---- 1. CONTROLLED FORMS ----

const controlledForms = `
import { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Must agree to terms';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      alert('Registered!');
    } catch (err) {
      setErrors({ form: 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label>Password</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      <div>
        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label>
          <input name="agreeToTerms" type="checkbox" checked={formData.agreeToTerms} onChange={handleChange} />
          I agree to the terms
        </label>
        {errors.agreeToTerms && <span className="error">{errors.agreeToTerms}</span>}
      </div>

      {errors.form && <div className="error">{errors.form}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
`;

// ---- 2. REACT HOOK FORM ----

const reactHookForm = `
// npm install react-hook-form
import { useForm } from 'react-hook-form';

function LoginForm() {
  const {
    register,         // connect inputs
    handleSubmit,     // wraps onSubmit
    formState: { errors, isSubmitting },
    reset,            // reset form
    watch,            // watch field values
    setValue,         // set field value programmatically
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Min 8 characters' },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <label>
        <input type="checkbox" {...register('rememberMe')} />
        Remember me
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
`;

// ---- 3. ZOD SCHEMA VALIDATION ----

const zodValidation = `
// npm install zod @hookform/resolvers
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema with Zod
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18').max(120),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  website: z.string().url().optional().or(z.literal('')),
  role: z.enum(['user', 'admin', 'moderator']),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

// TypeScript: infer type from schema
// type SignupForm = z.infer<typeof signupSchema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      password: '',
      confirmPassword: '',
      website: '',
      role: 'user',
    },
  });

  const onSubmit = async (data) => {
    // data is fully validated and typed!
    console.log('Valid data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age && <span>{errors.age.message}</span>}

      <input type="password" {...register('password')} placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <input type="password" {...register('confirmPassword')} placeholder="Confirm" />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <select {...register('role')}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
      </select>

      <button disabled={isSubmitting}>Sign Up</button>
    </form>
  );
}
`;

// ---- 4. MULTI-STEP FORM ----

const multiStepForm = `
import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '', lastName: '', email: '',
    // Step 2: Address
    street: '', city: '', state: '', zip: '',
    // Step 3: Payment
    cardNumber: '', expiry: '', cvv: '',
  });

  const totalSteps = 3;
  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    console.log('Final submission:', formData);
  };

  return (
    <div>
      {/* Progress indicator */}
      <div className="progress">
        Step {step} of {totalSteps}
        <div className="bar" style={{ width: \`\${(step/totalSteps)*100}%\` }} />
      </div>

      {/* Step content */}
      {step === 1 && <PersonalStep data={formData} onChange={updateFields} />}
      {step === 2 && <AddressStep data={formData} onChange={updateFields} />}
      {step === 3 && <PaymentStep data={formData} onChange={updateFields} />}

      {/* Navigation */}
      <div className="actions">
        {step > 1 && <button onClick={prev}>Back</button>}
        {step < totalSteps && <button onClick={next}>Next</button>}
        {step === totalSteps && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
}

function PersonalStep({ data, onChange }) {
  return (
    <div>
      <h2>Personal Information</h2>
      <input value={data.firstName} onChange={e => onChange({ firstName: e.target.value })} placeholder="First name" />
      <input value={data.lastName} onChange={e => onChange({ lastName: e.target.value })} placeholder="Last name" />
      <input value={data.email} onChange={e => onChange({ email: e.target.value })} placeholder="Email" />
    </div>
  );
}
`;

// ---- 5. FILE UPLOAD ----

const fileUpload = `
function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Image preview
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selected);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', 'Profile photo');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,  // don't set Content-Type, browser handles it
      });
      const data = await res.json();
      console.log('Uploaded:', data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: 200 }} />}
      {file && <p>{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
`;

// ---- SUMMARY ----
console.log("=== Forms & Validation Summary ===");
console.log(`
  Approaches:
    Controlled forms (useState)      — Simple forms
    React Hook Form                  — Performance, less re-renders
    React Hook Form + Zod            — Type-safe validation (recommended)

  Key Libraries:
    react-hook-form   — Form state management
    zod               — Schema validation
    @hookform/resolvers — Connect Zod to RHF
    yup               — Alternative to Zod

  Patterns:
    Multi-step forms, file uploads, dynamic fields
    Field-level vs form-level validation
    Server-side validation feedback
`);
