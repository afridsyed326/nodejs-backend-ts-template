import axios from "axios";
import sizeOf from "image-size";
import { createHash } from "crypto";


export const makeSlug = (slug: string) => {
  let newSlug = slug.toLowerCase().replace(/[^\w-]+/g, "-");
  while (newSlug.indexOf("--") !== -1) {
    newSlug = newSlug.replace("--", "-");
  }
  return newSlug;
};


export const genApiSecretKey = (): string => {
  const length: number = 32;
  const charset: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal: string = "";
  for (let i: number = 0, n: number = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
};

export function generateSecretKey(): string {
  const secretKey = createHash("sha256")
    .update(Math.random().toString())
    .digest("hex");

  return secretKey;
}

export const dateFormat = (date: Date): string => {
  const pad = (s: any) => (s < 10 ? "0" + s : s);

  var year = date.getFullYear();
  var month = pad(date.getMonth() + 1); // Months are zero indexed
  var day = pad(date.getDate());
  var hours = pad(date.getHours());
  var minutes = pad(date.getMinutes());
  var seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

interface DynamicQuery {
  [key: string]: RegExp;
}

export const updateConfigWithSearch = (
  config: DynamicQuery | null,
  searchKey: string,
  keys: string[]
): any => {
  const newQuery = searchKey.split(/[ ,]+/);

  const updatedConfig: any = {
    ...config,
    $and: [
      {
        $or: keys.map((key) => {
          const qqq = newQuery.map((str: string) => new RegExp(str, "i"));
          return {
            $and: [{ [key]: qqq }],
          };
        }),
      },
    ],
  };

  return updatedConfig;
};

export const getFilterByTimePeriodConfigs = async (timePeriod: string) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  if (timePeriod === "daily") {
    // Filter for the last 24 hours
    return { $gte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) };
  } else if (timePeriod === "weekly") {
    // Filter for the last 7 days
    return { $gte: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) };
  } else if (timePeriod === "monthly") {
    // Filter for the last 30 days
    const startOfMonth = new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    return { $gte: startOfMonth };
  } else if (timePeriod === "yearly") {
    // Filter for the last 12 months
    const startOfYear = new Date(currentYear - 1, currentMonth, currentDay);
    return { $gte: startOfYear };
  }

  return null;
};

export const formatDatePipelineStage = {
  $addFields: {
    date: {
      $dateToString: {
        format: "%Y-%m-%d %H:%M:%S",
        date: "$createdAt", // Assuming 'createdAt' is the field you want to format
        timezone: "+00:00", // Specify the timezone if needed
      },
    },
  },
};

export const lastNDaysFilter = (n: number) => {
  const nDaysAgo = new Date();
  nDaysAgo.setDate(nDaysAgo.getDate() - n);
  return { $gte: nDaysAgo };
};

export const lastNHoursFilter = (n: number) => {
  const nHoursAgo = new Date();
  nHoursAgo.setHours(nHoursAgo.getHours() - n);
  return { $gte: nHoursAgo };
};

export const last12MonthsFilter = () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  return { $gte: twelveMonthsAgo };
};

export const last7DaysChartLabels = (timeKey: string = "createdAt") => {
  const labels = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const label = `${month}, ${day}`;
    const filter = {
      [timeKey]: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
    };
    labels.push({ label, filter });
  }
  return labels;
};

export const last30DaysChartLabels = (timeKey: string = "createdAt") => {
  const labels = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const label = `${month}, ${day}`;
    const filter = {
      [timeKey]: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
    };
    labels.push({ label, filter });
  }
  return labels;
};

export const last12MonthsChartLabels = (timeKey: string = "createdAt") => {
  const labels = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const monthLabel = `${month}, ${year}`;
    const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
    const filter = {
      [timeKey]: {
        $gte: new Date(year, date.getMonth(), 1),
        $lt: new Date(year, date.getMonth(), daysInMonth + 1),
      },
    };
    labels.push({ label: monthLabel, filter });
  }
  return labels.reverse(); // Reverse to show the most recent month first
};

export const last24HoursChartLabels = (timeKey: string = "createdAt") => {
  const labels = [];
  const today = new Date();

  for (let i = 0; i < 24; i++) {
    const date = new Date(today.getTime() - i * 60 * 60 * 1000); // Subtracting i hours from current time
    const day = String(date.getDate()).padStart(2, "0");
    const hour = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12; // Convert hour to 12-hour format
    const amPm = date.getHours() >= 12 ? "pm" : "am";
    const label = `${day}, ${hour}, ${amPm}`;
    const filter = {
      [timeKey]: {
        $gte: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours()
        ),
        $lt: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours() + 1
        ),
      },
    };
    labels.push({ label, filter });
  }
  return labels.reverse(); // Reverse to show the most recent hour first
};

export const automaticMigrationRequest = async ({
  transactionId,
  userBID,
  amount,
}: any) => {
  const url = process.env.MIGRATION_AUTOMATIC_API_ENDPOINT || "";
  try {
    const response = await axios.post(
      url,
      {
        transactionId: transactionId,
        asset: "eurfi-v",
        userBID: userBID,
        amount: amount,
        platform: "PULSE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.MIGRATION_AUTOMATIC_API,
        },
      }
    );

    if (response.data.code === 200) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
        message: response.data.msg,
      };
    }
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      return {
        status: false,
        message: data.msg,
      };
    } else {
      return {
        status: false,
        message: error.message,
      };
    }
  }
};
