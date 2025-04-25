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

  const barData1 = {
    labels: [
      `Closed Tasks Last Week ${lastWeekCompletedTask}`,
      `Total Days Left ${taskDaysLeft}`,
    ],
    datasets: [
      {
        data: [lastWeekCompletedTask, taskDaysLeft],
        backgroundColor: ["#36A2EB", "#FF6384"],
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

  const pie = {
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
        <div className="row gap-3 ">
          <div className="col-12 col-lg-3 p-4 rounded bg-light">
            <Pie data={barData1} />
          </div>

          <div className="col-12 col-lg-7  rounded p-4 bg-light">
            <Bar data={barData2} />
          </div>

          <div className="col-12 col-lg-10 p-4  rounded bg-light">
            <Bar data={barData3} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
