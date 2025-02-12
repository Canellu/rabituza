import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
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
import { verifyUserCode } from '@/lib/auth/verifyLogin';
import { cn } from '@/lib/utils';
import { User } from '@/types/User';
import { format } from 'date-fns';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import useCreateOrUpdateUser from '../hooks/useCreateOrUpdateUser';

const excludedFields = ['id', 'email', 'avatar'];
const fieldLabels: Record<string, string> = {
  code: 'Code',
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
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [bio, setBio] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<'current' | 'new'>('current');

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
      setHeight(user.height || undefined);
      setWeight(user.weight || undefined);
      setBio(user.bio || '');
      setUsername(user.username || '');
    }
  }, [user, drawerOpen]);

  const handleFieldClick = (field: string) => {
    setSelectedField(field);
    setDrawerOpen(true);
  };

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      username: username?.trim().toLowerCase(),
      first_name: firstName?.trim(),
      last_name: lastName?.trim(),
      dob: dob || user.dob || undefined,
      height,
      gender,
      weight,
      bio: bio?.trim(),
      code: code ? code : user.code,
    };

    // Remove fields with undefined or null values
    const sanitizedUser = Object.fromEntries(
      Object.entries(updatedUser).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    createOrUpdate(sanitizedUser as User);
    setDrawerOpen(false);
  };

  const renderInputField = () => {
    switch (selectedField) {
      case 'code': {
        return (
          <div className="relative flex flex-col items-center gap-2 mt-4 pb-4">
            <Label htmlFor="code">
              {step === 'current' ? 'Current Code' : 'New Code'}
            </Label>
            <InputOTP
              maxLength={6}
              id="code"
              value={code}
              onChange={(value) => setCode(value)}
              autoFocus={shouldAutoFocus}
              onFocus={() => setError('')}
              onComplete={() => {
                if (user && code?.length === 6 && step === 'current') {
                  try {
                    const verifiedUser = verifyUserCode(user, code);
                    if (verifiedUser) {
                      setCode('');
                      setError('');
                      setStep('new');
                    }
                  } catch {
                    setError('Invalid Code');
                  }
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p
              className={cn(
                'absolute -bottom-4 inset-x-6 text-red-500 bg-red-100 text-sm rounded-md py-1 px-3 text-center',
                error ? 'visible' : 'invisible'
              )}
            >
              {error}
            </p>
          </div>
        );
      }
      case 'username':
        return (
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))} // Remove all whitespace
              placeholder="Username"
            />
          </div>
        );

      case 'first_name':
        return (
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              type="text"
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.trim())}
              placeholder="First name"
            />
          </div>
        );

      case 'last_name':
        return (
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              type="text"
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.trim())}
              placeholder="Last name"
            />
          </div>
        );
      case 'dob':
        return (
          <div className="flex flex-col w-full gap-2">
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
                selected={dob}
                showOutsideDays={false}
                onSelect={setDob}
                initialFocus
                classNames={{
                  caption: 'hidden',
                  head_row: 'flex space-x-1',
                  row: 'flex w-full mt-2 space-x-1',
                }}
                month={new Date(viewYear, viewMonth)}
                className="items-center flex w-full justify-center rounded-md border bg-white mt-2"
              />
            </div>
          </div>
        );
      case 'gender':
        return (
          <div className="flex flex-col w-full gap-2">
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
        );
      case 'weight':
        return (
          <div className="flex w-full items-end gap-3 justify-center">
            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="weight">Weight</Label>
              <Slider
                value={[weight || 70]}
                max={120}
                min={40}
                step={1}
                onValueChange={(vals) => setWeight(vals[0])}
                className="h-10 "
              />
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
            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="height">Height</Label>
              <Slider
                value={[height ?? 140]}
                max={200}
                min={140}
                step={1}
                onValueChange={(vals) => setHeight(vals[0])}
                className="h-10"
              />
            </div>

            <div className="flex items-center gap-1 text-base min-w-20">
              <Input
                type="number"
                id="heightInput"
                value={height ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setHeight(value ? Number(value) : undefined);
                }}
                className="peer w-20 text-center"
                inputMode="numeric"
                placeholder="Height"
              />
              <span>cm</span>
            </div>
          </div>
        );
      case 'bio':
        return (
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              rows={4}
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Get personalized messages based on your bio."
            />
          </div>
        );
      default:
        return null;
    }
  };

  const shouldAutoFocus = [
    'code',
    'username',
    'first_name',
    'last_name',
    'bio',
  ].includes(selectedField || '');

  return (
    <div className="flex flex-col py-4 rounded-lg border gap-2 bg-secondary w-full">
      {user &&
        Object.entries(user).map(([key, value], index, array) => {
          if (excludedFields.includes(key)) {
            return null;
          }

          const label = fieldLabels[key] || key.replace('_', ' ');
          const isBio = key === 'bio';

          let formattedValue: ReactNode;

          if (!value) {
            formattedValue = (
              <span className="text-gray-500 italic font-normal">Add info</span>
            );
          } else if (key === 'code') {
            formattedValue = <span className="tracking-wider">******</span>;
          } else if (key === 'weight' && typeof value === 'number') {
            formattedValue = `${value} kg`;
          } else if (key === 'height' && typeof value === 'number') {
            formattedValue = `${value} cm`;
          } else if (value instanceof Date) {
            formattedValue = format(value, 'dd. MMMM yyyy');
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
                      : 'text-emerald-700 font-medium text-right',
                    key !== 'username' && 'first-letter:capitalize'
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
        <DialogContent
          className={cn(
            'max-w-[96%] rounded-md p-4 gap-3',
            shouldAutoFocus ? 'top-[24%]' : ''
          )}
          autoFocus={shouldAutoFocus}
        >
          <DialogHeader>
            <DialogTitle>Edit {fieldLabels[selectedField || '']}</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            {renderInputField()}
            <div className="flex items-center justify-between mt-6">
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
