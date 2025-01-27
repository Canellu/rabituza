import { Separator } from '@/components/ui/separator';
import { User } from '@/types/User';
import { format } from 'date-fns';
import { Fragment } from 'react';

const excludedFields = ['id', 'code', 'email'];
const fieldLabels: Record<string, string> = {
  first_name: 'First name',
  last_name: 'Last name',
  dob: 'Date of birth',
};

const ProfileDetails = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col px-6 py-8 rounded-md border border-input gap-4">
      {user &&
        Object.entries(user).map(([key, value], index, array) => {
          // Skip excluded fields
          if (excludedFields.includes(key)) {
            return null;
          }

          // Get the display label for the key (use custom labels if defined)
          const label = fieldLabels[key] || key.replace('_', ' ');

          // Check if the current key is 'bio' and apply different styles
          const isBio = key === 'bio';
          const containerClass = isBio
            ? 'flex flex-col px-2 gap-3'
            : 'flex justify-between items-start px-2 gap-10';
          const valueClass = isBio
            ? 'text-muted-foreground'
            : 'text-muted-foreground font-medium first-letter:capitalize text-right';

          // Format weight and height with 'kg' and 'cm' suffixes
          let formattedValue: React.ReactNode;

          // Handle weight and height with suffixes
          if (key === 'weight' && typeof value === 'number') {
            formattedValue = `${value} kg`;
          } else if (key === 'height' && typeof value === 'number') {
            formattedValue = `${value} cm`;
          } else if (value instanceof Date) {
            // Format Date to string using date-fns format
            formattedValue = format(value, 'do MMMM yyyy');
          } else if (typeof value === 'string' || typeof value === 'number') {
            // Keep string or number values as is
            formattedValue = value;
          } else {
            // Fallback for any other types
            formattedValue = String(value);
          }

          return (
            <Fragment key={key}>
              <div className={containerClass}>
                {/* Left column - key */}
                <div className="capitalize whitespace-nowrap">{label}</div>

                {/* Right column - value */}
                <div className={valueClass}>{formattedValue}</div>
              </div>

              {/* Render Separator only if it's not the last item */}
              {index < array.length - 1 && <Separator />}
            </Fragment>
          );
        })}
    </div>
  );
};

export default ProfileDetails;
