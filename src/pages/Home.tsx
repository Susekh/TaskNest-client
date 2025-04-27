import { Check } from "lucide-react"
import { Link } from "react-router-dom";

const featureList = [
  { id: 1, content: 'Quick Project Setup' },
  { id: 2, content: 'Effortless Task Management' },
  { id: 3, content: 'Team Collaboration Made Simple' },
  { id : 4, content : 'Seamless Project Tracking'},
  { id : 5, content : 'Integrated Payment Gateways'}
];


function Home() {
  return (
    <>
    <section className="py-16 dark:bg-neutral-800">
      <div className="p-12 flex flex-wrap items-center justify-center gap-24">
        <div className="flex flex-col flex-wrap gap-12 justify-center text-center md:text-left md:justify-start">
          <h1 className="text-red-500 flex flex-col flex-wrap text-4xl md:text-6xl max-w-4xl font-extrabold">
          Your All-in-One Project Management <span className="p-1 text-white max-w-64 mt-4 bg-red-800">Solution</span>
          </h1>
          <p className="md:text-lg max-w-2xl text-red-800 dark:text-red-600">
          Streamline your team's workflow, collaborate seamlessly, and manage tasks and sprints with ease. Empower your team to deliver results faster, track progress more effectively.
          </p>
          <div>
            <Link to={"/dashboard"} className="rounded-md border-2 border-red-400 p-4 px-12 text-red-600  font-semibold hover:bg-red-500 hover:text-white uppercase duration-300">Get started</Link>
          </div>
        </div>
        <div className=" border-2 border-red-300 w-96 p-8 rounded-md">
          <ul className="flex flex-col gap-4 ">
            {
              featureList.map((el) => (<li key={el.id} className="flex gap-4"><Check className="border-2 rounded-sm bg-rose-500 text-white"/><p className="text-red-800 dark:text-red-600">{el.content}</p></li>))
            }
          </ul>
        </div>
      </div>
    </section>
    <section>
      
    </section>
    </>
  )
}

export default Home