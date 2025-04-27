// types.ts

// Enums
export type MemberRole = "ADMIN" | "MODERATOR" | "CONTRIBUTER";
  
  export enum SprintStatus {
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
  }
  
  export enum IssueStatus {
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
  }
  
  // Main Models
  export interface User {
    id: string;
    name: string;
    username: string;
    password?: string;
    email?: string;
    imgUrl: string;
    dob?: Date;
    gender?: string;
    createdAt: Date;
    updatedAt?: Date;
    refreshToken?: string;
    recoverAccount?: RecoverAccount;
    projects: Project[];
    members: Member[];
  }
  
  export interface RecoverAccount {
    id: number;
    resetToken?: string;
    resetTokenExpiry?: Date;
    userId: string;
    user: User;
  }
  
  export interface Project {
    id: string;
    name: string;
    imageUrl: string;
    inviteCode?: string;
    userId: string;
    user: User;
    members: Member[];
    sprints: Sprint[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Member {
    id: string;
    role: MemberRole;
    userId: string;
    user: User;
    projectId: string;
    project: Project;
    tasks: Task[];
    assingedIssues: Issue[];
    messages: Message[];
    directMessages: DirectMessage[];
    conversationsInitiated: Conversation[];
    conversationsRecieved: Conversation[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Sprint {
    id: string;
    name: string;
    projectId: string;
    project: Project;
    startDate: Date;
    endDate: Date;
    status: SprintStatus;
    columns: Column[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Column {
    id: string;
    name: string;
    sprintId?: string;
    sprint?: Sprint;
    tasks: Task[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Task {
    id: string;
    name: string;
    projectId: string;
    content: string;
    deadline: Date;
    columnId: string;
    column: Column;
    members: Member[];
    messages: Message[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Issue {
    id: string;
    name: string;
    description?: string;
    status: IssueStatus;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    assigneeId?: string;
    assignee?: Member;
  }
  
  export interface Message {
    id: string;
    content: string;
    fileUrl?: string;
    memberId: string;
    member: Member;
    name: string;
    taskId: string;
    task: Task;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Conversation {
    id: string;
    memberOneId: string;
    memberOne: Member;
    memberTwoId: string;
    memberTwo: Member;
    directMessages: DirectMessage[];
  }
  
  export interface DirectMessage {
    id: string;
    content: string;
    fileUrl?: string;
    memberId: string;
    member: Member;
    conversationId: string;
    conversation: Conversation;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  