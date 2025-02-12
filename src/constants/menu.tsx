import Activities from '@/app/components/Activities/Activities';
import Goals from '@/app/components/Goals';
import Health from '@/app/components/Health';
import Home from '@/app/components/Home';
import Profile from '@/app/components/Profile';
import { ActivityIcon, Goal, Heart, HomeIcon, User } from 'lucide-react';

export enum Tab {
  Home = 'home',
  Activities = 'activities',
  Goals = 'goals',
  Profile = 'profile',
  Health = 'health',
}

export const tabs = [
  {
    value: Tab.Home,
    icon: HomeIcon,
    title: 'Home',
    content: <Home />,
  },
  {
    value: Tab.Health,
    icon: Heart,
    title: 'Health',
    content: <Health />,
  },
  {
    value: Tab.Activities,
    icon: ActivityIcon,
    title: 'Activities',
    content: <Activities />,
  },
  {
    value: Tab.Goals,
    icon: Goal,
    title: 'Goals',
    content: <Goals />,
  },
  {
    value: Tab.Profile,
    icon: User,
    title: 'Profile',
    content: <Profile />,
  },
];
