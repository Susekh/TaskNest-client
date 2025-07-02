import { useNavigate, useParams } from "react-router-dom";
import conf from "@/conf/conf";
import useApiPost from "@/utils/hooks/useApiPost";
import ContentShimmer from "../loaders/shimmers/ContentShimmer";
import { useState, useEffect } from "react";
import callApiPost from "@/utils/callApiPost";
import Columns from "../columns/Columns";
import toast from "react-hot-toast";
import { Calendar, Clock, Layers, Plus, AlertCircle } from "lucide-react";
import { SprintStatus, Sprint as SprintType } from "@/types/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "../ui/button";
import { GenerateBoardModal } from "../modals/create/GenerateSprintBoard.ai";

function Sprint() {
  const { sprintId } = useParams();
  const [sprint, setSprint] = useState<SprintType | undefined>(undefined);
  const navigate = useNavigate();
  const member = useSelector((store: RootState) => store.member.member);

  if (!member) {
    navigate(-1);
  }

  // Fetch the sprint data using the sprintId
  const { data, isLoading, error } = useApiPost(
    `${conf.backendUrl}/fetch/sprint`,
    { sprintId }
  );

  // Update sprint state when data changes
  useEffect(() => {
    if (data?.sprint) {
      setSprint(data.sprint);
    }
  }, [data]);

  const createColumn = async () => {
    const promise = callApiPost(`${conf.backendUrl}/create/column/newColumn`, {
      sprintId,
      name: "Todo",
    });

    toast.promise(promise, {
      loading: "Creating column...",
      success: (res) => {
        if (res?.status === 201) {
          setSprint(res.data.sprint);
          return "Column created successfully";
        } else {
          throw new Error("Failed to create column");
        }
      },
      error: (err) => {
        console.error("Error creating column:", err);
        return `Error creating column`;
      },
    });
  };

  // Handle loading and error states
  if (isLoading) return <ContentShimmer />;

  if (error)
    return (
      <div className="flex items-center justify-center h-full w-full p-8">
        <div className="bg-white dark:bg-neutral-900 border border-slate-500/20 rounded-lg p-6 text-center max-w-md shadow-md">
          <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-neutral-800 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {error || "An error occurred while loading the sprint data."}
          </p>
        </div>
      </div>
    );

  return (
    <section className="bg-gray-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 min-h-screen">
      {/* Header with gradient */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          {sprint ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                  {sprint.name}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                  Sprint ID: {sprintId}
                </p>
              </div>
              
              {
                sprint.columns.length ? "" : <GenerateBoardModal sprintId={sprintId} setSprint={setSprint} />
              }
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <div className="bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 flex items-center">
                  <Calendar
                    size={16}
                    className="text-slate-600 dark:text-slate-500 mr-2"
                  />
                  <span className="text-sm">
                    {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                    {new Date(sprint.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 flex items-center">
                  <Clock
                    size={16}
                    className="text-slate-600 dark:text-slate-500 mr-2"
                  />
                  {member?.role === "ADMIN" || member?.role === "MODERATOR" ? (
                    <select
                      value={sprint.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;

                        try {
                          const res = await callApiPost(
                            `${conf.backendUrl}/update/sprint/status`,
                            { sprintId, newStatus }
                          );

                          if (res?.status === 200) {
                            setSprint((prev) =>
                              prev
                                ? { ...prev, status: newStatus as SprintStatus }
                                : prev
                            );
                            toast.success(
                              `Sprint status updated to ${newStatus}`
                            );
                          } else {
                            toast.error("Failed to update sprint status");
                          }
                        } catch (err) {
                          toast.error("Error updating sprint status");
                          console.error(err);
                        }
                      }}
                      className={`text-sm px-2 py-0.5 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white`}
                    >
                      <option value="PLANNED">PLANNED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  ) : (
                    <span
                      className={`text-sm px-2 py-0.5 rounded ${
                        sprint.status === "ACTIVE"
                          ? "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400"
                          : sprint.status === "COMPLETED"
                          ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-gray-200 dark:bg-neutral-700/50 text-gray-700 dark:text-neutral-300"
                      }`}
                    >
                      {sprint.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
              Sprint Details
            </h1>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {sprint ? (
          <div>
            {/* Columns section */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Layers
                    className="text-slate-600 dark:text-slate-500 mr-2"
                    size={20}
                  />
                  <h2 className="text-xl font-semibold">Sprint Columns</h2>
                </div>

                {member?.role === "ADMIN" || member?.role === "MODERATOR" ? (
                  <Button
                    onClick={createColumn}
                    className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg text-white font-medium shadow-sm"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Column
                  </Button>
                ) : (
                  ""
                )}
              </div>

              {/* Columns wrapper */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm">
                {sprint.columns.length ? (
                  <Columns
                    setSprint={setSprint}
                    columns={sprint.columns}
                    projectId={sprint.projectId}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700/30 rounded-full flex items-center justify-center mb-4">
                      <Layers
                        className="text-gray-400 dark:text-neutral-500"
                        size={24}
                      />
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-center">
                      No columns available yet.
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-500 text-sm text-center mt-2">
                      Add your first column to organize your sprint tasks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                No sprint data available.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Sprint;
