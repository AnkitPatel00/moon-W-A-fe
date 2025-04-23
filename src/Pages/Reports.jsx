import { Chart } from "chart.js/auto";
import { useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClosedTaskLastweek,
  fetchCompletedTaskByTeam,
  fetchtotalDaysLeft,
} from "../../features/report/reportSlice";

const Reports = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClosedTaskLastweek());
    dispatch(fetchtotalDaysLeft());
    dispatch(fetchCompletedTaskByTeam());
  }, []);

  const { lastWeekCompletedTask, taskDaysLeft, taskCompletedByTeams } =
    useSelector((state) => state.reportState);

  // console.log(
  //   taskCompletedByTeams
  //     ?.map(({ team }) => team.name)
  //     .reduce((acc, teamName) => {
  //       acc[teamName] = (acc[teamName] || 0) + 1;
  //       return acc;
  //     }, {})
  // );

  const barData1 = {
    labels: [
      `Closed Tasks Last Week ${lastWeekCompletedTask}`,
      `Total Days Left ${taskDaysLeft}`,
    ],
    datasets: [
      {
        label: "Task Details",
        data: [lastWeekCompletedTask, taskDaysLeft],
      },
    ],
  };

  const taskCompletedByTeam = taskCompletedByTeams
    ?.map(({ team }) => team.name)
    .reduce((acc, teamName) => {
      acc[teamName] = (acc[teamName] || 0) + 1;
      return acc;
    }, {});

  const barData2 = {
    labels: Object?.keys(taskCompletedByTeam),
    datasets: [
      {
        label: "Task Complete by Teams",
        data: Object?.values(taskCompletedByTeam),
      },
    ],
  };

  const taskCompletedByOwner = taskCompletedByTeams
    ?.flatMap(({ team }) => team.members)
    .reduce((acc, member) => {
      acc[`${member.name}...${member._id}`] =
        (acc[`${member.name}...${member._id}`] || 0) + 1;

      return acc;
    }, {});

  const barData3 = {
    labels: Object?.keys(taskCompletedByOwner).map((key) => key.slice(0, 10)),
    datasets: [
      {
        label: "Task Complete by Members",
        data: Object?.values(taskCompletedByOwner),
      },
    ],
  };

  return (
    <>
      <h2>Report Overview</h2>
      <div className="container-fluid  py-4">
        <div className="row  gap-3">
          <div className="col-12 col-lg-5 p-4  rounded bg-light">
            <Bar data={barData1} />
          </div>

          <div className="col-12 col-lg-5  rounded p-4 bg-light">
            <Bar data={barData2} />
          </div>

          <h5>Task Completed By Members</h5>
          <div className="col-12 col-lg-6 p-4  rounded bg-light">
            <Pie data={barData3} />
          </div>

          <div className="col-12 col-lg-12 p-4  rounded bg-light">
            <Bar data={barData3} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
