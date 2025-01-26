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

          // Check if the current key is 'bio' and apply flex-col for bio
          const isBio = key === 'bio';
          const containerClass = isBio
            ? 'flex flex-col px-2 gap-3'
            : 'flex justify-between items-start px-2 gap-10';
          const valueClass = isBio
            ? 'text-muted-foreground'
            : 'text-muted-foreground font-medium';

          return (
            <Fragment key={key}>
              <div className={containerClass}>
                {/* Left column - key */}
                <div className="capitalize">{label}</div>

                {/* Right column - value */}
                <div className={valueClass}>
                  {value instanceof Date
                    ? format(value, 'do MMMM yyyy')
                    : value}
                </div>
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
