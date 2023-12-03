export default function DisplayError({ message }: { message: string }) {
  return <p className="text-red-500 text-sm">{message}</p>;
}
