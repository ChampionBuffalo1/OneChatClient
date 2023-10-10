export default function GroupHeader({ title }: { title: string }) {
  return (
    <div className="fixed w-full top-0 rounded-sm h-10">
      <h1 className="text-2xl px-2 p-2 lg:px-4 bg-gray-950">{title}</h1>
    </div>
  );
}
