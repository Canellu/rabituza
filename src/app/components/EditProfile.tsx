'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

import { getUser } from '@/lib/database/user/get';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useCreateOrUpdateUser from '../hooks/useCreateOrUpdateUser';
import AnimateHeight from './AnimateHeight';

interface EditProfileProps {
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
}

const EditProfile = ({ editable, setEditable }: EditProfileProps) => {
  const userId = getSession();
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is null');
      }
      return getUser(userId);
    },
    enabled: !!userId, // Ensure query only runs when userId is truthy
  });
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

  const handleSaveProfile = () => {
    // Make sure `user` exists and userId is valid before proceeding
    if (!userId || !user) return;

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
    setEditable(false);
  };

  return (
    <AnimateHeight isOpen={editable}>
      <section className="flex flex-col px-6 py-8 rounded-md border border-input gap-4 w-full bg-white">
        <h2 className="text-lg font-semibold mb-5">Edit Profile</h2>

        {/* Username */}
        <div className="flex flex-col-reverse w-full gap-2">
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="peer"
            disabled={!editable}
          />
          <Label htmlFor="username">Username</Label>
        </div>

        {/* First name */}
        <div className="flex flex-col-reverse w-full gap-2">
          <Input
            type="text"
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="peer"
            disabled={!editable}
          />
          <Label htmlFor="first_name">First name</Label>
        </div>

        {/* Last name */}
        <div className="flex flex-col-reverse w-full gap-2">
          <Input
            type="text"
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="peer"
            disabled={!editable}
          />
          <Label htmlFor="last_name">Last name</Label>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col-reverse w-full gap-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild disabled={!editable}>
              <Button
                id="dob"
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal hover:bg-white text-base',
                  !date && 'text-muted-foreground '
                )}
              >
                <CalendarIcon />
                {date ? format(date, 'do MMMM yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4">
                <div className="flex gap-2">
                  {/* Month Select */}
                  <Select
                    onValueChange={(value) => handleMonthChange(Number(value))}
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
          <Label
            htmlFor="dob"
            className={cn(!editable ? 'opacity-70 cursor-not-allowed' : '')}
          >
            Date of Birth
          </Label>
        </div>

        {/* Gender */}
        <div className="flex flex-col-reverse w-full gap-2">
          <Select
            value={gender}
            onValueChange={(g) => setGender(g)}
            disabled={!editable}
          >
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
          <Label
            htmlFor="gender"
            className={cn(!editable ? 'opacity-70 cursor-not-allowed' : '')}
          >
            Gender
          </Label>
        </div>

        {/* Weight */}
        <div className="flex w-full items-end gap-3 justify-center">
          <div className="flex flex-col-reverse w-full gap-1">
            <Slider
              value={[weight || 70]}
              max={120}
              min={40}
              step={1}
              onValueChange={(vals) => setWeight(vals[0])}
              disabled={!editable}
              className="h-10 "
            />
            <Label
              htmlFor="weight"
              className={cn(!editable ? 'opacity-70 cursor-not-allowed' : '')}
            >
              Weight
            </Label>
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
              disabled={!editable}
              inputMode="numeric"
              placeholder="Weight"
            />
            <span>kg</span>
          </div>
        </div>

        {/* Height */}
        <div className="flex w-full items-end gap-3 justify-center">
          <div className="flex flex-col-reverse w-full gap-1">
            <Slider
              value={[height]}
              max={200}
              min={140}
              step={1}
              onValueChange={(vals) => setHeight(vals[0])}
              disabled={!editable}
              className="h-10 "
            />
            <Label
              htmlFor="height"
              className={cn(!editable ? 'opacity-70 cursor-not-allowed' : '')}
            >
              Height
            </Label>
          </div>

          <div className="flex items-center gap-1 text-base min-w-20">
            <Input
              type="number"
              id="heightInput"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="peer w-14 text-center"
              disabled={!editable}
              inputMode="numeric"
              placeholder="Height"
            />
            <span>cm</span>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col-reverse w-full gap-2">
          <Textarea
            rows={6}
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Get personalized messages based on your bio."
            disabled={!editable}
            className="peer"
          />
          <Label htmlFor="bio">About me</Label>
        </div>

        {/* Save and Cancel buttons */}
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => setEditable(false)}
            variant="secondary"
            disabled={!editable}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} disabled={!editable}>
            Save
          </Button>
        </div>
      </section>
    </AnimateHeight>
  );
};

export default EditProfile;
