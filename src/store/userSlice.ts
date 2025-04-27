import { Project, User } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

type task = {
    id : string;
    name : string;
    content : string;
    deadline : string;
    sprintId : string;
}

type sprint = {
    id : string;
    name : string;
    projectId : string;
    startDate : string;
    endDate : string;
    status : string;
    tasks : task[];
}

type issue = {
    id : string;
    name : string;
    description : string;
    status : string;
    order : number;
    assigneeId : string;
}

type message = {
    id : string;
    content : string;
    fileUrl? : string;
    taskId : string;
    deleted : boolean;
    memberId : string;
}

type member = {
    id : string;
    role : string;
    projectId : string;
    project : Project;
    taskId : string;
    assignedIssues : issue[];
    messages : message[];
}

type project = {
    id : string;
    name : string;
    imageUrl : string;
    members : member[];
    sprints? : sprint[];
}


type UserType = {
    id: string;
    createdAt: Date;
    username: string;
    name : string;
    imgUrl: string;
    email: string;
    projects? : project[];
    members? : member[];
};


const initialState: {
    status: boolean;
    userData: User | UserType;
} = {
    status: false,
    userData: {
        id: '0',
        createdAt: new Date(0),
        username: "",
        name : "",
        imgUrl: "https://github.com/shadcn.png",
        email: "",
    },
};

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        login : (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) =>{
            state.status = false;
            state.userData = initialState.userData;
        }
    }
});

export const {login, logout} = userSlice.actions;

export default userSlice.reducer;