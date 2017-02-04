export enum TaskState {
  ACTIVE,
  INACTIVE,
  COMPLETED
}
export interface TaskEntity {
  text: string;
  createdAt: Date;
  updatedAt: Date;
  state: TaskState;
}