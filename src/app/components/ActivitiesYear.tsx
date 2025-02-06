const ActivitiesYear = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesYear;
