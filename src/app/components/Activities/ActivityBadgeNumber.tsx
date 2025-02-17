const ActivityBadgeNumber = ({ count }: { count: number }) => {
  return (
    <div className="absolute -top-1 -right-2 bg-emerald-500 text-white text-xs font-semibold rounded-full size-5 flex items-center justify-center">
      {count}
    </div>
  );
};

export default ActivityBadgeNumber;
