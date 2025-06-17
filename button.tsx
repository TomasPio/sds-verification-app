
export function Button({ children, onClick, variant = 'default' }) {
  const styles = variant === 'outline' ? 'border border-gray-400' : 'bg-blue-600 text-white';
  return <button onClick={onClick} className={`px-3 py-1 rounded ${styles}`}>{children}</button>;
}
