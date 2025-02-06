import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { months } from '@/constants/months';
import { cn } from '@/lib/utils';
import { User } from '@/types/User';
import { format } from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import useCreateOrUpdateUser from '../hooks/useCreateOrUpdateUser';

const excludedFields = ['id', 'code', 'email'];
const fieldLabels: Record<string, string> = {
  username: 'Username',
  first_name: 'First Name',
  last_name: 'Last Name',
  dob: 'Date of Birth',
  gender: 'Gender',
  weight: 'Weight',
  height: 'Height',
  bio: 'Bio',
};

const ProfileDetails = ({ user }: { user?: User }) => {
  const [date, setDate] = useState<Date>();
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [selectedField, setSelectedField] = useState<string | null>(null);

  const { mutate: createOrUpdate } = useCreateOrUpdateUser();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 65 + 1 }, // Generate years to 65
    (_, i) => currentYear - i
  );

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setGender(user.gender || '');
      setHeight(user.height || 170);
      setWeight(user.weight || undefined);
      setBio(user.bio || '');
      setUsername(user.username || '');

      const dob = user.dob ? new Date(user.dob) : undefined;
      if (dob) {
        setDate(dob);
        setViewYear(dob.getFullYear());
        setViewMonth(dob.getMonth());
      }
    }
  }, [user, drawerOpen]);

  const handleFieldClick = (field: string) => {
    setSelectedField(field);
    setDrawerOpen(true);
  };

  const handleSaveProfile = () => {
    // Make sure `user` exists before proceeding
    if (!user) return;

    // Safely update user details
    const updatedUser = {
      ...user,
      username: username.toLowerCase(),
      first_name: firstName,
      last_name: lastName,
      dob: date,
      height,
      gender,
      weight,
      bio,
    };

    // Pass the updated user to createOrUpdate
    createOrUpdate(updatedUser);
    setDrawerOpen(false);
  };

  const renderInputField = () => {
    switch (selectedField) {
      case 'username':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="peer"
              autoFocus
            />
            <Label htmlFor="username">Username</Label>
          </div>
        );

      case 'first_name':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <Input
              type="text"
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="peer"
              autoFocus
            />
            <Label htmlFor="first_name">First name</Label>
          </div>
        );

      case 'last_name':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <Input
              type="text"
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="peer"
              autoFocus
            />
            <Label htmlFor="last_name">Last name</Label>
          </div>
        );
      case 'dob':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <div className="rounded-md">
              <div className="flex gap-2">
                {/* Month Select */}
                <Select
                  onValueChange={(value) => setViewMonth(Number(value))}
                  defaultValue={viewMonth.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Year Select */}
                <Select
                  onValueChange={(value) => setViewYear(Number(value))}
                  defaultValue={viewYear.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                weekStartsOn={1}
                selected={date}
                showOutsideDays={false}
                onSelect={setDate}
                initialFocus
                classNames={{
                  caption: 'hidden',
                  head_row: 'flex space-x-2',
                  row: 'flex w-full mt-2 space-x-2',
                }}
                month={new Date(viewYear, viewMonth)}
                className="items-center flex w-full justify-center rounded-md border bg-white mt-2"
              />
            </div>
          </div>
        );
      case 'gender':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <Select value={gender} onValueChange={(g) => setGender(g)}>
              <SelectTrigger
                className={cn(
                  'w-full',
                  gender ? 'text-stone-800' : 'text-muted-foreground'
                )}
                id="gender"
              >
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="gender">Gender</Label>
          </div>
        );
      case 'weight':
        return (
          <div className="flex w-full items-end gap-3 justify-center">
            <div className="flex flex-col-reverse w-full gap-1">
              <Slider
                value={[weight || 70]}
                max={120}
                min={40}
                step={1}
                onValueChange={(vals) => setWeight(vals[0])}
                className="h-10 "
              />
              <Label htmlFor="weight">Weight</Label>
            </div>

            <div className="flex items-center gap-1 text-base min-w-20">
              <Input
                type="number"
                id="weightInput"
                value={weight || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setWeight(value ? Number(value) : undefined);
                }}
                className="peer w-14 text-center"
                inputMode="numeric"
                placeholder="Weight"
              />
              <span>kg</span>
            </div>
          </div>
        );
      case 'height':
        return (
          <div className="flex w-full items-end gap-3 justify-center">
            <div className="flex flex-col-reverse w-full gap-1">
              <Slider
                value={[height]}
                max={200}
                min={140}
                step={1}
                onValueChange={(vals) => setHeight(vals[0])}
                className="h-10 "
              />
              <Label htmlFor="height">Height</Label>
            </div>

            <div className="flex items-center gap-1 text-base min-w-20">
              <Input
                type="number"
                id="heightInput"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="peer w-14 text-center"
                inputMode="numeric"
                placeholder="Height"
              />
              <span>cm</span>
            </div>
          </div>
        );
      case 'bio':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <Textarea
              rows={8}
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Get personalized messages based on your bio."
              className="peer"
              autoFocus
            />
            <Label htmlFor="bio">About Me</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col py-4 rounded-lg border gap-2 bg-secondary">
      {user &&
        Object.entries(user).map(([key, value], index, array) => {
          if (excludedFields.includes(key)) {
            return null;
          }

          const label = fieldLabels[key] || key.replace('_', ' ');
          const isBio = key === 'bio';

          let formattedValue: React.ReactNode;

          if (key === 'weight' && typeof value === 'number') {
            formattedValue = `${value} kg`;
          } else if (key === 'height' && typeof value === 'number') {
            formattedValue = `${value} cm`;
          } else if (value instanceof Date) {
            formattedValue = format(value, 'do MMMM yyyy');
          } else if (typeof value === 'string' || typeof value === 'number') {
            formattedValue = value;
          } else {
            formattedValue = String(value);
          }

          return (
            <Fragment key={key}>
              <div
                className={cn(
                  'flex py-1 px-4',
                  isBio ? 'flex-col gap-3' : 'justify-between items-center'
                )}
                onClick={() => handleFieldClick(key)}
              >
                <div className="text-secondary-foreground">{label}</div>
                <div
                  className={cn(
                    isBio
                      ? 'text-secondary-foreground whitespace-pre-line p-4 border rounded-md bg-stone-50 shadow-inner'
                      : 'text-emerald-600 font-medium text-right'
                  )}
                >
                  {formattedValue}
                </div>
              </div>
              {index < array.length - 1 && <Separator />}
            </Fragment>
          );
        })}

      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent className="max-w-[94%] rounded-md">
          <DialogHeader>
            <DialogTitle>Edit {fieldLabels[selectedField || '']}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {renderInputField()}
            <div className="flex items-center justify-between mt-4">
              <Button onClick={() => setDrawerOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDetails;
