'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { months } from '@/constants/months';

import { cn } from '@/lib/utils/tailwind';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, UserPen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useCreateOrUpdateUser from '../hooks/useCreateOrUpdateUser';
import { DatePickerDemo } from './DatePickerDemo';

const EditProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [date, setDate] = useState<Date>();
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { mutate } = useCreateOrUpdateUser();

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

  const handleSaveProfile = () => {
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

    mutate(updatedUser, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      },
    });
  };

  return (
    <Drawer>
      {/* Edit button */}
      <DrawerTrigger className="px-3 py-2 rounded-full bg-primary flex gap-1 items-center justify-center">
        <UserPen className="size-4 text-stone-800" />
        Edit profile
      </DrawerTrigger>

      {/* Drawer */}
      <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[90%] mx-[-1px]">
        <div className="flex flex-col bg-stone-100 flex-grow rounded-xl p-4 m-2 flex-1 overflow-y-auto gap-5 relative">
          {/* Title */}
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
            <DrawerDescription>
              Modify your personal details and update your profile settings.
            </DrawerDescription>
          </DrawerHeader>

          {/* Username */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>

          {/* First name */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="first_name">Fist name</Label>
            <Input
              type="text"
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Fist name"
            />
          </div>

          {/* Last name */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              type="text"
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>

          <DatePickerDemo />

          {/* Date of Birth */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dob"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal hover:bg-white text-base',
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
                  </div>
                  {/* Calendar */}
                  <Calendar
                    mode="single"
                    weekStartsOn={1}
                    selected={date}
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
          </div>

          {/* Gender */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="gender">Gender</Label>
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
          </div>

          {/* Weight */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              type="number"
              id="weight"
              value={weight ? weight : ''}
              onChange={(e) => {
                const value = e.target.value;
                setWeight(value ? Number(value) : undefined);
              }}
              placeholder="Weight"
            />
          </div>

          {/* Height */}
          <div className="grid w-full items-center gap-1">
            <Label htmlFor="height">Height (cm)</Label>
            <div className="flex justify-between items-center w-full gap-3 ">
              <Slider
                defaultValue={[170]}
                max={200}
                min={140}
                step={1}
                onValueChange={(vals) => setHeight(vals[0])}
              />
              <span className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-nowrap min-w-20 items-center justify-center">
                {height} cm
              </span>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="bio">About me</Label>
            <Textarea
              rows={6}
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Get personalized messages based on your bio."
            />
          </div>
        </div>

        {/* Save button */}
        <DrawerFooter className="mb-6">
          <DrawerClose
            onClick={() => handleSaveProfile()}
            className="bg-primary py-2 rounded-full"
          >
            Save
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditProfile;
