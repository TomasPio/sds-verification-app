
export function Input({ placeholder, value, onChange, type = 'text', className = '' }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`border px-2 py-1 rounded w-full ${className}`} />;
}
