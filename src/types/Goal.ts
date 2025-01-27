export type Goal = {
  id?: string;
  title: string;
  description?: string;
  status: GoalStatus;
  category: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  tags?: string[];
};

export enum GoalStatus {
  Completed = 'completed',
  InProgress = 'inProgress',
  Abandoned = 'abandoned',
}
