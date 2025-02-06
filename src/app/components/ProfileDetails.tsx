import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { CalendarIcon } from 'lucide-react';
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
  const [popoverOpen, setPopoverOpen] = useState(false);
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
  }, [user]);

  const handleMonthChange = (monthIndex: number) => {
    setViewMonth(monthIndex);
  };

  const handleYearChange = (year: number) => {
    setViewYear(year);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setPopoverOpen(false);
    }
  };

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
            />
            <Label htmlFor="last_name">Last name</Label>
          </div>
        );
      case 'dob':
        return (
          <div className="flex flex-col-reverse w-full gap-2">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dob"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal hover:bg-white text-base rounded-md',
                    !date && 'text-muted-foreground '
                  )}
                >
                  <CalendarIcon />
                  {date ? (
                    format(date, 'do MMMM yyyy')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4">
                  <div className="flex gap-2">
                    {/* Month Select */}
                    <Select
                      onValueChange={(value) =>
                        handleMonthChange(Number(value))
                      }
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
                      onValueChange={(value) => handleYearChange(Number(value))}
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
                  {/* Calendar */}
                  <Calendar
                    mode="single"
                    weekStartsOn={1}
                    selected={date}
                    fixedWeeks
                    onSelect={handleDateSelect}
                    initialFocus
                    className="p-1"
                    classNames={{
                      caption: 'hidden',
                    }}
                    month={new Date(viewYear, viewMonth)}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Label htmlFor="dob">Date of Birth</Label>
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
              rows={6}
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Get personalized messages based on your bio."
              className="peer"
            />
            <Label htmlFor="bio">About me</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col p-4 py-6 rounded-lg border gap-2 bg-secondary">
      {user &&
        Object.entries(user).map(([key, value], index, array) => {
          if (excludedFields.includes(key)) {
            return null;
          }

          const label = fieldLabels[key] || key.replace('_', ' ');
          const isBio = key === 'bio';
          const containerClass = isBio
            ? 'flex flex-col px-2 gap-3'
            : 'flex justify-between items-center px-2 py-2 transition-colors duration-200 ease-in-out';
          const valueClass = isBio
            ? 'text-gray-600'
            : 'text-gray-800 font-medium text-right';

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
                className={containerClass}
                onClick={() => handleFieldClick(key)}
              >
                <div className="capitalize text-gray-500">{label}</div>
                <div className={valueClass}>{formattedValue}</div>
              </div>
              {index < array.length - 1 && <Separator />}
            </Fragment>
          );
        })}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[98%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>Edit {fieldLabels[selectedField || '']}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {renderInputField()}
            <div className="flex items-center justify-between mt-4">
              <Button onClick={() => setDrawerOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ProfileDetails;
