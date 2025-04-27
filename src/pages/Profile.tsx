import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

function Profile() {

    const res = useSelector((store: RootState) => store.user);
    const user = res.userData;
    const navigate = useNavigate();

    const profileList = [
        { id: 1, title: 'username', content: user.username },
        { id: 2, title: 'name', content: user.name },
        { id: 3, title: 'email', content: user.email },
        { id: 4, title: 'age', content: '18' },
        { id: 6, title: 'id', content: user.id },
    ]

    return (
        <div className="w-full p-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <div className="w-84 rounded-md p-12 bg-white dark:bg-neutral-800 shadow-lg dark:shadow-lg">
                <ul className="flex flex-col gap-4 text-neutral-800 dark:text-neutral-200">
                    {
                        profileList.map((elem) => (
                            <li key={elem.id}>
                                <p className="font-bold capitalize">{elem.title}</p>
                                <p>{`${elem.content}`}</p>
                            </li>
                        ))
                    }
                </ul>
                <button
                    onClick={() => navigate('/profile/edit')}
                    className="p-2 w-full bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700 duration-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default Profile;
