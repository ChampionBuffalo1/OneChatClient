export default function Group({ icon, name, recentMessage }: { icon?: string; name: string; recentMessage?: string }) {
  return (
    // border-gray-300
    <div className="flex items-center p-4 space-x-4 border-b">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
        {icon ? (
          <img src={icon} alt="Group Icon" className="w-6 h-6" />
        ) : (
          <span className="text-gray-900 text-xl">+</span>
        )}
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-md font-semibold">{name}</h2>
        </div>
        {recentMessage && <p className="text-gray-400">{recentMessage}</p>}
      </div>
    </div>
  );
}
