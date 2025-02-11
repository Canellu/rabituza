import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { activityLevels, calculateBMR } from '@/lib/utils/nutrition';
import { User } from '@/types/User';
import { TriangleAlert } from 'lucide-react';

interface RecommendedValuesProps {
  user: User | undefined;
  selectedActivity: keyof typeof activityLevels | undefined;
  onActivitySelect: (activity: keyof typeof activityLevels) => void;
}

const RecommendedValues = ({
  user,
  selectedActivity,
  onActivitySelect,
}: RecommendedValuesProps) => {
  const missingData =
    !user?.weight || !user?.height || !user?.gender || !user?.dob;

  const bmr = calculateBMR(user!);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="calories-info" className="border-none">
        <AccordionTrigger className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 text-start hover:no-underline border rounded-md p-3 bg-stone-50">
          <span className="text-sm font-medium text-stone-800">
            Recommended calories based on profile data
          </span>
          <span className="sr-only">Toggle calory info</span>
        </AccordionTrigger>
        <AccordionContent className="border rounded-md mt-1 pb-0">
          {missingData ? (
            <div className="p-3 bg-yellow-100 border-yellow-200 border rounded-md text-yellow-800 items-center line-clamp-2 flex gap-2">
              <TriangleAlert className="size-5 min-w-5 min-h-5" /> Unable to
              calculate recommended values. Missing user data. Using default
              placeholders.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-100">
                  <TableHead className="p-3 text-stone-800">
                    <span>Activity Level</span>
                    <span className="mt-1 inline-block text-stone-600 font-normal">
                      Base Metabolic Rate (BMR)
                    </span>
                    <br />
                  </TableHead>
                  <TableHead className="p-3 text-stone-800 text-right">
                    <span>Daily Calories</span>
                    <span className="mt-1 inline-block text-stone-600 font-normal">
                      {Math.round(bmr)} kcal
                    </span>
                    <br />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(activityLevels).map(([key, value]) => (
                  <TableRow
                    key={key}
                    className={cn(
                      'cursor-pointer hover:bg-stone-50',
                      key === selectedActivity && 'bg-stone-100 font-medium'
                    )}
                    onClick={() =>
                      onActivitySelect(key as keyof typeof activityLevels)
                    }
                  >
                    <TableCell className="p-3 text-stone-800 text-nowrap">
                      {value.displayName}
                    </TableCell>
                    <TableCell className="p-3 text-stone-800 text-right text-nowrap">
                      {Math.round(bmr * value.calorieMultiplier)} kcal
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RecommendedValues;
