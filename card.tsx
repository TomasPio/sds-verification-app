
export function Card({ children }) {
  return <div className="rounded-xl shadow bg-white border p-4 mb-4">{children}</div>;
}
export function CardContent({ children }) {
  return <div>{children}</div>;
}
